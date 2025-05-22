// src/vendors/dto/create-vendor.dto.ts
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsString()
  contactPerson: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}