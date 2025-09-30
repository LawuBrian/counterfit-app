# 🚀 Local Testing Guide for Counterfit

## ✅ Quick Start Commands

### **Start Frontend (Website)**
```powershell
cd counterfit-website
& "C:\Program Files\nodejs\npm.cmd" run dev
```
**Access at**: http://localhost:3000

### **Start Backend (API)**
```powershell
cd counterfit-backend  
& "C:\Program Files\nodejs\npm.cmd" start
```
**Access at**: http://localhost:5000

## 🧪 **Testing Your Payment Flow Locally**

### **1. Test Order Creation**
- Go to: http://localhost:3000
- Browse products and add to cart
- Go through checkout process
- **Note**: Use Yoco test cards for local testing

### **2. Test Admin Panel**
- Go to: http://localhost:3000/admin
- Login with: `admin@counterfit.co.za`
- Check orders, update statuses
- Test payment status changes

### **3. Test Yoco Integration**
Use these test card numbers:
```
✅ Success: 4000 0000 0000 0002
❌ Decline: 4000 0000 0000 0069
🔄 3D Secure: 4000 0000 0000 3220
```

## 🔧 **Environment Setup for Local Testing**

### **Frontend (.env.local)**
```env
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
YOCO_SECRET_KEY=sk_test_bb2272947mZK5ek9bb34e6fb1fd8
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_2a385890AlKNgRLc7a14
YOCO_WEBHOOK_URL=http://localhost:3000/api/webhooks/yoco
```

### **Backend Environment**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=counterfit-super-secret-jwt-key-2025
```

## 🐛 **Testing Webhook Locally**

### **Option 1: Use ngrok (Recommended)**
1. Install ngrok: https://ngrok.com/
2. Run: `ngrok http 3000`
3. Update webhook URL to ngrok URL
4. Test real payments with webhook

### **Option 2: Manual Testing**
1. Create test orders locally
2. Manually update payment status in admin
3. Test order workflow without webhooks

## 📋 **Local Testing Checklist**

### **Frontend Tests:**
- [ ] Homepage loads correctly
- [ ] Product pages display
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Admin panel accessible
- [ ] Order management works

### **Backend Tests:**
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Authentication functions
- [ ] Order creation/updates
- [ ] User management

### **Payment Tests:**
- [ ] Yoco checkout loads
- [ ] Test payments process
- [ ] Webhook receives notifications
- [ ] Order status updates automatically
- [ ] Admin can override statuses

## 🚨 **Common Issues & Fixes**

### **Port Already in Use**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### **Database Connection Issues**
- Check Supabase credentials in .env
- Verify internet connection
- Test database queries manually

### **Yoco Webhook Issues**
- Use ngrok for local webhook testing
- Check webhook secret matches
- Verify webhook URL is accessible

## 🎯 **Quick Test Scenarios**

### **Test 1: Complete Order Flow**
1. Add product to cart → Checkout → Pay → Check admin panel

### **Test 2: Payment Status Update**
1. Create order → Check "pending" status → Update to "paid" → Verify change

### **Test 3: Webhook Simulation**
1. Create order → Manually call webhook endpoint → Check status update

## 📞 **Need Help?**

If you encounter issues:
1. Check browser console for errors
2. Check terminal output for server errors
3. Verify environment variables are set
4. Test individual API endpoints

---

**🎉 Your local development environment is now ready for testing!**
