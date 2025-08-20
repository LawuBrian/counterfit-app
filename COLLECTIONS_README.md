# Collections System

## Overview
The collections system allows admins to create combo packages and product bundles that customers can purchase. Collections can be fixed combinations (like Jacket + Skully) or flexible selections where customers choose from available options.

## Collection Types

### 1. Combo Package
- **Example**: Jacket + Skully combo
- **Products per order**: 2 (recommended)
- **Description**: Fixed combination where customers get specific items together

### 2. Duo Collection
- **Products per order**: Exactly 2
- **Description**: Customers choose 2 items from any available categories

### 3. Trio Collection
- **Products per order**: Exactly 3
- **Description**: Customers choose 3 items from any available categories

### 4. Mixed Selection
- **Products per order**: Flexible (1-10)
- **Description**: Customers can choose any combination up to the maximum limit

### 5. Single Product
- **Products per order**: 1
- **Description**: Single product collection

## How to Create a Collection

### Step 1: Basic Information
1. **Collection Name**: Use descriptive names like "Premium Jacket + Skully Combo"
2. **Collection Type**: Choose the appropriate type based on your needs
3. **Products in Collection**: Set how many products customers will receive per order
4. **Description**: Explain what the collection includes
5. **Status**: Set to draft initially, publish when ready

### Step 2: Cover Image
1. Upload a representative image for the collection
2. Images are stored in `/uploads/images/collections/` on the backend
3. Use high-quality images that show the collection well

### Step 3: Product Selection
1. **Select Categories**: Choose which product categories to include
2. **Set Max Selections**: For each category, set how many items customers can pick
3. **Select Products**: Choose specific products from each category

### Example: Jacket + Skully Combo
- **Outerwear Category**: Select all jackets, max selections: 1
- **Accessories Category**: Select all skull caps, max selections: 1
- **Products per Order**: 2
- **Collection Type**: Combo

## Database Structure

Collections are stored with the following fields:
- `name`: Collection name
- `slug`: URL-friendly version of the name
- `description`: Collection description
- `image`: Cover image URL
- `collectionType`: Type of collection
- `basePrice`: Total price of the collection
- `maxSelections`: Products per order
- `productCategories`: JSON array of category selections
- `status`: draft/published/archived
- `featured`: Whether to feature the collection

## Image Storage

Collection images are stored in the backend at:
```
counterfit-backend/uploads/images/collections/
```

The frontend uploads to `/api/upload/collection-image` which forwards to the backend with the `collections` category.

## Best Practices

1. **Naming**: Use clear, descriptive names that customers understand
2. **Images**: Use high-quality images that represent the collection well
3. **Product Selection**: Include enough variety in each category for customer choice
4. **Pricing**: Set competitive prices for combo packages
5. **Testing**: Test collections in draft mode before publishing

## Troubleshooting

### Common Issues
1. **No products selected**: Ensure at least one category has products selected
2. **Image upload fails**: Check file size (max 100MB) and format (JPG, PNG, GIF)
3. **Validation errors**: Ensure collection type matches maxSelections count
4. **Backend errors**: Check console logs for detailed error messages

### Debug Mode
The system includes console logging to help debug issues:
- Collection creation data is logged to console
- Upload responses are logged
- Validation errors are shown as alerts
