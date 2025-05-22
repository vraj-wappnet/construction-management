// src/projects/dto/create-project.dto.ts
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/user.entity';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Website Redesign',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the project',
    example: 'Redesigning the company website to improve user experience',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The location of the project',
    example: 'New York Office',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'The start date of the project in ISO 8601 format',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the project in ISO 8601 format (optional)',
    example: '2025-12-31T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    description: 'The status of the project (optional)',
    example: 'In Progress',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'List of user roles allowed to access the project (optional)',
    enum: UserRole,
    isArray: true,
    example: ['user', 'admin'], // Assuming UserRole enum has values like 'user', 'admin'
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  allowedRoles?: UserRole[];
}
