# Supabase Storage Migration Guide

## Problem
Images uploaded through admin panel are stored on Render's ephemeral filesystem and disappear on every deployment.

## Solution
Migrate to Supabase Storage for permanent image hosting.

---

## Step 1: Set Up Supabase Storage

### 1.1 Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Create bucket with these settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **YES** (images need to be publicly accessible)
   - **Allowed MIME types**: Leave empty or set to `image/*`
   - **File size limit**: `100MB`

6. Click **"Create bucket"**

### 1.2 Configure Bucket Policies

1. Click on the `product-images` bucket
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Create these policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

**Policy 2: Authenticated Upload** (Admin only)
```sql
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Delete** (Admin only)
```sql
CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

---

## Step 2: Update Backend Code

### 2.1 Switch to Supabase Upload Route

Edit `counterfit-backend/server.js`:

```javascript
// OLD: Local filesystem uploads
// app.use('/api/upload', require('./routes/upload'));

// NEW: Supabase Storage uploads
app.use('/api/upload', require('./routes/upload-supabase'));
```

### 2.2 Test Locally

1. Restart your local backend:
```bash
cd counterfit-app/counterfit-backend
npm run dev
```

2. Go to http://localhost:3000/admin
3. Try uploading a product image
4. Check Supabase Dashboard → Storage → product-images
5. You should see the image there!

---

## Step 3: Migrate Existing Images (Optional)

If you want to keep your existing images that are currently on Render:

### Option A: Manual Upload via Admin Panel

1. Download images from your local `uploads/images/` folders
2. Go to admin panel
3. Re-upload each product with its images
4. Supabase will store them permanently

### Option B: Bulk Upload Script

Create `counterfit-backend/scripts/migrate-to-supabase.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { supabase } = require('../lib/supabase');

async function migrateImagesToSupabase() {
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'images');
  const categories = ['outerwear', 'tops', 'bottoms', 'accessories', 'collections'];

  for (const category of categories) {
    const categoryPath = path.join(uploadsDir, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`⏭️  Skipping ${category} - folder doesn't exist`);
      continue;
    }

    const files = fs.readdirSync(categoryPath);
    console.log(`📂 Migrating ${files.length} images from ${category}...`);

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      const storagePath = `${category}/${file}`;

      try {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(storagePath, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (error) {
          console.error(`❌ Failed to upload ${file}:`, error.message);
        } else {
          console.log(`✅ Uploaded: ${storagePath}`);
        }
      } catch (err) {
        console.error(`❌ Error uploading ${file}:`, err.message);
      }
    }
  }

  console.log('✅ Migration complete!');
}

migrateImagesToSupabase();
```

Run it:
```bash
cd counterfit-app/counterfit-backend
node scripts/migrate-to-supabase.js
```

---

## Step 4: Update Image URLs in Database

Your products in the database still have old URLs like:
```
https://counterfit-backend.onrender.com/uploads/images/tops/IMAGE.jpeg
```

They need to be updated to Supabase URLs:
```
https://[your-project].supabase.co/storage/v1/object/public/product-images/tops/IMAGE.jpeg
```

### Option A: Update via Admin Panel

1. Go to each product in admin panel
2. Re-upload the image (now stored in Supabase)
3. Save the product

### Option B: Bulk Update Script

Create `counterfit-backend/scripts/update-image-urls.js`:

```javascript
const { supabase } = require('../lib/supabase');

async function updateImageUrls() {
  // Get all products
  const { data: products, error } = await supabase
    .from('Product')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`📦 Updating ${products.length} products...`);

  for (const product of products) {
    // Extract filename and category from old URL
    const oldImages = product.images || [];
    const newImages = [];

    for (const oldUrl of oldImages) {
      if (oldUrl.includes('counterfit-backend.onrender.com')) {
        // Extract: /uploads/images/tops/IMAGE.jpeg
        const match = oldUrl.match(/\/uploads\/images\/([^\/]+)\/([^\/]+)$/);
        
        if (match) {
          const category = match[1];
          const filename = match[2];
          
          // Get new Supabase URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`${category}/${filename}`);
          
          newImages.push(publicUrl);
          console.log(`🔄 ${product.name}: ${filename} → Supabase`);
        } else {
          newImages.push(oldUrl); // Keep as is
        }
      } else {
        newImages.push(oldUrl); // Keep as is
      }
    }

    // Update product
    if (newImages.length > 0) {
      const { error: updateError } = await supabase
        .from('Product')
        .update({ images: newImages })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Failed to update ${product.name}:`, updateError);
      } else {
        console.log(`✅ Updated: ${product.name}`);
      }
    }
  }

  console.log('✅ URL update complete!');
}

updateImageUrls();
```

---

## Step 5: Deploy to Production

### 5.1 Commit Changes

```bash
cd counterfit-app/counterfit-backend
git add routes/upload-supabase.js server.js
git commit -m "feat: Migrate image uploads to Supabase Storage"
git push origin main
```

### 5.2 Verify on Render

1. Wait for deployment to complete
2. Check Render logs for successful startup
3. Go to your production admin panel
4. Upload a test image
5. Check Supabase Dashboard to confirm it's there
6. Verify image displays on frontend

---

## Step 6: Clean Up (After Verification)

Once everything works:

1. **Remove old upload route** (optional):
   - Delete or rename `routes/upload.js` to `routes/upload-old.js`
   
2. **Remove local uploads folder from git** (optional):
   ```bash
   echo "uploads/" >> .gitignore
   git rm -r --cached uploads/
   git commit -m "Remove uploads folder from git"
   ```

3. **Remove Render's local filesystem serving**:
   - Comment out the static file serving in `server.js` if not needed

---

## Benefits

✅ **Images persist across deployments**
✅ **Faster deployments** (no large image files in git)
✅ **Better performance** (Supabase CDN)
✅ **Automatic backups** (included with Supabase)
✅ **Scalable** (no filesystem limits)
✅ **Professional solution** (industry standard)

---

## Troubleshooting

### Images not uploading?

**Check Supabase logs:**
1. Supabase Dashboard → Logs
2. Look for upload errors

**Common issues:**
- Bucket not public
- Bucket policies not set
- SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment

### Old images still showing?

**Database still has old URLs:**
- Run the URL update script (Step 4, Option B)
- Or manually update products in admin panel

### Images not displaying?

**CORS issue:**
- Supabase Storage has CORS enabled by default
- If issues, check browser console

---

## Quick Reference

**Upload endpoint:**
```
POST /api/upload/image?category=outerwear
POST /api/upload/images?category=tops
```

**Get Supabase URL from path:**
```javascript
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl('tops/IMAGE-123456.jpeg');
```

**Delete image:**
```javascript
await supabase.storage
  .from('product-images')
  .remove(['tops/IMAGE-123456.jpeg']);
```

---

## Cost

**Supabase Free Tier includes:**
- 1GB storage
- 2GB bandwidth/month
- Free SSL/CDN

Should be plenty for an e-commerce site. If you exceed, paid plans start at $25/month with 100GB storage.

---

## Next Steps

After migration is complete:
1. Test thoroughly in production
2. Monitor Supabase storage usage
3. Set up automatic image optimization (optional)
4. Consider adding image thumbnails/variants (optional)

