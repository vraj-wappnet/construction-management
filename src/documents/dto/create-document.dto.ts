// src/documents/dto/create-document.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'The name of the document',
    example: 'Project Blueprint',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The type of the document (e.g., blueprint, contract, approval)',
    example: 'blueprint',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'A brief description of the document (optional)',
    example: 'Blueprint for the new office layout',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The ID of the project associated with the document',
    example: 1,
  })
  @IsNumber()
  projectId: number;
}