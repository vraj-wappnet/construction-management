// src/projects/projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    clientId: number,
  ): Promise<Project> {
    const client = await this.usersRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      client,
      status: createProjectDto.status || 'planned',
    });

    return this.projectsRepository.save(project);
  }

  async findAllForUser(user: User): Promise<Project[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.contractors', 'contractors')
      .leftJoinAndSelect('project.siteEngineers', 'siteEngineers');

    switch (user.role) {
      case 'admin':
        // Admins can see all projects
        break;
      case 'client':
        query.where('client.id = :userId', { userId: user.id });
        break;
      case 'contractor':
        query
          .leftJoin('project.contractors', 'contractor')
          .where('contractor.id = :userId', { userId: user.id });
        break;
      case 'site_engineer':
        query
          .leftJoin('project.siteEngineers', 'engineer')
          .where('engineer.id = :userId', { userId: user.id });
        break;
    }

    return query.getMany();
  }

  async findOne(id: number, user: User): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: [
        'client',
        'contractors',
        'siteEngineers',
        'tasks',
        'documents',
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user has access to this project
    const hasAccess =
      user.role === 'admin' ||
      project.client.id === user.id ||
      project.contractors.some((c) => c.id === user.id) ||
      project.siteEngineers.some((e) => e.id === user.id);

    if (!hasAccess) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }
}
