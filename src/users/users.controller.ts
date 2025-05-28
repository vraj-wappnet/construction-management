import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123!' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        role: {
          type: 'string',
          enum: ['admin', 'contractor', 'site_engineer', 'client'],
          example: 'client',
        },
        phone: { type: 'string', example: '+1234567890', nullable: true },
        company: { type: 'string', example: 'Example Corp', nullable: true },
        profilePicture: { type: 'string', format: 'binary' },
      },
      required: ['email', 'password', 'firstName', 'lastName', 'role'],
    },
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, file);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @ApiBearerAuth()
  @Get('site-engineers')
  @UseGuards(JwtAuthGuard)
  getSiteEngineers() {
    return this.usersService.getSiteEngineers();
  }

  @ApiBearerAuth()
  @Get('contractors')
  @UseGuards(JwtAuthGuard)
  getContractors() {
    return this.usersService.getContractors();
  }

  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com', nullable: true },
        password: {
          type: 'string',
          example: 'NewPassword123!',
          nullable: true,
        },
        currentPassword: {
          type: 'string',
          example: 'OldPassword123!',
          nullable: true,
        },
        firstName: { type: 'string', example: 'John', nullable: true },
        lastName: { type: 'string', example: 'Doe', nullable: true },
        role: {
          type: 'string',
          enum: ['admin', 'contractor', 'site_engineer', 'client'],
          example: 'client',
          nullable: true,
        },
        phone: { type: 'string', example: '+1234567890', nullable: true },
        company: { type: 'string', example: 'Example Corp', nullable: true },
        profilePicture: { type: 'string', format: 'binary', nullable: true },
      },
    },
  })
  update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.update(req.user.id, updateUserDto, file);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
