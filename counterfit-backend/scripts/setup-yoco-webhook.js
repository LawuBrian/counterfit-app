const { registerYocoWebhook } = require('../lib/yoco');
require('dotenv').config();

async function setupYocoWebhook() {
  try {
    console.log('🔔 Setting up Yoco webhook...');
    
    const webhookUrl = process.env.YOCO_WEBHOOK_URL || 'https://counterfit.co.za/api/webhooks/yoco';
    console.log('📍 Webhook URL:', webhookUrl);
    
    const webhook = await registerYocoWebhook(webhookUrl);
    
    console.log('✅ Yoco webhook registered successfully!');
    console.log('📋 Webhook details:', JSON.stringify(webhook, null, 2));
    
    console.log('\n🎯 Next steps:');
    console.log('1. Ensure your webhook endpoint is accessible at:', webhookUrl);
    console.log('2. Test webhook with a small payment');
    console.log('3. Monitor webhook calls in your application logs');
    
  } catch (error) {
    console.error('❌ Failed to setup Yoco webhook:', error);
    process.exit(1);
  }
}

setupYocoWebhook();
