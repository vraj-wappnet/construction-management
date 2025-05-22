// src/documents/document.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { DocumentVersion } from './document-version.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string; // blueprint, contract, approval, etc.

  @ManyToOne(() => Project, (project) => project.documents)
  project: Project;

  @OneToMany(() => DocumentVersion, (version) => version.document)
  versions: DocumentVersion[];
}
