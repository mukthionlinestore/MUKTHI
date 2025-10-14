require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function listUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).select('name email role isVerified createdAt').sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      console.log('═══════════════════════════════════════════════════════════════════════════════');
      console.log('| Name                  | Email                      | Role       | Verified |');
      console.log('═══════════════════════════════════════════════════════════════════════════════');
      
      users.forEach(user => {
        const name = (user.name || '').padEnd(20).substring(0, 20);
        const email = (user.email || '').padEnd(25).substring(0, 25);
        const role = (user.role || 'user').padEnd(10);
        const verified = user.isVerified ? '   ✓    ' : '   ✗    ';
        
        console.log(`| ${name} | ${email} | ${role} | ${verified}|`);
      });
      
      console.log('═══════════════════════════════════════════════════════════════════════════════');
      
      // Count by role
      const superadmins = users.filter(u => u.role === 'superadmin').length;
      const admins = users.filter(u => u.role === 'admin').length;
      const regularUsers = users.filter(u => u.role === 'user').length;
      
      console.log('\nSummary:');
      console.log(`  Super Admins: ${superadmins}`);
      console.log(`  Admins: ${admins}`);
      console.log(`  Users: ${regularUsers}`);
      console.log(`  Total: ${users.length}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

listUsers();


