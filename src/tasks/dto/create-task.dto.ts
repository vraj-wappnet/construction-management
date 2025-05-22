// src/tasks/dto/create-task.dto.ts
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  assignedToIds: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  dependencyIds?: number[];
}
