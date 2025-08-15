// Configuration for the frontend application

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000',
  
  // NextAuth Configuration
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  
  // Site Configuration
  siteName: 'Counterfit',
  siteDescription: 'Luxury streetwear that redefines style and innovation',
  
  // Default pagination
  defaultPageSize: 20,
  
  // Image configuration
  defaultProductImage: '/placeholder-product.jpg',
  defaultCollectionImage: '/placeholder-collection.jpg',
}
