/*
import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../server';
import { AppDataSource } from '../config/ormconfig';
import { Message } from '../entities/Message';
import { User } from '../entities/User';

describe('Message Controller Tests', () => {
  let app: Express;
  let testUser: User;
  let testMessage: Message;

  beforeAll(async () => {
    app = await createServer();
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should create a new message', async () => {
    const response = await request(app)
      .post('/api/messages')
      .send({
        content: 'Test message',
        userId: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('Test message');
  });

  it('should get all messages', async () => {
    const response = await request(app)
      .get('/api/messages');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
*/ 