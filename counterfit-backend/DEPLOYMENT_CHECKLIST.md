# 🚀 Supabase Migration Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Database Setup
- [ ] Run `supabase-schema.sql` in your Supabase SQL editor
- [ ] Verify all tables are created successfully
- [ ] Check that indexes and triggers are in place

### 2. Environment Variables
- [ ] Update Render environment variables:
  - [ ] `SUPABASE_URL` (your project URL)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (service role key)
  - [ ] `SUPABASE_ANON_KEY` (anon key)
  - [ ] `NODE_ENV=production`
- [ ] Remove old `DATABASE_URL` if present

### 3. Code Updates
- [ ] All routes updated to use Supabase
- [ ] Prisma dependencies removed from routes
- [ ] Error handling consistent across all endpoints
- [ ] Authentication middleware working correctly

## 🚀 Deployment Steps

### 1. Render Deployment
- [ ] Push code changes to your repository
- [ ] Render automatically detects changes and redeploys
- [ ] Monitor deployment logs for any errors

### 2. Database Initialization
- [ ] Run the setup script: `node scripts/setup-supabase.js`
- [ ] Verify sample data is created
- [ ] Check admin user creation

### 3. Connection Testing
- [ ] Check server logs for "✅ Supabase connected successfully"
- [ ] Test a simple endpoint (e.g., `/api/collections`)
- [ ] Verify authentication endpoints work

## 🧪 Post-Deployment Testing

### 1. Public Endpoints
- [ ] `GET /api/collections` - Returns collections
- [ ] `GET /api/collections/featured` - Returns featured collections
- [ ] `GET /api/collections/:slug` - Returns single collection

### 2. Protected Endpoints (with valid JWT)
- [ ] `GET /api/users/profile` - Returns user profile
- [ ] `GET /api/orders/my` - Returns user orders
- [ ] `POST /api/users/wishlist/:productId` - Updates wishlist

### 3. Admin Endpoints (with admin JWT)
- [ ] `GET /api/users` - Returns all users
- [ ] `GET /api/orders` - Returns all orders
- [ ] `PUT /api/collections/:id` - Updates collection

## 🔍 Monitoring & Debugging

### 1. Server Logs
- [ ] Check for Supabase connection success
- [ ] Monitor API request logs
- [ ] Watch for any error messages

### 2. Database Monitoring
- [ ] Verify tables exist in Supabase dashboard
- [ ] Check Row Level Security (RLS) settings
- [ ] Monitor query performance

### 3. API Response Testing
- [ ] Test with Postman or similar tool
- [ ] Verify response format consistency
- [ ] Check error handling for invalid requests

## 🚨 Common Issues & Solutions

### 1. Connection Errors
**Issue**: "Supabase connection failed"
**Solution**: 
- Verify environment variables in Render
- Check Supabase project status
- Ensure service role key is correct

### 2. Table Not Found Errors
**Issue**: "relation does not exist"
**Solution**:
- Run the schema SQL in Supabase
- Check table names match exactly (case-sensitive)
- Verify schema is in the correct database

### 3. Authentication Issues
**Issue**: "JWT token invalid"
**Solution**:
- Check JWT_SECRET is set correctly
- Verify token format in requests
- Test with a fresh login

### 4. Permission Errors
**Issue**: "insufficient privileges"
**Solution**:
- Check user role in database
- Verify adminOnly middleware
- Ensure proper JWT payload

## 📊 Performance Monitoring

### 1. Response Times
- [ ] Monitor API response times
- [ ] Check for slow queries
- [ ] Optimize if needed

### 2. Database Performance
- [ ] Monitor Supabase dashboard metrics
- [ ] Check query execution plans
- [ ] Optimize indexes if needed

### 3. Error Rates
- [ ] Track 4xx and 5xx error rates
- [ ] Monitor failed authentication attempts
- [ ] Log and analyze errors

## 🔒 Security Checklist

### 1. Environment Variables
- [ ] All sensitive keys are in Render environment
- [ ] No hardcoded credentials in code
- [ ] Service role key has minimal required permissions

### 2. API Security
- [ ] Authentication required for protected routes
- [ ] Role-based access control working
- [ ] Input validation in place

### 3. Database Security
- [ ] RLS policies configured (if needed)
- [ ] No direct database access from frontend
- [ ] Proper user permissions

## 📈 Scaling Considerations

### 1. Supabase Limits
- [ ] Monitor database size
- [ ] Check API rate limits
- [ ] Plan for growth

### 2. Performance Optimization
- [ ] Implement caching if needed
- [ ] Optimize database queries
- [ ] Consider CDN for static assets

## 📞 Support Resources

### 1. Documentation
- [ ] API documentation updated
- [ ] Setup instructions clear
- [ ] Troubleshooting guide available

### 2. Monitoring Tools
- [ ] Render logs accessible
- [ ] Supabase dashboard monitoring
- [ ] Error tracking implemented

### 3. Contact Information
- [ ] Development team contact
- [ ] Supabase support access
- [ ] Render support access

## 🎯 Success Criteria

### 1. Functional Requirements
- [ ] All API endpoints respond correctly
- [ ] Authentication works for all user types
- [ ] Database operations complete successfully
- [ ] Error handling provides useful feedback

### 2. Performance Requirements
- [ ] API response times under 500ms
- [ ] Database queries execute efficiently
- [ ] No memory leaks or crashes

### 3. Security Requirements
- [ ] No unauthorized access to protected endpoints
- [ ] User data properly isolated
- [ ] No sensitive information exposed

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: ⏳ Pending / ✅ Complete / ❌ Failed

**Notes**: 
_________________________________
_________________________________
_________________________________
