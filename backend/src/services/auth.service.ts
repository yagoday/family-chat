import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private static userRepository = AppDataSource.getRepository(User);

  static async validateCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  static async updateUserOnlineStatus(user: User, isOnline: boolean): Promise<User> {
    user.isOnline = isOnline;
    return await this.userRepository.save(user);
  }

  static generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '24h' });
  }

  static getUserProfile(user: User) {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: `/images/${user.username}.jpeg`,
      isOnline: user.isOnline,
      isAdmin: user.isAdmin
    };
  }
} 