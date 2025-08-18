# SendGrid Email Setup Guide

## 🚀 **Quick Setup Steps**

### 1. **Create SendGrid Account**
- Go to [sendgrid.com](https://sendgrid.com)
- Click "Start for Free"
- Sign up with your email
- Verify your email address

### 2. **Get Your API Key**
- Login to SendGrid dashboard
- Go to **Settings** → **API Keys**
- Click **"Create API Key"**
- Name: "Counterfit Website"
- Access: **"Restricted Access"** → Select only **"Mail Send"**
- Click **"Create & View"**
- Copy the API key (starts with `SG.`)

### 3. **Update Your Environment File**
Create or update your `.env.local` file:
```bash
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=SG.your_actual_api_key_here
EMAIL_FROM=helpcounterfit@gmail.com
EMAIL_FROM_NAME=Counterfit
```

### 4. **Verify Sender Email**
- In SendGrid dashboard, go to **Settings** → **Sender Authentication**
- Click **"Verify a Single Sender"**
- Add `helpcounterfit@gmail.com` as your sender email
- Check your Gmail for verification email
- Click the verification link

## ✅ **Benefits of SendGrid**
- ✅ 100 free emails/day
- ✅ No complex Gmail security setup
- ✅ Better deliverability
- ✅ Professional dashboard
- ✅ Easy to scale

## 🧪 **Test Your Setup**
1. Restart your development server
2. Go to `/contact` page
3. Submit the contact form
4. Check your Gmail inbox for the email

## 🚨 **Important Notes**
- Replace `SG.your_actual_api_key_here` with your real API key
- The sender email must be verified in SendGrid
- Free tier: 100 emails/day, then $14.95/month for 50k emails

## 🔧 **Troubleshooting**
- **API Key Error**: Make sure you copied the full API key
- **Sender Not Verified**: Check your Gmail for verification email
- **Rate Limit**: Free tier allows 100 emails/day

## 📧 **Ready for Production**
Once tested locally, this will work exactly the same on Render!
