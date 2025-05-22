// src/vendors/dto/create-vendor.dto.ts
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({
    description: 'The name of the vendor',
    example: 'ABC Supplies',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The name of the contact person for the vendor',
    example: 'John Smith',
  })
  @IsString()
  contactPerson: string;

  @ApiProperty({
    description: 'The email address of the vendor',
    example: 'contact@abcsupplies.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The phone number of the vendor',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'The address of the vendor',
    example: '123 Supply St, New York, NY',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The tax ID of the vendor (optional)',
    example: 'TAX123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({
    description: 'Whether the vendor is active (optional)',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
