const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual user token

async function testProfileFunctionality() {
  try {
    console.log('🧪 Testing profile functionality...\n');
    
    // Step 1: Get user profile
    console.log('1. Fetching user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Profile data:', profileResponse.data);
    
    // Step 2: Update profile
    console.log('\n2. Testing profile update...');
    const updateData = {
      name: 'Updated Test User',
      phone: '+1234567890',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      }
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/api/auth/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Update response:', updateResponse.data);
    
    // Step 3: Test password change
    console.log('\n3. Testing password change...');
    const passwordData = {
      currentPassword: 'currentpassword',
      newPassword: 'newpassword123'
    };
    
    try {
      const passwordResponse = await axios.put(`${BASE_URL}/api/auth/change-password`, passwordData, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('   Password change response:', passwordResponse.data);
    } catch (error) {
      console.log('   Password change failed (expected if current password is wrong):', error.response?.data?.message);
    }
    
    // Step 4: Test avatar upload
    console.log('\n4. Testing avatar upload...');
    const FormData = require('form-data');
    const fs = require('fs');
    
    // Create a simple test image (you would need a real image file for this test)
    const formData = new FormData();
    // formData.append('image', fs.createReadStream('./test-image.jpg'));
    
    try {
      const avatarResponse = await axios.post(`${BASE_URL}/api/upload/cloudinary`, formData, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('   Avatar upload response:', avatarResponse.data);
    } catch (error) {
      console.log('   Avatar upload failed (expected without image file):', error.response?.data?.message);
    }
    
    console.log('\n🎉 Profile functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testProfileFunctionality();
