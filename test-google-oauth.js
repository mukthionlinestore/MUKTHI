const axios = require('axios');

async function testGoogleOAuth() {
  try {
    console.log('🔍 Testing Google OAuth configuration...\n');
    
    // Test the Google OAuth route
    console.log('1. Testing /api/auth/google route...');
    const response = await axios.get('http://localhost:5000/api/auth/google', {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    
    if (response.status === 302 || response.status === 301) {
      console.log('✅ Redirect URL:', response.headers.location);
      console.log('✅ This means Google OAuth is working correctly!');
    } else {
      console.log('❌ Unexpected response:', response.data);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status);
      console.log('❌ Error data:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testGoogleOAuth();
