const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import User model
const User = require('./backend/models/User');

async function debugUser() {
  try {
    console.log('🔍 Debugging User Authentication...\n');

    // Find all users
    const users = await User.find({}).select('name email role createdAt');
    console.log('📋 All users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });

    if (users.length === 0) {
      console.log('\n❌ No users found in database!');
      console.log('💡 You need to register a user first.');
      return;
    }

    // Test specific user
    const testEmail = 'test@example.com'; // Change this to your email
    console.log(`\n🔍 Looking for user with email: ${testEmail}`);
    
    const user = await User.findOne({ email: testEmail });
    if (!user) {
      console.log('❌ User not found!');
      console.log('💡 Available emails:', users.map(u => u.email).join(', '));
      return;
    }

    console.log('✅ User found:', {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });

    // Test password comparison
    console.log('\n🔑 Testing password comparison...');
    const testPasswords = ['123456', 'password', 'test123', 'newpassword123'];
    
    for (const password of testPasswords) {
      const isMatch = await user.comparePassword(password);
      console.log(`Password "${password}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugUser();
