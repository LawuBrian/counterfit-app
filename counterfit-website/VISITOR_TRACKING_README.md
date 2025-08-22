# Visitor Tracking System

This document explains how to set up and use the visitor tracking system for the Counterfit website.

## Overview

The visitor tracking system provides comprehensive analytics about your website visitors, including:
- Page views and unique visitors
- Device types and browsers
- Geographic information
- Visit duration and pages per visit
- Bounce rate analysis
- Real-time visitor activity

## Features

### 🎯 **Real-time Tracking**
- Automatic page view tracking
- Session-based visitor identification
- Visit duration calculation
- Cross-page navigation tracking

### 📊 **Analytics Dashboard**
- Overview statistics (24h, 7d, 30d, 90d periods)
- Top performing pages
- Device and browser breakdown
- Geographic visitor distribution
- Recent visitor activity

### 🔒 **Privacy Compliant**
- No personal information collected
- Session-based tracking (no persistent cookies)
- Respects user privacy settings
- GDPR compliant data collection

## Setup Instructions

### 1. Backend Setup

#### Database Migration
Since the backend uses Supabase, you need to create the visitors table in your Supabase dashboard:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the SQL script** from `counterfit-backend/supabase-visitors-table.sql`

Alternatively, you can copy and paste this SQL:

```sql
-- Create visitors table for tracking website analytics
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sessionId TEXT UNIQUE NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  referrer TEXT,
  pageUrl TEXT NOT NULL,
  pageTitle TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  deviceType TEXT,
  browser TEXT,
  os TEXT,
  screenResolution TEXT,
  language TEXT,
  isReturning BOOLEAN DEFAULT false,
  visitDuration INTEGER,
  pagesViewed INTEGER DEFAULT 1,
  lastActivity TIMESTAMPTZ DEFAULT NOW(),
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_sessionId ON visitors(sessionId);
CREATE INDEX IF NOT EXISTS idx_visitors_createdAt ON visitors(createdAt);
CREATE INDEX IF NOT EXISTS idx_visitors_lastActivity ON visitors(lastActivity);
CREATE INDEX IF NOT EXISTS idx_visitors_deviceType ON visitors(deviceType);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
```

#### Verify Routes
Ensure the visitors routes are properly registered in `server.js`:

```javascript
app.use('/api/visitors', require('./routes/visitors'));
```

#### Environment Variables
Make sure your backend has the necessary environment variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Frontend Setup

#### Environment Variables
Add the backend URL to your frontend environment:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### Component Integration
The visitor tracking is automatically integrated into:
- Homepage (`/`)
- Admin dashboard (`/admin`)

## Usage

### Automatic Tracking

Once set up, visitor tracking happens automatically:

1. **Page Views**: Every page load is tracked
2. **Session Management**: Unique sessions are created for each visitor
3. **Duration Tracking**: Visit duration is calculated when users leave
4. **Cross-page Navigation**: Multiple page views within a session are tracked

### Admin Dashboard

Access visitor analytics through the admin dashboard:

1. Navigate to `/admin`
2. Scroll down to the "Visitor Analytics" section
3. Use the period selector (24h, 7d, 30d, 90d) to view different time ranges
4. View comprehensive metrics and recent visitor activity

### Manual Tracking

You can manually track visitors in any component:

```typescript
import { useVisitorTracking } from '@/lib/visitorTracking'

export default function MyPage() {
  useVisitorTracking('/my-page', 'My Page Title')
  
  return (
    <div>My page content</div>
  )
}
```

## API Endpoints

### Backend Routes

- `POST /api/visitors/track` - Track a page view
- `PUT /api/visitors/duration` - Update visit duration
- `GET /api/visitors/analytics` - Get analytics data (admin only)
- `GET /api/visitors/recent` - Get recent visitors (admin only)

### Frontend Routes

- `GET /api/admin/visitors/analytics` - Frontend proxy to backend analytics
- `GET /api/admin/visitors/recent` - Frontend proxy to backend recent visitors

## Data Collected

### Visitor Information
- **Session ID**: Unique identifier for each visit
- **Page URL**: Current page being viewed
- **Page Title**: Title of the page
- **Timestamp**: When the page was viewed

### Device Information
- **Device Type**: Mobile, tablet, or desktop
- **Browser**: Chrome, Firefox, Safari, Edge, etc.
- **Operating System**: Windows, macOS, Linux, iOS, Android
- **Screen Resolution**: Display dimensions

### Technical Information
- **User Agent**: Browser identification string
- **Language**: User's preferred language
- **Timezone**: User's timezone
- **Referrer**: Where the user came from

### Geographic Information
- **Country**: Visitor's country (if available)
- **City**: Visitor's city (if available)
- **Region**: Visitor's region (if available)

## Privacy & Compliance

### Data Protection
- No personal information is collected
- Session IDs are randomly generated
- IP addresses are not stored
- No cross-site tracking

### GDPR Compliance
- Minimal data collection
- No persistent identifiers
- User consent not required for basic analytics
- Easy data deletion process

### User Control
- Users can disable JavaScript to opt out
- No tracking cookies are set
- Respects browser privacy settings

## Troubleshooting

### Common Issues

#### No Visitor Data
1. Check if the backend is running
2. Verify database connection
3. Check browser console for errors
4. Ensure environment variables are set

#### Analytics Not Loading
1. Verify admin authentication
2. Check backend API endpoints
3. Review network requests in browser dev tools
4. Check backend logs for errors

#### Database Errors
1. Run the migration script
2. Check database connection string
3. Verify table structure
4. Check Prisma schema

### Debug Mode

Enable debug logging by checking the browser console and backend logs for detailed error information.

## Performance Considerations

### Optimization
- Analytics are fetched asynchronously
- No impact on page load performance
- Efficient database queries with proper indexing
- Minimal memory footprint

### Scaling
- Database queries are optimized for large datasets
- Pagination for recent visitors list
- Efficient aggregation for analytics
- Background processing for heavy calculations

## Future Enhancements

### Planned Features
- Real-time visitor count
- Heat maps for page interactions
- Conversion funnel analysis
- A/B testing integration
- Email campaign tracking

### Custom Analytics
- Custom event tracking
- Goal conversion tracking
- E-commerce analytics
- User behavior analysis

## Support

For technical support or questions about the visitor tracking system:

1. Check this documentation
2. Review the code comments
3. Check the backend logs
4. Contact the development team

## License

This visitor tracking system is part of the Counterfit application and follows the same licensing terms.
