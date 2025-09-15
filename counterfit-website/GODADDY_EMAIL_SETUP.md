# 🌐 GoDaddy Email Authentication Setup Guide

## 📋 **Step-by-Step GoDaddy DNS Setup**

### **Step 1: Access GoDaddy DNS Management**

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in to your account

2. **Navigate to DNS Settings**
   - Click "My Products" 
   - Find your domain `counterfit.co.za`
   - Click "DNS" button next to it
   - OR go to "Manage DNS" if you see that option

### **Step 2: Add SPF Record**

1. **Click "Add Record"**
2. **Select Record Type**: `TXT`
3. **Fill in the details**:
   ```
   Name: @ 
   Value: v=spf1 include:sendgrid.net ~all
   TTL: 1 Hour (default)
   ```
4. **Click "Save"**

### **Step 3: Add DMARC Record**

1. **Click "Add Record"** again
2. **Select Record Type**: `TXT`
3. **Fill in the details**:
   ```
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@counterfit.co.za
   TTL: 1 Hour (default)
   ```
4. **Click "Save"**

### **Step 4: SendGrid Domain Authentication**

1. **Go to SendGrid Dashboard**
   - Login to [sendgrid.com](https://sendgrid.com)
   - Go to Settings → Sender Authentication
   - Click "Authenticate Your Domain"

2. **Enter Your Domain**
   - Domain: `counterfit.co.za`
   - Click "Next"

3. **SendGrid will show you CNAME records like this**:
   ```
   Name: s1._domainkey.counterfit.co.za
   Value: s1.domainkey.u1234567.wl.sendgrid.net
   
   Name: s2._domainkey.counterfit.co.za  
   Value: s2.domainkey.u1234567.wl.sendgrid.net
   ```

4. **Add these CNAME records in GoDaddy**:
   - Click "Add Record" in GoDaddy
   - Select "CNAME"
   - For the first record:
     ```
     Name: s1._domainkey
     Value: s1.domainkey.u1234567.wl.sendgrid.net
     ```
   - Click "Save"
   - Repeat for the second record:
     ```
     Name: s2._domainkey
     Value: s2.domainkey.u1234567.wl.sendgrid.net
     ```

### **Step 5: Create Email Addresses**

**Option A: Use GoDaddy Email (Recommended)**
1. In GoDaddy, go to "Email & Office"
2. Set up these email addresses:
   - `orders@counterfit.co.za`
   - `hello@counterfit.co.za` 
   - `unsubscribe@counterfit.co.za`
   - `dmarc@counterfit.co.za`

**Option B: Use Email Forwarding (Free)**
1. In GoDaddy DNS, click "Add Record"
2. Select "Forward" or add MX records
3. Forward emails to your existing email

## 🖥️ **Visual GoDaddy Interface Guide**

### **What You'll See in GoDaddy DNS:**

```
┌─────────────────────────────────────────┐
│  DNS Management - counterfit.co.za      │
├─────────────────────────────────────────┤
│  Type │ Name      │ Value               │
├─────────────────────────────────────────┤
│  A    │ @         │ 192.168.1.1         │
│  TXT  │ @         │ v=spf1 include:...  │ ← ADD THIS
│  TXT  │ _dmarc    │ v=DMARC1; p=quar... │ ← ADD THIS  
│  CNAME│ s1._dom...│ s1.domainkey.u12... │ ← ADD THIS
│  CNAME│ s2._dom...│ s2.domainkey.u12... │ ← ADD THIS
└─────────────────────────────────────────┘
```

## ✅ **Verification Steps**

### **1. Check DNS Propagation (Wait 2-24 hours)**
```bash
# Check SPF
nslookup -type=TXT counterfit.co.za

# Check DMARC
nslookup -type=TXT _dmarc.counterfit.co.za
```

### **2. Verify in SendGrid**
- Go back to SendGrid Domain Authentication
- Click "Verify" next to your domain
- Should show green checkmarks ✅

### **3. Test Email Delivery**
- Send a test order email
- Check if it goes to inbox instead of spam

## 🚨 **Common GoDaddy Issues & Solutions**

### **Issue 1: Can't find "Add Record"**
- Look for "Manage DNS" or "DNS Management"
- Sometimes it's under "Advanced Features"

### **Issue 2: Name field doesn't accept "@"**
- Try leaving Name field blank instead of "@"
- Or use your domain name: `counterfit.co.za`

### **Issue 3: Value too long**
- GoDaddy sometimes limits TXT record length
- Try splitting long records or contact support

### **Issue 4: CNAME conflicts**
- Remove any existing CNAME records with same name
- Only one CNAME record per name allowed

## 📞 **Need Help?**

**GoDaddy Support:**
- Phone: Available in your GoDaddy account
- Chat: Available 24/7 in GoDaddy dashboard
- Help: [support.godaddy.com](https://support.godaddy.com)

**What to tell them:**
"I need to add SPF, DMARC, and DKIM records for email authentication with SendGrid"

## 🎯 **Expected Timeline**

- **DNS Changes**: 2-24 hours to propagate
- **SendGrid Verification**: Immediate after DNS propagates  
- **Email Improvement**: Immediate after verification
- **Full Reputation**: 1-2 weeks of consistent sending

## ⚠️ **Important Notes**

1. **Don't delete existing records** - only add new ones
2. **Case sensitive** - copy values exactly as shown
3. **Wait for propagation** - DNS changes take time
4. **Test thoroughly** - send emails to different providers
5. **Monitor results** - check SendGrid analytics

---

**After setup, your emails should go to inbox instead of spam! 🎉**

