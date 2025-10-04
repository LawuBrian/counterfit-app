# Production Issues & Fixes

## Issues Identified

### 1. ❌ CORS Errors - Images Not Loading
**Error:** `Failed to load resource: net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin`

**Cause:** Helmet's default security settings blocking cross-origin image requests

**Fix Applied:** ✅ Modified `server.js` to configure Helmet properly

### 2. ❌ 401 Unauthorized Errors
**Error:** API endpoints returning 401 (orders, wishlist, etc.)

**Causes:**
- Missing or expired JWT tokens
- JWT_SECRET mismatch between environments
- Session not persisting accessToken

**Fixes Needed:** See below

### 3. ❌ Images Disappearing After Deployment
**Cause:** Render uses ephemeral filesystem - uploaded files don't persist across deploys

**Solution:** Use cloud storage (S3, Cloudinary, Supabase Storage)

---

## Immediate Fixes Required

### 1. Check Environment Variables on Render

**Backend (counterfit-backend):**
```bash
# Verify these are set on Render:
JWT_SECRET=<your-secret-32-chars-or-more>
JWT_EXPIRE=30d
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
SUPABASE_ANON_KEY=<your-key>
NODE_ENV=production
```

**Frontend (counterfit-website):**
```bash
# Verify these are set on Netlify/Vercel:
NEXT_PUBLIC_BACKEND_URL=https://counterfit-backend.onrender.com
NEXTAUTH_URL=https://www.counterfit.co.za
NEXTAUTH_SECRET=<your-nextauth-secret>
NEXT_PUBLIC_YOCO_PUBLIC_KEY=<your-yoco-key>
```

### 2. Deploy Backend Changes

The Helmet configuration has been updated. Deploy to Render:

```bash
cd counterfit-app/counterfit-backend
git add server.js
git commit -m "Fix CORS headers for images and API requests"
git push
```

### 3. Fix Image Storage Issue

**Option A: Use Supabase Storage (Recommended)**

1. Enable Supabase Storage in your project
2. Update backend upload route to save to Supabase instead of local filesystem
3. Images will persist across deployments

**Option B: Use Cloudinary**

1. Sign up for Cloudinary free tier
2. Update upload routes to use Cloudinary SDK
3. Images stored in cloud

### 4. Debug 401 Errors

Add this debug endpoint to backend to check auth:

```javascript
// Add to counterfit-backend/server.js
app.get('/api/debug/auth', (req, res) => {
  const authHeader = req.headers.authorization;
  const hasToken = authHeader && authHeader.startsWith('Bearer');
  
  res.json({
    hasAuthHeader: !!authHeader,
    hasToken,
    jwtSecretSet: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET?.length,
    environment: process.env.NODE_ENV
  });
});
```

Then test in production:
```bash
curl https://counterfit-backend.onrender.com/api/debug/auth
```

### 5. Frontend Session Debug

Check if accessToken is in session:

1. Open browser console on production site
2. Run: `fetch('/api/auth/session').then(r => r.json()).then(console.log)`
3. Verify `user.accessToken` exists

---

## Long-term Solutions

### 1. Move to Cloud Storage

Replace local file storage with Supabase Storage:

```javascript
// Example: routes/upload.js
const { supabase } = require('../lib/supabase');

async function uploadToSupabase(file, path) {
  const { data, error } = await supabase.storage
    .from('products')
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(path);
    
  return publicUrl;
}
```

### 2. Add Token Refresh

Implement refresh token logic to prevent 401 errors from expired tokens

### 3. Add Better Error Logging

Use a service like Sentry or LogRocket to track production errors

---

## Testing Checklist

- [ ] Images load correctly on production
- [ ] Can view orders in admin panel
- [ ] Can add/remove items from wishlist
- [ ] Can update products
- [ ] No CORS errors in console
- [ ] Authentication persists across page refreshes
- [ ] New deployments don't lose images

---

## Quick Commands

**Check backend logs on Render:**
```bash
# Via Render Dashboard -> Logs
# Look for JWT_SECRET and authentication errors
```

**Test backend auth manually:**
```bash
# 1. Login to get token
curl -X POST https://counterfit-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# 2. Use token to test admin endpoint
curl https://counterfit-backend.onrender.com/api/admin/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Test CORS:**
```bash
curl -I https://counterfit-backend.onrender.com/uploads/images/your-image.jpeg
# Should see: Access-Control-Allow-Origin: *
```

