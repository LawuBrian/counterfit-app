const { supabase } = require('../lib/supabase');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkDatabase() {
  try {
    console.log('🔍 Checking Supabase database...');
    
    // Check environment variables
    console.log('🔍 Environment variables:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Check Users table
    console.log('\n👥 Checking Users table...');
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('*');
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
    } else {
      console.log(`✅ Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
        console.log(`    Created: ${user.createdAt}, Updated: ${user.updatedAt}`);
      });
    }

    // Check Products table
    console.log('\n📦 Checking Products table...');
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, name, images');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log(`✅ Found ${products.length} products:`);
      products.forEach(product => {
        console.log(`  - ${product.name}`);
        console.log(`    Images: ${product.images ? product.images.length : 0} images`);
        if (product.images && product.images.length > 0) {
          product.images.forEach((img, index) => {
            console.log(`      ${index + 1}. ${img.url || img}`);
          });
        }
      });
    }

    // Check Collections table
    console.log('\n🎨 Checking Collections table...');
    const { data: collections, error: collectionsError } = await supabase
      .from('Collection')
      .select('*');
    
    if (collectionsError) {
      console.error('❌ Error fetching collections:', collectionsError);
    } else {
      console.log(`✅ Found ${collections.length} collections:`);
      collections.forEach(collection => {
        console.log(`  - ${collection.name} (${collection.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Run the function
if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;
