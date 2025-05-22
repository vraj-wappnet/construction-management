// src/invoices/dto/update-invoice.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}