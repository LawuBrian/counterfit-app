import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Missing Supabase admin credentials. Server-side operations may fail.')
}

/**
 * Admin Supabase client with service role key
 * This client bypasses Row-Level Security (RLS) policies
 * Use ONLY for server-side operations where you need admin privileges
 * 
 * NEVER expose this client to the frontend!
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Helper to check if admin client is properly configured
 */
export function isAdminConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceRoleKey)
}

