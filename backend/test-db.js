require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  // Show environment variables (without sensitive data)
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? 
    `${process.env.DATABASE_URL.split('@')[0]}@***` : 'Not set');
  console.log('');

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔗 Attempting to connect to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test basic query
    console.log('📊 Testing basic database operations...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Count notes
    const noteCount = await prisma.note.count();
    console.log(`📝 Notes in database: ${noteCount}`);
    
    // Count tags
    const tagCount = await prisma.tag.count();
    console.log(`🏷️  Tags in database: ${tagCount}`);
    
    console.log('');

    // Test user retrieval
    if (userCount > 0) {
      console.log('🔍 Testing user retrieval...');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          createdAt: true,
          _count: {
            select: {
              notes: true
            }
          }
        }
      });
      
      users.forEach(user => {
        console.log(`  - ${user.username} (${user._count.notes} notes) - ID: ${user.id.substring(0, 8)}...`);
      });
      console.log('');
    }

    // Test schema validation
    console.log('🔧 Testing schema integrity...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    
    console.log('📊 Database tables:');
    tables.forEach(table => {
      console.log(`  - ${table.TABLE_NAME}`);
    });
    
    console.log('\n✅ All database tests passed!');

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Connection Tips:');
      console.error('- Check if DATABASE_URL is correct');
      console.error('- Verify network connectivity');
      console.error('- Ensure database server is running');
    }
    
    if (error.message.includes('Access denied')) {
      console.error('\n💡 Authentication Tips:');
      console.error('- Verify username and password');
      console.error('- Check database permissions');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
