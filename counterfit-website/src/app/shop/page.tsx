'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Filter, Grid, List, SlidersHorizontal, Zap, Heart, Package } from 'lucide-react'
import { getProducts, getImageUrl, formatPrice, getProductUrl, type Product } from '@/lib/api'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    featured: false,
    isNew: false,
    search: '',
    maxPrice: 3000
  })

  const categories = ["outerwear", "tops", "bottoms", "footwear", "accessories", "athletic"]

  // Debounced effect for price changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300) // 300ms delay for price slider

    return () => clearTimeout(timeoutId)
  }, [filters.maxPrice])

  // Immediate effect for other filters
  useEffect(() => {
    fetchProducts()
  }, [filters.category, filters.featured, filters.isNew, filters.search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await getProducts({
        status: 'active',
        category: filters.category || undefined,
        featured: filters.featured || undefined,
        isNew: filters.isNew || undefined,
        search: filters.search || undefined,
        limit: 50
      })
      
      if (response.success) {
        // Client-side price filtering
        const filteredProducts = response.data.filter(product => 
          product.price <= filters.maxPrice
        )
        setProducts(filteredProducts)
      } else {
        console.error('Failed to fetch products:', response.message)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      featured: false,
      isNew: false,
      search: '',
      maxPrice: 3000
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Matching scraped HTML exactly */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="/1d66cc_a11baf46680b4215b9e69ddb52d2051c_mv2.png"
            alt="Shop Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Zap className="w-3 h-3 mr-1" />
            New Arrivals Available
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white mb-4">Shop Collection</h1>
          <p className="font-paragraph text-lg text-white/90 max-w-2xl mx-auto">
            Experience Paki and Jareed's vision through our complete collection of luxury streetwear that blends innovation with timeless design.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar - Matching scraped HTML */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Matching scraped HTML exactly */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white rounded-lg border border-shape-stroke p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-semibold text-primary">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Search</h4>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Categories</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="all-categories"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="all-categories" className="font-paragraph text-sm text-secondary cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={category}
                        name="category"
                        checked={filters.category === category}
                        onChange={() => handleFilterChange('category', category)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor={category} className="font-paragraph text-sm text-secondary cursor-pointer capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured & New */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Special</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="font-paragraph text-sm text-secondary cursor-pointer">
                      Featured Products
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="new"
                      checked={filters.isNew}
                      onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="new" className="font-paragraph text-sm text-secondary cursor-pointer">
                      New Arrivals
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-sm text-secondary">R0</span>
                    <span className="font-paragraph text-sm text-secondary">R3500</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="3500"
                      step="50"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                      style={{
                        background: `linear-gradient(to right, #000 0%, #000 ${(filters.maxPrice / 3500) * 100}%, #e5e7eb ${(filters.maxPrice / 3500) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="font-paragraph text-sm text-primary font-medium">
                      Up to R{filters.maxPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <span className="font-paragraph text-sm text-secondary">
                  {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <select className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-border disabled:cursor-not-allowed disabled:opacity-50 w-48">
                  <option>Featured First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
                
                <div className="flex items-center border border-shape-stroke rounded-lg">
                  <Button variant="default" size="sm" className="rounded-r-none">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="rounded-xl bg-background border shadow-md animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200 rounded-t-xl"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <Link key={product.id} href={getProductUrl(product)} className="rounded-xl text-primary bg-background group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 block">
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <Image
                        src={getImageUrl(product.images[0]?.url || '/placeholder-product.jpg')}
                        alt={product.images[0]?.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Multiple Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.featured && (
                          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-black text-white">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </div>
                        )}
                        {product.isNew && (
                          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                            <Zap className="w-3 h-3 mr-1" />
                            New
                          </div>
                        )}
                      </div>

                      {/* Heart Button */}
                      <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-primary" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                          {product.name}
                        </h3>
                        <p className="font-paragraph text-sm text-secondary/80 mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-heading text-xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.comparePrice && product.comparePrice > 0 && product.comparePrice !== 0 && product.comparePrice > product.price && (
                            <span className="text-sm text-secondary/60 line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // No products found
                <div className="col-span-full text-center py-16">
                  <div className="mb-4">
                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}