import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "./entity/Note";
import { Tag } from "./entity/Tag";
import { User } from "./entity/User";

const isProduction = process.env.NODE_ENV === 'production';

// Create MySQL DataSource (primary choice)
const createMySQLDataSource = () => {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;
  
  if (databaseUrl) {
    console.log('Ì≥ä Connecting to MySQL via URL...');
    return new DataSource({
      type: "mysql",
      url: databaseUrl,
      ssl: false,
      synchronize: true,
      logging: !isProduction,
      entities: [Note, Tag, User],
      migrations: [],
      subscribers: [],
      connectTimeout: 60000,
      extra: {
        connectionLimit: 2,
        acquireTimeout: 60000,
        timeout: 60000,
      }
    });
  }
  
  if (process.env.MYSQLHOST) {
    console.log('Ì≥ä Connecting to MySQL via individual env vars...');
    return new DataSource({
      type: "mysql",
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306'),
      username: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
      ssl: false,
      synchronize: true,
      logging: !isProduction,
      entities: [Note, Tag, User],
      migrations: [],
      subscribers: [],
      connectTimeout: 60000,
      extra: {
        connectionLimit: 2,
        acquireTimeout: 60000,
        timeout: 60000,
      }
    });
  }
  
  return null;
};

// Create SQLite DataSource (fallback for local development only)
const createSQLiteDataSource = () => {
  if (isProduction) {
    throw new Error('‚ùå SQLite is not allowed in production. MySQL connection required.');
  }
  
  console.log('‚ö†Ô∏è Fallback to SQLite for local development (MySQL not available)');
  return new DataSource({
    type: "sqlite",
    database: "notes.sqlite",
    synchronize: true,
    logging: true,
    entities: [Note, Tag, User],
    migrations: [],
    subscribers: [],
  });
};

// Global data source variable - lazy initialization for serverless
let AppDataSource: DataSource | null = null;
let isInitialized = false;

// Initialize database with timeout for serverless
export const initializeDatabase = async (): Promise<DataSource> => {
  if (isInitialized && AppDataSource?.isInitialized) {
    return AppDataSource;
  }

  try {
    console.log('Ì∫Ä Initializing database...');
    
    if (!AppDataSource) {
      const hasRailwayConfig = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLHOST;
      
      if (isProduction || hasRailwayConfig) {
        AppDataSource = createMySQLDataSource();
        if (!AppDataSource) {
          throw new Error('‚ùå MySQL configuration not found');
        }
      } else {
        AppDataSource = createSQLiteDataSource();
      }
    }

    if (!AppDataSource.isInitialized) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database initialization timeout')), 30000);
      });
      
      const initPromise = AppDataSource.initialize();
      
      await Promise.race([initPromise, timeoutPromise]);
      isInitialized = true;
      console.log("‚úÖ Database initialized successfully!");
    }
    
    return AppDataSource;
  } catch (error) {
    console.error("‚ùå Database initialization failed:", error);
    
    if (!isProduction && AppDataSource?.options.type === 'mysql') {
      console.log('Ì¥Ñ Attempting SQLite fallback...');
      try {
        AppDataSource = createSQLiteDataSource();
        await AppDataSource.initialize();
        isInitialized = true;
        console.log("‚úÖ SQLite fallback successful!");
        return AppDataSource;
      } catch (sqliteError) {
        console.error("‚ùå SQLite fallback also failed:", sqliteError);
        throw sqliteError;
      }
    }
    
    throw error;
  }
};

export const getDataSource = async (): Promise<DataSource> => {
  return await initializeDatabase();
};

export { AppDataSource };
export default AppDataSource;
