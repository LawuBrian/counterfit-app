# 🚀 Counterfit Backend API Documentation

## 📋 Overview

This document describes the updated API endpoints for the Counterfit backend, now using Supabase instead of Prisma. All endpoints return JSON responses with consistent error handling.

## 🔐 Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {...},
  "error": "Error details (if applicable)"
}
```

## 🛍️ Orders API

### Create Order
- **POST** `/api/orders`
- **Access**: Private
- **Body**:
  ```json
  {
    "orderNumber": "ORD-202412-0001",
    "items": [...],
    "totalAmount": 1299.99,
    "shippingAddress": {...},
    "billingAddress": {...},
    "notes": "Optional notes"
  }
  ```

### Get User Orders
- **GET** `/api/orders/my`
- **Access**: Private
- **Response**: Array of user's orders

### Get Single Order
- **GET** `/api/orders/:id`
- **Access**: Private (users can only see their own orders, admins can see all)
- **Response**: Order details

### Update Order Status (Admin Only)
- **PUT** `/api/orders/:id/status`
- **Access**: Private/Admin
- **Body**:
  ```json
  {
    "status": "shipped",
    "paymentStatus": "paid",
    "trackingNumber": "TRK123456",
    "carrier": "PostNet",
    "estimatedDelivery": "2024-01-15T10:00:00Z"
  }
  ```

### Get All Orders (Admin Only)
- **GET** `/api/orders`
- **Access**: Private/Admin
- **Query Parameters**:
  - `status`: Filter by order status
  - `limit`: Number of orders per page (default: 50)
  - `page`: Page number (default: 1)
- **Response**: Paginated orders with user information

## 📚 Collections API

### Get All Collections
- **GET** `/api/collections`
- **Access**: Public
- **Query Parameters**:
  - `status`: Filter by collection status
  - `limit`: Number of collections to return
- **Response**: Array of collections

### Get Single Collection
- **GET** `/api/collections/:slug`
- **Access**: Public
- **Response**: Collection details

### Create Collection (Admin Only)
- **POST** `/api/collections`
- **Access**: Private/Admin
- **Body**:
  ```json
  {
    "name": "Collection Name",
    "slug": "collection-slug",
    "description": "Collection description",
    "image": "image-url",
    "featured": false,
    "status": "draft"
  }
  ```

### Update Collection (Admin Only)
- **PUT** `/api/collections/:id`
- **Access**: Private/Admin
- **Body**: Any collection fields to update

### Delete Collection (Admin Only)
- **DELETE** `/api/collections/:id`
- **Access**: Private/Admin

### Get Featured Collections
- **GET** `/api/collections/featured`
- **Access**: Public
- **Response**: Array of featured published collections

## 👥 Users API

### Add/Remove from Wishlist
- **POST** `/api/users/wishlist/:productId`
- **Access**: Private
- **Response**: Updated wishlist array

### Get User Wishlist
- **GET** `/api/users/wishlist`
- **Access**: Private
- **Response**: Array of product IDs in wishlist

### Get User Profile
- **GET** `/api/users/profile`
- **Access**: Private
- **Response**: User profile information

### Update User Profile
- **PUT** `/api/users/profile`
- **Access**: Private
- **Body**:
  ```json
  {
    "firstName": "New First Name",
    "lastName": "New Last Name",
    "avatar": "new-avatar-url"
  }
  ```

### Get All Users (Admin Only)
- **GET** `/api/users`
- **Access**: Private/Admin
- **Query Parameters**:
  - `limit`: Number of users per page (default: 50)
  - `page`: Page number (default: 1)
  - `role`: Filter by user role
  - `search`: Search by name or email
- **Response**: Paginated users

### Get User by ID (Admin Only)
- **GET** `/api/users/:id`
- **Access**: Private/Admin
- **Response**: User details

### Update User Role (Admin Only)
- **PUT** `/api/users/:id/role`
- **Access**: Private/Admin
- **Body**:
  ```json
  {
    "role": "ADMIN"
  }
  ```

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    avatar VARCHAR(500),
    wishlist TEXT[],
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Collection Table
```sql
CREATE TABLE "Collection" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Product Table
```sql
CREATE TABLE "Product" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    "shortDescription" TEXT,
    price DECIMAL(10,2) NOT NULL,
    "comparePrice" DECIMAL(10,2),
    "costPrice" DECIMAL(10,2),
    "stockCode" VARCHAR(100) UNIQUE,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    "isNew" BOOLEAN DEFAULT false,
    "isAvailable" BOOLEAN DEFAULT true,
    images JSONB NOT NULL,
    sizes JSONB NOT NULL,
    colors JSONB NOT NULL,
    inventory JSONB NOT NULL,
    shipping JSONB,
    seo JSONB,
    "totalStock" INTEGER,
    "salesCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Order Table
```sql
CREATE TABLE "Order" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id),
    "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    "paymentStatus" VARCHAR(20) DEFAULT 'pending',
    "paymentMethod" VARCHAR(50),
    "paymentId" VARCHAR(255),
    "trackingNumber" VARCHAR(100),
    carrier VARCHAR(100),
    "estimatedDelivery" TIMESTAMP WITH TIME ZONE,
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB,
    notes TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Setup Instructions

### 1. Database Setup
Run the SQL schema in your Supabase SQL editor:
```bash
# Copy and paste the contents of supabase-schema.sql
```

### 2. Environment Variables
Ensure these are set in your Render environment:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

### 3. Initialize Sample Data
Run the setup script:
```bash
node scripts/setup-supabase.js
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin/User permissions
- **Input Validation**: Request body validation
- **SQL Injection Protection**: Supabase built-in protection
- **Error Handling**: Consistent error responses

## 📝 Error Codes

- **400**: Bad Request (invalid input)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server issues)

## 🔄 Migration Notes

- **From Prisma**: All routes now use Supabase instead of Prisma
- **Data Types**: JSONB for complex objects, UUID for IDs
- **Timestamps**: Automatic `createdAt` and `updatedAt` handling
- **Relationships**: Foreign key constraints maintained
- **Indexes**: Performance indexes on frequently queried fields

## 🧪 Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Test collections endpoint
curl https://your-backend.onrender.com/api/collections

# Test with authentication
curl -H "Authorization: Bearer <token>" \
     https://your-backend.onrender.com/api/orders/my
```

## 📞 Support

For issues or questions:
1. Check the server logs for detailed error messages
2. Verify your Supabase credentials
3. Ensure the database tables are created correctly
4. Test the connection using the setup script
