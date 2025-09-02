import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testBasicConnection() {
  console.log('🔄 Testing basic MySQL connection...');
  
  const config = {
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT || '3306'),
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    connectTimeout: 10000,
  };
  
  console.log('Connection config:', {
    ...config,
    password: config.password ? '[HIDDEN]' : 'NOT SET'
  });
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Basic connection successful!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test:', rows);
    
    await connection.end();
    console.log('✅ Connection closed successfully!');
    
  } catch (error) {
    console.error('❌ Basic connection failed:', error);
  }
}

testBasicConnection();
