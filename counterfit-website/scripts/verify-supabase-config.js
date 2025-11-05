/**
 * Verify Supabase configuration for server-side operations
 * Run with: node scripts/verify-supabase-config.js
 */

require('dotenv').config({ path: '.env.local' })

console.log('🔍 Checking Supabase Configuration...\n')

const checks = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    description: 'Public Supabase URL (used client-side)'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    description: 'Public anon key (used client-side, respects RLS)'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: process.env.SUPABASE_SERVICE_ROLE_KEY,
    required: true,
    description: 'Service role key (server-side only, bypasses RLS)'
  }
]

let allGood = true

checks.forEach(check => {
  const exists = !!check.value
  const status = exists ? '✅' : '❌'
  const preview = exists 
    ? `${check.value.substring(0, 20)}...${check.value.substring(check.value.length - 5)}`
    : 'NOT SET'
  
  console.log(`${status} ${check.name}`)
  console.log(`   ${check.description}`)
  console.log(`   Value: ${preview}\n`)
  
  if (check.required && !exists) {
    allGood = false
  }
})

if (!allGood) {
  console.log('❌ Configuration is incomplete!')
  console.log('\n📝 To fix this:')
  console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
  console.log('2. Select your project')
  console.log('3. Go to Settings → API')
  console.log('4. Find the "service_role" key (⚠️  SECRET - keep this secure!)')
  console.log('5. Add it to your .env.local file:\n')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n')
  console.log('6. Restart your Next.js dev server')
  process.exit(1)
} else {
  console.log('✅ All configuration looks good!')
  console.log('🚀 You can now create orders and perform server-side operations.')
}

