#!/usr/bin/env node

/**
 * Script to register YOCO webhook endpoint
 * Run this script after deploying your webhook endpoint
 * 
 * Usage: node scripts/register-yoco-webhook.js
 */

const https = require('https');

// Configuration - Update these values
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY || 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const WEBHOOK_URL = process.env.YOCO_WEBHOOK_URL || 'https://your-domain.com/api/webhooks/yoco';

async function registerWebhook() {
  try {
    console.log('🔔 Registering YOCO webhook...');
    console.log('�� Webhook URL:', WEBHOOK_URL);
    
    const postData = JSON.stringify({
      url: WEBHOOK_URL,
      name: 'Counterfit Payment Webhook' // Added required name field
    });

    const options = {
      hostname: 'payments.yoco.com',
      port: 443,
      path: '/api/webhooks',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const response = JSON.parse(data);
          console.log('✅ Webhook registered successfully!');
          console.log('🔑 Webhook ID:', response.id);
          console.log('🔐 Webhook Secret:', response.secret);
          console.log('');
          console.log('⚠️  IMPORTANT: Save the webhook secret above to your environment variables as YOCO_WEBHOOK_SECRET');
          console.log('�� Add this to your .env.local file:');
          console.log(`YOCO_WEBHOOK_SECRET=${response.secret}`);
        } else {
          console.error('❌ Failed to register webhook:', res.statusCode);
          console.error('Response:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ Error registering webhook:', error);
  }
}

// Check if required environment variables are set
if (!YOCO_SECRET_KEY || YOCO_SECRET_KEY.includes('xxxxxxxx')) {
  console.error('❌ YOCO_SECRET_KEY not set or invalid');
  console.log('📝 Please set YOCO_SECRET_KEY environment variable');
  console.log('�� Example: export YOCO_SECRET_KEY=sk_test_your_key_here');
  process.exit(1);
}

if (!WEBHOOK_URL || WEBHOOK_URL.includes('your-domain.com')) {
  console.error('❌ YOCO_WEBHOOK_URL not set or invalid');
  console.log('📝 Please set YOCO_WEBHOOK_URL environment variable');
  console.log('�� Example: export YOCO_WEBHOOK_URL=https://yourdomain.com/api/webhooks/yoco');
  process.exit(1);
}

// Register the webhook
registerWebhook();