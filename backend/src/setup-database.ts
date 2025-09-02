import { getDataSource } from './data-source';

async function setupDatabase() {
  try {
    const dataSource = await getDataSource();
    console.log('Database initialized successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
