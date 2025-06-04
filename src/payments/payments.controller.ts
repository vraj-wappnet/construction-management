// import {
//   Controller,
//   Post,
//   Body,
//   Req,
//   UseGuards,
//   Get,
// } from '@nestjs/common';
// import { PaymentsService } from './payments.service';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
// import { Payment } from './payment.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../users/user.entity';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @Controller('payments')
// @ApiTags('payments')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class PaymentsController {
//   constructor(private paymentsService: PaymentsService) {}

//   @Post()
//   @Roles(UserRole.CLIENT, UserRole.CONTRACTOR)
//   async createPayment(
//     @Body() createPaymentDto: CreatePaymentDto,
//     @Req() req,
//   ): Promise<{ clientSecret: string; paymentId: number }> {
//     return this.paymentsService.createPaymentIntent(createPaymentDto, req.user);
//   }

  
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';

class PaymentIntentResponse {
  @ApiProperty({
    description: 'Client secret for confirming the payment on the client side',
    example: 'pi_3N9Z5zKX0yZ2W3X4_secret_abc123',
  })
  clientSecret: string;

  @ApiProperty({
    description: 'ID of the created payment record in the database',
    example: 1,
  })
  paymentId: number;
}

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.CONTRACTOR)
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment intent created successfully',
    type: PaymentIntentResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to make this payment',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project or payee not found',
  })
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
