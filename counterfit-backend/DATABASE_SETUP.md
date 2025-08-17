# Database Setup Guide for Render Deployment

## 🚨 Current Issue
Your backend is failing to connect to the Supabase database on Render with the error:
```
Can't reach database server at `aws-1-ap-southeast-1.pooler.supabase.com:5432`
```

## 🔧 Solution Steps

### 1. Update Your Supabase Connection String

You need to replace the placeholder values in your `env.production` file with your actual Supabase credentials.

**Current (incorrect):**
```bash
DATABASE_URL=postgresql://username:password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20
```

**Should be (example):**
```bash
DATABASE_URL=postgresql://postgres.yourprojectid:your_actual_password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** from the "Connection pooling" section
5. Replace `[YOUR-PASSWORD]` with your actual database password

### 3. Update Render Environment Variables

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add/update these variables:

```bash
NODE_ENV=production
DATABASE_URL=your_actual_supabase_connection_string
JWT_SECRET=your_actual_jwt_secret
```

### 4. Alternative Connection String Format

If the pooler doesn't work, try the direct connection:

```bash
DATABASE_URL=postgresql://postgres.yourprojectid:your_password@aws-1-ap-southeast-1.supabase.com:5432/postgres
```

### 5. Test Your Connection String Locally

Before deploying, test your connection string locally:

1. Create a `.env.local` file with your production DATABASE_URL
2. Run: `npx prisma db pull` to test the connection
3. If it works locally, the issue is with Render's environment

### 6. Render-Specific Issues

**Common Render problems:**
- Environment variables not being loaded
- Network restrictions
- Build process not copying .env files

**Solutions:**
1. Ensure environment variables are set in Render dashboard (not in code)
2. Check if your Render service has outbound internet access
3. Verify the build process completes successfully

### 7. Verify Database Status

1. Check if your Supabase database is active
2. Verify the database password hasn't changed
3. Ensure your IP isn't blocked by Supabase

### 8. Debugging Commands

Add these to your server startup to debug:

```javascript
console.log('🔍 Environment check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...')
```

## 🚀 Quick Fix

1. **Get your actual Supabase connection string**
2. **Set it in Render environment variables** (not in code)
3. **Redeploy your service**
4. **Check the logs** for connection success

## 📞 Need Help?

If you're still having issues:
1. Check Render deployment logs
2. Verify Supabase database is running
3. Test connection string locally first
4. Ensure all environment variables are set in Render dashboard

## 🔒 Security Note

- Never commit real database credentials to git
- Use Render environment variables for sensitive data
- Rotate your database password if it was ever exposed
