const { supabase } = require('../lib/supabase');
require('dotenv').config();

async function addUserFields() {
  try {
    console.log('🔄 Adding new fields to User table in Supabase...');
    
    // First, let's check if the fields already exist by looking at a user
    const { data: users, error: fetchError } = await supabase
      .from('User')
      .select('id, addresses, paymentMethods, settings')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError);
      return;
    }

    if (users.length > 0) {
      const user = users[0];
      console.log('📋 Current user fields:', {
        hasAddresses: user.addresses !== null && user.addresses !== undefined,
        hasPaymentMethods: user.paymentMethods !== null && user.paymentMethods !== undefined,
        hasSettings: user.settings !== null && user.settings !== undefined
      });
    }

    // Update all users to add the new fields with default values
    const { data: result, error: updateError } = await supabase
      .from('User')
      .update({ 
        addresses: [],
        paymentMethods: [],
        settings: {},
        updatedAt: new Date().toISOString()
      })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all users

    if (updateError) {
      console.error('❌ Error updating users:', updateError);
      
      // If the fields don't exist, we need to add them to the table schema first
      if (updateError.message.includes('column') && updateError.message.includes('does not exist')) {
        console.log('💡 The database columns need to be added first. You may need to:');
        console.log('   1. Go to your Supabase dashboard');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Run the following SQL:');
        console.log('');
        console.log('   ALTER TABLE "User" ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT \'[]\'::jsonb;');
        console.log('   ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "paymentMethods" JSONB DEFAULT \'[]\'::jsonb;');
        console.log('   ALTER TABLE "User" ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT \'{}\'::jsonb;');
        console.log('');
        console.log('   Then run this script again.');
        return;
      }
      return;
    }

    console.log(`✅ Updated users with new fields`);
    
    // Verify the update
    const { data: updatedUsers, error: verifyError } = await supabase
      .from('User')
      .select('id, addresses, paymentMethods, settings')
      .limit(1);

    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }

    if (updatedUsers.length > 0) {
      const user = updatedUsers[0];
      console.log('📋 Updated user fields:', {
        addresses: Array.isArray(user.addresses) ? user.addresses.length : 'not array',
        paymentMethods: Array.isArray(user.paymentMethods) ? user.paymentMethods.length : 'not array',
        settings: typeof user.settings === 'object' ? Object.keys(user.settings).length : 'not object'
      });
    }

    console.log('🎉 User fields migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error adding user fields:', error);
  }
}

// Run the migration
addUserFields();
