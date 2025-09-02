import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }
  return prisma;
};

export const connectDatabase = async () => {
  try {
    const client = getPrismaClient();
    // Test connection
    await client.$connect();
    console.log('✅ Prisma connected to MySQL successfully!');
    return client;
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
};

export default getPrismaClient;
