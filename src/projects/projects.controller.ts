// src/projects/projects.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req): Promise<Project> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req): Promise<Project[]> {
    return this.projectsService.findAllForUser(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT, UserRole.CONTRACTOR, UserRole.SITE_ENGINEER)
  async findOne(@Param('id') id: string, @Req() req): Promise<Project> {
    return this.projectsService.findOne(+id, req.user);
  }
}