// src/documents/dto/create-document-version.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentVersionDto {
  @IsString()
  version: string;

  @IsString()
  filePath: string;

  @IsOptional()
  @IsString()
  notes?: string;
}