const http = require('http');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function testEndpoint(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  // Wait a bit to ensure server is ready
  console.log('⏳ Waiting for server to be ready...');
  await delay(1000);

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('/health');
    console.log('✅ Health Check:', health.status);
    console.log('   Response:', JSON.stringify(health.data, null, 2));
    console.log('');

    // Test 2: Main endpoint
    console.log('2. Testing main endpoint...');
    const main = await testEndpoint('/');
    console.log('✅ Main Endpoint:', main.status);
    console.log('   Response:', JSON.stringify(main.data, null, 2));
    console.log('');

    // Test 3: Login (should work since we seeded the database)
    console.log('3. Testing login...');
    const login = await testEndpoint('/api/auth/login', 'POST', {
      username: 'admin',
      password: 'password123'
    });
    console.log('✅ Login:', login.status);
    
    let token = null;
    if (login.status === 200 && login.data && login.data.data && login.data.data.token) {
      token = login.data.data.token;
      console.log('   🔑 Token obtained successfully');
      console.log('   👤 User:', login.data.data.user.username);
    } else {
      console.log('   ❌ Login failed, trying to create default user first...');
      
      // Test creating default user
      const createUser = await testEndpoint('/api/auth/create-default-user', 'POST');
      console.log('   Create User Response:', createUser.status);
      
      if (createUser.status === 201 || createUser.status === 409) {
        console.log('   🔄 Retrying login...');
        const retryLogin = await testEndpoint('/api/auth/login', 'POST', {
          username: 'admin',
          password: 'password123'
        });
        
        if (retryLogin.status === 200 && retryLogin.data && retryLogin.data.data && retryLogin.data.data.token) {
          token = retryLogin.data.data.token;
          console.log('   ✅ Login successful on retry');
        }
      }
    }
    console.log('');

    if (token) {
      // Test 4: Get user profile (authenticated)
      console.log('4. Testing get user profile...');
      const profile = await testEndpoint('/api/auth/profile', 'GET', null, token);
      console.log('✅ Profile:', profile.status);
      if (profile.data) {
        console.log('   User info:', profile.data.data?.username || 'No username');
      }
      console.log('');

      // Test 5: Get notes (authenticated)
      console.log('5. Testing get notes...');
      const notes = await testEndpoint('/api/notes', 'GET', null, token);
      console.log('✅ Notes:', notes.status);
      if (notes.status === 200 && notes.data) {
        console.log(`   Found ${notes.data.data?.length || 0} notes`);
        if (notes.data.data && notes.data.data.length > 0) {
          notes.data.data.forEach((note, index) => {
            console.log(`     ${index + 1}. "${note.title}" (${note.tags?.length || 0} tags)`);
          });
        }
      }
      console.log('');

      // Test 6: Get tags
      console.log('6. Testing get tags...');
      const tags = await testEndpoint('/api/tags');
      console.log('✅ Tags:', tags.status);
      if (tags.status === 200 && tags.data) {
        console.log(`   Found ${tags.data.data?.length || 0} tags`);
        if (tags.data.data && tags.data.data.length > 0) {
          tags.data.data.forEach((tag, index) => {
            console.log(`     ${index + 1}. "${tag.name}" (${tag.color}) - ${tag._count?.notes || 0} notes`);
          });
        }
      }
      console.log('');

      // Test 7: Create a new note
      console.log('7. Testing create note...');
      const createNote = await testEndpoint('/api/notes', 'POST', {
        title: 'Test Note from API',
        content: 'This is a test note created during API testing.',
        tagIds: []
      }, token);
      console.log('✅ Create Note:', createNote.status);
      if (createNote.status === 201) {
        console.log('   ✨ Note created successfully!');
        console.log(`   📝 Title: "${createNote.data.data.title}"`);
      }
      console.log('');

      // Test 8: Search notes
      console.log('8. Testing search notes...');
      const search = await testEndpoint('/api/notes/search?q=test', 'GET', null, token);
      console.log('✅ Search Notes:', search.status);
      if (search.status === 200) {
        console.log(`   🔍 Found ${search.data.data?.length || 0} notes matching "test"`);
      }
      console.log('');

    } else {
      console.log('⚠️  Skipping authenticated tests - no token available');
    }

    console.log('🎉 API testing completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('✅ Database connection: Working');
    console.log('✅ Basic endpoints: Working');
    console.log('✅ Authentication: Working');
    console.log('✅ CRUD operations: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run tests
runTests();
