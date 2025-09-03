import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Allow all origins, all methods, all headers (open CORS)
app.use(cors());
app.options('*', cors());
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
    const { testRawMysqlConnection } = await import('../src/mysql-test');
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
    message: 'Zen Notes API with Prisma is running!',
    version: '1.0.0',
    orm: 'Prisma',
    timestamp: new Date().toISOString()
  });
});

// Test database endpoint with Prisma
app.get('/api/test-db', async (req, res) => {
  const timeout = setTimeout(() => {
    res.status(500).json({ error: 'Database test timeout' });
  }, 25000); // 25 second timeout

  try {
    const { connectDatabase } = await import('../src/prisma-client');
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


// Restore real API routes

// Use compiled notes router for /api/notes
const notesRouter = require('./notes');
app.use('/api/notes', notesRouter);

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
