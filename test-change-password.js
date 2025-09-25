const axios = require('axios');

// Test change password functionality
async function testChangePassword() {
  try {
    console.log('🔐 Testing Change Password Functionality...\n');

    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com', // Replace with your email
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // Set up axios with auth header
    const authAxios = axios.create({
      baseURL: 'http://localhost:5000',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Test change password
    console.log('2. Testing change password...');
    const changePasswordData = {
      currentPassword: '123456',
      newPassword: 'newpassword123'
    };

    console.log('📤 Sending change password request:', {
      currentPassword: '***' + changePasswordData.currentPassword.slice(-2),
      newPassword: '***' + changePasswordData.newPassword.slice(-2)
    });

    const changeResponse = await authAxios.put('/api/auth/change-password', changePasswordData);
    
    console.log('✅ Change password successful!');
    console.log('📥 Response:', changeResponse.data);

    // Test login with new password
    console.log('\n3. Testing login with new password...');
    const newLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com', // Replace with your email
      password: 'newpassword123'
    });

    console.log('✅ Login with new password successful!');
    console.log('📥 Response:', newLoginResponse.data);

    // Change password back to original
    console.log('\n4. Changing password back to original...');
    const revertResponse = await authAxios.put('/api/auth/change-password', {
      currentPassword: 'newpassword123',
      newPassword: '123456'
    });

    console.log('✅ Password reverted successfully!');
    console.log('📥 Response:', revertResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('📊 Status:', error.response?.status);
    console.error('📋 Headers:', error.response?.headers);
  }
}

// Run the test
testChangePassword();
