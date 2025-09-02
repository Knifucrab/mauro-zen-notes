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

// Raw MySQL test without TypeORM
app.get('/api/test-mysql', async (req, res) => {
  try {
    const { testRawMysqlConnection } = await import('./mysql-test');
    const result = await testRawMysqlConnection();
    
    res.json({
      status: result.success ? 'MySQL connected' : 'MySQL failed',
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Raw MySQL test failed:', error);
    res.status(500).json({ 
      error: 'Raw MySQL test failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zen Notes API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test database endpoint with Prisma
app.get('/api/test-db', async (req, res) => {
  const timeout = setTimeout(() => {
    res.status(500).json({ error: 'Database test timeout' });
  }, 25000); // 25 second timeout

  try {
    const { connectDatabase } = await import('./prisma-client');
    const prisma = await connectDatabase();
    
    clearTimeout(timeout);
    
    // Simple test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    res.json({
      status: 'Prisma connected to MySQL',
      test: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Prisma test failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Temporary: API routes disabled during Prisma migration
app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth API temporarily disabled during Prisma migration' });
});

app.use('/api/notes', (req, res) => {
  res.json({ message: 'Notes API temporarily disabled during Prisma migration' });
});

app.use('/api/tags', (req, res) => {
  res.json({ message: 'Tags API temporarily disabled during Prisma migration' });
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
