"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Zap, Tag } from 'lucide-react'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getFeaturedProducts, getImageUrl, formatPrice, getProductUrl, type Product } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllFeatured, setShowAllFeatured] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const timestamp = Date.now()
        // Fetch all featured products instead of limiting to 5
        const response = await getFeaturedProducts(50, timestamp)
        console.log('🛍️ Featured products response:', response)
        if (response.success) {
          console.log('🛍️ Featured products data:', response.data)
          console.log('🛍️ First product images:', response.data[0]?.images)
          setFeaturedProducts(response.data)
        } else {
          console.log('❌ Failed to fetch featured products:', response.message)
          setFeaturedProducts([])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Determine which products to show
  const displayedProducts = showAllFeatured ? featuredProducts : featuredProducts.slice(0, 5)
  const hasMoreProducts = featuredProducts.length > 5

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/resources/Luxury_jersey.jpeg"
            alt="Counterfit Luxury Streetwear"
            fill
            className="object-cover object-[50%_25%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center sm:text-left max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="inline-block mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold rounded-md border">
            Luxury Streetwear Collection
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
            Luxury Streetwear.<br />Redefined.
          </h1>
          <p className="font-paragraph text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-xl sm:max-w-2xl mx-auto sm:mx-0 leading-relaxed">
            Experience the future of premium streetwear through innovative design that blends luxury with timeless style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 w-full sm:w-auto h-10 rounded-md text-sm shadow">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 w-full sm:w-auto h-10 rounded-md text-sm bg-transparent shadow-sm">
                View Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-4">
                Featured Products
              </h2>
              <p className="font-paragraph text-lg text-secondary">
                Signature pieces that embody Paki and Jareed's vision of luxury streetwear excellence
              </p>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <Link href="/shop">
                <Button variant="outline" className="border-primary text-primary bg-transparent shadow-sm hover:bg-primary/90 hover:text-primary-foreground h-9 px-4 py-2 rounded-md text-sm font-medium">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              // Fallback when products are loading
              <div className="col-span-full text-center py-12">
                <p className="text-secondary text-lg">Loading featured products...</p>
              </div>
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => {
                const imageUrl = getImageUrl(product.images[0]?.url || '/placeholder-product.jpg')
                return (
                <Link key={product.id || product._id} href={getProductUrl(product)} className="group overflow-hidden rounded-xl bg-background shadow-md hover:shadow-lg transition-all duration-300 block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.images[0]?.alt || product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-black/80 text-white backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </div>
                    </div>
                    {product.isNew && (
                      <div className="absolute top-4 right-4">
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          New
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-paragraph text-sm text-secondary/80 mb-3 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-heading text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && product.comparePrice > 0 && product.comparePrice > product.price && (
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
              )})
            ) : (
              // Fallback when no products are available
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-secondary text-lg mb-4">No featured products available at the moment.</p>
                  <p className="text-sm text-secondary/60 mb-6">This could be because:</p>
                  <ul className="text-sm text-secondary/60 mb-6 space-y-1">
                    <li>• No products are marked as featured</li>
                    <li>• All featured products are inactive</li>
                    <li>• Products were recently deleted</li>
                  </ul>
                  <div className="flex gap-3 justify-center">
                    <Link href="/shop">
                      <Button variant="outline">Browse All Products</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Show More/Less Button */}
          {hasMoreProducts && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => setShowAllFeatured(!showAllFeatured)}
                className="border-primary text-primary bg-transparent shadow-sm hover:bg-primary/90 hover:text-primary-foreground h-10 px-6 py-2 rounded-md text-sm font-medium"
              >
                {showAllFeatured ? 'Show Less' : `Show More (${featuredProducts.length - 5} more)`}
                <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${showAllFeatured ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              Shop by Category
            </h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              Explore our curated categories, each reflecting our commitment to luxury, innovation, and timeless design
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Outerwear", image: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png", description: "Premium jackets, blazers, and coats" },
              { name: "Tops", image: "/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png", description: "Hoodies, tees, and performance wear" },
              { name: "Bottoms", image: "/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png", description: "Denim, joggers, and technical pants" },
              { name: "Footwear", image: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png", description: "Statement sneakers and athletic shoes" },
              { name: "Accessories", image: "/images/1d66cc_cde498cebe1e46d6a5caf466f6343ed9_mv2.png", description: "Bags, caps, and luxury details" },
              { name: "Athletic", image: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png", description: "Performance meets street style" }
            ].map((category, index) => (
              <Link key={index} href={`/shop?category=${category.name.toLowerCase()}`} className="group">
                <div className="rounded-xl bg-background overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-heading text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
                      {category.name}
                    </h3>
                    <p className="font-paragraph text-xs text-secondary/70 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-secondary/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                Premium Quality
              </h3>
              <p className="font-paragraph text-secondary">
                Every piece is crafted with the finest materials and attention to detail, ensuring lasting quality and style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                Limited Drops
              </h3>
              <p className="font-paragraph text-secondary">
                Exclusive releases that ensure you stand out from the crowd with unique, limited-edition pieces.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                Authentic Style
              </h3>
              <p className="font-paragraph text-secondary">
                Designs that reflect genuine streetwear culture and innovation, created for those who value luxury and timeless style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-32 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <NewsletterSignup 
            title="Stay in the Loop"
            description="Be the first to know about new collections, exclusive drops, and behind-the-scenes content."
          />
          <div className="mt-6 text-center">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 h-9 px-4 py-2 bg-transparent shadow-sm">
              Sign In for Exclusive Access
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}