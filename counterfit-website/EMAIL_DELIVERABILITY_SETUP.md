# 📧 Email Deliverability Setup Guide

## 🚨 **Why Emails Go to Spam**

Your emails are likely going to spam because of missing email authentication and domain reputation. Here's how to fix it:

## ✅ **Step 1: Domain Authentication (CRITICAL)**

### SPF Record
Add this TXT record to your DNS (counterfit.co.za):
```
Name: @
Type: TXT
Value: v=spf1 include:sendgrid.net ~all
```

### DKIM Authentication
1. Go to SendGrid Dashboard → Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Enter: `counterfit.co.za`
4. Add the DNS records they provide (usually 2 CNAME records)

### DMARC Policy
Add this TXT record to your DNS:
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@counterfit.co.za
```

## ✅ **Step 2: Create Dedicated Email Addresses**

Create these email addresses in your domain:
- `orders@counterfit.co.za` - For transactional emails
- `hello@counterfit.co.za` - For support (reply-to)
- `unsubscribe@counterfit.co.za` - For unsubscribe requests
- `dmarc@counterfit.co.za` - For DMARC reports

## ✅ **Step 3: SendGrid Configuration**

### Add Sender Identity
1. Go to SendGrid → Settings → Sender Authentication
2. Add `orders@counterfit.co.za` as verified sender
3. Verify the email address

### Environment Variables
Update your environment variables:
```bash
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=orders@counterfit.co.za
EMAIL_FROM_NAME=Counterfit Orders
```

## ✅ **Step 4: What I've Already Fixed in Code**

✅ **Dedicated transactional email**: `orders@counterfit.co.za`
✅ **Reply-to address**: `hello@counterfit.co.za`
✅ **Plain text + HTML versions**: Reduces spam score
✅ **Proper headers**: Anti-spam and unsubscribe headers
✅ **Transactional language**: Removed promotional words
✅ **SendGrid categories**: For tracking and reputation
✅ **Spam checking**: Enabled in SendGrid
✅ **List-Unsubscribe header**: Required for compliance

## ✅ **Step 5: Test Your Setup**

### Check DNS Records
```bash
# Check SPF
nslookup -type=TXT counterfit.co.za

# Check DMARC  
nslookup -type=TXT _dmarc.counterfit.co.za
```

### Test Email Deliverability
1. Send test emails to:
   - Gmail
   - Outlook
   - Yahoo
   - Your own email
2. Check if they land in inbox vs spam

### Use Online Tools
- [MX Toolbox](https://mxtoolbox.com/spf.aspx)
- [DMARC Analyzer](https://www.dmarcanalyzer.com/)
- [Mail Tester](https://www.mail-tester.com/)

## ✅ **Step 6: Monitor & Improve**

### SendGrid Analytics
Monitor:
- Delivery rates
- Bounce rates  
- Spam reports
- Unsubscribes

### Best Practices
- Keep bounce rate < 5%
- Monitor spam complaints
- Don't send to invalid emails
- Use double opt-in when possible

## 🔧 **Quick DNS Setup Commands**

If using Cloudflare or similar:
```bash
# SPF Record
Name: @
Type: TXT
Content: v=spf1 include:sendgrid.net ~all

# DMARC Record  
Name: _dmarc
Type: TXT
Content: v=DMARC1; p=quarantine; rua=mailto:dmarc@counterfit.co.za
```

## 📈 **Expected Results**

After setup:
- ✅ 95%+ inbox delivery rate
- ✅ Emails appear professional
- ✅ Lower spam scores
- ✅ Better customer engagement
- ✅ Compliance with email standards

## ⚠️ **Important Notes**

1. **DNS changes take 24-48 hours** to propagate
2. **Domain reputation builds over time** (start with low volume)
3. **Test thoroughly** before going live
4. **Monitor delivery rates** and adjust as needed

---

**Need help?** Contact your DNS provider or hosting company to add these records.


