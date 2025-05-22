// src/materials/dto/update-material-status.dto.ts
import { IsString } from 'class-validator';

export class UpdateMaterialStatusDto {
  @IsString()
  status: string;
}
