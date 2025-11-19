"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Heart, Share2, Plus, Minus, ShoppingBag, Truck, Shield, RotateCcw, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useParams } from 'next/navigation'
import { getImageUrl } from '@/lib/utils'
import { formatPrice, calculateDiscountPercentage } from '@/lib/api'

// Define proper types for the product data
interface ProductData {
  id: string
  _id?: string // Fallback for compatibility
  name: string
  price: number
  comparePrice?: number
  description: string
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  category: string
  status: string
  sizes: Array<{
    size: string
    stock: number
    isAvailable: boolean
  }>
  colors: Array<{
    name: string
    hexCode: string
    stock: number
    isAvailable: boolean
  }>
  inventory: {
    trackQuantity: boolean
    quantity: number
    lowStockThreshold: number
    allowBackorder: boolean
  }
  inStock: boolean
  sizeGuide?: {
    enabled: boolean
    title: string
    measurements: Array<{
      size: string
      chest?: string
      waist?: string
      hips?: string
      length?: string
    }>
    instructions?: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        // Try to fetch by ID first
        let response = await fetch(`/api/products/${productId}`)
        console.log('🔄 Trying ID-based fetch for:', productId)
        
        // If ID-based fetch fails, try slug-based fetch
        if (!response.ok) {
          console.log('🔄 ID-based fetch failed, trying slug-based fetch...')
          response = await fetch(`/api/products/slug/${productId}`)
          console.log('🔄 Slug-based fetch response status:', response.status)
        }
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        console.log('🛒 Raw API response:', data)
        console.log('🛒 Product data:', data.data)
        console.log('🛒 Product price:', data.data?.price, 'Type:', typeof data.data?.price)
        console.log('🛒 Product comparePrice:', data.data?.comparePrice, 'Type:', typeof data.data?.comparePrice)
        console.log('🛒 Full product object:', JSON.stringify(data.data, null, 2))
        setProduct(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="text-secondary mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/shop">
            <Button>
              Back to Shop
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    
    console.log('🛒 Product data:', product)
    console.log('🛒 Selected size:', selectedSize)
    console.log('🛒 Selected color:', selectedColor)
    console.log('🛒 Quantity:', quantity)
    console.log('🛒 Product ID:', product.id || product._id)
    
    const cartItem = {
      id: product.id || product._id,
      name: product.name || 'Unknown Product',
      price: product.price || 0,
      image: product.images?.[0]?.url || '',
      size: selectedSize,
      color: selectedColor || undefined,
      quantity
    }
    
    console.log('🛒 Cart item being added:', cartItem)
    
    addToCart(cartItem)
    
    // Show success feedback
    alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`)
  }

  const handleWishlistToggle = async () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const originalPrice = product.comparePrice && product.comparePrice > 0 && product.comparePrice > (product.price || 0) ? product.comparePrice : null

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="py-6 border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-secondary hover:text-primary">Home</Link>
            <span className="text-secondary">/</span>
            <Link href="/shop" className="text-secondary hover:text-primary">Shop</Link>
            <span className="text-secondary">/</span>
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 lg:py-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={getImageUrl(product.images[currentImageIndex]?.url || '')}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.twoForOne && (
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-purple-600 text-white shadow-lg">
                      2 FOR 1
                    </div>
                  )}
                  {product.status && (
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-black/80 text-white backdrop-blur-sm">
                      {product.status === 'Featured' && <Star className="w-3 h-3 mr-1 fill-current" />}
                      {product.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image.url)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-secondary/60 font-medium">{product.category}</span>
                  <span className="text-secondary/40">•</span>
                  <span className="text-sm text-secondary/60 font-medium">{product.status}</span>
                </div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-secondary/60 ml-2">({product.inventory?.quantity || 0} in stock)</span>
                  {(product.inventory?.quantity || 0) <= 10 && (product.inventory?.quantity || 0) > 0 && (
                    <span className="ml-3 text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full animate-pulse">
                      ⚠️ Only {product.inventory?.quantity} left!
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-heading text-3xl font-bold text-primary">
                      {formatPrice(product.price || 0)}
                    </span>
                    {originalPrice !== null && originalPrice > 0 && originalPrice > (product.price || 0) && (
                      <>
                        <span className="text-xl text-secondary/60 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded">
                          {calculateDiscountPercentage(originalPrice, product.price || 0)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {originalPrice !== null && originalPrice > 0 && originalPrice > (product.price || 0) && (
                    <p className="text-sm text-gray-600">
                      You save {formatPrice(originalPrice - (product.price || 0))}
                    </p>
                  )}
                </div>

                <p className="font-paragraph text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-lg font-semibold text-primary">Size</h3>
                  {product.sizeGuide?.enabled && (
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-primary hover:text-primary/80 underline"
                    >
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size.size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-primary hover:border-primary'
                      }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection - Only show if colors exist */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedColor === color.name
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 text-primary hover:border-primary'
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inventory?.quantity || 999, quantity + 1))}
                      disabled={quantity >= (product.inventory?.quantity || 999)}
                      className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-secondary/60">
                    {product.inventory?.quantity || 0} in stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 font-semibold"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isInWishlist(product.id) ? 'fill-current text-red-600' : ''}`} />
                  {isInWishlist(product.id) ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-heading text-lg font-semibold text-primary mb-4">Features</h3>
                <ul className="space-y-2">
                  {/* Features data not available in the new product structure, so this will be empty */}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-primary text-sm">Fast Shipping</div>
                      <div className="text-xs text-secondary/60">4-5 business days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-primary text-sm">30-Day Returns</div>
                      <div className="text-xs text-secondary/60">Easy returns policy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-primary text-sm">Secure Payment</div>
                      <div className="text-xs text-secondary/60">SSL encrypted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background rounded-2xl p-6">
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {/* Specifications data not available in the new product structure, so this will be empty */}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary">You Might Also Like</h2>
            <Button variant="outline">
              <Link href="/shop" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Related products data not available in the new product structure, so this will be empty */}
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && product.sizeGuide?.enabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {product.sizeGuide.title}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowSizeGuide(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {product.sizeGuide.instructions && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">How to Measure</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.sizeGuide.instructions}
                  </p>
                </div>
              )}

              {product.sizeGuide.measurements && product.sizeGuide.measurements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Size</th>
                          {product.sizeGuide.measurements[0]?.chest && (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Chest (cm)</th>
                          )}
                          {product.sizeGuide.measurements[0]?.waist && (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Waist (cm)</th>
                          )}
                          {product.sizeGuide.measurements[0]?.hips && (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Hips (cm)</th>
                          )}
                          {product.sizeGuide.measurements[0]?.length && (
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Length (cm)</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizeGuide.measurements.map((measurement, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-medium">{measurement.size}</td>
                            {measurement.chest && (
                              <td className="border border-gray-300 px-4 py-2">{measurement.chest}</td>
                            )}
                            {measurement.waist && (
                              <td className="border border-gray-300 px-4 py-2">{measurement.waist}</td>
                            )}
                            {measurement.hips && (
                              <td className="border border-gray-300 px-4 py-2">{measurement.hips}</td>
                            )}
                            {measurement.length && (
                              <td className="border border-gray-300 px-4 py-2">{measurement.length}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
