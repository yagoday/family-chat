/*
import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../server';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

let app: Express;

beforeAll(async () => {
  app = await createServer();
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Auth Controller', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wronguser',
        password: 'wrongpass'
      });

    expect(response.status).toBe(401);
  });
});
*/ 