// src/materials/materials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async create(
    projectId: number,
    createMaterialDto: CreateMaterialDto,
  ): Promise<Material> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const vendors = (
      await Promise.all(
        createMaterialDto.vendorIds.map((id) =>
          this.vendorsRepository.findOne({ where: { id } }),
        ),
      )
    ).filter((vendor): vendor is Vendor => vendor !== null);

    const material = this.materialsRepository.create({
      ...createMaterialDto,
      project,
      vendors,
    });

    return this.materialsRepository.save(material);
  }

  async findAllForProject(projectId: number): Promise<Material[]> {
    return this.materialsRepository.find({
      where: { project: { id: projectId } },
      relations: ['vendors'],
    });
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialsRepository.findOne({
      where: { id },
      relations: ['project', 'vendors'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  async updateStatus(id: number, status: string): Promise<Material> {
    const material = await this.materialsRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    material.status = status;
    return this.materialsRepository.save(material);
  }

  async remove(id: number): Promise<void> {
    await this.materialsRepository.delete(id);
  }
}
