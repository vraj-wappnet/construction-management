// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'Password123!',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: 'user', // Use a valid value from your UserRole enum, e.g., 'user' or 'admin'
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'The phone number of the user (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'The company name of the user (optional)',
    example: 'Example Corp',
    required: false,
  })
  @IsOptional()
  @IsString()
  company?: string;
}
