const { supabase } = require('../lib/supabase');
const bcrypt = require('bcryptjs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user in Supabase...');
    
    // Check if environment variables are loaded
    console.log('🔍 Checking environment variables...');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      console.error('Please check your .env file or environment variables.');
      return;
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('User')
      .select('id, email, role')
      .eq('email', 'admin@counterfit.co.za')
      .single();
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('');
      console.log('🔑 You can login with:');
      console.log('Email: admin@counterfit.co.za');
      console.log('Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Generate a UUID for the user ID
    const userId = crypto.randomUUID();
    console.log('🔑 Generated User ID:', userId);

    // Create admin user
    const { data: adminUser, error: createError } = await supabase
      .from('User')
      .insert({
        id: userId,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@counterfit.co.za',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating admin user:', createError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('Email: admin@counterfit.co.za');
    console.log('Password: admin123');
    console.log('');
    console.log('🚨 IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('You can now:');
    console.log('1. Go to your website: https://counterfit.co.za/auth/signin');
    console.log('2. Login with the credentials above');
    console.log('3. Access admin panel: https://counterfit.co.za/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
