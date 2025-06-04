import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from './payment.entity';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    // Validate STRIPE_SECRET_KEY
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }

    // Initialize Stripe with the secret key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(
    createPaymentDto: CreatePaymentDto,
    payer: User,
  ): Promise<{ clientSecret: string; paymentId: number }> {
    const { amount, currency, payeeId, projectId, description } =
      createPaymentDto;

    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'contractors', 'siteEngineers'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const payee = await this.usersRepository.findOneBy({ id: payeeId });
    if (!payee) {
      throw new NotFoundException('Payee not found');
    }

    // Validate payment roles
    if (payer.role === UserRole.CLIENT) {
      // Client can only pay contractors assigned to their project
      if (
        payee.role !== UserRole.CONTRACTOR ||
        !project.contractors.some((c) => c.id === payeeId)
      ) {
        throw new ForbiddenException('Invalid payee for this project');
      }
    } else if (payer.role === UserRole.CONTRACTOR) {
      // Contractor can only pay site engineers assigned to the project
      if (
        payee.role !== UserRole.SITE_ENGINEER ||
        !project.siteEngineers.some((e) => e.id === payeeId) ||
        !project.contractors.some((c) => c.id === payer.id)
      ) {
        throw new ForbiddenException(
          'Invalid payee or you are not assigned to this project',
        );
      }
    } else {
      throw new ForbiddenException(
        'Only clients and contractors can initiate payments',
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      description,
      metadata: { projectId, payerId: payer.id, payeeId },
    });

    // Ensure client_secret is present
    if (!paymentIntent.client_secret) {
      throw new BadRequestException(
        'Failed to create payment intent: client_secret is missing',
      );
    }

    // Save payment record
    const payment = this.paymentsRepository.create({
      stripePaymentIntentId: paymentIntent.id,
      amount: amount / 100, // Convert cents to dollars
      currency,
      status: paymentIntent.status,
      payer,
      payee,
      project,
      description,
    });

    await this.paymentsRepository.save(payment);

    return { clientSecret: paymentIntent.client_secret, paymentId: payment.id };
  }

  // async confirmPayment(
  //   confirmPaymentDto: ConfirmPaymentDto,
  //   user: User,
  // ): Promise<Payment> {
  //   const { paymentIntentId } = confirmPaymentDto;

  //   const payment = await this.paymentsRepository.findOne({
  //     where: { stripePaymentIntentId: paymentIntentId },
  //     relations: ['payer', 'payee', 'project'],
  //   });
  //   if (!payment) {
  //     throw new NotFoundException('Payment not found');
  //   }

  //   // Verify user is the payer
  //   if (payment.payer.id !== user.id) {
  //     throw new ForbiddenException('You are not authorized to confirm this payment');
  //   }

  //   // Retrieve payment intent from Stripe
  //   const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
  //   payment.status = paymentIntent.status;

  //   await this.paymentsRepository.save(payment);

  //   return payment;
  // }
  async confirmPayment(
    confirmPaymentDto: ConfirmPaymentDto,
    user: User,
  ): Promise<Payment> {
    const { paymentIntentId } = confirmPaymentDto;
    const payment = await this.paymentsRepository.findOne({
      where: { stripePaymentIntentId: paymentIntentId },
      relations: ['payer', 'payee', 'project'],
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.payer.id !== user.id)
      throw new ForbiddenException('Unauthorized');

    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    payment.status = paymentIntent.status; // Ensure this is "succeeded" for successful payments
    return this.paymentsRepository.save(payment);
  }
  async getPaymentHistory(user: User): Promise<Payment[]> {
    const query = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.payer', 'payer')
      .leftJoinAndSelect('payment.payee', 'payee')
      .leftJoinAndSelect('payment.project', 'project');

    if (user.role === UserRole.ADMIN) {
      // Admins see all payments
    } else if (user.role === UserRole.CLIENT) {
      // Clients see payments they made
      query.where('payment.payerId = :userId', { userId: user.id });
    } else if (user.role === UserRole.CONTRACTOR) {
      // Contractors see payments they made or received
      query.where('payment.payerId = :userId OR payment.payeeId = :userId', {
        userId: user.id,
      });
    } else if (user.role === UserRole.SITE_ENGINEER) {
      // Site engineers see payments they received
      query.where('payment.payeeId = :userId', { userId: user.id });
    } else {
      throw new ForbiddenException('Invalid user role');
    }

    return query.getMany();
  }
}
