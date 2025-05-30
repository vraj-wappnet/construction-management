import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'The Stripe payment intent ID',
    example: 'pi_3N9Z5zKX0yZ2W3X4',
  })
  @IsString()
  paymentIntentId: string;
}