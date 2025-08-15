const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/counterfit');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@counterfit.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@counterfit.com');
      console.log('You can reset the password if needed.');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@counterfit.com',
      password: 'admin123', // This will be hashed automatically
      role: 'ADMIN'
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('Email: admin@counterfit.com');
    console.log('Password: admin123');
    console.log('');
    console.log('🚨 IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('You can now:');
    console.log('1. Start your frontend: npm run dev');
    console.log('2. Go to: http://localhost:3000/auth/signin');
    console.log('3. Login with the credentials above');
    console.log('4. Access admin panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
