# Google OAuth Setup Guide for Counterfit

This guide will help you set up Google OAuth authentication for your Counterfit application.

## Prerequisites

- A Google Cloud Console account
- Access to your Supabase database
- Node.js and npm installed

## Step 1: Set up Google OAuth in Google Cloud Console

### 1.1 Create a new project or select existing one
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth consent screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Counterfit"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (your email addresses for testing)

### 1.3 Create OAuth 2.0 credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
5. Copy the Client ID and Client Secret

## Step 2: Update Environment Variables

### 2.1 Frontend (.env.local)
Create or update your `.env.local` file in the `counterfit-website` directory:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2.2 Backend (.env)
Create or update your `.env` file in the `counterfit-backend` directory:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 3: Update Database Schema

### 3.1 Run the migration script
Navigate to the backend directory and run:

```bash
cd counterfit-backend
node scripts/add-google-id-field.js
```

### 3.2 Manual database update (if script fails)
If the automatic migration fails, manually run these SQL commands in your Supabase SQL editor:

```sql
-- Add googleId column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255) UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "User"("googleId");
```

## Step 4: Test the Implementation

### 4.1 Start the backend server
```bash
cd counterfit-backend
npm start
```

### 4.2 Start the frontend development server
```bash
cd counterfit-website
npm run dev
```

### 4.3 Test Google Sign-in
1. Go to `http://localhost:3000/auth/signin`
2. Click "Continue with Google"
3. Complete the Google OAuth flow
4. Verify that you're redirected back to the application

## Step 5: Production Deployment

### 5.1 Update Google OAuth redirect URIs
1. Go back to Google Cloud Console
2. Update the authorized redirect URIs to include your production domain
3. Remove the localhost redirect URI if not needed

### 5.2 Update environment variables
Make sure your production environment has the correct Google OAuth credentials.

## Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" error
- Ensure the redirect URI in Google Cloud Console matches exactly
- Check for trailing slashes or protocol mismatches

#### 2. "Client ID not found" error
- Verify your environment variables are set correctly
- Restart your development servers after updating environment variables

#### 3. Database errors
- Ensure the `googleId` field was added to the User table
- Check that the migration script ran successfully

#### 4. CORS issues
- Verify your backend CORS configuration allows requests from your frontend domain

### Debug Mode
Enable debug mode in your NextAuth configuration by setting:

```typescript
debug: process.env.NODE_ENV === 'development'
```

This will provide detailed logs in your console for troubleshooting.

## Security Considerations

1. **Never commit credentials**: Ensure `.env` files are in `.gitignore`
2. **Use environment variables**: Always use environment variables for sensitive data
3. **Validate redirect URIs**: Only allow redirect URIs from your domains
4. **Regular credential rotation**: Consider rotating OAuth credentials periodically

## Additional Resources

- [NextAuth.js Google Provider Documentation](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Documentation](https://supabase.com/docs)

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure the database schema is updated
4. Check that both frontend and backend are running

---

**Note**: This setup enables users to sign in with Google accounts. Users can still use traditional email/password authentication as well.
