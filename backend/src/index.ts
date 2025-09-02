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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/notes', authMiddleware, notesRouter);
app.use('/tags', authMiddleware, tagsRouter);

// Initialize database before handling requests
const initApp = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// For serverless environments (Vercel)
if (process.env.NODE_ENV === 'production') {
  initApp();
  module.exports = app;
} else {
  // For local development
  const PORT = process.env.PORT || 3000;
  initApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
