import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Create a mock client for build time if environment variables are not properly set
const createMockClient = () => ({
  from: () => ({
    select: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'MOCK_ERROR', message: 'Mock client' } }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'MOCK_ERROR', message: 'Mock client' } }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'MOCK_ERROR', message: 'Mock client' } }) }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: { code: 'MOCK_ERROR', message: 'Mock client' } }) }),
    eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'MOCK_ERROR', message: 'Mock client' } }) }),
    or: () => ({ range: () => Promise.resolve({ data: [], error: null, count: 0 }) }),
    order: () => ({ range: () => Promise.resolve({ data: [], error: null, count: 0 }) }),
    range: () => Promise.resolve({ data: [], error: null, count: 0 })
  })
})

export const supabase = (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder_key') 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey)

// Waitlist table interface
export interface WaitlistEntry {
  id?: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at?: string
  updated_at?: string
}

// Function to add user to waitlist
export async function addToWaitlist(userData: Omit<WaitlistEntry, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // First check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      throw new Error(`Error checking existing user: ${checkError.message}`)
    }

    if (existingUser) {
      return {
        success: false,
        message: 'This email is already on our waitlist!',
        error: 'DUPLICATE_EMAIL'
      }
    }

    // Insert new user
    const { data, error } = await supabase
      .from('waitlist')
      .insert([userData])
      .select()
      .single()

    if (error) {
      throw new Error(`Error adding to waitlist: ${error.message}`)
    }

    return {
      success: true,
      message: 'Successfully added to waitlist!',
      data
    }
  } catch (error) {
    console.error('Error in addToWaitlist:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      error: 'UNKNOWN_ERROR'
    }
  }
}

// Function to get waitlist count (for admin purposes)
export async function getWaitlistCount() {
  try {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw new Error(`Error getting waitlist count: ${error.message}`)
    }

    return { count: count || 0, error: null }
  } catch (error) {
    console.error('Error getting waitlist count:', error)
    return { count: 0, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
