import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mauro-zen-notes.vercel.app',
    'https://mauro-zen-notes-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint (no database required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    hasDbUrl: !!process.env.DATABASE_URL,
    hasHost: !!process.env.MYSQLHOST
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zen Notes API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test database endpoint with timeout
app.get('/api/test-db', async (req, res) => {
  const timeout = setTimeout(() => {
    res.status(500).json({ error: 'Database test timeout' });
  }, 25000); // 25 second timeout

  try {
    const { initializeDatabase } = await import('./data-source');
    const dataSource = await initializeDatabase();
    
    clearTimeout(timeout);
    
    // Simple test query
    const result = await dataSource.query('SELECT 1 as test');
    
    res.json({
      status: 'Database connected',
      test: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Database test failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Lazy load routes with database (each route handles its own initialization)
app.use('/api/auth', async (req, res, next) => {
  try {
    const authRoutes = await import('./auth');
    authRoutes.default(req, res, next);
  } catch (error) {
    console.error('Auth route error:', error);
    res.status(500).json({ error: 'Auth service unavailable' });
  }
});

app.use('/api/notes', async (req, res, next) => {
  try {
    const noteRoutes = await import('./notes');
    noteRoutes.default(req, res, next);
  } catch (error) {
    console.error('Notes route error:', error);
    res.status(500).json({ error: 'Notes service unavailable' });
  }
});

app.use('/api/tags', async (req, res, next) => {
  try {
    const tagRoutes = await import('./tags');
    tagRoutes.default(req, res, next);
  } catch (error) {
    console.error('Tags route error:', error);
    res.status(500).json({ error: 'Tags service unavailable' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Health check: http://localhost:${PORT}/health`);
  });
}

// For Vercel serverless
export default app;
