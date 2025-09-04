import { AppDataSource } from './data-source';

async function setupDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
