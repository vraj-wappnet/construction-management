// src/invoices/dto/create-invoice.dto.ts
import { IsNumber, IsDateString, IsString, IsDecimal, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'The unique invoice number',
    example: 'INV-001',
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'The issue date of the invoice in ISO 8601 format',
    example: '2025-05-22T00:00:00.000Z',
  })
  @IsDateString()
  issueDate: Date;

  @ApiProperty({
    description: 'The due date of the invoice in ISO 8601 format',
    example: '2025-06-22T00:00:00.000Z',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    description: 'The total amount of the invoice',
    example: 1500.75,
  })
  @IsDecimal()
  amount: number;

  @ApiProperty({
    description: 'A brief description of the invoice (optional)',
    example: 'Payment for construction materials',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the contractor associated with the invoice',
    example: 1,
  })
  @IsNumber()
  contractorId: number;
}