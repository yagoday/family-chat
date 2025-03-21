import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import { parse } from 'cookie';

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    // Get cookies from handshake headers
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error('Authentication cookie is required'));
    }

    const cookies = parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      return next(new Error('User not found'));
    }

    // Attach user ID to socket data
    socket.data.userId = user.id;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
}; 