# Google OAuth Setup Script for Counterfit
# This script helps you set up Google OAuth authentication

Write-Host "🔐 Google OAuth Setup for Counterfit" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    
    # Create .env.local with Google OAuth placeholders
    @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=https://counterfit-backend.onrender.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Email Configuration (if using email service)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password

# Stripe Configuration (if using Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
"@ | Out-File -FilePath $envFile -Encoding UTF8
    
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Google Cloud Console: https://console.cloud.google.com/" -ForegroundColor White
Write-Host "2. Create OAuth 2.0 credentials for your project" -ForegroundColor White
Write-Host "3. Set authorized redirect URIs:" -ForegroundColor White
Write-Host "   - Development: http://localhost:3000/api/auth/callback/google" -ForegroundColor White
Write-Host "   - Production: https://yourdomain.com/api/auth/callback/google" -ForegroundColor White
Write-Host "4. Copy your Client ID and Client Secret" -ForegroundColor White
Write-Host "5. Update the .env.local file with your credentials" -ForegroundColor White
Write-Host "6. Update your backend .env file with the same credentials" -ForegroundColor White
Write-Host "7. Run the SQL script in your Supabase SQL editor:" -ForegroundColor White
Write-Host "   - Use the file: counterfit-backend/add-google-id-manual.sql" -ForegroundColor White
Write-Host ""
Write-Host "🔧 After setup:" -ForegroundColor Yellow
Write-Host "- Restart your development servers" -ForegroundColor White
Write-Host "- Test Google sign-in at /auth/signin" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed instructions, see: GOOGLE_OAUTH_SETUP.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
