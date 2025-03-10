import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/ormconfig';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import backgroundRoutes from './routes/background.routes';
import { authenticateSocket } from './middleware/auth.middleware';
import { User } from './entities/User';
import { Message } from './entities/Message';

config();

const app = express();
const httpServer = createServer(app);

// Basic CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://yagodas.up.railway.app',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: ['https://yagodas.up.railway.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', backgroundRoutes);

// Socket.IO middleware
io.use(authenticateSocket);

// Socket.IO connection handling
io.on('connection', async (socket) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: socket.data.userId } });
    
    if (user) {
      user.isOnline = true;
      await userRepository.save(user);
      
      io.emit('user_status', {
        userId: socket.data.userId,
        isOnline: true
      });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }

  socket.on('send_message', async (data) => {
    try {
      const { content } = data;
      const userRepository = AppDataSource.getRepository(User);
      const messageRepository = AppDataSource.getRepository(Message);
      
      const user = await userRepository.findOne({ where: { id: socket.data.userId } });

      if (!user) return;

      const message = new Message();
      message.content = content;
      message.sender = user;
      message.senderId = user.id;
      
      const savedMessage = await messageRepository.save(message);

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

  socket.on('typing', () => {
    socket.broadcast.emit('user_typing', {
      userId: socket.data.userId
    });
  });

  socket.on('disconnect', async () => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update(socket.data.userId, { isOnline: false });
      
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
    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

export default app; 