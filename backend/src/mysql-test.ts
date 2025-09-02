import mysql from 'mysql2/promise';

export const testRawMysqlConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306'),
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
      connectTimeout: 30000,
    });

    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();
    
    return { success: true, result: rows };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};
