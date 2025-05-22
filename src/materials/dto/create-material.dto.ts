// src/materials/dto/create-material.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'The name of the material',
    example: 'Concrete',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the material (optional)',
    example: 'High-strength concrete for foundation',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The quantity of the material',
    example: 100,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The unit of measurement for the material',
    example: 'cubic meters',
  })
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'The status of the material (optional)',
    example: 'Ordered',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Array of vendor IDs supplying the material',
    example: [1, 2],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  vendorIds: number[];
}