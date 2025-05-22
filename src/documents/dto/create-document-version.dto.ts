// src/documents/dto/create-document-version.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentVersionDto {
  @ApiProperty({
    description: 'The version identifier of the document',
    example: '1.0.0',
  })
  @IsString()
  version: string;

  @ApiProperty({
    description: 'The file path or URL of the document version',
    example: '/uploads/documents/blueprint-v1.pdf',
  })
  @IsString()
  filePath: string;

  @ApiProperty({
    description: 'Notes about this document version (optional)',
    example: 'Initial draft of the blueprint',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}