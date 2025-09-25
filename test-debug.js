const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminAPI() {
  try {
    console.log('🔍 Testing Admin API Endpoints...\n');

    // 1. Test login
    console.log('1. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@ecommerce.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');

    // Set auth header
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Test add category
    console.log('2. Testing Add Category...');
    try {
      const categoryResponse = await axios.post(`${BASE_URL}/api/admin/categories`, {
        name: 'Test Category'
      }, config);
      console.log('✅ Category added:', categoryResponse.data);
    } catch (error) {
      console.log('❌ Category add failed:', error.response?.data || error.message);
    }

    // 3. Test add brand
    console.log('\n3. Testing Add Brand...');
    try {
      const brandResponse = await axios.post(`${BASE_URL}/api/admin/brands`, {
        name: 'Test Brand'
      }, config);
      console.log('✅ Brand added:', brandResponse.data);
    } catch (error) {
      console.log('❌ Brand add failed:', error.response?.data || error.message);
    }

    // 4. Test add product
    console.log('\n4. Testing Add Product...');
    try {
      const productData = {
        name: 'Test Product',
        description: 'Test product description',
        price: 99.99,
        quantity: 10,
        category: 'Test Category',
        brand: 'Test Brand',
        images: ['https://via.placeholder.com/300x300'],
        thumbnailIndex: 0,
        sizes: [{ name: 'M', available: true }],
        colors: [{ name: 'Red', code: '#ff0000' }],
        features: ['Feature 1', 'Feature 2'],
        isNew: true,
        isSold: false
      };

      const productResponse = await axios.post(`${BASE_URL}/api/admin/products`, productData, config);
      console.log('✅ Product added:', productResponse.data._id);
    } catch (error) {
      console.log('❌ Product add failed:', error.response?.data || error.message);
    }

    // 5. Test get categories
    console.log('\n5. Testing Get Categories...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/api/products/categories/list`);
      console.log('✅ Categories:', categoriesResponse.data);
    } catch (error) {
      console.log('❌ Get categories failed:', error.response?.data || error.message);
    }

    // 6. Test get brands
    console.log('\n6. Testing Get Brands...');
    try {
      const brandsResponse = await axios.get(`${BASE_URL}/api/products/brands/list`);
      console.log('✅ Brands:', brandsResponse.data);
    } catch (error) {
      console.log('❌ Get brands failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminAPI();

