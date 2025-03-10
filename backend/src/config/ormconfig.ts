import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { SeedUsers1709999999999 } from "../migrations/1709999999999-SeedUsers";
import { AddIsAdminColumn1741588358569 } from "../migrations/1741588358569-AddIsAdminColumn";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: isProduction,
  extra: {
    ssl: isProduction ? {
      rejectUnauthorized: false
    } : false
  },
  synchronize: false,
  logging: true,
  entities: [User, Message],
  migrations: [SeedUsers1709999999999, AddIsAdminColumn1741588358569],
  subscribers: [],
  migrationsRun: true // This will ensure migrations run on startup
}); 