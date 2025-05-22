// src/invoices/invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  invoiceNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, paid, overdue, cancelled

  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Project, (project) => project.invoices)
  project: Project;

  @ManyToOne(() => User)
  contractor: User;

  @ManyToOne(() => User)
  client: User;
}