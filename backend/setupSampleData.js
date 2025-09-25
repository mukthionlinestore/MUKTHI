const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for sample data setup'))
.catch(err => console.log('MongoDB connection error:', err));

// Sample categories
const sampleCategories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Health',
  'Toys & Games',
  'Automotive',
  'Jewelry',
  'Food & Beverages'
];

// Sample brands
const sampleBrands = [
  'Apple',
  'Samsung',
  'Nike',
  'Adidas',
  'Sony',
  'LG',
  'Canon',
  'Dell',
  'HP',
  'Microsoft',
  'Google',
  'Amazon',
  'Coca-Cola',
  'Pepsi',
  'Toyota',
  'Honda',
  'BMW',
  'Mercedes-Benz',
  'Rolex',
  'Cartier'
];

// Sample products
const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 999.99,
    originalPrice: 1099.99,
    quantity: 50,
    category: 'Electronics',
    brand: 'Apple',
    isNewProduct: true,
    isSold: false,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
    ],
    thumbnailIndex: 0,
    sizes: [],
    colors: [
      { name: 'Natural Titanium', code: '#8F8F8F' },
      { name: 'Blue Titanium', code: '#4A90E2' },
      { name: 'White Titanium', code: '#F5F5F5' },
      { name: 'Black Titanium', code: '#2C2C2C' }
    ],
    features: [
      'A17 Pro chip',
      '48MP Main camera',
      'ProRAW photography',
      'USB-C connector',
      'Titanium design'
    ]
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 129.99,
    originalPrice: 149.99,
    quantity: 100,
    category: 'Clothing',
    brand: 'Nike',
    isNewProduct: false,
    isSold: false,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    thumbnailIndex: 0,
    sizes: [
      { name: '7', available: true },
      { name: '8', available: true },
      { name: '9', available: true },
      { name: '10', available: true },
      { name: '11', available: true },
      { name: '12', available: true }
    ],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Red', code: '#FF0000' },
      { name: 'Blue', code: '#0066CC' }
    ],
    features: [
      'Air Max technology',
      'Breathable mesh upper',
      'Rubber outsole',
      'Cushioned midsole',
      'Lightweight design'
    ]
  },
  {
    name: 'Samsung 4K Smart TV',
    description: '65-inch 4K Ultra HD Smart TV with Crystal Display',
    price: 799.99,
    originalPrice: 999.99,
    quantity: 25,
    category: 'Electronics',
    brand: 'Samsung',
    isNewProduct: true,
    isSold: false,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'
    ],
    thumbnailIndex: 0,
    sizes: [],
    colors: [
      { name: 'Black', code: '#000000' }
    ],
    features: [
      '4K Ultra HD resolution',
      'Smart TV capabilities',
      'Crystal Display',
      'HDR support',
      'Built-in streaming apps'
    ]
  }
];

async function setupSampleData() {
  try {
    console.log('Setting up sample data...');

    // Add sample products
    for (const product of sampleProducts) {
      const existingProduct = await Product.findOne({ name: product.name });
      if (!existingProduct) {
        const newProduct = new Product(product);
        await newProduct.save();
        console.log(`✅ Added product: ${product.name}`);
      } else {
        console.log(`⚠️  Product already exists: ${product.name}`);
      }
    }

    console.log('\n✅ Sample data setup completed!');
    console.log('\n📊 Summary:');
    console.log(`- Categories available: ${sampleCategories.join(', ')}`);
    console.log(`- Brands available: ${sampleBrands.join(', ')}`);
    console.log(`- Sample products added: ${sampleProducts.length}`);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Login as admin and go to Admin Panel');
    console.log('2. Add more categories and brands as needed');
    console.log('3. Add more products with your own images and details');
    
  } catch (error) {
    console.error('Error setting up sample data:', error);
  } finally {
    mongoose.connection.close();
  }
}

setupSampleData();
