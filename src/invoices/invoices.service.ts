// src/invoices/invoices.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    projectId: number,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['client'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const contractor = await this.usersRepository.findOne({
      where: { id: createInvoiceDto.contractorId },
    });
    if (!contractor) {
      throw new NotFoundException('Contractor not found');
    }

    const invoice = this.invoicesRepository.create({
      ...createInvoiceDto,
      project,
      contractor,
      client: project.client,
      status: 'pending',
    });

    return this.invoicesRepository.save(invoice);
  }

  async findAllForProject(projectId: number): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      where: { project: { id: projectId } },
      relations: ['contractor', 'client'],
      order: { issueDate: 'DESC' },
    });
  }

  async markAsPaid(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    invoice.status = 'paid';
    invoice.paymentDate = new Date();
    invoice.paymentMethod = updateInvoiceDto.paymentMethod ?? '';

    return this.invoicesRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    await this.invoicesRepository.delete(id);
  }
}
