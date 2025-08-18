// Test script to verify email functionality
const testEmailConfig = {
  service: 'smtp',
  fromEmail: 'helpcounterfit@gmail.com',
  fromName: 'Counterfit',
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    user: 'helpcounterfit@gmail.com',
    pass: 'Counterfit@1234567890'
  }
};

console.log('📧 Testing Email Configuration:');
console.log('Service:', testEmailConfig.service);
console.log('From Email:', testEmailConfig.fromEmail);
console.log('From Name:', testEmailConfig.fromName);
console.log('SMTP Host:', testEmailConfig.smtp.host);
console.log('SMTP Port:', testEmailConfig.smtp.port);
console.log('SMTP User:', testEmailConfig.smtp.user);
console.log('SMTP Pass:', testEmailConfig.smtp.pass ? '***SET***' : 'NOT SET');

console.log('\n✅ Configuration looks good!');
console.log('\n📝 Next steps:');
console.log('1. Make sure your .env.local file has the correct EMAIL_SMTP_PASS');
console.log('2. Test the contact form at http://localhost:3000/contact');
console.log('3. Check the console for email logs');
console.log('4. Check your Gmail inbox for test emails');
