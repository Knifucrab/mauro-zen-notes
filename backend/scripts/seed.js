const bcrypt = require('bcryptjs');
const prisma = require('../src/config/database');

async function createDefaultUser() {
  try {
    console.log('🔄 Creating default admin user...');
    
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: 'admin'
      }
    });

    if (existingUser) {
      console.log('ℹ️  Default admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });

    console.log('✅ Default admin user created successfully');
    console.log('📋 Credentials:');
    console.log('   Username: admin');
    console.log('   Password: password123');
    console.log('   ID:', user.id);
    
  } catch (error) {
    console.error('❌ Error creating default user:', error);
  }
}

async function createSampleTags() {
  try {
    console.log('🔄 Creating sample tags...');
    
    const sampleTags = [
      { name: 'Work', color: '#3B82F6' },
      { name: 'Personal', color: '#10B981' },
      { name: 'Ideas', color: '#F59E0B' },
      { name: 'Important', color: '#EF4444' },
      { name: 'Todo', color: '#8B5CF6' },
      { name: 'Meeting', color: '#06B6D4' }
    ];

    for (const tagData of sampleTags) {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tagData.name }
      });

      if (!existingTag) {
        await prisma.tag.create({
          data: tagData
        });
        console.log(`✅ Created tag: ${tagData.name}`);
      } else {
        console.log(`ℹ️  Tag already exists: ${tagData.name}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating sample tags:', error);
  }
}

async function createSampleNotes() {
  try {
    console.log('🔄 Creating sample notes...');
    
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!adminUser) {
      console.log('⚠️  Admin user not found. Skipping sample notes creation.');
      return;
    }

    // Get some tags
    const workTag = await prisma.tag.findUnique({ where: { name: 'Work' } });
    const personalTag = await prisma.tag.findUnique({ where: { name: 'Personal' } });
    const ideasTag = await prisma.tag.findUnique({ where: { name: 'Ideas' } });

    const sampleNotes = [
      {
        title: 'Welcome to Zen Notes',
        content: 'This is your first note in Zen Notes! You can create, edit, and organize your notes with tags. Feel free to delete this note when you\'re ready to start.',
        tagIds: personalTag ? [personalTag.id] : []
      },
      {
        title: 'Project Planning',
        content: 'Plan the next quarter goals:\n\n- Review current projects\n- Set priorities\n- Allocate resources\n- Schedule team meetings',
        tagIds: workTag ? [workTag.id] : []
      },
      {
        title: 'App Ideas',
        content: 'Some cool app ideas:\n\n1. Note-taking app with AI assistance\n2. Habit tracker with gamification\n3. Local business discovery platform\n4. Recipe sharing community',
        tagIds: ideasTag ? [ideasTag.id] : []
      }
    ];

    for (const noteData of sampleNotes) {
      const existingNote = await prisma.note.findFirst({
        where: {
          title: noteData.title,
          userId: adminUser.id
        }
      });

      if (!existingNote) {
        const note = await prisma.note.create({
          data: {
            title: noteData.title,
            content: noteData.content,
            userId: adminUser.id,
            ...(noteData.tagIds.length > 0 && {
              tags: {
                connect: noteData.tagIds.map(id => ({ id }))
              }
            })
          }
        });
        console.log(`✅ Created note: ${noteData.title}`);
      } else {
        console.log(`ℹ️  Note already exists: ${noteData.title}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating sample notes:', error);
  }
}

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    await createDefaultUser();
    console.log('');
    await createSampleTags();
    console.log('');
    await createSampleNotes();
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 You can now login with:');
    console.log('   Username: admin');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  createDefaultUser,
  createSampleTags,
  createSampleNotes
};
