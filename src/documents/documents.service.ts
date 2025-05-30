

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './document.entity';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { Project } from '../projects/project.entity';
// import { CloudinaryService } from './cloudinary.service';

// @Injectable()
// export class DocumentsService {
//   constructor(
//     @InjectRepository(Document)
//     private documentsRepository: Repository<Document>,
//     @InjectRepository(Project)
//     private projectsRepository: Repository<Project>,
//     private cloudinaryService: CloudinaryService,
//   ) {}

//   async create(
//     projectId: number,
//     createDocumentDto: CreateDocumentDto,
//     file: Express.Multer.File, // Use Express.Multer.File instead of Multer.File
//   ): Promise<Document> {
//     const project = await this.projectsRepository.findOne({
//       where: { id: projectId },
//     });
//     if (!project) {
//       throw new NotFoundException('Project not found');
//     }

//     // Upload file to Cloudinary, passing the document type
//     const fileUrl = await this.cloudinaryService.uploadFile(
//       file,
//       `documents/${projectId}`,
//       createDocumentDto.type,
//     );

//     const document = this.documentsRepository.create({
//       ...createDocumentDto,
//       project,
//       filePath: fileUrl,
//     });

//     return this.documentsRepository.save(document);
//   }

//   async findAllForProject(projectId: number): Promise<Document[]> {
//     return this.documentsRepository.find({
//       where: { project: { id: projectId } },
//     });
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Project } from '../projects/project.entity';
import { CloudinaryService } from './cloudinary.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    projectId: number,
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ): Promise<Document> {
    try {
      const project = await this.projectsRepository.findOne({
        where: { id: projectId },
      });
      if (!project) {
        this.logger.error(`Project not found: projectId=${projectId}`);
        throw new NotFoundException('Project not found');
      }

      const fileUrl = await this.cloudinaryService.uploadFile(
        file,
        `documents/${projectId}`,
        createDocumentDto.type,
      );

      const document = this.documentsRepository.create({
        ...createDocumentDto,
        project,
        filePath: fileUrl,
      });

      return this.documentsRepository.save(document);
    } catch (error) {
      this.logger.error(`Failed to create document: ${(error as Error).message}`);
      throw error;
    }
  }

  async findAllForProject(projectId: number): Promise<Document[]> {
    try {
      const documents = await this.documentsRepository.find({
        where: { project: { id: projectId } },
      });
      this.logger.log(`Found ${documents.length} documents for projectId=${projectId}`);
      return documents;
    } catch (error) {
      this.logger.error(`Failed to fetch documents: ${(error as Error).message}`);
      throw error;
    }
  }

  async findOne(projectId: number, documentId: number): Promise<Document> {
    try {
      const document = await this.documentsRepository.findOne({
        where: { id: documentId, project: { id: projectId } },
      });
      if (!document) {
        this.logger.error(`Document not found: projectId=${projectId}, documentId=${documentId}`);
        throw new NotFoundException('Document not found');
      }
      this.logger.debug(`Returning document: id=${documentId}, filePath=${document.filePath}, name=${document.name}`);
      return document;
    } catch (error) {
      this.logger.error(`Failed to fetch document: ${(error as Error).message}`);
      throw error;
    }
  }
}