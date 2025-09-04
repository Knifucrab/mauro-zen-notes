const http = require('http');

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

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('/health');
    console.log('✅ Health:', health.status, health.data);
    console.log('');

    // Test 2: Main endpoint
    console.log('2. Testing main endpoint...');
    const main = await testEndpoint('/');
    console.log('✅ Main:', main.status, main.data);
    console.log('');

    // Test 3: Create default user
    console.log('3. Creating default user...');
    const createUser = await testEndpoint('/api/auth/create-default-user', 'POST');
    console.log('✅ Create User:', createUser.status, createUser.data);
    console.log('');

    // Test 4: Login
    console.log('4. Testing login...');
    const login = await testEndpoint('/api/auth/login', 'POST', {
      username: 'admin',
      password: 'password123'
    });
    console.log('✅ Login:', login.status, login.data);
    
    if (login.data && login.data.data && login.data.data.token) {
      const token = login.data.data.token;
      console.log('🔑 Token obtained for authenticated requests');
      console.log('');

      // Test 5: Get notes (authenticated)
      console.log('5. Testing get notes...');
      const notes = await testEndpoint('/api/notes', 'GET', null, token);
      console.log('✅ Notes:', notes.status, notes.data);
      console.log('');

      // Test 6: Get tags
      console.log('6. Testing get tags...');
      const tags = await testEndpoint('/api/tags');
      console.log('✅ Tags:', tags.status, tags.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
runTests();
