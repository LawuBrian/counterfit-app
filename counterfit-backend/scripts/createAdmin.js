const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Connecting to Supabase database...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@counterfit.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@counterfit.com');
      console.log('You can reset the password if needed.');
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@counterfit.com',
        password: 'admin123', // Note: This is plain text - you should hash it in production
        role: 'ADMIN'
      }
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
    console.log('1. Go to your website: https://counterfit-app.vercel.app/auth/signin');
    console.log('2. Login with the credentials above');
    console.log('3. Access admin panel: https://counterfit-app.vercel.app/admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

// Run the function
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
