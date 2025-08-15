"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Heart, Share2, Plus, Minus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { getImageUrl } from '@/lib/api'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  category: string
  status: string
  featured: boolean
  isNew: boolean
  isAvailable: boolean
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
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
  createdAt: string
  updatedAt: string
}

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/slug/${params.slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data.data)
      } else if (response.status === 404) {
        setError('Product not found')
      } else {
        setError('Failed to load product')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.inventory.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Only require size/color if they are available options
    const requiresSize = availableSizes.length > 0
    const requiresColor = availableColors.length > 0
    
    if (requiresSize && !selectedSize) {
      alert('Please select a size')
      return
    }
    
    if (requiresColor && !selectedColor) {
      alert('Please select a color')
      return
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: quantity
    })

    alert('Added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="font-paragraph text-secondary mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <Button>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const availableSizes = product.sizes.filter(size => size.isAvailable)
  const availableColors = product.colors.filter(color => color.isAvailable)

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
                  src={getImageUrl(product.images[selectedImage]?.url || primaryImage?.url || '')}
                  alt={product.images[selectedImage]?.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  {product.featured && (
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-black/80 text-white backdrop-blur-sm">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </div>
                  )}
                  {product.isNew && (
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-green-600/80 text-white backdrop-blur-sm">
                      New
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={getImageUrl(image.url)}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-secondary/60 font-medium capitalize">{product.category}</span>
                  {product.status !== 'active' && (
                    <>
                      <span className="text-secondary/40">•</span>
                      <span className="text-sm text-secondary/60 font-medium capitalize">{product.status}</span>
                    </>
                  )}
                </div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-heading text-3xl font-bold text-primary">
                    R{product.price.toLocaleString()}
                  </span>
                  {product.comparePrice && product.comparePrice > 0 && product.comparePrice > product.price && (
                    <span className="text-xl text-secondary/60 line-through">
                      R{product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {product.shortDescription && (
                    <p className="font-paragraph text-secondary leading-relaxed font-medium">
                      {product.shortDescription}
                    </p>
                  )}
                  <p className="font-paragraph text-secondary leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((sizeOption) => (
                      <button
                        key={sizeOption.size}
                        onClick={() => setSelectedSize(sizeOption.size)}
                        disabled={sizeOption.stock === 0}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedSize === sizeOption.size
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 text-primary hover:border-primary'
                        }`}
                      >
                        {sizeOption.size}
                        {sizeOption.stock === 0 && ' (Out of Stock)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((colorOption) => (
                      <button
                        key={colorOption.name}
                        onClick={() => setSelectedColor(colorOption.name)}
                        disabled={colorOption.stock === 0}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedColor === colorOption.name
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 text-primary hover:border-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300" 
                            style={{ backgroundColor: colorOption.hexCode }}
                          ></div>
                          {colorOption.name}
                          {colorOption.stock === 0 && ' (Out of Stock)'}
                        </div>
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
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.inventory.quantity}
                      className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-secondary/60">
                    {product.inventory.quantity} in stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 font-semibold"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || (availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor)}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {!product.isAvailable ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className={`${isWishlisted ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
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
    </div>
  )
}
