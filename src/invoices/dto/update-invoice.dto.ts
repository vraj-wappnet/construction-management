// src/invoices/dto/update-invoice.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoiceDto {
  @ApiProperty({
    description: 'The payment method for the invoice (optional)',
    example: 'Bank Transfer',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
