# Supabase Setup Guide for Render

## 🚀 **Migration Complete!**

Your backend has been migrated from Prisma to Supabase REST API. This will solve your database connection issues.

## 🔧 **Required Environment Variables in Render:**

Go to your Render dashboard → Environment tab and add these variables:

### **Required:**
```bash
SUPABASE_URL=https://ohrayboywmcsqkirqrty.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=production
```

### **Optional (keep existing):**
```bash
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 📋 **How to Get Supabase Keys:**

1. **Go to [Supabase Dashboard](https://app.supabase.com/)**
2. **Select your project**
3. **Go to Settings → API**
4. **Copy these values:**
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon public key** → `SUPABASE_ANON_KEY`

## 🗑️ **Remove Old Variables:**

You can now remove these from Render:
- `DATABASE_URL` (no longer needed)

## ✅ **What This Fixes:**

- ❌ **Before**: Direct database connection failing on Render
- ✅ **After**: HTTP API calls to Supabase (much more reliable)

## 🚀 **Deploy:**

1. **Update environment variables in Render**
2. **Render will automatically redeploy**
3. **Check logs for**: `✅ Supabase connected successfully`

## 🔍 **Expected Logs:**

```
🔍 Environment check:
NODE_ENV: production
SUPABASE_URL exists: true
SUPABASE_SERVICE_ROLE_KEY exists: true
🔄 Testing Supabase connection...
✅ Supabase connected successfully
📊 Database accessible, sample query returned: X results
✅ Connected to Supabase database
🚀 Counterfit Backend Server running on port 5000
```

## 🎯 **Benefits:**

- **No more connection pooling issues**
- **Better security** (no direct database access)
- **Automatic scaling** (Supabase handles it)
- **Real-time capabilities** (if needed later)
- **Built-in authentication** (Row Level Security)

## 📞 **Need Help?**

If you see any errors in the logs after deployment, check:
1. **Environment variables are set correctly**
2. **Supabase keys are valid**
3. **Database is active in Supabase dashboard**
