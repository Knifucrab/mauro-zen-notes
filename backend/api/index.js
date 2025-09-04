const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('../src/routes/auth.routes');
const noteRoutes = require('../src/routes/note.routes');
const tagRoutes = require('../src/routes/tag.routes');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173', // Vite dev server
      'https://mauro-zen-notes-frontend.vercel.app',
      process.env.FRONTEND_URL,
      process.env.DEV_FRONTEND_URL
    ].filter(Boolean);
    
    // In production, be more restrictive
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      const productionOrigins = [
        'https://mauro-zen-notes-frontend.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (productionOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all configured origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  const environment = process.env.VERCEL ? 'vercel' : (process.env.NODE_ENV || 'development');
  
  res.json({
    message: 'Zen Notes API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: environment,
    mode: isProduction ? 'production' : 'development',
    deployment: process.env.VERCEL ? 'serverless' : 'traditional'
  });
});

app.get('/health', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : (process.env.NODE_ENV || 'development'),
    mode: isProduction ? 'production' : 'development',
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this data already exists'
    });
  }
  
  if (error.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Record not found'
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token expired'
    });
  }
  
  // Default error response
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : error.name || 'Error',
    message: statusCode >= 500 && process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Export the Express app for Vercel
module.exports = app;
