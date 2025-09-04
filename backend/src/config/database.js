const { PrismaClient } = require('@prisma/client');

let prisma;

// Database configuration for different environments
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  const isVercel = process.env.VERCEL;
  
  if (isVercel) {
    // Vercel serverless configuration
    return {
      log: ['error'], // Minimal logging for serverless
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    };
  } else if (isProduction) {
    // Traditional production configuration
    return {
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    };
  } else {
    // Development configuration
    return {
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    };
  }
};

// Ensure we have a single instance of Prisma Client
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  // In production/serverless, create new instance each time
  prisma = new PrismaClient(getDatabaseConfig());
} else {
  // In development, use a global variable to preserve the instance
  // across hot reloads
  if (!global.__prisma) {
    global.__prisma = new PrismaClient(getDatabaseConfig());
  }
  prisma = global.__prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
