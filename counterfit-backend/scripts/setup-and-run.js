const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Function to check and set up environment variables
function checkEnvironment() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName] === `your_${varName.toLowerCase()}_here`) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing or invalid environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    
    console.log('\n📝 Please update your .env file with the correct values:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to Settings > API');
    console.log('   3. Copy the Project URL and API keys');
    console.log('   4. Update your .env file in the backend directory');
    console.log('\n   Example .env file:');
    console.log('   SUPABASE_URL=https://your-project.supabase.co');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key');
    console.log('   SUPABASE_ANON_KEY=your_actual_anon_key');
    
    return false;
  }
  
  console.log('✅ All environment variables are set correctly');
  return true;
}

// Function to test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('\n🔄 Testing Supabase connection...');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test connection by trying to fetch a product
    const { data, error } = await supabase
      .from('Product')
      .select('id')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📊 Database accessible, found ${data ? data.length : 0} products`);
    return true;
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

// Function to run the database update
async function runDatabaseUpdate() {
  try {
    console.log('\n🚀 Running database update...');
    
    // Import and run the update script
    const { updateToDescriptiveImages } = require('./update-to-descriptive-images');
    
    if (typeof updateToDescriptiveImages === 'function') {
      await updateToDescriptiveImages();
    } else {
      console.log('⚠️ Update function not found, running script directly...');
      require('./update-to-descriptive-images');
    }
    
  } catch (error) {
    console.error('❌ Error running database update:', error);
  }
}

// Main function
async function main() {
  console.log('🚀 Counterfit Database Setup and Update Script');
  console.log('================================================\n');
  
  // Step 1: Check environment
  if (!checkEnvironment()) {
    console.log('\n❌ Please fix the environment variables and run this script again');
    process.exit(1);
  }
  
  // Step 2: Test Supabase connection
  if (!await testSupabaseConnection()) {
    console.log('\n❌ Supabase connection failed. Please check your credentials');
    process.exit(1);
  }
  
  // Step 3: Run database update
  await runDatabaseUpdate();
  
  console.log('\n🎉 Setup and update completed!');
}

// Run the main function
main().catch(console.error);
