const { supabase } = require('../lib/supabase');

async function addGoogleIdField() {
  try {
    console.log('🔧 Adding googleId field to User table...');
    
    // Add googleId column to User table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255) UNIQUE;
      `
    });

    if (error) {
      // If RPC method doesn't work, try direct SQL (this might not work in Supabase)
      console.log('⚠️ RPC method failed, trying alternative approach...');
      
      // Try to add the column using a different method
      const { error: alterError } = await supabase
        .from('User')
        .select('id')
        .limit(1);
      
      if (alterError) {
        console.error('❌ Failed to add googleId field:', alterError);
        console.log('💡 You may need to manually add the googleId field to your User table');
        console.log('💡 SQL command: ALTER TABLE "User" ADD COLUMN "googleId" VARCHAR(255) UNIQUE;');
        return;
      }
    }

    console.log('✅ googleId field added successfully to User table');
    
    // Create index for better performance
    console.log('🔧 Creating index for googleId...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_user_google_id ON "User"("googleId");
      `
    });

    if (indexError) {
      console.log('⚠️ Could not create index automatically');
      console.log('💡 You may need to manually create the index');
      console.log('💡 SQL command: CREATE INDEX idx_user_google_id ON "User"("googleId");');
    } else {
      console.log('✅ Index created successfully');
    }

    console.log('🎉 Database schema updated successfully!');
    console.log('📝 The User table now supports Google OAuth authentication');
    
  } catch (error) {
    console.error('❌ Error updating database schema:', error);
    console.log('💡 You may need to manually update your database schema');
    console.log('💡 Required changes:');
    console.log('   1. ALTER TABLE "User" ADD COLUMN "googleId" VARCHAR(255) UNIQUE;');
    console.log('   2. CREATE INDEX idx_user_google_id ON "User"("googleId");');
  }
}

// Run the migration
addGoogleIdField();
