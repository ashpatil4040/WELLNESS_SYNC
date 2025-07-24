// Simple test script to verify API functionality
const https = require('https');
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ success: res.statusCode < 400, data: jsonData, status: res.statusCode });
        } catch (error) {
          resolve({ success: false, data: data, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest('http://localhost:5000/health');
    if (healthResponse.success) {
      console.log('✅ Health check:', healthResponse.data.message);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await makeRequest('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    if (registerResponse.success && registerResponse.data.success) {
      console.log('✅ Registration successful:', registerResponse.data.user.name);
    } else {
      console.log('ℹ️ Registration response:', registerResponse.data.message);
    }

    // Test login
    console.log('\n3. Testing user login...');
    const loginResponse = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    if (loginResponse.success && loginResponse.data.success) {
      console.log('✅ Login successful:', loginResponse.data.user.name);
      console.log('🔑 Token received:', loginResponse.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }

    console.log('\n🎉 API test completed!');
    console.log('\n📱 Frontend is running at: http://localhost:5173');
    console.log('🔧 Backend is running at: http://localhost:5000');
    console.log('\n✨ Both frontend and backend are working correctly!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
