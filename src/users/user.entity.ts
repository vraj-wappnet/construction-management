import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

export enum UserRole {
  ADMIN = 'admin',
  CONTRACTOR = 'contractor',
  SITE_ENGINEER = 'site_engineer',
  CLIENT = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string | null;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @ManyToMany(() => Project, (project) => project.contractors)
  contractorProjects: Project[];

  @ManyToMany(() => Project, (project) => project.siteEngineers)
  siteEngineerProjects: Project[];

  @ManyToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}