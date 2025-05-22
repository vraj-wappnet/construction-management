// src/tasks/dto/update-task.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The name of the task (optional)',
    example: 'Design Homepage',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'A brief description of the task (optional)',
    example: 'Create wireframes and mockups for the homepage',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The start date of the task in ISO 8601 format (optional)',
    example: '2025-06-01T00:00:00.000Z',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    description: 'The end date of the task in ISO 8601 format (optional)',
    example: '2025-06-15T00:00:00.000Z',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: 'The status of the task (optional)',
    example: 'In Progress',
    required: false,
  })
  status?: string;

  @ApiProperty({
    description: 'The progress percentage of the task (optional)',
    example: 50,
    required: false,
  })
  progress?: number;

  @ApiProperty({
    description: 'Array of user IDs assigned to the task (optional)',
    example: [1, 2, 3],
    required: false,
  })
  assignedToIds?: number[];

  @ApiProperty({
    description: 'Array of task IDs that this task depends on (optional)',
    example: [4, 5],
    required: false,
  })
  dependencyIds?: number[];
}