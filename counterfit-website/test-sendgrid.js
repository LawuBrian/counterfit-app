// Test script for SendGrid email functionality
// Run with: node test-sendgrid.js

const sgMail = require('@sendgrid/mail');

// Configuration - update these values
const config = {
  apiKey: process.env.EMAIL_API_KEY || 'SG.your_api_key_here',
  fromEmail: process.env.EMAIL_FROM || 'helpcounterfit@gmail.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Counterfit',
  toEmail: 'your-test-email@gmail.com' // Update this to your test email
};

async function testSendGrid() {
  try {
    console.log('🧪 Testing SendGrid email functionality...');
    console.log('📧 From:', config.fromEmail);
    console.log('📧 To:', config.toEmail);
    console.log('🔑 API Key:', config.apiKey.substring(0, 10) + '...');

    // Set the API key
    sgMail.setApiKey(config.apiKey);

    // Test email
    const msg = {
      to: config.toEmail,
      from: {
        email: config.fromEmail,
        name: config.fromName
      },
      subject: '🧪 SendGrid Test Email - Counterfit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">🎉 SendGrid is Working!</h1>
          <p>This is a test email to verify your SendGrid setup is working correctly.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li><strong>Service:</strong> SendGrid</li>
              <li><strong>From:</strong> ${config.fromEmail}</li>
              <li><strong>To:</strong> ${config.toEmail}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p>If you received this email, your SendGrid configuration is working perfectly! 🚀</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            © 2025 Counterfit - Luxury Streetwear
          </p>
        </div>
      `
    };

    console.log('📤 Sending test email...');
    const response = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully!');
    console.log('📊 Response:', response[0].statusCode);
    console.log('📧 Check your inbox at:', config.toEmail);
    
  } catch (error) {
    console.error('❌ SendGrid test failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response body:', error.response.body);
      console.error('Response headers:', error.response.headers);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if your API key is correct');
    console.log('2. Verify your sender email is verified in SendGrid');
    console.log('3. Make sure you have the right permissions (Mail Send)');
    console.log('4. Check if you\'ve hit your daily limit (100 emails/day free)');
  }
}

// Check if required environment variables are set
if (!config.apiKey || config.apiKey === 'SG.your_api_key_here') {
  console.error('❌ Please set your EMAIL_API_KEY environment variable');
  console.log('💡 Create a .env.local file with:');
  console.log('EMAIL_API_KEY=SG.your_actual_api_key_here');
  console.log('EMAIL_FROM=helpcounterfit@gmail.com');
  console.log('EMAIL_FROM_NAME=Counterfit');
  process.exit(1);
}

if (config.toEmail === 'your-test-email@gmail.com') {
  console.error('❌ Please update the toEmail in this script to your test email');
  process.exit(1);
}

// Run the test
testSendGrid();
