"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Heart, Share2, Plus, Minus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react'
import { useState, use } from 'react'
import { useCart } from '@/contexts/CartContext'

// Sample product data - in a real app this would come from a database
const products = {
  1: {
    id: 1,
    name: "Urban Duo Collection",
    price: 2000,
    originalPrice: null,
    description: "Contemporary streetwear set featuring coordinated pieces. Perfect for the modern streetwear enthusiast who values both style and comfort. This collection represents the pinnacle of urban fashion, combining innovative design with premium materials to create pieces that stand out in any crowd.",
    images: [
      "/images/1d66cc_149ffeb3bc0f441aa37acb363303a407_mv2.jpg",
      "/images/1d66cc_2cd6bfd9f3f14c02bf9bec1597481052_mv2.jpg",
      "/images/1d66cc_dae82150175d4010871e43fef851f81a_mv2.jpg"
    ],
    category: "Collection",
    collection: "Urban Series",
    badge: "Featured",
    rating: 5,
    reviews: 24,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Grey"],
    inStock: true,
    stockCount: 15,
    features: [
      "Premium cotton blend fabric",
      "Coordinated two-piece set",
      "Modern fit with comfort stretch",
      "Machine washable",
      "Limited edition design"
    ],
    specifications: {
      material: "80% Cotton, 20% Polyester",
      fit: "Regular fit",
      care: "Machine wash cold, tumble dry low",
      origin: "Designed in South Africa"
    }
  },
  2: {
    id: 2,
    name: "Executive Trio Collection", 
    price: 3000,
    originalPrice: null,
    description: "Professional streetwear for the modern individual. Where business meets street culture in perfect harmony. This sophisticated collection bridges the gap between corporate elegance and street authenticity, featuring pieces that transition seamlessly from boardroom to street.",
    images: [
      "/images/1d66cc_2cd6bfd9f3f14c02bf9bec1597481052_mv2.jpg",
      "/images/1d66cc_149ffeb3bc0f441aa37acb363303a407_mv2.jpg",
      "/images/1d66cc_b4b6f42d5bec4d1296ef5f4525844fb8_mv2.png"
    ],
    category: "Collection",
    collection: "Executive Series",
    badge: "Featured",
    rating: 5,
    reviews: 18,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Black"],
    inStock: true,
    stockCount: 8,
    features: [
      "Three-piece coordinated set",
      "Business-casual aesthetic",
      "Premium tailoring",
      "Wrinkle-resistant fabric",
      "Professional finish"
    ],
    specifications: {
      material: "70% Wool, 30% Polyester",
      fit: "Tailored fit",
      care: "Dry clean recommended",
      origin: "Designed in South Africa"
    }
  }
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id)
  const product = products[productId as keyof typeof products]
  const { addToCart } = useCart()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="font-paragraph text-secondary mb-8">The product you're looking for doesn't exist.</p>
          <Button>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
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
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    })

    alert('Added to cart!')
  }

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
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.badge && (
                  <div className="absolute top-6 left-6">
                    <div className="inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold bg-black/80 text-white backdrop-blur-sm">
                      {product.badge === 'Featured' && <Star className="w-3 h-3 mr-1 fill-current" />}
                      {product.badge}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
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
                  <span className="text-sm text-secondary/60 font-medium">{product.collection}</span>
                </div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-secondary/60 ml-2">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-heading text-3xl font-bold text-primary">
                    R{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-secondary/60 line-through">
                      R{product.originalPrice.toLocaleString()}
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
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-primary hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-primary hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

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
                  disabled={!selectedSize || !selectedColor}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
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

              {/* Features */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-heading text-lg font-semibold text-primary mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="font-paragraph text-secondary">{feature}</span>
                    </li>
                  ))}
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
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                      <dd className="text-primary font-medium">{value}</dd>
                    </div>
                  ))}
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
            {Object.values(products).filter(p => p.id !== product.id).map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`} className="group">
                <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-primary">
                        R{relatedProduct.price.toLocaleString()}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(relatedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
