# 🚨 CRITICAL: Production Environment Variables Setup

## ⚠️ **IMMEDIATE ACTION REQUIRED**

Your production environment is missing critical environment variables that are causing the 500 errors for:
- Email sending (order confirmations)
- Yoco checkout creation
- Fastway shipping integration

## 🔧 **Missing Environment Variables**

### 1. **Email Configuration (REQUIRED)**
```env
# SendGrid Configuration (Recommended)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=SG.your_sendgrid_api_key_here
EMAIL_FROM=helpcounterfit@gmail.com
EMAIL_FROM_NAME=Counterfit

# OR SMTP Configuration
# EMAIL_SERVICE=smtp
# EMAIL_SMTP_HOST=smtp.gmail.com
# EMAIL_SMTP_PORT=587
# EMAIL_SMTP_USER=helpcounterfit@gmail.com
# EMAIL_SMTP_PASS=your_app_password_here
```

### 2. **Yoco Payment Configuration (REQUIRED)**
```env
# Get these from your Yoco dashboard: https://dashboard.yoco.com/
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_your_public_key_here
YOCO_SECRET_KEY=sk_test_your_secret_key_here
YOCO_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. **Fastway Shipping Configuration (REQUIRED)**
```env
# Get these from your Fastway account
FASTWAY_API_KEY=716180395a51ca35608ca88bee56492e
FASTWAY_BASE_URL=https://api.fastway.co.za
FASTWAY_ENVIRONMENT=test
```

### 4. **NextAuth Configuration (REQUIRED)**
```env
NEXTAUTH_URL=https://www.counterfit.co.za
NEXTAUTH_SECRET=your-super-secure-production-secret-minimum-32-characters-here
```

### 5. **Backend Configuration (REQUIRED)**
```env
NEXT_PUBLIC_BACKEND_URL=https://counterfit-backend.onrender.com
BACKEND_API_KEY=your_backend_api_key_here
```

## 🚀 **Quick Setup Steps**

### Step 1: Create Production Environment File
```bash
cd counterfit-website
touch .env.production
```

### Step 2: Add Missing Variables
Copy the variables above into your `.env.production` file.

### Step 3: Get SendGrid API Key
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account or login
3. Go to Settings → API Keys
4. Create new API key with "Mail Send" permission
5. Copy the key (starts with `SG.`)

### Step 4: Get Yoco Keys
1. Go to [Yoco Dashboard](https://dashboard.yoco.com/)
2. Navigate to Settings → API Keys
3. Copy your public and secret keys
4. Set up webhook endpoint: `https://www.counterfit.co.za/api/webhooks/yoco`

### Step 5: Configure Fastway
1. **API Key**: You already have this: `716180395a51ca35608ca88bee56492e`
2. **Base URL**: Use `https://api.fastway.co.za` for production
3. **Environment**: Set to `live` for production, `test` for development

### Step 6: Generate NextAuth Secret
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 7: Deploy to Production
1. Add these environment variables to your hosting platform (Vercel/Netlify)
2. Redeploy your application

## 🔍 **Why This Happens**

The 500 errors occur because:

1. **Email API**: Missing `EMAIL_API_KEY` causes SendGrid to fail
2. **Yoco API**: Missing `YOCO_SECRET_KEY` causes payment creation to fail
3. **Fastway API**: Missing `FASTWAY_API_KEY` causes shipping rates to fail
4. **NextAuth**: Missing `NEXTAUTH_SECRET` can cause authentication issues

## ✅ **Test After Setup**

1. **Test Email**: Submit contact form to verify email sending
2. **Test Checkout**: Try creating an order to verify Yoco integration
3. **Test Shipping**: Enter postal code to verify Fastway rates
4. **Check Logs**: Monitor your hosting platform logs for errors

## 🆘 **Emergency Fix**

If you need to temporarily disable these features while setting up:

```typescript
// In your checkout page, comment out email sending temporarily
// await fetch('/api/email/send', { ... })

// In your Yoco creation, add error handling
try {
  const checkout = await createYocoCheckout(data)
} catch (error) {
  console.error('Yoco temporarily unavailable:', error)
  // Show user-friendly message
}
```

## 📞 **Support**

- **SendGrid**: Check their [API documentation](https://sendgrid.com/docs/API_Reference/)
- **Yoco**: Contact their [support team](https://support.yoco.com/)
- **Fastway**: Contact their [support team](https://www.fastway.co.za/contact-us)
- **NextAuth**: Check their [deployment guide](https://next-auth.js.org/deployment)

---

**⚠️ IMPORTANT**: These environment variables are REQUIRED for your production site to function properly. Without them, customers cannot complete orders, receive confirmation emails, or get accurate shipping rates.
