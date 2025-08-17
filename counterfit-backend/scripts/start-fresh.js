const { supabase } = require('../lib/supabase');
require('dotenv').config();

async function startFresh() {
  try {
    console.log('🧹 Starting fresh with Counterfit database...');
    
    // Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('Product')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Cannot connect to Supabase. Check your environment variables:');
      console.error('   - SUPABASE_URL');
      console.error('   - SUPABASE_ANON_KEY');
      console.error('   - SUPABASE_SERVICE_ROLE_KEY');
      return;
    }
    
    console.log('✅ Connected to Supabase successfully');
    
    // Clear all products
    console.log('🗑️  Clearing all products...');
    const { error: productError } = await supabase
      .from('Product')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (productError) {
      console.error('❌ Error clearing products:', productError);
    } else {
      console.log('✅ All products cleared');
    }
    
    // Clear all collections
    console.log('🗑️  Clearing all collections...');
    const { error: collectionError } = await supabase
      .from('Collection')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (collectionError) {
      console.error('❌ Error clearing collections:', collectionError);
    } else {
      console.log('✅ All collections cleared');
    }
    
    console.log('');
    console.log('🎉 Database is now clean and ready!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to your admin panel: /admin/products');
    console.log('2. Add real products with real images using the upload feature');
    console.log('3. Mark the ones you want as featured');
    console.log('4. Your home page will now show real featured products');
    console.log('');
    console.log('💡 Tip: Use the image upload feature in your admin panel');
    console.log('   This will store images in your uploads/products/ folder');
    console.log('   and give you proper image URLs for your products');
    
  } catch (error) {
    console.error('❌ Error starting fresh:', error);
  }
}

// Run the function
if (require.main === module) {
  startFresh();
}

module.exports = startFresh;
