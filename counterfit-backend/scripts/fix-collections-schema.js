const { supabase } = require('../lib/supabase');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function fixCollectionsSchema() {
  try {
    console.log('🔄 Fixing Collection table schema...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    console.log('✅ Supabase connected successfully');

    // Since we can't use ALTER TABLE directly, let's check what columns exist
    console.log('🔍 Checking current Collection table structure...');
    
    try {
      const { data, error } = await supabase
        .from('Collection')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Error checking table structure:', error);
        return;
      }
      
      console.log('✅ Collection table exists and is accessible');
    } catch (error) {
      console.error('❌ Error accessing Collection table:', error);
      return;
    }

    // Try to insert a test record with the new fields to see which ones are missing
    console.log('🧪 Testing which columns are missing...');
    
    const testData = {
      name: 'TEST_COLLECTION_DELETE_ME',
      slug: 'test-collection-delete-me-' + Date.now(),
      description: 'Test collection to check schema',
      collectionType: 'combo',
      basePrice: 299.99,
      allowCustomSelection: true,
      maxSelections: 2,
      productCategories: []
    };

    try {
      const { data, error } = await supabase
        .from('Collection')
        .insert(testData)
        .select();
      
      if (error) {
        console.log('❌ Error inserting test data:', error.message);
        
        // Parse the error to see which columns are missing
        if (error.message.includes('allowCustomSelection')) {
          console.log('🔧 Missing: allowCustomSelection column');
        }
        if (error.message.includes('collectionType')) {
          console.log('🔧 Missing: collectionType column');
        }
        if (error.message.includes('basePrice')) {
          console.log('🔧 Missing: basePrice column');
        }
        if (error.message.includes('maxSelections')) {
          console.log('🔧 Missing: maxSelections column');
        }
        if (error.message.includes('productCategories')) {
          console.log('🔧 Missing: productCategories column');
        }
        
        console.log('\n💡 You need to manually add these columns to your Supabase database.');
        console.log('💡 Go to your Supabase dashboard > SQL Editor and run:');
        console.log(`
          ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "collectionType" VARCHAR(20) DEFAULT 'singular';
          ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "basePrice" DECIMAL(10,2) DEFAULT 0;
          ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "allowCustomSelection" BOOLEAN DEFAULT false;
          ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "maxSelections" INTEGER DEFAULT 1;
          ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "productCategories" JSONB DEFAULT '[]';
        `);
        
      } else {
        console.log('✅ All columns exist! Test data inserted successfully');
        
        // Clean up the test data
        const { error: deleteError } = await supabase
          .from('Collection')
          .delete()
          .eq('slug', testData.slug);
        
        if (deleteError) {
          console.log('⚠️ Could not delete test data:', deleteError.message);
        } else {
          console.log('✅ Test data cleaned up');
        }
      }
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
    
  } catch (error) {
    console.error('❌ Error fixing collections schema:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  fixCollectionsSchema();
}

module.exports = fixCollectionsSchema;
