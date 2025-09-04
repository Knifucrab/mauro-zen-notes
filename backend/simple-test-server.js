// Simple standalone test
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Simple test working!' });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();
    const tagCount = await prisma.tag.count();
    
    await prisma.$disconnect();
    
    res.json({
      message: 'Database test successful!',
      data: { users: userCount, notes: noteCount, tags: tagCount }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001; // Use different port to avoid conflicts

const server = app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on http://localhost:${PORT}`);
  console.log(`📱 Test endpoints:`);
  console.log(`   http://localhost:${PORT}/test`);
  console.log(`   http://localhost:${PORT}/test-db`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

// Keep server running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server...');
  server.close(() => {
    console.log('✅ Test server closed');
    process.exit(0);
  });
});
