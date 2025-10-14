require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

// Get email from command line argument
const email = process.argv[2];

async function setSuperAdmin() {
  try {
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node set-superadmin.js <email>');
      console.log('Example: node set-superadmin.js admin@example.com');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email "${email}" not found!`);
      console.log('\nYou can create a new superadmin using: node create-superadmin.js');
    } else {
      // Update user role to superadmin
      user.role = 'superadmin';
      user.isVerified = true;
      await user.save();

      console.log('✅ User updated to superadmin successfully!\n');
      console.log('Super Admin Details:');
      console.log('ID:', user._id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Verified:', user.isVerified);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

setSuperAdmin();


