# 🚀 Counterfit Integration Setup Guide

## 🎯 Overview

This guide will help you set up the complete CMS, authentication, and payment systems for your Counterfit website.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Stripe account for payments
- Google OAuth app (optional)
- Email service (Gmail/SendGrid)

## 🔧 Setup Steps

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Copy from env.example and update with your values
cp env.example .env.local
```

**Required Environment Variables:**

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/counterfit_db"

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@counterfit.co.za

# Admin Configuration
ADMIN_EMAIL=admin@counterfit.co.za
```

### 2. Database Setup

#### Install and Setup PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb counterfit_db
```

**Option B: Cloud Database (Recommended)**
- **Railway**: https://railway.app/
- **Supabase**: https://supabase.com/
- **PlanetScale**: https://planetscale.com/

#### Initialize Prisma

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 3. Stripe Payment Setup

#### Create Stripe Account
1. Go to https://stripe.com/
2. Create an account
3. Get your API keys from Dashboard → Developers → API keys

#### Configure Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

#### Test Payment Integration
```bash
# Install Stripe CLI for testing
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Authentication Setup

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

#### Create Admin User
```bash
# Run the development server
npm run dev

# Navigate to /auth/signup
# Create your admin account
# Update user role in database:
```

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin-email@example.com';
```

### 5. Email Configuration

#### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use the app password in `EMAIL_SERVER_PASSWORD`

#### SendGrid Setup (Alternative)
```bash
npm install @sendgrid/mail
```

Update email configuration in your API routes to use SendGrid.

### 6. File Upload (Optional)

#### Cloudinary Setup
1. Create account at https://cloudinary.com/
2. Get cloud name, API key, and secret
3. Add to environment variables

```bash
npm install cloudinary
```

### 7. Production Deployment

#### Database Migration
```bash
# Production database setup
npx prisma migrate deploy
```

#### Environment Variables
Set all environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Project → Variables

#### Domain Configuration
Update `NEXTAUTH_URL` to your production domain.

## 🧪 Testing the Integration

### 1. Authentication Test
- Sign up: http://localhost:3000/auth/signup
- Sign in: http://localhost:3000/auth/signin
- Admin access: http://localhost:3000/admin

### 2. Payment Test
1. Add products to cart
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify order creation

### 3. Admin Panel Test
1. Sign in as admin
2. Access admin dashboard
3. Test product management
4. View orders and users

## 🔐 Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` in production
- [ ] Database credentials secured
- [ ] Stripe webhook secret configured
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled

## 📊 Analytics & Monitoring

### Google Analytics (Optional)
```bash
npm install @next/third-parties
```

### Error Monitoring
```bash
npm install @sentry/nextjs
```

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] All environment variables set
- [ ] Database migrated
- [ ] Stripe live keys configured
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Admin account created
- [ ] Test transactions completed
- [ ] Email notifications working

### Post-Launch
- [ ] Monitor error logs
- [ ] Check payment webhooks
- [ ] Verify email delivery
- [ ] Test user registration
- [ ] Monitor site performance

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check database URL format
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

**Stripe Webhook Issues**
- Verify webhook URL is accessible
- Check webhook secret matches
- Ensure HTTPS in production

**Authentication Problems**
- Verify `NEXTAUTH_SECRET` is set
- Check callback URLs in OAuth providers
- Ensure session cookies are working

**Email Not Sending**
- Verify SMTP credentials
- Check firewall/security settings
- Test with a simple email client

### Debug Commands
```bash
# Check database connection
npx prisma db pull

# View database schema
npx prisma studio

# Check Stripe webhooks
stripe listen --print-json

# View application logs
npm run dev
```

## 📞 Support

If you encounter issues:

1. Check the error logs in your terminal
2. Verify environment variables are set correctly
3. Test each integration individually
4. Check the official documentation:
   - [NextAuth.js](https://next-auth.js.org/)
   - [Prisma](https://www.prisma.io/docs)
   - [Stripe](https://stripe.com/docs)

## 🎉 Congratulations!

Your Counterfit website is now fully integrated with:
- ✅ User authentication & authorization
- ✅ Database with Prisma ORM
- ✅ Stripe payment processing
- ✅ Admin dashboard for content management
- ✅ Email notifications
- ✅ Production-ready security

Your luxury streetwear brand is ready to launch! 🚀
