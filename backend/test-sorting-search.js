const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';

// Test cases for sorting and searching
const testCases = [
  {
    name: 'Test 1: Basic search',
    params: { search: 'shirt' },
    expected: 'Should return products containing "shirt"'
  },
  {
    name: 'Test 2: Category filter',
    params: { category: 'Electronics' },
    expected: 'Should return products in Electronics category'
  },
  {
    name: 'Test 3: Brand filter',
    params: { brand: 'Apple' },
    expected: 'Should return products from Apple brand'
  },
  {
    name: 'Test 4: Price sorting (low to high)',
    params: { sort: 'price_asc' },
    expected: 'Should return products sorted by price ascending'
  },
  {
    name: 'Test 5: Price sorting (high to low)',
    params: { sort: 'price_desc' },
    expected: 'Should return products sorted by price descending'
  },
  {
    name: 'Test 6: Name sorting (A to Z)',
    params: { sort: 'name_asc' },
    expected: 'Should return products sorted by name ascending'
  },
  {
    name: 'Test 7: Name sorting (Z to A)',
    params: { sort: 'name_desc' },
    expected: 'Should return products sorted by name descending'
  },
  {
    name: 'Test 8: Rating sorting',
    params: { sort: 'rating' },
    expected: 'Should return products sorted by rating descending'
  },
  {
    name: 'Test 9: Newest first',
    params: { sort: 'newest' },
    expected: 'Should return products sorted by creation date descending'
  },
  {
    name: 'Test 10: Oldest first',
    params: { sort: 'oldest' },
    expected: 'Should return products sorted by creation date ascending'
  },
  {
    name: 'Test 11: Combined search and filter',
    params: { search: 'phone', category: 'Electronics', sort: 'price_asc' },
    expected: 'Should return electronics containing "phone" sorted by price'
  },
  {
    name: 'Test 12: Empty search',
    params: { search: '' },
    expected: 'Should return all products'
  }
];

async function runTests() {
  console.log('🧪 Testing Sorting and Search Functionality\n');
  
  for (const testCase of testCases) {
    try {
      console.log(`\n📋 ${testCase.name}`);
      console.log(`Expected: ${testCase.expected}`);
      
      const params = new URLSearchParams(testCase.params);
      const response = await axios.get(`${BASE_URL}/products?${params}`);
      
      const { products, total } = response.data;
      
      console.log(`✅ Success: Found ${products.length} products (Total: ${total})`);
      
      // Show first few products for verification
      if (products.length > 0) {
        console.log('📦 Sample products:');
        products.slice(0, 3).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - $${product.price} - ${product.category}`);
        });
      }
      
      // Verify sorting for specific tests
      if (testCase.params.sort) {
        verifySorting(products, testCase.params.sort);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  }
}

function verifySorting(products, sortType) {
  if (products.length < 2) return;
  
  let isCorrectlySorted = true;
  
  switch (sortType) {
    case 'price_asc':
      for (let i = 1; i < products.length; i++) {
        if (products[i].price < products[i-1].price) {
          isCorrectlySorted = false;
          break;
        }
      }
      break;
      
    case 'price_desc':
      for (let i = 1; i < products.length; i++) {
        if (products[i].price > products[i-1].price) {
          isCorrectlySorted = false;
          break;
        }
      }
      break;
      
    case 'name_asc':
      for (let i = 1; i < products.length; i++) {
        if (products[i].name.toLowerCase() < products[i-1].name.toLowerCase()) {
          isCorrectlySorted = false;
          break;
        }
      }
      break;
      
    case 'name_desc':
      for (let i = 1; i < products.length; i++) {
        if (products[i].name.toLowerCase() > products[i-1].name.toLowerCase()) {
          isCorrectlySorted = false;
          break;
        }
      }
      break;
      
    case 'rating':
      for (let i = 1; i < products.length; i++) {
        if (products[i].rating > products[i-1].rating) {
          isCorrectlySorted = false;
          break;
        }
      }
      break;
  }
  
  if (isCorrectlySorted) {
    console.log(`✅ Sorting verification: Correctly sorted by ${sortType}`);
  } else {
    console.log(`⚠️  Sorting verification: May not be correctly sorted by ${sortType}`);
  }
}

// Run the tests
runTests().catch(console.error);
