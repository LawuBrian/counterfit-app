const { createClient } = require('@supabase/supabase-js')

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://ohrayboywmcsqkirqrty.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// Create Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create public client for read-only operations
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test connection
async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    // Test a simple query
    const { data, error } = await supabase
      .from('Product')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connected successfully')
    console.log('📊 Database accessible, sample query returned:', data ? data.length : 0, 'results')
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message)
    return false
  }
}

// Test connection on startup
testSupabaseConnection()

module.exports = { supabase, supabasePublic, testSupabaseConnection }
