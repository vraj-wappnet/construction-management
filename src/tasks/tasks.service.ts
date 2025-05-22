// src/tasks/tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto'; // Ensure this is imported
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Existing methods (create, findAllForProject, findOne, addDependency) remain unchanged
  // src/tasks/tasks.service.ts
  async create(projectId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Fetch assigned users
    const assignedTo = await Promise.all(
      createTaskDto.assignedToIds.map((id) =>
        this.usersRepository.findOne({ where: { id } }),
      ),
    ).then((users) => users.filter((user): user is User => user !== null)); // Ensure no null values

    // Fetch dependencies if provided
    const dependencies = createTaskDto.dependencyIds
      ? await Promise.all(
          createTaskDto.dependencyIds.map((id) =>
            this.tasksRepository.findOne({ where: { id } }),
          ),
        ).then((tasks) => tasks.filter((task): task is Task => task !== null)) // Ensure no null values
      : [];

    // Create a single task entity
    const task = this.tasksRepository.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      startDate: createTaskDto.startDate,
      endDate: createTaskDto.endDate,
      status: createTaskDto.status || 'pending',
      progress: createTaskDto.progress || 0,
      project,
      assignedTo,
      dependencies,
    });

    // Save and return the task
    return this.tasksRepository.save(task);
  }

  async findAllForProject(projectId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { project: { id: projectId } },
      relations: ['assignedTo', 'dependencies'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo', 'dependencies'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async addDependency(taskId: number, dependencyId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['dependencies'],
    });
    const dependency = await this.tasksRepository.findOne({
      where: { id: dependencyId },
    });

    if (!task || !dependency) {
      throw new NotFoundException('Task or dependency not found');
    }

    task.dependencies.push(dependency);
    return this.tasksRepository.save(task);
  }

  // New methods to add
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project', 'assignedTo', 'dependencies'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Update task fields based on UpdateTaskDto
    Object.assign(task, {
      name: updateTaskDto.name ?? task.name,
      description: updateTaskDto.description ?? task.description,
      startDate: updateTaskDto.startDate ?? task.startDate,
      endDate: updateTaskDto.endDate ?? task.endDate,
      status: updateTaskDto.status ?? task.status,
      progress: updateTaskDto.progress ?? task.progress,
    });

    // Update assigned users if provided
    if (updateTaskDto.assignedToIds) {
      const assignedTo = await Promise.all(
        updateTaskDto.assignedToIds.map((id) =>
          this.usersRepository.findOne({ where: { id } }),
        ),
      );
      task.assignedTo = assignedTo.filter((user) => user !== null) as User[];
    }

    // Update dependencies if provided
    if (updateTaskDto.dependencyIds) {
      const dependencies = await Promise.all(
        updateTaskDto.dependencyIds.map((id) =>
          this.tasksRepository.findOne({ where: { id } }),
        ),
      );
      task.dependencies = dependencies.filter((dep) => dep !== null) as Task[];
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.delete(id);
  }
}
