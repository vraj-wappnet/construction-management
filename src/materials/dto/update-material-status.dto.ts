// src/materials/dto/update-material-status.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialStatusDto {
  @ApiProperty({
    description: 'The updated status of the material',
    example: 'Delivered',
  })
  @IsString()
  status: string;
}
