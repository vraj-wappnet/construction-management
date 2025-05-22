// src/vendors/dto/update-vendor.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVendorDto } from './create-vendor.dto';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @ApiProperty({
    description: 'The name of the vendor (optional)',
    example: 'ABC Supplies',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The name of the contact person for the vendor (optional)',
    example: 'John Smith',
    required: false,
  })
  contactPerson?: string;

  @ApiProperty({
    description: 'The email address of the vendor (optional)',
    example: 'contact@abcsupplies.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The phone number of the vendor (optional)',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'The address of the vendor (optional)',
    example: '123 Supply St, New York, NY',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'The tax ID of the vendor (optional)',
    example: 'TAX123456',
    required: false,
  })
  taxId?: string;

  @ApiProperty({
    description: 'Whether the vendor is active (optional)',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
