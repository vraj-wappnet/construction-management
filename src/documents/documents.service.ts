// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './document.entity';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { Project } from '../projects/project.entity';
// import { Multer } from 'multer';
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
//     file: Multer.File,
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

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    projectId: number,
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File, // Use Express.Multer.File instead of Multer.File
  ): Promise<Document> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Upload file to Cloudinary, passing the document type
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
  }

  async findAllForProject(projectId: number): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { project: { id: projectId } },
    });
  }
}