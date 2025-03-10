import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { SeedUsers1709999999999 } from "../migrations/1709999999999-SeedUsers";
import { AddIsAdminColumn1741588358569 } from "../migrations/1741588358569-AddIsAdminColumn";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'family_chat',
  synchronize: false,
  logging: true,
  entities: [User, Message],
  migrations: [SeedUsers1709999999999, AddIsAdminColumn1741588358569],
  subscribers: [],
}); 