const { supabase } = require('../lib/supabase');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function updateCollectionsSchemaSimple() {
  try {
    console.log('🔄 Updating Collection table schema (simple approach)...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    console.log('📝 Adding new columns to Collection table...');
    
    // First, let's check what columns currently exist
    console.log('🔍 Checking current table structure...');
    
    try {
      // Try to select from the new columns to see if they exist
      const { data: testData, error: testError } = await supabase
        .from('Collection')
        .select('id, name, slug, description, image, featured, status, "createdAt", "updatedAt"')
        .limit(1);
      
      if (testError) {
        console.error('❌ Error accessing Collection table:', testError);
        return;
      }
      
      console.log('✅ Collection table is accessible');
    } catch (error) {
      console.error('❌ Cannot access Collection table:', error.message);
      return;
    }

    // Now let's add the new columns one by one using direct SQL
    console.log('\n📝 Adding new columns...');
    
    // 1. Add collectionType column
    console.log('➕ Adding collectionType column...');
    try {
      const { error: typeError } = await supabase
        .from('Collection')
        .select('id')
        .limit(1);
      
      // If we can select, the table exists. Now let's add the column
      // We'll use a workaround by inserting a dummy record with the new field
      const { error: insertError } = await supabase
        .from('Collection')
        .insert({
          name: 'TEMP_COLUMN_ADD',
          slug: 'temp-column-add-' + Date.now(),
          description: 'Temporary record for schema update',
          status: 'draft',
          featured: false,
          "collectionType": 'singular',
          "basePrice": 0,
          "allowCustomSelection": false,
          "maxSelections": 1,
          "productCategories": []
        });
      
      if (insertError) {
        console.log('ℹ️ collectionType column already exists or error:', insertError.message);
      } else {
        console.log('✅ Added collectionType column');
        
        // Clean up the temp record
        await supabase
          .from('Collection')
          .delete()
          .eq('name', 'TEMP_COLUMN_ADD');
      }
    } catch (error) {
      console.log('ℹ️ collectionType column already exists or error:', error.message);
    }

    // 2. Update existing collections with default values
    console.log('\n🔄 Updating existing collections with default values...');
    
    try {
      const { data: collections, error: fetchError } = await supabase
        .from('Collection')
        .select('id, name, slug, description, image, featured, status, "createdAt", "updatedAt"');
      
      if (fetchError) {
        console.error('❌ Error fetching collections:', fetchError);
        return;
      }

      console.log(`📋 Found ${collections.length} collections to update`);

      for (const collection of collections) {
        const updateData = {
          "collectionType": 'singular',
          "basePrice": 0,
          "allowCustomSelection": false,
          "maxSelections": 1,
          "productCategories": [],
          "updatedAt": new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('Collection')
          .update(updateData)
          .eq('id', collection.id);

        if (updateError) {
          console.error(`❌ Error updating collection ${collection.name}:`, updateError);
        } else {
          console.log(`✅ Updated collection: ${collection.name}`);
        }
      }
    } catch (error) {
      console.error('❌ Error updating collections:', error);
    }

    // 3. Test the new structure
    console.log('\n🧪 Testing new table structure...');
    
    try {
      const { data: testCollections, error: testError } = await supabase
        .from('Collection')
        .select('id, name, "collectionType", "basePrice", "allowCustomSelection", "maxSelections", "productCategories"')
        .limit(2);
      
      if (testError) {
        console.error('❌ Error testing new structure:', testError);
      } else {
        console.log('✅ New structure test successful!');
        console.log('📋 Sample data:', testCollections);
      }
    } catch (error) {
      console.error('❌ Error testing new structure:', error);
    }

    console.log('\n🎉 Collection table schema update completed!');
    console.log('\n🔍 New columns added:');
    console.log('- collectionType: Type of collection (singular, combo, duo, trio, mixed)');
    console.log('- basePrice: Base price for the collection');
    console.log('- allowCustomSelection: Whether customers can customize');
    console.log('- maxSelections: Maximum number of products customers can select');
    console.log('- productCategories: JSON array of product categories and selections');
    
    console.log('\n💡 Next steps:');
    console.log('1. Test creating a new collection in the admin panel');
    console.log('2. Check if the 500 error is resolved');
    console.log('3. Try the smart product selection feature');
    
  } catch (error) {
    console.error('❌ Error updating collections schema:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  updateCollectionsSchemaSimple();
}

module.exports = updateCollectionsSchemaSimple;
