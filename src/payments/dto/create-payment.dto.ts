import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The amount to be paid (in the smallest currency unit, e.g., cents)',
    example: 10000, // $100.00
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The currency of the payment',
    example: 'usd',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'The ID of the payee (contractor or site engineer)',
    example: 2,
  })
  @IsNumber()
  payeeId: number;

  @ApiProperty({
    description: 'The ID of the project associated with the payment',
    example: 1,
  })
  @IsNumber()
  projectId: number;

  @ApiProperty({
    description: 'Optional description of the payment',
    example: 'Payment for project milestone 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}