// src/documents/dto/create-document.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsString()
  type: string; // blueprint, contract, approval, etc.

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  projectId: number;
}
