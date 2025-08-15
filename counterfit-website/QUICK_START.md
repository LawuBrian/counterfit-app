# 🚀 Quick Start Guide

## ⚡ Get Your Counterfit Website Running in 5 Minutes

### 1. Environment Setup (2 minutes)

```bash
# Copy the environment template
cp env.example .env.local
```

**Edit `.env.local` with your details:**
```env
# Database (use a simple local SQLite for testing)
DATABASE_URL="file:./dev.db"

# NextAuth (required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Stripe (for payments - get from https://stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key

# Admin Email
ADMIN_EMAIL=admin@counterfit.co.za
```

### 2. Database Setup (1 minute)

```bash
# Generate Prisma client and setup database
npm run db:generate
npm run db:push

# Setup sample data and admin user
npm run db:setup
```

### 3. Start Development Server (1 minute)

```bash
# Start the website
npm run dev
```

🎉 **Your website is now running at:** http://localhost:3000

### 4. Test Everything (1 minute)

#### 🛍️ Customer Experience:
1. **Browse Products**: http://localhost:3000
2. **Add to Cart**: Click any product → Add to Cart
3. **View Cart**: http://localhost:3000/cart
4. **Sign Up**: http://localhost:3000/auth/signup

#### 👑 Admin Experience:
1. **Admin Login**: http://localhost:3000/auth/signin
   - Email: `admin@counterfit.co.za`
   - Password: `admin123`
2. **Admin Dashboard**: http://localhost:3000/admin
3. **Manage Products**: Add, edit, delete products
4. **View Orders**: Monitor customer orders

## 🎯 What You Have Now

### ✅ **Fully Functional Features:**
- **Product Browsing**: Homepage, shop, collections
- **Shopping Cart**: Add/remove items, quantities
- **User Authentication**: Sign up, sign in, accounts
- **Admin Dashboard**: Complete CMS for products/orders
- **Payment Ready**: Stripe integration (test mode)
- **Mobile Responsive**: Perfect on all devices

### ✅ **Sample Data Included:**
- 5 sample products with real images
- 3 product categories (Outerwear, Tops, Accessories)
- 2 featured collections (Platform Series, Dynamic Motion)
- Admin user account ready to use

## 🔧 Common Issues & Solutions

### Database Connection Error
```bash
# Delete the database and recreate
rm prisma/dev.db
npm run db:push
npm run db:setup
```

### Missing Environment Variables
- Make sure `.env.local` exists and has the required variables
- Restart the dev server after adding variables

### Stripe Payments Not Working
- Use Stripe test keys for development
- Test card: `4242 4242 4242 4242`
- For production, switch to live keys

## 🚀 Ready for Production?

### Quick Production Checklist:
- [ ] Set up production database (PostgreSQL)
- [ ] Configure Stripe live keys
- [ ] Set up email service (Gmail SMTP/SendGrid)
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Test complete user journey

## 📚 Need More Help?

- **Full Setup Guide**: `INTEGRATION_SETUP.md`
- **System Overview**: `SYSTEM_OVERVIEW.md`
- **Database Management**: `npm run db:studio`

## 🎉 Congratulations!

Your **Counterfit luxury streetwear website** is now:
- ✅ Fully functional e-commerce platform
- ✅ Professional admin dashboard
- ✅ Secure user authentication
- ✅ Payment processing ready
- ✅ Mobile responsive design
- ✅ Production ready architecture

**Time to launch your streetwear empire!** 👑🚀
