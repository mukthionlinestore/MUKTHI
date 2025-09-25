const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User model
const User = require('./backend/models/User');

async function checkUser() {
  try {
    console.log('🔍 Checking user accounts in database...\n');
    
    // Get all users
    const users = await User.find({}).select('name email role createdAt');
    console.log(`Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });
    
    // Check specific user by email
    const testEmail = 'your-email@example.com'; // Replace with actual email
    console.log(`\n🔍 Checking specific user: ${testEmail}`);
    
    const specificUser = await User.findOne({ email: testEmail });
    if (specificUser) {
      console.log('✅ User found!');
      console.log('   Name:', specificUser.name);
      console.log('   Email:', specificUser.email);
      console.log('   Role:', specificUser.role);
      console.log('   Created:', specificUser.createdAt);
      console.log('   Password hash exists:', !!specificUser.password);
      console.log('   Password hash length:', specificUser.password ? specificUser.password.length : 0);
      
      // Test password comparison
      console.log('\n🔐 Testing password comparison...');
      const testPassword = '123456';
      const isMatch = await specificUser.comparePassword(testPassword);
      console.log(`   Password "123456" matches: ${isMatch}`);
      
      const wrongPassword = 'wrongpassword';
      const isWrongMatch = await specificUser.comparePassword(wrongPassword);
      console.log(`   Password "wrongpassword" matches: ${isWrongMatch}`);
      
    } else {
      console.log('❌ User not found in database');
      console.log('   This means the user account was not created properly or was deleted');
    }
    
    console.log('\n🎉 Database check completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the check
checkUser();
