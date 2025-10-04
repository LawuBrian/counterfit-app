# Debug Production 401 Errors

## Current Errors
```
PUT /api/admin/products/[id] 401 (Unauthorized)
GET /api/admin/orders 401 (Unauthorized)
```

## Immediate Steps to Debug

### Step 1: Check if Session Has AccessToken

Open browser console on https://www.counterfit.co.za and run:

```javascript
// Check if you're logged in and have a token
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => {
    console.log('=== SESSION DEBUG ===');
    console.log('User:', data?.user?.email);
    console.log('Role:', data?.user?.role);
    console.log('Has accessToken:', !!data?.user?.accessToken);
    console.log('Token preview:', data?.user?.accessToken?.substring(0, 30) + '...');
    
    // Store for next step
    window.DEBUG_TOKEN = data?.user?.accessToken;
    window.DEBUG_SESSION = data;
    
    return data;
  });
```

**Expected Result:**
- `Has accessToken: true`
- `Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6...`

**If `Has accessToken: false`:**
- The backend login isn't returning the token properly
- You need to logout and login again

---

### Step 2: Test Token Directly

If you have a token, test it against the backend:

```javascript
// Use token from Step 1
const token = window.DEBUG_TOKEN;

fetch('https://counterfit-backend.onrender.com/api/debug/auth', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(r => r.json())
  .then(data => {
    console.log('=== BACKEND AUTH DEBUG ===');
    console.log(data);
  });
```

**Expected Result:**
```json
{
  "hasAuthHeader": true,
  "hasToken": true,
  "jwtSecretSet": true,
  "jwtSecretLength": 32,
  "environment": "production"
}
```

**If `jwtSecretSet: false` or `jwtSecretLength` is wrong:**
- JWT_SECRET is not set on Render
- Go to Render → Environment → Add JWT_SECRET

---

### Step 3: Test Admin Orders Endpoint

```javascript
// Test the actual failing endpoint
const token = window.DEBUG_TOKEN;

fetch('https://counterfit-backend.onrender.com/api/admin/orders?limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('=== ORDERS TEST ===');
    console.log(data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

**If still 401:**
- Token is invalid or expired
- JWT_SECRET mismatch
- Check Render logs for "Token verification failed"

---

## Quick Fixes

### Fix 1: Logout and Login Again

Sometimes the session has an old/expired token:

1. Go to https://www.counterfit.co.za/admin
2. Logout
3. Clear cookies (F12 → Application → Cookies → Clear all)
4. Login again
5. Test again

### Fix 2: Check Render Environment Variables

1. Go to https://dashboard.render.com
2. Select `counterfit-backend` service
3. Click "Environment" tab
4. Verify these exist:

```
JWT_SECRET=<32+ character string>
JWT_EXPIRE=30d
NODE_ENV=production
```

**IMPORTANT:** JWT_SECRET must be the SAME value that was used when you first created admin users. If you changed it, existing tokens won't work.

### Fix 3: Generate New JWT_SECRET (Last Resort)

If JWT_SECRET is missing or wrong:

```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and add to Render environment
```

⚠️ **WARNING:** This will invalidate all existing tokens. All users must login again.

---

## Detailed Debugging

### Check Backend Logs

1. Go to Render Dashboard → counterfit-backend
2. Click "Logs"
3. Look for these messages when you try to update a product or view orders:

```
🔐 Token received: eyJhbGci...
🔍 Verifying token with JWT_SECRET: SET
❌ Token verification failed: invalid signature
```

**If you see "invalid signature":**
- JWT_SECRET mismatch
- Token was created with different secret

**If you see "NOT SET":**
- JWT_SECRET is missing from environment

**If you see "jwt expired":**
- Token is too old (default 30 days)
- User needs to login again

---

## Root Cause Analysis

The frontend calls:
1. Browser → `PUT /api/admin/products/[id]` (Next.js API route on frontend)
2. Next.js API → Gets session and extracts `accessToken`
3. Next.js API → `POST https://counterfit-backend.onrender.com/api/admin/products/[id]` with `Authorization: Bearer ${accessToken}`
4. Backend → Verifies token with JWT_SECRET
5. **🔴 Backend returns 401 if:**
   - No token in Authorization header
   - Token is expired
   - JWT_SECRET doesn't match
   - User doesn't exist in database

---

## Resolution Checklist

- [ ] Session has accessToken (Step 1)
- [ ] Backend has JWT_SECRET set (Step 2)
- [ ] JWT_SECRET length is 32+ characters
- [ ] Token successfully validates against backend
- [ ] Backend logs show successful auth
- [ ] Can view orders without 401
- [ ] Can update products without 401

---

## If All Else Fails

1. **Reset Everything:**
   ```bash
   # On your local machine
   cd counterfit-app/counterfit-backend
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copy this value
   ```

2. **Update Render:**
   - Dashboard → counterfit-backend → Environment
   - Set JWT_SECRET to the new value
   - Save changes (this will redeploy)

3. **Clear Session:**
   - Go to https://www.counterfit.co.za
   - Logout
   - Clear all cookies
   - Close browser
   - Open fresh browser
   - Login again

4. **Test:**
   ```javascript
   // Should now work
   fetch('/api/auth/session').then(r => r.json()).then(console.log)
   ```

---

## Common Issues

### Issue: "Has accessToken: false"

**Solution:** Backend isn't returning token during login.

Check `counterfit-backend/routes/auth.js` login route:
- Should return `accessToken` in response
- Check Render logs during login

### Issue: "jwtSecretSet: false"

**Solution:** Add JWT_SECRET to Render environment.

### Issue: "invalid signature"

**Solution:** JWT_SECRET on backend doesn't match the one used to create the token.
- All users must login again with new token

### Issue: Token looks correct but still 401

**Solution:** 
- Token might be expired (check JWT_EXPIRE)
- User might be deleted from database
- Check backend logs for exact error

---

## Support Commands

```bash
# Test backend auth endpoint
curl https://counterfit-backend.onrender.com/api/debug/auth

# Test with your token (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://counterfit-backend.onrender.com/api/admin/orders

# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run these and share the output if you need help.

