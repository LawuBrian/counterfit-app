# Counterfit Backend Scripts

This directory contains various scripts for managing your Counterfit backend database and images.

## 🖼️ Image Management Scripts

### 1. Update to Descriptive Images
**File:** `update-to-descriptive-images.js`

This script updates your existing database to use descriptive image names instead of timestamp-based names. It maps products and collections to your organized image structure.

**Usage:**
```bash
cd counterfit-app/counterfit-backend
node scripts/update-to-descriptive-images.js
```

**What it does:**
- Fetches all products and collections from your Supabase database
- Maps them to descriptive image paths based on product names and categories
- Updates the database with the new image paths
- Ensures all images use your organized folder structure

### 2. Seed Descriptive Products
**File:** `seed-descriptive-products.js`

This script creates a fresh database with sample products that use descriptive image names from your organized structure.

**Usage:**
```bash
cd counterfit-app/counterfit-backend
node scripts/seed-descriptive-products.js
```

**What it does:**
- Clears existing products and collections (keeps admin data)
- Creates new collections with descriptive images
- Creates sample products with proper image mappings
- Uses your organized image structure: `/images/outerwear/`, `/images/bottoms/`, etc.

## 🗂️ Image Structure

Your images are organized in the following structure:

```
public/images/
├── outerwear/
│   ├── BLACKJACKET.jpeg
│   ├── FURRYGREYJACKET.jpeg
│   ├── LUXURYJACKET.jpeg
│   ├── NATUREJACKET.jpeg
│   └── WHITEJACKET.jpeg
├── bottoms/
│   └── COUNTERFITPANTS.jpeg
├── tops/
│   └── WHITEDUOCOLLECTION.jpg
├── accessories/
│   └── SKULLCAP.jpg
└── collections/
    ├── COMBOPANTSJACKET.jpeg
    ├── COMBOSKULLYJACKET.jpeg
    ├── DUONATURECAMOORBLACKWHITE MIX.jpeg
    ├── JACKETDUOCOLLECTION.jpg
    ├── TRIOCOLLECTION.jpeg
    └── WHITEDUOCOLLECTION.jpg
```

## 🚀 Getting Started

### Option 1: Update Existing Database
If you already have products in your database:

1. **Run the update script:**
   ```bash
   node scripts/update-to-descriptive-images.js
   ```

2. **Check the results:**
   - Verify products display correctly on your website
   - Check admin panel for proper image assignments

### Option 2: Fresh Start
If you want to start with a clean database:

1. **Run the seed script:**
   ```bash
   node scripts/seed-descriptive-products.js
   ```

2. **Verify the setup:**
   - Check your website for the new products
   - Verify all images are displaying correctly
   - Test the admin panel functionality

## 🔧 Environment Setup

Make sure you have these environment variables set in your `.env` file:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

## 📱 Frontend Integration

The frontend has been updated to properly handle descriptive image paths:

- **`getImageUrl()` function** now properly serves images from your organized structure
- **Product components** will automatically display the correct images
- **Collection pages** will show proper collection images
- **Admin panel** will display products with working images

## 🎯 Image Mapping Logic

The scripts use intelligent mapping to assign images:

1. **Product Name Matching:** Tries to match product names to image categories
2. **Category Matching:** Falls back to matching by product category
3. **Default Images:** Uses fallback images if no specific matches are found

## 🔍 Troubleshooting

### Images Not Displaying
- Check that image paths in database start with `/images/`
- Verify images exist in your `public/images/` folder
- Check browser console for any 404 errors

### Database Errors
- Ensure your Supabase credentials are correct
- Check that tables exist and have the right structure
- Verify your service role key has write permissions

### Script Errors
- Make sure you're in the correct directory
- Check that all dependencies are installed
- Verify your `.env` file is properly configured

## 📊 Expected Results

After running the scripts, you should see:

- ✅ Products with descriptive image names instead of timestamps
- ✅ All images loading from your organized folder structure
- ✅ Collections with proper representative images
- ✅ Admin panel showing products with working images
- ✅ Website displaying products correctly

## 🚀 Next Steps

1. **Run the appropriate script** based on your needs
2. **Test your website** to ensure images display correctly
3. **Use the admin panel** to fine-tune any image assignments
4. **Add more products** using the same descriptive image structure

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify your environment variables are set correctly
3. Ensure your Supabase database is accessible
4. Check that your image files exist in the correct locations
