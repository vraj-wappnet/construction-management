// src/projects/dto/create-project.dto.ts
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  allowedRoles?: UserRole[];
}
