// src/materials/dto/create-material.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  vendorIds: number[];
}
