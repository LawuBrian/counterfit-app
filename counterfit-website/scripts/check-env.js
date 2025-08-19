#!/usr/bin/env node

/**
 * Environment Variables Checker for Counterfit Website
 * Run this script to see which environment variables are missing
 */

console.log('🔍 Checking Counterfit Website Environment Variables...\n')

// Required environment variables
const requiredVars = {
  // Backend
  'NEXT_PUBLIC_BACKEND_URL': 'Backend API URL',
  
  // NextAuth
  'NEXTAUTH_URL': 'NextAuth URL (your domain)',
  'NEXTAUTH_SECRET': 'NextAuth secret key',
  
  // Email (choose one service)
  'EMAIL_SERVICE': 'Email service (sendgrid, smtp, etc.)',
  'EMAIL_API_KEY': 'Email API key (SendGrid)',
  'EMAIL_FROM': 'Sender email address',
  'EMAIL_FROM_NAME': 'Sender name',
  
  // Yoco Payment
  'NEXT_PUBLIC_YOCO_PUBLIC_KEY': 'Yoco public key',
  'YOCO_SECRET_KEY': 'Yoco secret key',
  'YOCO_WEBHOOK_SECRET': 'Yoco webhook secret',
  
  // Backend API
  'BACKEND_API_KEY': 'Backend API key for webhooks'
}

// Optional environment variables
const optionalVars = {
  'NODE_ENV': 'Node environment',
  'NEXT_PUBLIC_GA_ID': 'Google Analytics ID',
  'NEXT_PUBLIC_SENTRY_DSN': 'Sentry error tracking'
}

console.log('📋 REQUIRED Environment Variables:')
console.log('=====================================')

let missingCount = 0
let configuredCount = 0

for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${description}`)
    if (varName.includes('SECRET') || varName.includes('KEY')) {
      console.log(`   Value: ${value.substring(0, 8)}...${value.substring(value.length - 4)}`)
    } else {
      console.log(`   Value: ${value}`)
    }
    configuredCount++
  } else {
    console.log(`❌ ${varName}: ${description} - MISSING`)
    missingCount++
  }
}

console.log('\n📋 OPTIONAL Environment Variables:')
console.log('=====================================')

for (const [varName, description] of Object.entries(optionalVars)) {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${description}`)
    console.log(`   Value: ${value}`)
  } else {
    console.log(`⚠️  ${varName}: ${description} - Not set (optional)`)
  }
}

console.log('\n📊 SUMMARY:')
console.log('============')
console.log(`✅ Configured: ${configuredCount}/${Object.keys(requiredVars).length}`)
console.log(`❌ Missing: ${missingCount}`)

if (missingCount === 0) {
  console.log('\n🎉 All required environment variables are configured!')
} else {
  console.log('\n🚨 MISSING CRITICAL ENVIRONMENT VARIABLES!')
  console.log('\nTo fix this:')
  console.log('1. Create a .env.production file in your counterfit-website folder')
  console.log('2. Add the missing variables above')
  console.log('3. Deploy to your hosting platform with these environment variables')
  console.log('\nSee PRODUCTION_ENV_SETUP.md for detailed instructions')
}

// Check specific configurations
console.log('\n🔧 CONFIGURATION CHECKS:')
console.log('========================')

// Email service check
const emailService = process.env.EMAIL_SERVICE
if (emailService === 'sendgrid') {
  if (!process.env.EMAIL_API_KEY) {
    console.log('❌ SendGrid configured but EMAIL_API_KEY is missing')
  } else {
    console.log('✅ SendGrid email service properly configured')
  }
} else if (emailService === 'smtp') {
  const smtpVars = ['EMAIL_SMTP_HOST', 'EMAIL_SMTP_USER', 'EMAIL_SMTP_PASS']
  const missingSmtp = smtpVars.filter(v => !process.env[v])
  if (missingSmtp.length > 0) {
    console.log(`❌ SMTP configured but missing: ${missingSmtp.join(', ')}`)
  } else {
    console.log('✅ SMTP email service properly configured')
  }
} else if (!emailService) {
  console.log('❌ No email service configured')
} else {
  console.log(`⚠️  Unknown email service: ${emailService}`)
}

// Yoco check
if (process.env.YOCO_SECRET_KEY && process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY) {
  console.log('✅ Yoco payment service properly configured')
} else {
  console.log('❌ Yoco payment service not configured')
}

// NextAuth check
if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
  console.log('✅ NextAuth properly configured')
} else {
  console.log('❌ NextAuth not properly configured')
}

console.log('\n💡 TIP: Run this script in your production environment to see what\'s missing!')
