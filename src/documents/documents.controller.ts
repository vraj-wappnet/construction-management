// // import {
// //   Controller,
// //   Get,
// //   Post,
// //   Body,
// //   Param,
// //   UseGuards,
// //   UseInterceptors,
// //   UploadedFile,
// // } from '@nestjs/common';
// // import { FileInterceptor } from '@nestjs/platform-express';
// // import { DocumentsService } from './documents.service';
// // import { CreateDocumentDto } from './dto/create-document.dto';
// // import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// // import { RolesGuard } from '../auth/roles.guard';
// // import { Roles } from '../auth/roles.decorator';
// // import { UserRole } from '../users/user.entity';
// // import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
// // import { Multer } from 'multer';

// // @Controller('projects/:projectId/documents')
// // @ApiBearerAuth()
// // @UseGuards(JwtAuthGuard, RolesGuard)
// // export class DocumentsController {
// //   constructor(private readonly documentsService: DocumentsService) {}

// //   @Post()
// //   @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
// //   @UseInterceptors(FileInterceptor('file'))
// //   @ApiConsumes('multipart/form-data')
// //   @ApiBody({
// //     schema: {
// //       type: 'object',
// //       properties: {
// //         name: { type: 'string', example: 'Project Blueprint' },
// //         type: { type: 'string', example: 'blueprint' },
// //         notes: { type: 'string', example: 'Initial draft of the blueprint' },
// //         file: { type: 'string', format: 'binary' },
// //       },
// //     },
// //   })
// //   create(
// //     @Param('projectId') projectId: string,
// //     @Body() createDocumentDto: CreateDocumentDto,
// //     @UploadedFile() file: Multer.File,
// //   ) {
// //     return this.documentsService.create(+projectId, createDocumentDto, file);
// //   }

// //   @Get()
// //   @Roles(
// //     UserRole.ADMIN,
// //     UserRole.SITE_ENGINEER,
// //     UserRole.CONTRACTOR,
// //     UserRole.CLIENT,
// //   )
// //   findAll(@Param('projectId') projectId: string) {
// //     return this.documentsService.findAllForProject(+projectId);
// //   }
// // }
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
//     @UploadedFile() file: Express.Multer.File, // Use Express.Multer.File
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
  Res,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { lookup } from 'mime-types';

@Controller('projects/:projectId/documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

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
  async create(
    @Param('projectId') projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
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
  async findAll(@Param('projectId') projectId: string) {
    return this.documentsService.findAllForProject(+projectId);
  }

  @Get(':documentId/download')
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  async download(
    @Param('projectId') projectId: string,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ) {
    try {
      const document = await this.documentsService.findOne(+projectId, +documentId);
      if (!document) {
        this.logger.error(`Document not found: projectId=${projectId}, documentId=${documentId}`);
        throw new NotFoundException('Document not found');
      }

      this.logger.debug(`Fetching file from Cloudinary: ${document.filePath}`);
      const response = await fetch(document.filePath);
      if (!response.ok) {
        this.logger.error(`Failed to fetch file: ${document.filePath}, status=${response.status}`);
        throw new HttpException(
          `File not found or inaccessible (HTTP ${response.status})`,
          response.status,
        );
      }

      if (!response.body) {
        this.logger.error(`Response body is empty for file: ${document.filePath}`);
        throw new HttpException('No file content available', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Determine content type
      let contentType = response.headers.get('content-type') || 'application/octet-stream';
      const fileExtensionMatch = document.filePath.match(/\.([a-zA-Z0-9]+)$/);
      const fileExtension = fileExtensionMatch ? fileExtensionMatch[1].toLowerCase() : null;
      if (fileExtension) {
        const mimeType = lookup(fileExtension) || contentType;
        contentType = mimeType;
      }

      // Set filename
      let fileName = document.name || 'document';
      if (fileExtension) {
        if (!fileName.toLowerCase().endsWith(`.${fileExtension}`)) {
          fileName += `.${fileExtension}`;
        }
      } else if (contentType === 'application/pdf') {
        fileName += '.pdf';
      } else if (contentType.startsWith('image/')) {
        fileName += contentType.includes('jpeg') ? '.jpg' : '.png';
      }

      this.logger.debug(`Downloading file: name=${fileName}, contentType=${contentType}`);

      // Buffer the response
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength === 0) {
        this.logger.error(`Empty buffer for file: ${document.filePath}`);
        throw new HttpException('File content is empty', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Set headers and send
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', buffer.byteLength);
      res.send(Buffer.from(buffer));
    } catch (error) {
      this.logger.error(`Download error: ${(error as Error).message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to download file: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}