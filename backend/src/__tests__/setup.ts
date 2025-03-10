import { AppDataSource } from '../config/ormconfig';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
}); 