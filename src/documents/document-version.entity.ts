// src/documents/document-version.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';

@Entity()
export class DocumentVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  filePath: string;

  @Column()
  uploadedAt: Date;

  @ManyToOne(() => User)
  uploadedBy: User;

  @Column()
  notes: string;

  @ManyToOne(() => Document, (document) => document.versions)
  document: Document;
}
