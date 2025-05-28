import { DataSource } from "typeorm";
import 'dotenv/config';
import { User } from "./users/user.entity";
import { Project } from "./projects/project.entity"; // Add this import
import { Task } from "./tasks/task.entity";
import { Invoice } from "./invoices/invoice.entity";
import { Vendor } from "./vendors/vendor.entity";
import { Material } from "./materials/material.entity";
import { Document } from "./documents/document.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    synchronize: false,
    logging: false,
    entities: [User, Project, Task , Invoice, Vendor,Material,Document], // Include all related entities
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});