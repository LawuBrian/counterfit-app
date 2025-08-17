const { supabase } = require('../lib/supabase');
require('dotenv').config();

async function clearSupabase() {
  try {
    console.log('🗑️  Clearing Supabase database...');
    
    // Clear all products
    const { error: productError } = await supabase
      .from('Product')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all products
    
    if (productError) {
      console.error('❌ Error clearing products:', productError);
    } else {
      console.log('✅ All products cleared');
    }
    
    // Clear all collections
    const { error: collectionError } = await supabase
      .from('Collection')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all collections
    
    if (collectionError) {
      console.error('❌ Error clearing collections:', collectionError);
    } else {
      console.log('✅ All collections cleared');
    }
    
    console.log('');
    console.log('🎉 Database cleared successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to your admin panel: /admin/products');
    console.log('2. Add real products with real images');
    console.log('3. Mark the ones you want as featured');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

// Run the function
if (require.main === module) {
  clearSupabase();
}

module.exports = clearSupabase;
