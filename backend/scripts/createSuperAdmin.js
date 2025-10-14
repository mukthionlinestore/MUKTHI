const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './config.env' });

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      return;
    }

    // Create super admin user
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@eshop.com',
      password: 'SuperAdmin123!',
      role: 'superadmin',
      isVerified: true
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Email: superadmin@eshop.com');
    console.log('Password: SuperAdmin123!');
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createSuperAdmin();









