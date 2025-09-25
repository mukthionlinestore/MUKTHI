const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

async function testProductDeletionIssue() {
  try {
    console.log('🔍 Testing product deletion issue...\n');
    
    // Step 1: Get products list
    console.log('1. Fetching products list...');
    const productsResponse = await axios.get(`${BASE_URL}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const products = productsResponse.data.products;
    console.log(`   Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('   No products found to test');
      return;
    }
    
    const testProduct = products[0];
    console.log(`   Testing with: ${testProduct.name} (ID: ${testProduct._id})\n`);
    
    // Step 2: Delete the product
    console.log('2. Deleting product...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Delete response status:', deleteResponse.status);
    console.log('   Delete response data:', deleteResponse.data);
    
    // Step 3: Wait a moment
    console.log('\n3. Waiting 1 second...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Try to fetch the deleted product
    console.log('4. Attempting to fetch deleted product...');
    try {
      const fetchResponse = await axios.get(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('   ❌ Product still exists!');
      console.log('   Response:', fetchResponse.data);
    } catch (fetchError) {
      if (fetchError.response && fetchError.response.status === 404) {
        console.log('   ✅ Product successfully deleted (404 Not Found)');
      } else {
        console.log('   ⚠️ Unexpected error:', fetchError.message);
      }
    }
    
    // Step 5: Fetch products list again
    console.log('\n5. Fetching products list again...');
    const productsResponse2 = await axios.get(`${BASE_URL}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const productsAfter = productsResponse2.data.products;
    console.log(`   Found ${productsAfter.length} products after deletion`);
    
    const productStillExists = productsAfter.find(p => p._id === testProduct._id);
    if (productStillExists) {
      console.log('   ❌ Product still appears in list!');
    } else {
      console.log('   ✅ Product removed from list successfully');
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testProductDeletionIssue();
