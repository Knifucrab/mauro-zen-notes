import 'dotenv/config';
import { getDataSource, initializeDatabase } from './data-source';

async function testMySQLConnection() {
  console.log('🔄 Testing MySQL connection to Railway...');
  console.log('DATABASE_URL provided:', !!process.env.DATABASE_URL);
  console.log('Connection details:');
  console.log('- Host:', process.env.MYSQLHOST);
  console.log('- Port:', process.env.MYSQLPORT);
  console.log('- User:', process.env.MYSQLUSER);
  console.log('- Database:', process.env.MYSQLDATABASE);
  console.log('- Password length:', process.env.MYSQLPASSWORD?.length || 0);
  
  try {
  const dataSource = await getDataSource();
  console.log('✅ Database connection successful!');

  // Test a simple query
  const result = await dataSource.query('SELECT 1 as test');
  console.log('✅ Query test successful:', result);

  // Show database info
  const dbInfo = await dataSource.query('SELECT DATABASE() as current_db');
  console.log('✅ Connected to database:', dbInfo);

  // Check if tables exist
  const tables = await dataSource.query('SHOW TABLES');
  console.log('📋 Existing tables:', tables);

  await dataSource.destroy();
  console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testMySQLConnection();
