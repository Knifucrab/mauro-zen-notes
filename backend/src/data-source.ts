import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "./entity/Note";
import { Tag } from "./entity/Tag";
import { User } from "./entity/User";

const isProduction = process.env.NODE_ENV === 'production';

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
      extra: { connectionLimit: 5 }
    });
  }
  
  console.log('Ì≥ä Connecting to MySQL via env vars...');
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
    extra: { connectionLimit: 5 }
  });
};

const createSQLiteDataSource = () => {
  if (isProduction) {
    throw new Error('SQLite not allowed in production');
  }
  console.log('‚ö†Ô∏è Using SQLite fallback...');
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

const hasRailwayConfig = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLHOST;

export const AppDataSource = isProduction || hasRailwayConfig 
  ? createMySQLDataSource() 
  : createSQLiteDataSource();

let isInitialized = false;

export const initializeDatabase = async () => {
  if (!isInitialized && !AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("‚úÖ Database initialized successfully!");
      return AppDataSource;
    } catch (error) {
      console.error("‚ùå Database initialization failed:", error);
      
      if (!isProduction && AppDataSource.options.type === 'mysql') {
        console.log('Ì¥Ñ Attempting SQLite fallback...');
        try {
          const sqliteDS = createSQLiteDataSource();
          await sqliteDS.initialize();
          isInitialized = true;
          console.log("‚úÖ SQLite fallback successful!");
          return sqliteDS;
        } catch (sqliteError) {
          console.error("‚ùå SQLite fallback failed:", sqliteError);
          throw sqliteError;
        }
      }
      
      throw error;
    }
  }
  return AppDataSource;
};
