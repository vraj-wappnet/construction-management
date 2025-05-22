// src/materials/materials.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects/:projectId/materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
  create(
    @Param('projectId') projectId: string,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    return this.materialsService.create(+projectId, createMaterialDto);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  findAll(@Param('projectId') projectId: string) {
    return this.materialsService.findAllForProject(+projectId);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.SITE_ENGINEER,
    UserRole.CONTRACTOR,
    UserRole.CLIENT,
  )
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(+id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER)
  updateStatus(
    @Param('id') id: string,
    @Body() updateMaterialStatusDto: UpdateMaterialStatusDto,
  ) {
    return this.materialsService.updateStatus(
      +id,
      updateMaterialStatusDto.status,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.materialsService.remove(+id);
  }
}
