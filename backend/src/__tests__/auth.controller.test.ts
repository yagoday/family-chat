import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../server';
import { createTestUser, clearDatabase, generateToken } from './helpers';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

let app: Express;

beforeAll(async () => {
  app = await createServer();
});

beforeEach(async () => {
  await clearDatabase();
});

describe('AuthController', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createTestUser();
      const username = user.username;
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username,
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(username);
      expect(response.body.user.isOnline).toBe(true);

      // Verify user is marked as online in database
      const updatedUser = await AppDataSource.getRepository(User).findOne({
        where: { id: user.id }
      });
      expect(updatedUser?.isOnline).toBe(true);
    });

    it('should return 401 with invalid credentials', async () => {
      const user = await createTestUser();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: user.username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const user = await createTestUser();
      user.isOnline = true;
      await AppDataSource.getRepository(User).save(user);

      const token = generateToken(user);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');

      // Verify user is marked as offline in database
      const updatedUser = await AppDataSource.getRepository(User).findOne({
        where: { id: user.id }
      });
      expect(updatedUser?.isOnline).toBe(false);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication token is required');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(user.username);
      expect(response.body).toHaveProperty('isOnline');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication token is required');
    });
  });
}); 