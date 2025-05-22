// src/tasks/dto/create-task.dto.ts
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    example: 'Design Homepage',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief description of the task',
    example: 'Create wireframes and mockups for the homepage',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The start date of the task in ISO 8601 format',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the task in ISO 8601 format',
    example: '2025-06-15T00:00:00.000Z',
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    description: 'The status of the task (optional)',
    example: 'Not Started',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'The progress percentage of the task (optional)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  progress?: number;

  @ApiProperty({
    description: 'Array of user IDs assigned to the task',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  assignedToIds: number[];

  @ApiProperty({
    description: 'Array of task IDs that this task depends on (optional)',
    example: [4, 5],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  dependencyIds?: number[];
}
