/*
import { createServer } from '../server';
import { io as Client } from 'socket.io-client';
import { Server } from 'socket.io';
import { AppDataSource } from '../config/ormconfig';
import { createTestUser, generateToken } from './helpers';
import { User } from '../entities/User';

describe('Socket.io Tests', () => {
  let io: Server;
  let clientSocket: any;
  let port: number;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    const app = await createServer();
    await AppDataSource.initialize();
    port = 3001;
    io = app.listen(port).on('upgrade', (request, socket, head) => {
      // WebSocket upgrade handling
    });
  });

  afterAll(async () => {
    io.close();
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = generateToken(testUser);
    clientSocket = Client(`http://localhost:${port}`, {
      auth: {
        token: authToken
      }
    });
  });

  afterEach(() => {
    clientSocket.close();
  });

  it('should connect with valid token', (done) => {
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it('should receive message event', (done) => {
    const testMessage = {
      content: 'Test message',
      sender: testUser
    };

    clientSocket.on('message', (message: any) => {
      expect(message.content).toBe(testMessage.content);
      expect(message.sender.id).toBe(testUser.id);
      done();
    });

    // Emit a test message
    clientSocket.emit('send_message', testMessage);
  });
});
*/ 