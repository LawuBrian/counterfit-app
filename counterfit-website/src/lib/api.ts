// API utility functions for fetching data from the backend

import { config } from './config'

const API_BASE_URL = config.apiUrl

export interface Product {
  id: string
  _id?: string // Fallback for compatibility
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  stockCode?: string
  category: string
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  isNew: boolean
  isAvailable: boolean
  images: Array<{
    url: string
    alt?: string
    isPrimary: boolean
  }>
  sizes: Array<{
    size: string
    stock: number
    isAvailable: boolean
  }>
  colors: Array<{
    name: string
    hexCode?: string
    stock: number
    isAvailable: boolean
  }>
  inventory: {
    quantity: number
    trackQuantity: boolean
    lowStockThreshold: number
  }
  totalStock?: number
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  featured: boolean
  status: 'active' | 'draft' | 'archived'
  collectionType: 'singular' | 'combo' | 'duo' | 'trio' | 'mixed'
  products: string[] // Array of product IDs included in collection
  basePrice: number // Base price for the collection
  customizationRules?: {
    allowCustomSelection: boolean
    maxSelections?: number
    productCategories?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Generic API fetch function
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API fetch error:', error)
    return {
      success: false,
      data: [] as T,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Product API functions
export async function getProducts(params?: {
  page?: number
  limit?: number
  category?: string
  featured?: boolean
  isNew?: boolean
  status?: string
  search?: string
}): Promise<ApiResponse<Product[]>> {
  const searchParams = new URLSearchParams()
  
  if (params?.page) searchParams.append('page', params.page.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  if (params?.category) searchParams.append('category', params.category)
  if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
  if (params?.isNew !== undefined) searchParams.append('isNew', params.isNew.toString())
  if (params?.status) searchParams.append('status', params.status)
  if (params?.search) searchParams.append('search', params.search)

  const endpoint = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  return apiFetch<Product[]>(endpoint)
}

export async function getFeaturedProducts(limit = 5, cacheBuster?: number): Promise<ApiResponse<Product[]>> {
  const params: any = { featured: true, status: 'active', limit }
  if (cacheBuster) {
    params._t = cacheBuster
  }
  return getProducts(params)
}

export async function getNewProducts(limit = 10): Promise<ApiResponse<Product[]>> {
  return getProducts({ isNew: true, status: 'active', limit })
}

export async function getProductsByCategory(category: string, limit?: number): Promise<ApiResponse<Product[]>> {
  return getProducts({ category, status: 'active', limit })
}

export async function getProduct(id: string): Promise<ApiResponse<Product>> {
  return apiFetch<Product>(`/api/products/${id}`)
}

// Collection API functions
export async function getCollections(params?: {
  page?: number
  limit?: number
  featured?: boolean
  status?: string
}): Promise<ApiResponse<Collection[]>> {
  const searchParams = new URLSearchParams()
  
  if (params?.page) searchParams.append('page', params.page.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
  if (params?.status) searchParams.append('status', params.status)

  const endpoint = `/api/collections${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  return apiFetch<Collection[]>(endpoint)
}

export async function getFeaturedCollections(limit = 3): Promise<ApiResponse<Collection[]>> {
  return getCollections({ featured: true, status: 'active', limit })
}

export async function getCollection(id: string): Promise<ApiResponse<Collection>> {
  return apiFetch<Collection>(`/api/collections/${id}`)
}

// Utility functions
export function getImageUrl(imagePath: string): string {
  console.log('🖼️ getImageUrl called with:', imagePath)
  
  // If no image path provided, return placeholder
  if (!imagePath) {
    console.log('❌ No image path provided, returning placeholder')
    return 'https://counterfit-backend.onrender.com/uploads/images/placeholder/default-image.png'
  }
  
  // If path starts with http/https, it's already a full URL (backend URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('🌐 Backend URL detected, adding cache-busting parameter')
    // Add cache-busting parameter to prevent CDN caching issues
    const separator = imagePath.includes('?') ? '&' : '?'
    return `${imagePath}${separator}v=${Date.now()}`
  }
  
  // If path starts with /resources/, serve from Next.js public folder (keep for resources)
  if (imagePath.startsWith('/resources/')) {
    console.log('📁 Resources path detected, serving from Next.js public folder')
    return imagePath
  }
  
  // For any other paths (including /images/ paths), redirect to backend
  console.log('🔄 Redirecting image path to backend:', imagePath)
  const backendUrl = `https://counterfit-backend.onrender.com/uploads${imagePath}`
  // Add cache-busting parameter to prevent CDN caching issues
  return `${backendUrl}?v=${Date.now()}`
}

export function formatPrice(price: number): string {
  // Handle invalid prices
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return 'R0.00'
  }
  return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

export function getProductUrl(product: Product): string {
  return `/product/${product.id || product._id}`
}

export function getCollectionUrl(collection: Collection): string {
  return `/collections/${collection.slug || collection.id}`
}
