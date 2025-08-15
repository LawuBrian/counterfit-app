# MongoDB Atlas Setup Script
# Run this after getting your connection string from MongoDB Atlas

# Replace YOUR_CONNECTION_STRING with your actual MongoDB Atlas connection string
# Example: mongodb+srv://counterfit-admin:yourpassword@counterfit-cluster.xxxxx.mongodb.net/counterfit?retryWrites=true&w=majority

$env:MONGODB_URI = "YOUR_CONNECTION_STRING_HERE"
$env:JWT_SECRET = "counterfit-jwt-secret-12345"
$env:JWT_EXPIRE = "30d"
$env:NODE_ENV = "development"
$env:PORT = "5000"
$env:FRONTEND_URL = "http://localhost:3000"

Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host "🚀 Now run: npm run dev" -ForegroundColor Cyan
Write-Host "📝 Don't forget to replace YOUR_CONNECTION_STRING_HERE with your actual MongoDB Atlas connection string" -ForegroundColor Yellow
