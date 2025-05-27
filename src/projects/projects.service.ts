import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
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
    const client = await this.usersRepository.findOneBy({ id: clientId });
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

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (user.role !== 'admin' && project.client.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this project',
      );
    }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async acceptProject(id: number, contractorId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['contractors'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const contractor = await this.usersRepository.findOneBy({
      id: contractorId,
    });
    if (!contractor || contractor.role !== 'contractor') {
      throw new NotFoundException('Contractor not found');
    }

    // Remove the check that requires the contractor to be pre-assigned
    // Instead, add the contractor to the project's contractors array if not already present
    project.contractors = project.contractors || [];
    if (!project.contractors.some((c) => c.id === contractorId)) {
      project.contractors.push(contractor);
    }

    // Update the project status to 'in_progress'
    project.status = 'in_progress';

    return this.projectsRepository.save(project);
  }

  async assignSiteEngineer(
    projectId: number,
    siteEngineerId: number,
    contractorId: number,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['contractors', 'siteEngineers'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const contractor = await this.usersRepository.findOneBy({
      id: contractorId,
    });
    if (!contractor || contractor.role !== 'contractor') {
      throw new ForbiddenException(
        'Only contractors can assign site engineers',
      );
    }

    if (!project.contractors.some((c) => c.id === contractorId)) {
      throw new ForbiddenException('You are not assigned to this project');
    }

    const siteEngineer = await this.usersRepository.findOneBy({
      id: siteEngineerId,
    });
    if (!siteEngineer || siteEngineer.role !== 'site_engineer') {
      throw new NotFoundException('Site engineer not found');
    }

    project.siteEngineers = project.siteEngineers || [];
    if (!project.siteEngineers.some((e) => e.id === siteEngineerId)) {
      project.siteEngineers.push(siteEngineer);
    }

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
        // Admins see all projects
        break;
      case 'client':
        // Clients see projects they created
        query.where('client.id = :userId', { userId: user.id });
        break;
      case 'contractor':
        // Contractors see all projects (like admin) or optionally only projects they're assigned to
        // Current implementation shows all projects to contractors
        break;
      case 'site_engineer':
        // Site engineers see projects they are assigned to
        query
          .leftJoin('project.siteEngineers', 'engineer')
          .where('engineer.id = :userId', { userId: user.id });
        break;
      default:
        throw new ForbiddenException('Invalid user role');
    }

    return query.getMany();
  }

  async findMyProjects(user: User): Promise<Project[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.contractors', 'contractors')
      .leftJoinAndSelect('project.siteEngineers', 'siteEngineers');

    switch (user.role) {
      case 'admin':
        // Admins see all projects
        break;
      case 'client':
        // Clients see projects they created
        query.where('client.id = :userId', { userId: user.id });
        break;
      case 'contractor':
        // Contractors see projects they accepted (status = 'in_progress')
        query
          .leftJoin('project.contractors', 'contractor')
          .where('contractor.id = :userId', { userId: user.id })
          .andWhere('project.status = :status', { status: 'in_progress' });
        break;
      case 'site_engineer':
        // Site engineers see projects they are assigned to
        query
          .leftJoin('project.siteEngineers', 'engineer')
          .where('engineer.id = :userId', { userId: user.id });
        break;
      default:
        throw new ForbiddenException('Invalid user role');
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

    const hasAccess =
      user.role === 'admin' ||
      project.client.id === user.id ||
      project.contractors.some((c) => c.id === user.id) ||
      project.siteEngineers.some((e) => e.id === user.id);

    if (!hasAccess) {
      throw new ForbiddenException(
        'You are not authorized to view this project',
      );
    }

    return project;
  }

  async delete(id: number, user: User): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (user.role !== 'admin' && project.client.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this project',
      );
    }

    await this.projectsRepository.delete(id);
  }
}
