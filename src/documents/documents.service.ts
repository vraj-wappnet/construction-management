// src/documents/documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { DocumentVersion } from './document-version.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private versionsRepository: Repository<DocumentVersion>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    projectId: number,
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const document = this.documentsRepository.create({
      ...createDocumentDto,
      project,
    });

    return this.documentsRepository.save(document);
  }

  async findAllForProject(projectId: number): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { project: { id: projectId } },
      relations: ['versions', 'versions.uploadedBy'],
    });
  }

  async addVersion(
    documentId: number,
    createVersionDto: CreateDocumentVersionDto,
    userId: number,
  ): Promise<DocumentVersion> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
    });
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!document || !user) {
      throw new NotFoundException('Document or user not found');
    }

    const version = this.versionsRepository.create({
      ...createVersionDto,
      document,
      uploadedBy: user,
      uploadedAt: new Date(),
    });

    return this.versionsRepository.save(version);
  }

  async findVersions(documentId: number): Promise<DocumentVersion[]> {
    return this.versionsRepository.find({
      where: { document: { id: documentId } },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async findLatestVersion(documentId: number): Promise<DocumentVersion> {
    const version = await this.versionsRepository.findOne({
      where: { document: { id: documentId } },
      order: { uploadedAt: 'DESC' },
      relations: ['uploadedBy'],
    });
    if (!version) {
      throw new NotFoundException('Document version not found');
    }
    return version;
  }
}
