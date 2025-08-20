// Test script for contact form email functionality
// Run with: node test-contact-form.js

async function testContactForm() {
  try {
    console.log('🧪 Testing contact form email functionality...');
    
    // Test data for contact form
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Contact Form',
      message: 'This is a test message to verify the contact form email functionality is working correctly.'
    };
    
    console.log('📧 Contact form data:', contactData);
    
    // Make a request to your contact API
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Contact form email sent successfully!');
      console.log('📊 Response:', result);
    } else {
      console.error('❌ Contact form email failed:');
      console.error('Status:', response.status);
      console.error('Response:', result);
    }
    
  } catch (error) {
    console.error('❌ Contact form test failed:');
    console.error('Error:', error.message);
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your development server is running (npm run dev)');
    console.log('2. Check if your .env.local file has the correct SendGrid configuration');
    console.log('3. Verify your SendGrid API key is valid');
    console.log('4. Make sure your sender email is verified in SendGrid');
  }
}

// Check if we're in a browser environment
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testContactForm();
} else {
  // Browser environment
  console.log('🌐 Running in browser - use the test button on your contact page instead');
}
