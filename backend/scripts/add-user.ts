import { DataSource } from 'typeorm';
import { User } from '../src/entities/User';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config(); // Load environment variables

const args = process.argv.slice(2);
const usernameIndex = args.indexOf('--username');
const passwordIndex = args.indexOf('--password');

if (usernameIndex === -1 || passwordIndex === -1) {
  console.error('Usage: npm run add-user -- --username <username> --password <password>');
  process.exit(1);
}

const username = args[usernameIndex + 1];
const password = args[passwordIndex + 1];

if (!username || !password) {
  console.error('Both username and password are required');
  process.exit(1);
}

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
});

async function addUser() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");

    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      console.error('User already exists');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    
    await userRepository.save(user);
    console.log(`User ${username} created successfully`);
    
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

addUser(); 