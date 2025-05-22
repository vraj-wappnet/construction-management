// // src/users/dto/update-user.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
// import { IsString, IsOptional } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {
//   @IsOptional()
//   @IsString()
//   currentPassword?: string;
// }
// src/users/dto/update-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email address of the user (optional)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password for the user account (optional)',
    example: 'NewPassword123!',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'The first name of the user (optional)',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user (optional)',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The role of the user (optional)',
    enum: UserRole,
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

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
