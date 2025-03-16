import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { SeedUsers1709999999999 } from "../migrations/1709999999999-SeedUsers";
import { AddIsAdminColumn1741588358569 } from "../migrations/1741588358569-AddIsAdminColumn";
import { CreateMessages1741593647638 } from "../migrations/1741593647638-CreateMessages";
import { DeleteAllMessages1742141237000 } from "../migrations/1742141237000-DeleteAllMessages";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;


export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: isDevelopment ? false : {
    rejectUnauthorized: false
  },
  synchronize: false,
  logging: false, // Disable SQL query logging
  entities: [User, Message],
  migrations: [
    SeedUsers1709999999999, 
    AddIsAdminColumn1741588358569,
    CreateMessages1741593647638,
    DeleteAllMessages1742141237000
  ],
  subscribers: [],
  migrationsRun: true // This will ensure migrations run on startup
}); 