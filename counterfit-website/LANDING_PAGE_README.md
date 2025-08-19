# Counterfit Landing Page

## Overview
This is a new landing page focused on account signup while the full website is under development. The page captures the Counterfit brand essence of resilience and success from failure.

## Features

### 🎯 Brand Messaging
- **Core Tagline**: "Built from losses. Worn by winners."
- **Secondary Tagline**: "Grind stitched in every thread."
- **Brand Story**: Emphasizes how Counterfit is built on failure turned to success

### 📝 Signup Form
- **Required Fields**: First Name, Last Name, Email, Password, Confirm Password
- **Optional Fields**: Phone Number
- **Features**: 
  - Form validation
  - Success confirmation
  - Responsive design
  - Smooth animations
  - **NEW: Supabase integration for real-time database storage**

### 🔐 Admin Bypass
To access admin information, add `?admin` to the URL:
```
https://yourdomain.com/?admin
```

**What the admin sees:**
- Waitlist signup capabilities with Supabase integration
- Brand identity established
- Development priorities and next steps
- Current progress overview

**Admin Access Features:**
- Full navigation access (Shop, Collections, About, Contact)
- Search functionality
- Cart access
- Admin badge displayed in header
- Complete mobile navigation

### 🚫 Navigation Restrictions
**Regular Users (Non-Admin):**
- Can only access the Home page
- Navigation tabs show with lock icons (🔒)
- Clicking restricted tabs shows message: "🔒 [Section] is currently under development. Sign up for early access to be notified when it launches!"
- Search and cart are disabled
- Mobile menu focuses on signup

**Admin Users:**
- Full navigation access to Shop, Collections, About, Contact
- Search functionality enabled
- Cart functionality enabled
- Admin badge displayed in header
- Complete mobile navigation

### 🎨 Design Elements
- **Hero Section**: Large background image with brand messaging
- **Signup Section**: Two-column layout with form and benefits
- **Brand Story Section**: Comprehensive showcase of all five brand pillars
- **Brand Values**: Three pillars (Resilience, Excellence, Community)
- **Coming Soon**: Details about future website features
- **Final CTA**: Strong call-to-action to join the movement

### 📖 Brand Story Section
The "Learn Our Story" section showcases all five brand pillars with a sophisticated layout:

**1. The Hustler's Blueprint**
- Style: Fear of God / A-COLD-WALL (minimalist but raw, rooted in grind culture)
- Visuals: Neutral tones, oversized silhouettes, distressed textures
- Taglines: "Built from losses. Worn by winners." / "Grind stitched in every thread."

**2. Street Luxury Movement**
- Style: Off-White / Palm Angels (high fashion edge blended with street energy)
- Visuals: Bold graphics, statement prints, elevated cuts, striking typography
- Taglines: "Luxury born in the streets." / "Your hustle is high fashion."

**3. Rebel Energy**
- Style: Supreme / Stüssy (provocative, unapologetic, rebellious)
- Visuals: Loud colors, bold logos, disruptive slogans
- Taglines: "For the ones who don't fit in." / "Rules are for the counterfeit. We are Counterfit."

**4. Cultural Movement**
- Style: Daily Paper / Trapstar (deeply tied to community, music, and heritage)
- Visuals: African-inspired patterns, amapiano & hip-hop collabs, storytelling designs
- Taglines: "Worn by the culture. Powered by the streets." / "From our block to the world."

**5. Tech-Driven Hype**
- Style: Corteiz / Nike SNKRS (scarcity-driven, digital-first)
- Visuals: QR codes on garments, live-drop exclusives, futuristic graphics
- Taglines: "Live. Limited. Legendary." / "The streetwear you can't pause."

## 🗄️ Database Integration

### Supabase Setup
The landing page now integrates with Supabase for real-time waitlist management:

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Database Schema:**
- **Table**: `waitlist`
- **Fields**: id, email (unique), first_name, last_name, phone, created_at, updated_at
- **Features**: Automatic duplicate email prevention, timestamps, UUID primary keys

**Setup Instructions:**
1. Create a Supabase project
2. Run the SQL script in `supabase-waitlist-setup.sql`
3. Add environment variables to your deployment
4. Install dependencies: `npm install @supabase/supabase-js`

### Waitlist Features
- **Real-time Storage**: Users are immediately saved to Supabase
- **Duplicate Prevention**: Email addresses are unique, preventing spam
- **Data Validation**: Form validation before submission
- **Error Handling**: User-friendly error messages
- **Success Confirmation**: Clear feedback when signup is successful

## Usage

### For Users
1. Visit the homepage
2. Scroll to the signup section
3. Fill out the form with required information
4. Submit to create account
5. Receive confirmation message
6. **NEW**: Data is automatically saved to Supabase waitlist

**Navigation Experience:**
- Only the Home tab is clickable
- Other tabs show lock icons and are disabled
- Clicking restricted tabs encourages signup
- Mobile menu focuses on joining the movement

### For Admins
1. Add `?admin` to the URL
2. View current development status
3. See what features are implemented
4. Access development priorities
5. Full navigation access with admin badge
6. **NEW**: View waitlist integration status

## Technical Implementation

### Dependencies Added
- `@supabase/supabase-js`: Client library for Supabase integration

### Components Updated
- **SignupForm**: Now integrates with Supabase API
- **HomePage**: Admin section shows waitlist integration status

### Database Operations
- **addToWaitlist()**: Adds new users with duplicate prevention
- **getWaitlistCount()**: Retrieves total waitlist count for admin purposes

### Security Features
- Row Level Security (RLS) enabled
- Public insert policies for signup
- Configurable read policies for admin access
- Input validation and sanitization

## Next Steps
1. **Set up Supabase project** and run the database setup script
2. **Configure environment variables** in your deployment
3. **Test the signup flow** to ensure data is being saved
4. **Monitor waitlist growth** through Supabase dashboard
5. **Implement admin dashboard** for managing waitlist entries
6. **Add email notifications** when users sign up
7. **Create analytics** to track signup conversion rates

## File Structure
```
counterfit-website/
├── src/
│   ├── components/
│   │   ├── SignupForm.tsx          # Updated with Supabase integration
│   │   └── layout/
│   │       └── Header.tsx          # Navigation restrictions
│   ├── lib/
│   │   └── supabase.ts             # NEW: Supabase configuration
│   └── app/
│       └── page.tsx                # Landing page with admin bypass
├── supabase-waitlist-setup.sql     # NEW: Database setup script
├── env.local.example                # Updated with Supabase variables
└── LANDING_PAGE_README.md          # This documentation
```
