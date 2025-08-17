const { supabase } = require('../lib/supabase');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting admin password in Supabase...');
    
    // Check if environment variables are loaded
    console.log('🔍 Checking environment variables...');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Check if admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('User')
      .select('id, email, role')
      .eq('email', 'admin@counterfit.co.za')
      .single();
    
    if (!existingAdmin) {
      console.log('❌ Admin user not found! Run createAdmin.js first.');
      return;
    }

    console.log('✅ Admin user found:', existingAdmin.email);

    // Hash the new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('🔑 Generated new password hash');

    // Update admin password
    const { data: updatedAdmin, error: updateError } = await supabase
      .from('User')
      .update({
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      })
      .eq('email', 'admin@counterfit.co.za')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating admin password:', updateError);
      return;
    }

    console.log('✅ Admin password updated successfully!');
    console.log('');
    console.log('🔑 New Login Credentials:');
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
    console.error('❌ Error resetting admin password:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  resetAdminPassword();
}

module.exports = resetAdminPassword;
