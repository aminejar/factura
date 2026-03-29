// Quick API test script
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health response:', healthData);

    // Test register endpoint
    console.log('\n2. Testing /api/auth/register...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const registerData = await registerResponse.json();
    console.log('✅ Register response:', registerData);

    // Test login endpoint if register was successful
    if (registerData.token) {
      console.log('\n3. Testing /api/auth/login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const loginData = await loginResponse.json();
      console.log('✅ Login response:', loginData);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();