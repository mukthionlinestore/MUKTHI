const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

async function testProductDeletion() {
  try {
    console.log('🧪 Testing product deletion functionality...\n');
    
    // First, get a list of products to find one to delete
    console.log('1. Fetching products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const products = productsResponse.data.products;
    console.log(`   Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('   No products found to test deletion');
      return;
    }
    
    // Select the first product for testing
    const testProduct = products[0];
    console.log(`   Testing with product: ${testProduct.name} (ID: ${testProduct._id})\n`);
    
    // Test the delete endpoint
    console.log('2. Testing product deletion...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   ✅ Delete request successful');
    console.log('   Response status:', deleteResponse.status);
    console.log('   Response data:', deleteResponse.data);
    
    // Verify the product was actually deleted
    console.log('\n3. Verifying product deletion...');
    try {
      const verifyResponse = await axios.get(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('   ❌ Product still exists after deletion');
      console.log('   Response:', verifyResponse.data);
    } catch (verifyError) {
      if (verifyError.response && verifyError.response.status === 404) {
        console.log('   ✅ Product successfully deleted (404 Not Found)');
      } else {
        console.log('   ⚠️ Unexpected error during verification:', verifyError.message);
      }
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testProductDeletion();
