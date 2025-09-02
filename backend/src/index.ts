import 'dotenv/config'; // Load environment variables first
import express from 'express';
import cors from 'cors';
import notesRouter from './notes';
import tagsRouter from './tags';
import authRouter from './auth';
import { initializeDatabase } from './data-source';
import { authMiddleware } from './middleware/auth';

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://mauro-zen-notes-frontend.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Simple health check that doesn't require database
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    dbConfigured: !!(process.env.DATABASE_URL || process.env.MYSQLHOST)
  });
});

// Middleware to ensure database is initialized for routes that need it
const ensureDatabase = async (req: any, res: any, next: any) => {
  try {
    await initApp();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Public routes (with database)
app.use('/auth', ensureDatabase, authRouter);

// Protected routes (with database)
app.use('/notes', ensureDatabase, authMiddleware, notesRouter);
app.use('/tags', ensureDatabase, authMiddleware, tagsRouter);

// Initialize database before handling requests
let dbInitialized = false;
const initApp = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
};

// For serverless environments (Vercel)
if (process.env.NODE_ENV === 'production') {
  // Vercel will handle the initialization through middleware
  console.log('🚀 Running in production/serverless mode');
} else {
  // For local development
  const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts
  initApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for Vercel
export default app;
