// Test script to check environment variables
require('dotenv').config();

console.log('🧪 Testing environment variables...');
console.log('');

console.log('📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('');

console.log('🔑 Supabase Configuration:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('');

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('🔍 Service Role Key (first 20 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...');
}

console.log('📁 Current working directory:', process.cwd());
console.log('📁 .env file exists:', require('fs').existsSync('.env'));
console.log('');

// Test if we can create a Supabase client
try {
  const { createClient } = require('@supabase/supabase-js');
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase client created successfully');
  } else {
    console.log('❌ Cannot create Supabase client - missing required environment variables');
  }
} catch (error) {
  console.log('❌ Error creating Supabase client:', error.message);
}
