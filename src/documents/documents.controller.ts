// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { DocumentsService } from './documents.service';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from '../users/user.entity';
// import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
// import { Multer } from 'multer';

// @Controller('projects/:projectId/documents')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class DocumentsController {
//   constructor(private readonly documentsService: DocumentsService) {}

//   @Post()
//   @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
//   @UseInterceptors(FileInterceptor('file'))
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         name: { type: 'string', example: 'Project Blueprint' },
//         type: { type: 'string', example: 'blueprint' },
//         notes: { type: 'string', example: 'Initial draft of the blueprint' },
//         file: { type: 'string', format: 'binary' },
//       },
//     },
//   })
//   create(
//     @Param('projectId') projectId: string,
//     @Body() createDocumentDto: CreateDocumentDto,
//     @UploadedFile() file: Multer.File,
//   ) {
//     return this.documentsService.create(+projectId, createDocumentDto, file);
//   }

//   @Get()
//   @Roles(
//     UserRole.ADMIN,
//     UserRole.SITE_ENGINEER,
//     UserRole.CONTRACTOR,
//     UserRole.CLIENT,
//   )
//   findAll(@Param('projectId') projectId: string) {
//     return this.documentsService.findAllForProject(+projectId);
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('projects/:projectId/documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Project Blueprint' },
        type: { type: 'string', example: 'blueprint' },
        notes: { type: 'string', example: 'Initial draft of the blueprint' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Param('projectId') projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File, // Use Express.Multer.File
  ) {
    return this.documentsService.create(+projectId, createDocumentDto, file);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  findAll(@Param('projectId') projectId: string) {
    return this.documentsService.findAllForProject(+projectId);
  }
}