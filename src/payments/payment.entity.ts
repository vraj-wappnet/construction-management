import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripePaymentIntentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string; // e.g., pending, succeeded, failed

  @ManyToOne(() => User, (user) => user.paymentsMade)
  payer: User;

  @ManyToOne(() => User, (user) => user.paymentsReceived)
  payee: User;

  @ManyToOne(() => Project, (project) => project.payments)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  description: string;
}