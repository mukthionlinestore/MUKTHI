const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import models
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function createSampleProducts() {
  try {
    console.log('🌱 Creating sample products...\n');

    // First, create categories and brands
    console.log('📂 Creating categories...');
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
      { name: 'Books', description: 'Books and educational materials' },
      { name: 'Sports', description: 'Sports and fitness equipment' }
    ]);
    console.log('✅ Categories created');

    console.log('🏷️ Creating brands...');
    const brands = await Brand.insertMany([
      { name: 'Apple', description: 'Premium technology products' },
      { name: 'Samsung', description: 'Innovative electronics' },
      { name: 'Nike', description: 'Athletic wear and shoes' },
      { name: 'Adidas', description: 'Sports and lifestyle brand' },
      { name: 'Generic', description: 'Generic products' }
    ]);
    console.log('✅ Brands created');

    // Create sample products
    console.log('📦 Creating sample products...');
    const products = await Product.insertMany([
      {
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced camera system and A17 Pro chip',
        price: 999,
        salePrice: 899,
        category: categories[0]._id,
        brand: brands[0]._id,
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
        ],
        stock: 50,
        isActive: true,
        isNewProduct: true,
        isFeatured: true,
        tags: ['smartphone', 'apple', 'premium'],
        specifications: {
          'Display': '6.1-inch Super Retina XDR',
          'Processor': 'A17 Pro chip',
          'Camera': '48MP Main camera',
          'Storage': '128GB',
          'Color': 'Natural Titanium'
        }
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Powerful Android smartphone with AI features',
        price: 799,
        salePrice: 699,
        category: categories[0]._id,
        brand: brands[1]._id,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500'
        ],
        stock: 30,
        isActive: true,
        isNewProduct: true,
        isFeatured: false,
        tags: ['smartphone', 'samsung', 'android'],
        specifications: {
          'Display': '6.2-inch Dynamic AMOLED',
          'Processor': 'Snapdragon 8 Gen 3',
          'Camera': '50MP Main camera',
          'Storage': '256GB',
          'Color': 'Titanium Gray'
        }
      },
      {
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning',
        price: 150,
        salePrice: 120,
        category: categories[1]._id,
        brand: brands[2]._id,
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
        ],
        stock: 25,
        isActive: true,
        isNewProduct: false,
        isFeatured: true,
        tags: ['shoes', 'nike', 'running', 'sports'],
        specifications: {
          'Size': 'US 7-12',
          'Color': 'Black/White',
          'Material': 'Mesh upper',
          'Sole': 'Rubber outsole',
          'Cushioning': 'Max Air'
        }
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Professional laptop with M3 Pro chip',
        price: 1999,
        salePrice: 1799,
        category: categories[0]._id,
        brand: brands[0]._id,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
        ],
        stock: 15,
        isActive: true,
        isNewProduct: true,
        isFeatured: true,
        tags: ['laptop', 'apple', 'professional', 'macbook'],
        specifications: {
          'Display': '14.2-inch Liquid Retina XDR',
          'Processor': 'M3 Pro chip',
          'Memory': '18GB unified memory',
          'Storage': '512GB SSD',
          'Color': 'Space Gray'
        }
      },
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199,
        salePrice: 149,
        category: categories[0]._id,
        brand: brands[4]._id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        stock: 40,
        isActive: true,
        isNewProduct: false,
        isFeatured: false,
        tags: ['headphones', 'wireless', 'bluetooth', 'audio'],
        specifications: {
          'Connectivity': 'Bluetooth 5.0',
          'Battery': '30 hours',
          'Noise Cancellation': 'Active',
          'Color': 'Black',
          'Weight': '250g'
        }
      }
    ]);

    console.log('✅ Sample products created');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Products: ${products.length}`);
    
    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📝 Product IDs for testing:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}: ${product._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
}

// Run the function
createSampleProducts();

