#!/usr/bin/env node
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
const isDevelopment = !isProduction && !isVercel;

console.log(`🚀 Starting Zen Notes API...`);
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔧 Mode: ${isVercel ? 'Serverless (Vercel)' : isProduction ? 'Production' : 'Development'}`);
console.log(`🌐 CORS Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

if (isVercel) {
  console.log('☁️  Running in Vercel serverless environment');
  // Export the app for Vercel
  module.exports = require('./api/index');
} else {
  // Traditional server startup for development or production
  console.log('🖥️  Starting traditional server...');
  const app = require('./api/index');
  const PORT = process.env.PORT || 3000;
  
  const server = app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 API documentation: http://localhost:${PORT}/`);
    
    if (isDevelopment) {
      console.log(`🔧 Development mode - Hot reload enabled`);
      console.log(`🌍 CORS enabled for development origins`);
    }
    
    console.log('✅ Server ready for requests');
  });

  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port.`);
    }
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
