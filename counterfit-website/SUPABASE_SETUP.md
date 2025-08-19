# Supabase Integration Setup Guide

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose your organization and project name
4. Wait for the project to be created

### 2. Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** and **anon public** key
3. Add these to your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-waitlist-setup.sql`
3. Paste and run the SQL script
4. Verify the `waitlist` table was created

### 4. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 5. Test the Integration
1. Start your development server
2. Fill out the signup form
3. Check your Supabase dashboard → **Table Editor** → **waitlist**
4. You should see the new entry

## Database Schema

The `waitlist` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `email` | VARCHAR(255) | Unique email address |
| `first_name` | VARCHAR(100) | User's first name |
| `last_name` | VARCHAR(100) | User's last name |
| `phone` | VARCHAR(20) | Optional phone number |
| `created_at` | TIMESTAMP | When the entry was created |
| `updated_at` | TIMESTAMP | When the entry was last updated |

## Features

### ✅ What's Working
- Real-time user signup to Supabase
- Duplicate email prevention
- Form validation
- Error handling
- Success confirmation
- Automatic timestamps

### 🔧 What You Can Customize
- Row Level Security policies
- Email validation rules
- Phone number formatting
- Additional user fields
- Admin access controls

## Troubleshooting

### Common Issues

**"Invalid API key" error**
- Check your environment variables are correct
- Ensure you're using the `anon` key, not the `service_role` key

**"Table doesn't exist" error**
- Run the SQL setup script again
- Check the table was created in **Table Editor**

**"Permission denied" error**
- Verify RLS policies are set correctly
- Check the SQL script ran completely

**Form not submitting**
- Check browser console for errors
- Verify Supabase URL is accessible
- Check network tab for failed requests

### Testing

**Test the API directly:**
```javascript
// In browser console
const { data, error } = await supabase
  .from('waitlist')
  .select('*')
console.log(data, error)
```

**Check table contents:**
- Go to **Table Editor** → **waitlist**
- You should see entries appear in real-time

## Security Notes

- The `anon` key is safe to use in the browser
- Row Level Security (RLS) is enabled by default
- Public can insert but read access is configurable
- Consider restricting read access for production

## Next Steps

1. **Monitor signups** in the Supabase dashboard
2. **Set up email notifications** when users sign up
3. **Create admin dashboard** for managing waitlist
4. **Add analytics** to track conversion rates
5. **Implement user authentication** for the full website

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the main README for more details
