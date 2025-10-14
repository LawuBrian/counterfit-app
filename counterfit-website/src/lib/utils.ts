import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get the full image URL
export function getImageUrl(imagePath: string): string {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a relative path starting with /uploads, construct full backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `${config.apiUrl}${imagePath}`
  }
  
  // If it's just a filename, construct the full path
  if (!imagePath.startsWith('/')) {
    return `${config.apiUrl}/uploads/products/${imagePath}`
  }
  
  // Default case - return as is
  return imagePath
}

// Helper function to get the primary image from a product's images array
export function getPrimaryImage(images: Array<{ url: string; alt?: string; isPrimary: boolean }>) {
  if (!images || images.length === 0) {
    return { url: '/placeholder-product.jpg', alt: 'No image available' }
  }
  
  // Find the primary image
  const primaryImage = images.find(img => img.isPrimary)
  
  // Return primary image if found, otherwise return first image
  return primaryImage || images[0]
}