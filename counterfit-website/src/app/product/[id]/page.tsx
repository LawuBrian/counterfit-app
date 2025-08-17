"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Heart, Share2, Plus, Minus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useParams } from 'next/navigation'
import { getImageUrl } from '@/lib/utils'
import { formatPrice } from '@/lib/api'

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
  stockCount: number
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
  
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        
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
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      size: selectedSize,
      color: selectedColor || undefined,
      quantity
    }
    
    console.log('🛒 Cart item being added:', cartItem)
    
    addToCart(cartItem)
    
    // Show success feedback
    alert(`Added ${quantity} ${product.name} (${selectedSize}) to cart!`)
  }

  const originalPrice = product.comparePrice && product.comparePrice > product.price ? product.comparePrice : null

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
                {product.status && (
                  <div className="absolute top-6 left-6">
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-black/80 text-white backdrop-blur-sm">
                      {product.status === 'Featured' && <Star className="w-3 h-3 mr-1 fill-current" />}
                      {product.status}
                    </div>
                  </div>
                )}
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
                  <span className="text-sm text-secondary/60 ml-2">({product.stockCount} in stock)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-heading text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {originalPrice !== null && originalPrice > 0 && originalPrice > product.price && (
                    <span className="text-xl text-secondary/60 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>

                <p className="font-paragraph text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-3">Size</h3>
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
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      disabled={quantity >= product.stockCount}
                      className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-secondary/60">
                    {product.stockCount} in stock
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
                  onClick={() => {}} // Wishlist functionality not implemented in this version
                  className={`${false ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                >
                  <Heart className={`mr-2 h-5 w-5 ${false ? 'fill-current' : ''}`} />
                  Save
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
                      <div className="font-medium text-primary text-sm">Free Shipping</div>
                      <div className="text-xs text-secondary/60">Orders over R1000</div>
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
              <div className="bg-background rounded-2xl p-6">
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Size Guide</h3>
                <p className="font-paragraph text-secondary mb-4">
                  For the best fit, please refer to our size guide or contact our customer service team.
                </p>
                <Button variant="outline" className="w-full">
                  View Size Guide
                </Button>
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
    </div>
  )
}
