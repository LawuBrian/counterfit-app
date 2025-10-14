'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Filter, Grid, List, SlidersHorizontal, Zap, Heart, Package, Search, X } from 'lucide-react'
import { getProducts, getImageUrl, formatPrice, getProductUrl, type Product } from '@/lib/api'
import { useWishlist } from '@/contexts/WishlistContext'

type ViewMode = 'grid' | 'list'
type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'name-asc' | 'name-desc'

function ShopPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    featured: false,
    isNew: false,
    search: '',
    maxPrice: 3500
  })

  const categories = ["outerwear", "tops", "bottoms", "accessories"]

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlFeatured = searchParams.get('featured')
    const urlIsNew = searchParams.get('isNew')
    
    setFilters(prev => ({
      ...prev,
      search: urlSearch || '',
      category: urlCategory || '',
      featured: urlFeatured === 'true',
      isNew: urlIsNew === 'true'
    }))
  }, [searchParams])

  // Combined effect for filtering and sorting
  useEffect(() => {
    if (products.length > 0) {
      applyFiltersAndSorting()
    }
  }, [products, filters, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await getProducts({
        status: 'active',
        limit: 100,
        category: filters.category || undefined,
        featured: filters.featured || undefined,
        isNew: filters.isNew || undefined,
        search: filters.search || undefined
      })
      
      if (response.success) {
        setProducts(response.data)
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

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const applyFiltersAndSorting = useCallback(() => {
    // Apply client-side filters (only price filter since others are handled server-side)
    let filtered = products.filter(product => {
      // Price filter
      if (product.price > filters.maxPrice) return false
      
      return true
    })
    
    // Then apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })
    
    setFilteredProducts(sorted)
  }, [products, filters.maxPrice, sortBy])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      featured: false,
      isNew: false,
      search: '',
      maxPrice: 3500
    })
    setSortBy('featured')
  }

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-r from-primary to-primary/90">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/Shop_hero.jpeg"
            alt="Shop Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            <Zap className="w-3 h-3 mr-1" />
            New Arrivals Available
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-primary-foreground mb-4">Shop Collection</h1>
          <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Experience Paki and Jareed's vision through our complete collection of luxury streetwear that blends innovation with timeless design.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full justify-between"
            >
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters & Search
              </span>
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-primary">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-heading text-base font-medium text-primary mb-3">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filters.category === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('category', '')}
                      className="justify-start"
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={filters.category === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('category', category)}
                        className="justify-start capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div className="mb-6">
                  <h4 className="font-heading text-base font-medium text-primary mb-3">Special</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="mobile-featured"
                        checked={filters.featured}
                        onChange={(e) => handleFilterChange('featured', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="mobile-featured" className="font-paragraph text-sm text-secondary cursor-pointer">
                        Featured Products
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="mobile-new"
                        checked={filters.isNew}
                        onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="mobile-new" className="font-paragraph text-sm text-secondary cursor-pointer">
                        New Arrivals
                      </label>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-heading text-base font-medium text-primary mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-secondary">
                      <span>R0</span>
                      <span>R{filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3500"
                      step="50"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear All
                  </Button>
                  <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-semibold text-primary">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
              </div>

              {/* Search */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-medium text-primary mb-4">Categories</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
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
                    <div key={category} className="flex items-center space-x-3">
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
                  <div className="flex items-center space-x-3">
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
                  <div className="flex items-center space-x-3">
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
                  <div className="flex items-center justify-between text-sm text-secondary">
                    <span>R0</span>
                    <span>R{filters.maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3500"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #000 0%, #000 ${(filters.maxPrice / 3500) * 100}%, #e5e7eb ${(filters.maxPrice / 3500) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-paragraph text-sm text-secondary">
                  {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex h-10 items-center justify-between whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-48"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                
                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => toggleViewMode('grid')}
                    className="rounded-r-none h-10 px-3"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => toggleViewMode('list')}
                    className="rounded-l-none h-10 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              // Loading skeleton
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={`rounded-xl bg-white border border-gray-200 shadow-md animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-[4/5]'} bg-gray-200 rounded-t-xl ${viewMode === 'list' ? 'rounded-l-xl rounded-t-none' : ''}`}></div>
                    <div className="p-6 flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={getProductUrl(product)} className={`rounded-xl text-primary bg-white group overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 block ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-[4/5]'} ${viewMode === 'list' ? 'rounded-l-xl' : 'rounded-t-xl'}`}>
                      <Image
                        src={getImageUrl(product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/placeholder-product.jpg')}
                        alt={product.images.find(img => img.isPrimary)?.alt || product.images[0]?.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.featured && (
                          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-black text-white shadow-sm">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </div>
                        )}
                        {product.isNew && (
                          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white shadow-sm">
                            <Zap className="w-3 h-3 mr-1" />
                            New
                          </div>
                        )}
                      </div>

                      {/* Heart Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id)
                          } else {
                            addToWishlist(product.id)
                          }
                        }}
                        disabled={wishlistLoading}
                        className={`absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white ${
                          isInWishlist(product.id) ? 'bg-red-100' : 'bg-white/90'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${
                          isInWishlist(product.id) ? 'text-red-600 fill-current' : 'text-primary'
                        }`} />
                      </button>
                    </div>

                    <div className={`p-6 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                          {product.name}
                        </h3>
                        <p className="font-paragraph text-sm text-secondary/80 mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

// Loading component for Suspense fallback
function ShopPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-r from-primary to-primary/90">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/Shop_hero.jpeg"
            alt="Shop Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            <Zap className="w-3 h-3 mr-1" />
            New Arrivals Available
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-primary-foreground mb-4">Shop Collection</h1>
          <p className="font-paragraph text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Experience Paki and Jareed's vision through our complete collection of luxury streetwear that blends innovation with timeless design.
          </p>
        </div>
      </section>

      {/* Loading Content */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Skeleton */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
              <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Products Loading Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-white border border-gray-200 shadow-md animate-pulse">
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageLoading />}>
      <ShopPageContent />
    </Suspense>
  )
}