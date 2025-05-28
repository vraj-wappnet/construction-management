import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string; // blueprint, contract, approval, etc.

  @Column()
  filePath: string; // Store the Firebase Storage URL

  @ManyToOne(() => Project, (project) => project.documents)
  project: Project;
}