process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  console.log('Starting server...');
  
  try {
    const app = require('./api/index');
    const PORT = process.env.PORT || 3000;

    console.log('About to start listening...');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
    });

    console.log('Server setup complete.');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
