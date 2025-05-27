import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('projects')
@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ): Promise<Project> {
    return this.projectsService.update(+id, updateProjectDto, req.user);
  }

  @Post(':id/accept')
  @Roles(UserRole.CONTRACTOR)
  async acceptProject(@Param('id') id: string, @Req() req): Promise<Project> {
    return this.projectsService.acceptProject(+id, req.user.id);
  }

  @Post(':id/assign-site-engineer/:siteEngineerId')
  @Roles(UserRole.CONTRACTOR)
  async assignSiteEngineer(
    @Param('id') projectId: string,
    @Param('siteEngineerId') siteEngineerId: string,
    @Req() req,
  ): Promise<Project> {
    return this.projectsService.assignSiteEngineer(
      +projectId,
      +siteEngineerId,
      req.user.id,
    );
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  async findAll(@Req() req): Promise<Project[]> {
    return this.projectsService.findAllForUser(req.user);
  }

  @Get('my-projects')
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  async findMyProjects(@Req() req): Promise<Project[]> {
    return this.projectsService.findMyProjects(req.user);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  async findOne(@Param('id') id: string, @Req() req): Promise<Project> {
    return this.projectsService.findOne(+id, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  async delete(@Param('id') id: string, @Req() req): Promise<void> {
    return this.projectsService.delete(+id, req.user);
  }
}