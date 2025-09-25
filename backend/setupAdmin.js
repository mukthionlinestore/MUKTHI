const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for admin setup'))
.catch(err => console.log('MongoDB connection error:', err));

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\n🎯 Next steps:');
    console.log('1. Login with these credentials');
    console.log('2. Go to Admin Panel to manage products');
    console.log('3. Add categories, brands, and products');
    
  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

setupAdmin();
