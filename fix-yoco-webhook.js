#!/usr/bin/env node

/**
 * Quick Fix Script for Yoco Webhook Registration
 * Run this to register your webhook with Yoco
 */

const https = require('https');

// Your Yoco configuration
const YOCO_SECRET_KEY = 'sk_test_bb2272947mZK5ek9bb34e6fb1fd8';
const WEBHOOK_URL = 'https://counterfit.co.za/api/webhooks/yoco';

console.log('🔔 Registering YOCO webhook...');
console.log('🌐 Webhook URL:', WEBHOOK_URL);

const postData = JSON.stringify({
  url: WEBHOOK_URL,
  name: 'Counterfit Payment Webhook'
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
    console.log('\n📊 Response Status:', res.statusCode);
    console.log('📝 Response Data:', data);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      try {
        const response = JSON.parse(data);
        console.log('\n✅ Webhook registered successfully!');
        console.log('🔑 Webhook ID:', response.id);
        console.log('🔐 Webhook Secret:', response.secret);
        console.log('\n⚠️  IMPORTANT: Your webhook is now active!');
        console.log('🎉 Future payments will automatically update order status.');
      } catch (e) {
        console.log('✅ Webhook registration successful (response not JSON)');
      }
    } else {
      console.error('\n❌ Failed to register webhook');
      console.error('Response:', data);
      
      // Check if webhook already exists
      if (data.includes('already exists') || data.includes('duplicate')) {
        console.log('\n💡 Webhook might already be registered - this is OK!');
        console.log('🔍 Check your Yoco dashboard to verify webhook is active.');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(postData);
req.end();
