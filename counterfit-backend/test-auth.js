const jwt = require('jsonwebtoken');

// Test JWT functionality
console.log('🔐 Testing JWT functionality...');

// Check if JWT_SECRET is set
const jwtSecret = process.env.JWT_SECRET;
console.log('JWT_SECRET set:', !!jwtSecret);
console.log('JWT_SECRET length:', jwtSecret ? jwtSecret.length : 0);

if (!jwtSecret) {
  console.log('❌ JWT_SECRET is not set! Please set it in your environment variables.');
  process.exit(1);
}

// Test token generation
try {
  const testUser = { id: 'test-user-123', role: 'ADMIN' };
  const token = jwt.sign(testUser, jwtSecret, { expiresIn: '1h' });
  console.log('✅ Token generated successfully');
  console.log('Token preview:', token.substring(0, 20) + '...');
  
  // Test token verification
  const decoded = jwt.verify(token, jwtSecret);
  console.log('✅ Token verified successfully');
  console.log('Decoded payload:', decoded);
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
  process.exit(1);
}

console.log('🎉 JWT functionality test passed!');
