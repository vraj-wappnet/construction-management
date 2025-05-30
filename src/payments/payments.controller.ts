import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.CONTRACTOR)
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req,
  ): Promise<{ clientSecret: string; paymentId: number }> {
    return this.paymentsService.createPaymentIntent(createPaymentDto, req.user);
  }

  @Post('confirm')
  @Roles(UserRole.CLIENT, UserRole.CONTRACTOR)
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @Req() req,
  ): Promise<Payment> {
    return this.paymentsService.confirmPayment(confirmPaymentDto, req.user);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  async getPaymentHistory(@Req() req): Promise<Payment[]> {
    return this.paymentsService.getPaymentHistory(req.user);
  }
}