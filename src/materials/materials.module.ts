// src/materials/materials.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from './material.entity';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';
import { Vendor } from '../vendors/vendor.entity'; // Import Vendor

@Module({
  imports: [
    TypeOrmModule.forFeature([Material, Vendor]), // Add Vendor here
    ProjectsModule,
    forwardRef(() => VendorsModule), // Break circular dependency,
  ],
  providers: [MaterialsService],
  controllers: [MaterialsController],
})
export class MaterialsModule {}
