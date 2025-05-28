import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'The name of the document',
    example: 'Project Blueprint',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The type of the document',
    example: 'blueprint',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Notes about this document (optional)',
    example: 'Initial draft of the blueprint',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}