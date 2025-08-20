const express = require('express');
const app = express();

app.use(express.json());

// Test endpoint to check database schema
app.get('/test-schema', async (req, res) => {
  try {
    // This is a simple test to see if the endpoint is accessible
    res.json({
      success: true,
      message: 'Backend is running and accessible',
      timestamp: new Date().toISOString(),
      note: 'Check if googleId field exists in User table'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test Google auth endpoint
app.post('/test-google-auth', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    
    // Simulate the Google auth logic
    res.json({
      success: true,
      message: 'Google auth endpoint is working',
      receivedData: { email, name, googleId },
      note: 'This is a test - actual user creation requires database schema update'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/test-schema`);
  console.log(`   POST http://localhost:${PORT}/test-google-auth`);
  console.log(`   Body: {"email":"test@example.com","name":"Test User","googleId":"test123"}`);
});
