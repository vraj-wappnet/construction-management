// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { DocumentsModule } from './documents/documents.module';
import { MaterialsModule } from './materials/materials.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MailModule } from './mail/mail.module';
import { User } from './users/user.entity';
import { Project } from './projects/project.entity';
import { Task } from './tasks/task.entity';
import { Document } from './documents/document.entity';
import { Material } from './materials/material.entity';
import { Invoice } from './invoices/invoice.entity';
import { Otp } from './auth/otp.entity';
import { Vendor } from './vendors/vendor.entity';
import { VendorsModule } from './vendors/vendors.module';
import { DocumentVersion } from './documents/document-version.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available application-wide
      envFilePath: '.env', // Explicitly specify the .env file path
      validationSchema: Joi.object({
        // Optional: validate your env variables
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        OTP_SECRET: Joi.string().required(),
        // Add other required environment variables here
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Project,
          Task,
          Document,
          DocumentVersion,
          Material,
          Invoice,
          Otp,
          Vendor,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    DocumentsModule,
    MaterialsModule,
    VendorsModule,
    InvoicesModule,
    MailModule,
  ],
})
export class AppModule {}