# 🚨 Immediate Action Plan for Production Issues

## Summary of Problems

1. **Images not loading** - CORS blocked by Helmet ✅ FIXED
2. **401 errors** - Authentication tokens not working ⚠️ NEEDS VERIFICATION  
3. **Images disappear after deploy** - Ephemeral filesystem ⚠️ NEEDS SOLUTION
4. **500 error on visitors/duration** - Query might be failing ⚠️ NEEDS INVESTIGATION

---

## ✅ FIXED: CORS/Image Loading

**What was done:**
- Modified `server.js` Helmet configuration to allow cross-origin resources
- Added proper CORS headers for images

**Action:** Deploy the backend changes to Render

```bash
cd counterfit-app/counterfit-backend
git add server.js
git commit -m "Fix: Configure Helmet for CORS and cross-origin images"
git push origin main
```

---

## ⚠️ TO FIX: 401 Unauthorized Errors

### Step 1: Verify Environment Variables

**On Render (Backend):**
1. Go to your Render dashboard
2. Navigate to counterfit-backend service
3. Click "Environment" tab
4. **Verify these variables exist and match:**

```
JWT_SECRET=<must-be-32-chars-or-more>
JWT_EXPIRE=30d
NODE_ENV=production
```

**On Netlify/Vercel (Frontend):**
1. Go to your frontend deployment dashboard
2. Check environment variables
3. **Verify:**

```
NEXTAUTH_SECRET=<different-from-JWT_SECRET>
NEXTAUTH_URL=https://www.counterfit.co.za
NEXT_PUBLIC_BACKEND_URL=https://counterfit-backend.onrender.com
```

### Step 2: Test Authentication Manually

After deploying backend changes:

```bash
# 1. Test the debug endpoint
curl https://counterfit-backend.onrender.com/api/debug/auth

# Should return:
# {
#   "hasAuthHeader": false,
#   "hasToken": false,
#   "jwtSecretSet": true,  <-- MUST BE TRUE
#   "jwtSecretLength": 32,  <-- SHOULD BE 32+
#   "environment": "production"
# }

# 2. Login to get a token
curl -X POST https://counterfit-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@counterfit.com","password":"your-password"}'

# Copy the "token" from response

# 3. Test with the token
curl https://counterfit-backend.onrender.com/api/admin/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return orders, not 401
```

### Step 3: Frontend Session Check

1. Go to https://www.counterfit.co.za
2. Login as admin
3. Open browser console (F12)
4. Run:

```javascript
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => {
    console.log('Session data:', data);
    console.log('Has accessToken:', !!data.user?.accessToken);
  });
```

**If accessToken is missing:**
- The backend isn't returning it during login
- Check backend `/api/auth/login` response

**If accessToken exists but still getting 401:**
- JWT_SECRET mismatch between environments
- Token is expired (check JWT_EXPIRE setting)

---

## ⚠️ TO FIX: Images Disappearing After Deployment

### Problem
Render uses ephemeral filesystem - uploaded files don't persist across deployments.

### Solution: Use Supabase Storage

#### Step 1: Enable Supabase Storage

1. Go to Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named "products"
4. Make it public

#### Step 2: Update Environment Variables

Add to backend on Render:

```
SUPABASE_URL=<your-url>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
```

#### Step 3: Migrate Existing Images

You need to:
1. Download current images from Render (if any exist)
2. Upload them to Supabase Storage manually, OR
3. Re-upload products from your local backup

#### Step 4: Update Backend Upload Code (Optional - for future)

Modify `routes/upload.js` to upload directly to Supabase Storage instead of local filesystem.

**For now:** After each deployment, you'll need to re-upload product images through the admin panel until Step 4 is implemented.

---

## ⚠️ TO INVESTIGATE: 500 Error on /api/visitors/duration

### Quick Fix

The error might be from a missing session. Add better error handling:

Edit `counterfit-backend/routes/visitors.js` around line 132:

```javascript
router.put('/duration', async (req, res) => {
  try {
    const { sessionId, duration } = req.body

    if (!sessionId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and duration are required'
      })
    }

    // Updated: Don't require .single() which errors if no record found
    const { data: visitors, error } = await supabase
      .from('visitors')
      .update({
        visitduration: duration,
        updatedat: new Date().toISOString()
      })
      .eq('sessionid', sessionId)
      .select()

    if (error) {
      console.error('Error updating duration:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to update visit duration',
        error: error.message  // Add error message for debugging
      })
    }

    // Return success even if no rows updated (session may have expired)
    res.json({
      success: true,
      data: visitors?.[0] || null,
      updated: visitors?.length > 0
    })
  } catch (error) {
    console.error('Duration update error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update visit duration',
      error: error.message
    })
  }
})
```

---

## Deployment Checklist

### Backend Deployment

```bash
cd counterfit-app/counterfit-backend

# 1. Verify changes
git status

# 2. Commit fixes
git add server.js routes/visitors.js
git commit -m "Fix: CORS, auth debug, and visitor duration error handling"

# 3. Push to trigger Render deployment
git push origin main

# 4. Monitor Render logs
# Watch for:
# - ✅ Server starting
# - ✅ JWT_SECRET exists
# - ✅ Supabase connected
# - ❌ Any errors
```

### Frontend Verification

After backend deploys:

1. Clear browser cache
2. Login to admin panel
3. Check:
   - [ ] Images load
   - [ ] Can view orders
   - [ ] Can update products  
   - [ ] No 401 errors in console
   - [ ] No CORS errors

---

## If Issues Persist

### Still getting 401 errors?

1. Check Render logs for "Token verification failed"
2. Compare JWT_SECRET lengths (backend vs what's generating tokens)
3. Try logging out and back in
4. Check token expiration (default 30 days)

### Images still not loading?

1. Check browser console for exact error
2. Test image URL directly: `https://counterfit-backend.onrender.com/uploads/images/your-image.jpg`
3. Check response headers for CORS headers
4. Verify Helmet configuration was deployed

### Still getting 500 errors?

1. Check Render logs for the exact error
2. Test the problematic endpoint with curl
3. Check Supabase query logs
4. Add more console.log statements

---

## Long-term Improvements

1. **Image Storage**: Implement Supabase Storage properly
2. **Token Refresh**: Add refresh token logic
3. **Error Monitoring**: Set up Sentry or similar
4. **CI/CD**: Automate deployment testing
5. **Backup**: Regular database backups
6. **CDN**: Use Cloudflare or similar for image caching

---

## Need Help?

Check logs in this order:
1. Browser Console (F12) - Frontend errors
2. Render Logs - Backend errors
3. Supabase Logs - Database errors

Common commands:
```bash
# View Render logs
# Go to Render Dashboard -> Your Service -> Logs

# Test endpoint
curl -v https://counterfit-backend.onrender.com/api/debug/auth

# Check if images are accessible
curl -I https://counterfit-backend.onrender.com/uploads/images/test.jpg
```

