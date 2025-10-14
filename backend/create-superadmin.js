require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get user input
    console.log('=== Create Super Admin ===\n');
    const name = await question('Enter name: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      console.log('\n⚠️  User already exists!');
      const update = await question('Do you want to update this user to superadmin? (yes/no): ');
      
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        user.role = 'superadmin';
        user.isVerified = true;
        await user.save();
        console.log('\n✅ User updated to superadmin successfully!');
      } else {
        console.log('\n❌ Operation cancelled.');
      }
    } else {
      // Create new superadmin user
      user = new User({
        name,
        email: email.toLowerCase(),
        password,
        role: 'superadmin',
        isVerified: true
      });

      await user.save();
      console.log('\n✅ Super admin created successfully!');
    }

    console.log('\nSuper Admin Details:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Verified:', user.isVerified);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

createSuperAdmin();


