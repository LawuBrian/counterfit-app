const express = require('express');
const app = express();

app.use(express.json());

// Debug endpoint to test Google auth step by step
app.post('/debug-google-auth', async (req, res) => {
  try {
    console.log('🔍 Debug: Received request:', req.body);
    
    const { email, name, image, googleId } = req.body;
    
    // Validate required fields
    if (!email || !name || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        received: { email, name, image, googleId },
        required: ['email', 'name', 'googleId']
      });
    }
    
    // Parse name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    console.log('🔍 Debug: Parsed name:', { firstName, lastName });
    
    // Simulate user creation (without database)
    const mockUser = {
      id: 'mock-user-id-' + Date.now(),
      firstName,
      lastName,
      email,
      googleId,
      avatar: image,
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔍 Debug: Mock user created:', mockUser);
    
    res.json({
      success: true,
      message: 'Debug endpoint working - user creation logic is valid',
      mockUser,
      note: 'This endpoint bypasses database operations for testing'
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint to check if server is running
app.get('/debug-health', (req, res) => {
  res.json({
    success: true,
    message: 'Debug server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /debug-health',
      'POST /debug-google-auth'
    ]
  });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🧪 Debug server running on port ${PORT}`);
  console.log(`📝 Debug endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/debug-health`);
  console.log(`   POST http://localhost:${PORT}/debug-google-auth`);
  console.log(`   Body: {"email":"test@example.com","name":"Test User","googleId":"test123"}`);
});
