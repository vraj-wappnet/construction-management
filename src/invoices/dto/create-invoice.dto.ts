// src/invoices/dto/create-invoice.dto.ts
import { IsNumber, IsDateString, IsString, IsDecimal, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsDateString()
  issueDate: Date;

  @IsDateString()
  dueDate: Date;

  @IsDecimal()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  contractorId: number;
}