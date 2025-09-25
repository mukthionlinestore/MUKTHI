const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';

async function testLogin() {
  try {
    console.log('🔍 Testing login functionality...\n');
    
    // Test 1: Try to login with the credentials
    console.log('1. Testing login with credentials...');
    const loginData = {
      email: 'your-email@example.com', // Replace with actual email
      password: '123456'
    };
    
    console.log('   Attempting login with:', {
      email: loginData.email,
      password: '***' + loginData.password.slice(-2) // Show last 2 chars for debugging
    });
    
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      console.log('   ✅ Login successful!');
      console.log('   Response:', {
        token: loginResponse.data.token ? 'Token received' : 'No token',
        user: loginResponse.data.user
      });
    } catch (loginError) {
      console.log('   ❌ Login failed');
      console.log('   Status:', loginError.response?.status);
      console.log('   Error message:', loginError.response?.data?.message);
      
      if (loginError.response?.data?.errors) {
        console.log('   Validation errors:', loginError.response.data.errors);
      }
    }
    
    // Test 2: Check if user exists by trying to register with same email
    console.log('\n2. Checking if user exists...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
        name: 'Test User',
        email: loginData.email,
        password: '123456'
      });
      console.log('   ❌ User does not exist (registration successful)');
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.message === 'User already exists') {
        console.log('   ✅ User exists in database');
      } else {
        console.log('   ⚠️ Unexpected error during registration check:', registerError.response?.data?.message);
      }
    }
    
    // Test 3: Test with different password
    console.log('\n3. Testing with different password...');
    try {
      const loginResponse2 = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: loginData.email,
        password: 'wrongpassword'
      });
      console.log('   ❌ Login should have failed but succeeded (this is wrong)');
    } catch (loginError2) {
      if (loginError2.response?.status === 400 && loginError2.response?.data?.message === 'Invalid credentials') {
        console.log('   ✅ Correctly rejected wrong password');
      } else {
        console.log('   ⚠️ Unexpected error with wrong password:', loginError2.response?.data?.message);
      }
    }
    
    console.log('\n🎉 Login test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Instructions for the user
console.log('📋 Instructions:');
console.log('1. Replace "your-email@example.com" with your actual email address');
console.log('2. Make sure your backend server is running on localhost:5000');
console.log('3. Run this script with: node test-login.js');
console.log('');

// Run the test
testLogin();
