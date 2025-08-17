const { supabase } = require('../lib/supabase');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function updateCollectionsSchema() {
  try {
    console.log('🔄 Updating Collection table schema...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Add new columns to Collection table
    console.log('📝 Adding new columns to Collection table...');
    
    // Add collectionType column
    try {
      const { error: typeError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE "Collection" 
          ADD COLUMN IF NOT EXISTS "collectionType" VARCHAR(20) DEFAULT 'singular' 
          CHECK ("collectionType" IN ('singular', 'combo', 'duo', 'trio', 'mixed'))
        `
      });
      
      if (typeError) {
        console.log('ℹ️ collectionType column already exists or error:', typeError.message);
      } else {
        console.log('✅ Added collectionType column');
      }
    } catch (error) {
      console.log('ℹ️ collectionType column already exists or error:', error.message);
    }

    // Add basePrice column
    try {
      const { error: priceError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE "Collection" 
          ADD COLUMN IF NOT EXISTS "basePrice" DECIMAL(10,2) DEFAULT 0
        `
      });
      
      if (priceError) {
        console.log('ℹ️ basePrice column already exists or error:', priceError.message);
      } else {
        console.log('✅ Added basePrice column');
      }
    } catch (error) {
      console.log('ℹ️ basePrice column already exists or error:', error.message);
    }

    // Add allowCustomSelection column
    try {
      const { error: customError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE "Collection" 
          ADD COLUMN IF NOT EXISTS "allowCustomSelection" BOOLEAN DEFAULT false
        `
      });
      
      if (customError) {
        console.log('ℹ️ allowCustomSelection column already exists or error:', customError.message);
      } else {
        console.log('✅ Added allowCustomSelection column');
      }
    } catch (error) {
      console.log('ℹ️ allowCustomSelection column already exists or error:', error.message);
    }

    // Add maxSelections column
    try {
      const { error: maxError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE "Collection" 
          ADD COLUMN IF NOT EXISTS "maxSelections" INTEGER DEFAULT 1
        `
      });
      
      if (maxError) {
        console.log('ℹ️ maxSelections column already exists or error:', maxError.message);
      } else {
        console.log('✅ Added maxSelections column');
      }
    } catch (error) {
      console.log('ℹ️ maxSelections column already exists or error:', error.message);
    }

    // Add productCategories column
    try {
      const { error: categoriesError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE "Collection" 
          ADD COLUMN IF NOT EXISTS "productCategories" JSONB DEFAULT '[]'
        `
      });
      
      if (categoriesError) {
        console.log('ℹ️ productCategories column already exists or error:', categoriesError.message);
      } else {
        console.log('✅ Added productCategories column');
      }
    } catch (error) {
      console.log('ℹ️ productCategories column already exists or error:', error.message);
    }

    // Update existing collections with default values
    console.log('🔄 Updating existing collections with default values...');
    
    const { data: collections, error: fetchError } = await supabase
      .from('Collection')
      .select('id, "collectionType", "basePrice", "allowCustomSelection", "maxSelections", "productCategories"');
    
    if (fetchError) {
      console.error('❌ Error fetching collections:', fetchError);
      return;
    }

    console.log(`📋 Found ${collections.length} collections to update`);

    for (const collection of collections) {
      const updateData = {
        collectionType: collection.collectionType || 'singular',
        basePrice: collection.basePrice || 0,
        allowCustomSelection: collection.allowCustomSelection || false,
        maxSelections: collection.maxSelections || 1,
        productCategories: collection.productCategories || [],
        updatedAt: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('Collection')
        .update(updateData)
        .eq('id', collection.id);

      if (updateError) {
        console.error(`❌ Error updating collection ${collection.id}:`, updateError);
      } else {
        console.log(`✅ Updated collection ${collection.id}`);
      }
    }

    // Create index for collectionType
    try {
      const { error: indexError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE INDEX IF NOT EXISTS idx_collection_type ON "Collection"("collectionType")
        `
      });
      
      if (indexError) {
        console.log('ℹ️ collectionType index already exists or error:', indexError.message);
      } else {
        console.log('✅ Created collectionType index');
      }
    } catch (error) {
      console.log('ℹ️ collectionType index already exists or error:', error.message);
    }

    console.log('\n🎉 Collection table schema update completed!');
    console.log('\n🔍 New columns added:');
    console.log('- collectionType: Type of collection (singular, combo, duo, trio, mixed)');
    console.log('- basePrice: Base price for the collection');
    console.log('- allowCustomSelection: Whether customers can customize');
    console.log('- maxSelections: Maximum number of products customers can select');
    console.log('- productCategories: JSON array of product categories and selections');
    
  } catch (error) {
    console.error('❌ Error updating collections schema:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  updateCollectionsSchema();
}

module.exports = updateCollectionsSchema;
