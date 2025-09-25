const axios = require('axios');

// Test admin functionality
async function testAdmin() {
  try {
    console.log('🧪 Testing Admin Functionality...\n');
    
    // Test 1: Login as admin
    console.log('1. Testing Admin Login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@ecommerce.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Set auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Test 2: Get admin stats
    console.log('\n2. Testing Admin Stats...');
    const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
    console.log('✅ Admin stats:', statsResponse.data);
    
    // Test 3: Get recent orders
    console.log('\n3. Testing Recent Orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/admin/recent-orders');
    console.log('✅ Recent orders:', ordersResponse.data.length, 'orders found');
    
    // Test 4: Get categories
    console.log('\n4. Testing Categories...');
    const categoriesResponse = await axios.get('http://localhost:5000/api/products/categories/list');
    console.log('✅ Categories:', categoriesResponse.data);
    
    // Test 5: Get brands
    console.log('\n5. Testing Brands...');
    const brandsResponse = await axios.get('http://localhost:5000/api/products/brands/list');
    console.log('✅ Brands:', brandsResponse.data);
    
    // Test 6: Get products
    console.log('\n6. Testing Products...');
    const productsResponse = await axios.get('http://localhost:5000/api/admin/products');
    console.log('✅ Products:', productsResponse.data.products.length, 'products found');
    
    console.log('\n🎉 All admin tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAdmin();
