// src/documents/documents.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('projects/:projectId/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
  create(
    @Param('projectId') projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.documentsService.create(+projectId, createDocumentDto);
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

  @Post(':id/versions')
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
  addVersion(
    @Param('id') id: string,
    @Body() createVersionDto: CreateDocumentVersionDto,
    @Req() req,
  ) {
    return this.documentsService.addVersion(+id, createVersionDto, req.user.id);
  }

  @Get(':id/versions')
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  findVersions(@Param('id') id: string) {
    return this.documentsService.findVersions(+id);
  }

  @Get(':id/latest')
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  findLatestVersion(@Param('id') id: string) {
    return this.documentsService.findLatestVersion(+id);
  }
}
