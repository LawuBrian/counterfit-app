const crypto = require('crypto');

// Register webhook endpoint with YOCO
async function registerYocoWebhook(webhookUrl) {
  try {
    console.log('🔔 Registering Yoco webhook:', webhookUrl);
    console.log('🔑 Using secret key:', process.env.YOCO_SECRET_KEY ? `${process.env.YOCO_SECRET_KEY.substring(0, 10)}...` : 'MISSING');
    
    const requestBody = {
      name: 'Counterfit Webhook',
      url: webhookUrl,
      events: [
        'checkout.payment.succeeded',
        'checkout.payment.failed',
        'checkout.payment.cancelled'
      ]
    };
    
    console.log('📋 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://payments.yoco.com/api/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.log('❌ Response status:', response.status);
      console.log('❌ Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('❌ Error data:', errorData);
      throw new Error(`Webhook registration failed: ${errorData.message || response.statusText}`);
    }
    
    const webhook = await response.json();
    console.log('✅ Yoco webhook registered:', webhook);
    
    return webhook;
    
  } catch (error) {
    console.error('❌ Failed to register Yoco webhook:', error);
    throw error;
  }
}

// Verify webhook signature using the new YOCO webhook security standard
function verifyWebhookSignature(
  webhookId,
  webhookTimestamp,
  requestBody,
  webhookSignature
) {
  try {
    if (!process.env.YOCO_WEBHOOK_SECRET) {
      console.warn('⚠️ Missing webhook secret');
      return false;
    }

    // Construct the signed content: id.timestamp.body
    const signedContent = `${webhookId}.${webhookTimestamp}.${requestBody}`;
    
    // Remove the 'whsec_' prefix from the secret
    const secretBytes = Buffer.from(process.env.YOCO_WEBHOOK_SECRET.split('_')[1], 'base64');
    
    // Generate expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64');
    
    // Extract the signature from the webhook-signature header
    // Format: "v1,signature" or "v1,signature v2,another-signature"
    const signatures = webhookSignature.split(' ');
    const primarySignature = signatures[0].split(',')[1];
    
    // Use constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(primarySignature)
    );
    
    console.log('🔐 Webhook signature verification:', isValid ? '✅ Valid' : '❌ Invalid');
    return isValid;
    
  } catch (error) {
    console.error('❌ Webhook signature verification error:', error);
    return false;
  }
}

// Validate webhook timestamp to prevent replay attacks
function validateWebhookTimestamp(timestamp, thresholdMinutes = 3) {
  try {
    const webhookTime = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const thresholdMs = thresholdMinutes * 60 * 1000;
    
    const isValid = Math.abs(now.getTime() - webhookTime.getTime()) < thresholdMs;
    
    console.log('⏰ Webhook timestamp validation:', isValid ? '✅ Valid' : '❌ Invalid');
    return isValid;
    
  } catch (error) {
    console.error('❌ Webhook timestamp validation error:', error);
    return false;
  }
}

module.exports = {
  registerYocoWebhook,
  verifyWebhookSignature,
  validateWebhookTimestamp
};
