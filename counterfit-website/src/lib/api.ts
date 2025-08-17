// API utility functions for fetching data from the backend

import { config } from './config'

const API_BASE_URL = config.apiUrl

export interface Product {
  _id: string
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
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  featured: boolean
  status: 'active' | 'draft' | 'archived'
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

export async function getFeaturedProducts(limit = 5): Promise<ApiResponse<Product[]>> {
  return getProducts({ featured: true, status: 'active', limit })
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
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // If path starts with /images/, /resources/, or is a public folder path, serve from Next.js public folder
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/resources/') || imagePath.startsWith('/1d66cc_') || imagePath.startsWith('/placeholder-')) {
    return imagePath
  }
  // Otherwise, serve from backend API
  return `${API_BASE_URL}${imagePath}`
}

export function formatPrice(price: number): string {
  return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

export function getProductUrl(product: Product): string {
  return `/product/${product._id}`
}

export function getCollectionUrl(collection: Collection): string {
  return `/collections/${collection.slug || collection._id}`
}
