// src/projects/project.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { Document } from '../documents/document.entity';
import { Invoice } from '../invoices/invoice.entity';
import { Material } from '../materials/material.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: 'planned' })
  status: string; // planned, in_progress, completed, delayed, cancelled

  @ManyToOne(() => User, (user) => user.projects)
  client: User;

  @ManyToMany(() => User, (user) => user.contractorProjects)
  @JoinTable()
  contractors: User[];

  @ManyToMany(() => User, (user) => user.siteEngineerProjects)
  @JoinTable()
  siteEngineers: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices: Invoice[];

  @OneToMany(() => Material, (material) => material.project)
  materials: Material[];

  @OneToMany(() => Document, (document) => document.project)
  documents: Document[];
}