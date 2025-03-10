import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../server';
import { createTestUser, clearDatabase, generateToken } from './helpers';
import { AppDataSource } from '../config/ormconfig';
import { Message } from '../entities/Message';
import { User } from '../entities/User';

let app: Express;
let testUser: User;
let authToken: string;

beforeAll(async () => {
  app = await createServer();
});

beforeEach(async () => {
  await clearDatabase();
  testUser = await createTestUser();
  authToken = generateToken(testUser);
});

describe('MessageController', () => {
  describe('GET /api/messages', () => {
    it('should return empty array when no messages exist', async () => {
      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return messages in correct order', async () => {
      const messageRepository = AppDataSource.getRepository(Message);
      
      // Create test messages
      const message1 = messageRepository.create({
        content: 'First message',
        sender: testUser,
        senderId: testUser.id
      });
      await messageRepository.save(message1);

      const message2 = messageRepository.create({
        content: 'Second message',
        sender: testUser,
        senderId: testUser.id
      });
      await messageRepository.save(message2);

      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].content).toBe('First message');
      expect(response.body[1].content).toBe('Second message');
    });

    it('should respect the limit parameter', async () => {
      const messageRepository = AppDataSource.getRepository(Message);
      
      // Create 3 test messages
      for (let i = 0; i < 3; i++) {
        const message = messageRepository.create({
          content: `Message ${i + 1}`,
          sender: testUser,
          senderId: testUser.id
        });
        await messageRepository.save(message);
      }

      const response = await request(app)
        .get('/api/messages?limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('POST /api/messages', () => {
    it('should create a new message successfully', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test message'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('Test message');
      expect(response.body.sender.id).toBe(testUser.id);
    });

    it('should create a message with image URL', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test message with image',
          imageUrl: 'https://example.com/image.jpg'
        });

      expect(response.status).toBe(201);
      expect(response.body.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should return 400 when no content or image provided', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Message must have content or image');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          content: 'Test message'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/messages/:id', () => {
    it('should delete message successfully', async () => {
      // Create a test message
      const messageRepository = AppDataSource.getRepository(Message);
      const message = messageRepository.create({
        content: 'Test message',
        sender: testUser,
        senderId: testUser.id
      });
      await messageRepository.save(message);

      const response = await request(app)
        .delete(`/api/messages/${message.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify message is deleted
      const deletedMessage = await messageRepository.findOne({
        where: { id: message.id }
      });
      expect(deletedMessage).toBeNull();
    });

    it('should return 404 for non-existent message', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'; // Valid UUID format
      const response = await request(app)
        .delete(`/api/messages/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 403 when trying to delete another user\'s message', async () => {
      // Create another user and their message
      const otherUser = await createTestUser();
      const messageRepository = AppDataSource.getRepository(Message);
      const message = messageRepository.create({
        content: 'Other user\'s message',
        sender: otherUser,
        senderId: otherUser.id
      });
      await messageRepository.save(message);

      const response = await request(app)
        .delete(`/api/messages/${message.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to delete this message');
    });
  });
}); 