// src/materials/material.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column()
  status: string; // ordered, in_transit, delivered, used

  @ManyToOne(() => Project, (project) => project.materials)
  project: Project;

  @ManyToMany(() => Vendor, (vendor) => vendor.materials)
  @JoinTable()
  vendors: Vendor[];
}