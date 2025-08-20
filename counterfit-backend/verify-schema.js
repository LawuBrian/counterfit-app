// Simple script to verify database schema
console.log('🔍 Checking if googleId field exists in User table...');

// This script will help verify the schema manually:
console.log('📋 To verify the schema manually:');
console.log('');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to Table Editor > User table');
console.log('3. Check if you see a "googleId" column');
console.log('');
console.log('Or run this SQL query in the SQL Editor:');
console.log('');
console.log('SELECT column_name, data_type, is_nullable');
console.log('FROM information_schema.columns');
console.log('WHERE table_name = \'User\' AND column_name = \'googleId\';');
console.log('');
console.log('Expected result:');
console.log('column_name | data_type | is_nullable');
console.log('googleId    | varchar   | YES');
console.log('');
console.log('If the field exists, the issue might be:');
console.log('- Backend needs restart to pick up schema changes');
console.log('- Validation errors in the request');
console.log('- Database connection issues');
console.log('');
console.log('Try restarting your backend server after schema changes.');
