import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Website Redesign',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'A brief description of the project',
    example: 'Redesigning the company website to improve user experience',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The location of the project',
    example: 'New York Office',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'The start date of the project in ISO 8601 format',
    example: '2025-06-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    description: 'The end date of the project in ISO 8601 format',
    example: '2025-12-31T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    description: 'The status of the project',
    example: 'In Progress',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;
}