import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let userCounter = 0;

export const createTestUser = async (username?: string, password: string = 'password123') => {
  const userRepository = AppDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User();
  user.username = username || `testuser${++userCounter}`;
  user.password = hashedPassword;
  user.isOnline = false;
  
  await userRepository.save(user);
  return user;
};

export const generateToken = (user: User) => {
  const jwtSecret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });
};

export const clearDatabase = async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // Drop all tables in the correct order
    await queryRunner.query('TRUNCATE TABLE "messages" CASCADE');
    await queryRunner.query('TRUNCATE TABLE "users" CASCADE');
    
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}; 