const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

async function rebuildIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Product model
    const Product = require('./models/Product');

    console.log('🔄 Rebuilding indexes...');

    // Drop existing indexes
    await Product.collection.dropIndexes();
    console.log('🗑️  Dropped existing indexes');

    // Create new indexes
    await Product.collection.createIndex(
      { name: 'text', description: 'text', category: 'text', brand: 'text', tags: 'text' },
      { name: 'text_search_index' }
    );
    console.log('📝 Created text search index');

    // Create compound indexes for better performance
    await Product.collection.createIndex({ isActive: 1, category: 1 });
    await Product.collection.createIndex({ isActive: 1, brand: 1 });
    await Product.collection.createIndex({ isActive: 1, price: 1 });
    await Product.collection.createIndex({ isActive: 1, rating: -1 });
    await Product.collection.createIndex({ isActive: 1, createdAt: -1 });
    await Product.collection.createIndex({ isActive: 1, name: 1 });
    await Product.collection.createIndex({ isActive: 1, quantity: 1 });
    console.log('🔗 Created compound indexes');

    // List all indexes
    const indexes = await Product.collection.getIndexes();
    console.log('\n📋 Current indexes:');
    Object.keys(indexes).forEach(indexName => {
      console.log(`   - ${indexName}: ${JSON.stringify(indexes[indexName].key)}`);
    });

    console.log('\n✅ Index rebuild completed successfully!');
    
  } catch (error) {
    console.error('❌ Error rebuilding indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the rebuild
rebuildIndexes();
