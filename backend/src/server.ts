import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/ormconfig';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import { authenticateSocket } from './middleware/auth.middleware';
import { User } from './entities/User';
import { Message } from './entities/Message';

config(); // Load environment variables

const app = express();
const httpServer = createServer(app);

// Define allowed origins
const allowedOrigins = [
  'https://yagodas.up.railway.app',
  'https://frontend-production-723b.up.railway.app',
  'http://localhost:3000'
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO middleware
io.use(authenticateSocket);

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.data.userId);

  // Update user status to online
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: socket.data.userId } });
    
    if (user) {
      user.isOnline = true;
      await userRepository.save(user);
      
      // Broadcast user online status
      io.emit('user_status', {
        userId: socket.data.userId,
        isOnline: true
      });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }

  // Handle new messages
  socket.on('send_message', async (data) => {
    try {
      const { content } = data;
      const userRepository = AppDataSource.getRepository(User);
      const messageRepository = AppDataSource.getRepository(Message);
      
      const user = await userRepository.findOne({ where: { id: socket.data.userId } });

      if (!user) {
        return;
      }

      // Create and save the new message
      const message = new Message();
      message.content = content;
      message.sender = user;
      message.senderId = user.id;
      
      const savedMessage = await messageRepository.save(message);

      // Broadcast the message to all clients
      io.emit('new_message', {
        id: savedMessage.id,
        content: savedMessage.content,
        sender: {
          id: user.id,
          username: user.username,
          nickname: user.nickname
        },
        timestamp: savedMessage.createdAt.toISOString()
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle typing events
  socket.on('typing', () => {
    socket.broadcast.emit('user_typing', {
      userId: socket.data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.data.userId);
    
    try {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update(socket.data.userId, { isOnline: false });
      
      // Broadcast user offline status
      io.emit('user_status', {
        userId: socket.data.userId,
        isOnline: false
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    
    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Allowed origins:', allowedOrigins);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

export default app; 