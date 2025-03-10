import { createServer } from '../server';
import { createTestUser, clearDatabase, generateToken } from './helpers';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { Server } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

interface MessageEvent {
  content: string;
  timestamp: string;
  sender?: {
    id: string;
    username: string;
    isOnline: boolean;
  };
}

interface TypingEvent {
  userId: string;
  username: string;
  isTyping: boolean;
}

let app: Express;
let httpServer: ReturnType<typeof createHttpServer>;
let io: Server;
let clientSocket: ClientSocket | null;
let testUser: User;
let port: number;

beforeAll(async () => {
  app = await createServer();
  httpServer = createHttpServer(app);
  io = new Server(httpServer);
  port = 4001; // Use a different port than the main server
  await new Promise<void>((resolve) => {
    httpServer.listen(port, () => resolve());
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    io.close(() => resolve());
  });
  await new Promise<void>((resolve) => {
    httpServer.close(() => resolve());
  });
});

beforeEach(async () => {
  await clearDatabase();
  testUser = await createTestUser();
  clientSocket = null;
});

afterEach(async () => {
  if (clientSocket?.connected) {
    await new Promise<void>((resolve) => {
      clientSocket?.close();
      resolve();
    });
  }
});

describe('Socket.io', () => {
  it('should connect with valid token', (done) => {
    const token = generateToken(testUser);
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token }
    });

    clientSocket.on('connect', () => {
      expect(clientSocket?.connected).toBe(true);
      done();
    });
  }, 10000);

  it('should disconnect with invalid token', (done) => {
    const invalidSocket = Client(`http://localhost:${port}`, {
      auth: { token: 'invalid-token' }
    });

    invalidSocket.on('connect_error', (error: Error) => {
      expect(error.message).toBe('Invalid token');
      invalidSocket.close();
      done();
    });
  }, 10000);

  it('should broadcast new message to all clients', (done) => {
    const token = generateToken(testUser);
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token }
    });

    const message: MessageEvent = {
      content: 'Test message',
      timestamp: new Date().toISOString()
    };

    clientSocket.on('connect', () => {
      clientSocket?.on('new_message', (receivedMessage: MessageEvent) => {
        expect(receivedMessage.content).toBe(message.content);
        expect(receivedMessage.sender?.id).toBe(testUser.id);
        expect(receivedMessage.sender?.username).toBe(testUser.username);
        done();
      });

      clientSocket?.emit('send_message', message);
    });
  }, 10000);

  it('should broadcast typing status', (done) => {
    const token = generateToken(testUser);
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token }
    });

    const secondSocket = Client(`http://localhost:${port}`, {
      auth: { token: generateToken(testUser) }
    });

    clientSocket.on('connect', () => {
      secondSocket.on('user_typing', (data: TypingEvent) => {
        expect(data.userId).toBe(testUser.id);
        expect(data.username).toBe(testUser.username);
        expect(data.isTyping).toBe(true);
        secondSocket.close();
        done();
      });

      clientSocket?.emit('typing', true);
    });
  }, 10000);

  it('should update user status on disconnect', async () => {
    const token = generateToken(testUser);
    clientSocket = Client(`http://localhost:${port}`, {
      auth: { token }
    });

    await new Promise<void>((resolve) => {
      clientSocket?.on('connect', () => resolve());
    });

    // Set user as online
    const userRepository = AppDataSource.getRepository(User);
    testUser.isOnline = true;
    await userRepository.save(testUser);

    // Disconnect socket and wait for the server to process it
    clientSocket?.close();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check user status in database
    const updatedUser = await userRepository.findOne({
      where: { id: testUser.id }
    });

    expect(updatedUser?.isOnline).toBe(false);
  }, 10000);
}); 