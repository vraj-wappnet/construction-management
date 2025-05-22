// src/tasks/tasks.controller.ts
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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects/:projectId/tasks')
@ApiBearerAuth()     
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER, UserRole.CONTRACTOR)
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(+projectId, createTaskDto);
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  findAll(@Param('projectId') projectId: string) {
    return this.tasksService.findAllForProject(+projectId);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Post(':id/dependencies')
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER)
  addDependency(
    @Param('id') taskId: string,
    @Body('dependencyId') dependencyId: string,
  ) {
    return this.tasksService.addDependency(+taskId, +dependencyId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SITE_ENGINEER)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
