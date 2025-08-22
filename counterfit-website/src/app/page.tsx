"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Zap, Tag, Sparkles, Shield, TrendingUp, Users, ShoppingBag, Eye, Heart, Package, ShoppingCart, Check } from 'lucide-react'
import SignupForm from '@/components/SignupForm'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getFeaturedProducts, getFeaturedCollections, Product, Collection } from '@/lib/api'
import { useVisitorTracking } from '@/lib/visitorTracking'

export default function HomePage() {
  const [showAdminInfo, setShowAdminInfo] = useState(false)
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  
  // Track visitor analytics
  useVisitorTracking('/', 'Counterfit - Luxury Streetwear')

  // Check if user is admin (either through session or URL parameter)
  useEffect(() => {
    const checkAdminStatus = () => {
      // Check if URL contains admin parameter
      const urlParams = new URLSearchParams(window.location.search)
      const hasAdminParam = urlParams.has('admin')
      
      // Check if user has admin role in session
      const hasAdminRole = session?.user?.role === 'ADMIN'
      
      setIsAdmin(hasAdminParam || hasAdminRole)
    }

    if (status === 'loading') return
    
    checkAdminStatus()
    
    // Listen for URL changes
    const handleUrlChange = () => checkAdminStatus()
    window.addEventListener('popstate', handleUrlChange)
    
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [session, status])

  // Fetch featured products and collections for all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsResponse, collectionsResponse] = await Promise.all([
          getFeaturedProducts(8),
          getFeaturedCollections(3)
        ])
        
        if (productsResponse.success) {
          setFeaturedProducts(productsResponse.data)
        }
        
        if (collectionsResponse.success) {
          setFeaturedCollections(collectionsResponse.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch data for all users, not just admins
    fetchData()
  }, [])

  // Show admin info if admin parameter is present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('admin')) {
      setShowAdminInfo(true)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Luxury_jersey.jpeg"
            alt="Counterfit Luxury Streetwear"
            fill
            className="object-cover object-[50%_25%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold mb-8 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Built different.
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              For the ones that don't fit in.
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/shop">
              <Button className="group bg-white text-black hover:bg-white/90 font-bold px-10 py-4 h-14 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Shop Now
              </Button>
            </Link>
            <Link href="/collections">
              <Button 
                variant="outline" 
                className="group border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-4 h-14 rounded-full text-lg bg-transparent shadow-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Eye className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                View Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Available to all users */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Featured Products
            </div>
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6">
              Signature Pieces
            </h2>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mx-auto">
              Discover our most coveted pieces that embody luxury, innovation, and timeless design
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.images?.[0]?.url || '/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Product badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.featured && (
                        <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          FEATURED
                        </div>
                      )}
                      {product.status === 'new' && (
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </div>
                      )}
                    </div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg font-bold text-primary">
                          R{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            R{product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Link href={`/product/${product.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-12 rounded-full">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section - Only show if collections exist */}
      {featuredCollections.length > 0 && (
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-4 py-2 text-sm font-semibold mb-6">
                <Tag className="w-4 h-4 mr-2" />
                Curated Collections
              </div>
              <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6">
                Signature Collections
              </h2>
              <p className="font-paragraph text-xl text-secondary max-w-3xl mx-auto">
                Discover Paki's vision through collections that embody luxury, innovation, and timeless design
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredCollections.map((collection, index) => (
                <div key={collection.id} className={`group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${index === 1 ? 'lg:scale-105' : ''}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={collection.image || '/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png'}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center rounded-full bg-white/20 text-white border border-white/30 px-3 py-1 text-xs font-semibold mb-3 backdrop-blur-sm">
                        {collection.collectionType === 'combo' ? 'Combo Collection' : 
                         collection.collectionType === 'duo' ? 'Duo Collection' :
                         collection.collectionType === 'trio' ? 'Trio Collection' : 'Collection'}
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-white mb-2">
                        {collection.name}
                      </h3>
                      <p className="font-paragraph text-white/90 text-sm mb-4 line-clamp-2">
                        {collection.description || 'Premium collection designed for the modern individual.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xl font-bold text-white">
                          R{collection.basePrice || 0}
                        </span>
                        <Link href={`/collections/${collection.slug}`}>
                          <Button className="bg-white text-black hover:bg-white/90 font-semibold px-4 py-2 rounded-lg transition-all duration-300">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category - Redesigned */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full bg-white/10 text-white px-4 py-2 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Shop by Category
            </div>
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6">
              Explore Categories
            </h2>
            <p className="font-paragraph text-xl text-gray-300 max-w-3xl mx-auto">
              Navigate through our curated categories, each reflecting our commitment to luxury, innovation, and timeless design
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Outerwear', image: '/images/outerwear/blackjacket.jpg', desc: 'Premium jackets, blazers, and coats', href: '/shop?category=outerwear' },
              { name: 'Tops', image: '/images/tops/WHITEDUOCOLLECTION.jpg', desc: 'Hoodies, tees, and performance wear', href: '/shop?category=tops' },
              { name: 'Bottoms', image: '/images/bottoms/COUNTERFITPANTS.jpeg', desc: 'Denim, joggers, and technical pants', href: '/shop?category=bottoms' },
              { name: 'Accessories', image: '/images/accessories/SKULLCAPBETTER.jpg', desc: 'Bags, caps, and luxury details', href: '/shop?category=accessories' }
            ].map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/10">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="font-paragraph text-xs text-gray-300 mt-2 group-hover:text-gray-200 transition-colors">
                      {category.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Info Section - Only visible to admins */}
      {showAdminInfo && (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
                Admin Dashboard Access
              </h2>
              <p className="font-paragraph text-xl text-blue-200">
                Welcome to the Counterfit admin panel. Here's what you can do:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Product Management</h3>
                <p className="text-blue-200 text-sm">
                  Add, edit, and manage products with full image upload capabilities
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Collection Management</h3>
                <p className="text-blue-200 text-sm">
                  Create and manage product collections with bulk import features
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Order Management</h3>
                <p className="text-blue-200 text-sm">
                  View and manage customer orders with shipment tracking
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Analytics & Stats</h3>
                <p className="text-blue-200 text-sm">
                  Monitor sales, user growth, and product performance
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/admin">
                <Button className="bg-white text-blue-900 hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-full text-lg">
                  Access Admin Dashboard
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Values - Redesigned */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6">
              Our Foundation
            </h2>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mx-auto">
              Every stitch tells a story of resilience. Every design reflects the journey from setback to success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: TrendingUp, title: 'Resilience', desc: 'Built from losses, we understand that every failure is a stepping stone to greatness.' },
              { icon: Star, title: 'Excellence', desc: 'Every garment is crafted with precision, quality, and the determination to exceed expectations.' },
              { icon: Users, title: 'Community', desc: "We're building more than a brand - we're creating a movement of winners who never give up." }
            ].map((value) => (
              <div key={value.title} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                  {value.title}
                </h3>
                <p className="font-paragraph text-lg text-secondary leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Redesigned */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-32 h-32 mx-auto mb-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-8">
            Stay in the Loop
          </h2>
          
          <p className="font-paragraph text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Be the first to know about new collections, exclusive drops, and behind-the-scenes content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto mb-8">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
            />
            <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 font-bold px-8 py-4 h-14 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
              Subscribe
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 h-12 rounded-2xl transition-all duration-300 hover:scale-105">
              Sign In for Exclusive Access
            </Button>
            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-2xl transition-all duration-300 hover:scale-105">
              Join the Movement
            </Button>
          </div>
                </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-4 py-2 text-sm font-semibold mb-6">
              <Tag className="w-4 h-4 mr-2" />
              Curated Collections
            </div>

            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6">
              Signature Collections
            </h2>

            <p className="font-paragraph text-xl text-secondary max-w-3xl mx-auto">
              Discover Paki's vision through collections that embody luxury, innovation, and timeless design
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <div key={collection.id} className={`group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${index === 1 ? 'lg:scale-105' : ''}`}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={collection.image || '/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png'}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-flex items-center rounded-full bg-white/20 text-white border border-white/30 px-3 py-1 text-xs font-semibold mb-3 backdrop-blur-sm">
                      {collection.collectionType === 'combo' ? 'Combo Collection' : 
                       collection.collectionType === 'duo' ? 'Duo Collection' :
                       collection.collectionType === 'trio' ? 'Trio Collection' : 'Collection'}
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    <p className="font-paragraph text-white/90 text-sm mb-4 line-clamp-2">
                      {collection.description || 'Premium collection designed for the modern individual.'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-white">
                        R{collection.basePrice || 0}
                      </span>
                      <Link href={`/collections/${collection.slug}`}>
                        <Button className="bg-white text-black hover:bg-white/90 font-semibold px-4 py-2 rounded-lg transition-all duration-300">
                          Explore
                        </Button>

                        </Link>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

      {/* Shop by Category - Redesigned */}

      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-20">

            <div className="inline-flex items-center rounded-full bg-white/10 text-white px-4 py-2 text-sm font-semibold mb-6">

              <Zap className="w-4 h-4 mr-2" />

              Shop by Category

            </div>

            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6">

              Explore Categories

            </h2>

            <p className="font-paragraph text-xl text-gray-300 max-w-3xl mx-auto">

              Navigate through our curated categories, each reflecting our commitment to luxury, innovation, and timeless design

            </p>

          </div>

          

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {[

              { name: 'Outerwear', image: '/images/outerwear/blackjacket.jpg', desc: 'Premium jackets, blazers, and coats', href: '/shop?category=outerwear' },

              { name: 'Tops', image: '/images/tops/WHITEDUOCOLLECTION.jpg', desc: 'Hoodies, tees, and performance wear', href: '/shop?category=tops' },

              { name: 'Bottoms', image: '/images/bottoms/COUNTERFITPANTS.jpeg', desc: 'Denim, joggers, and technical pants', href: '/shop?category=bottoms' },
              { name: 'Accessories', image: '/images/accessories/SKULLCAPBETTER.jpg', desc: 'Bags, caps, and luxury details', href: '/shop?category=accessories' }
            ].map((category) => (

              <Link key={category.name} href={category.href} className="group">

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/10">

                  <div className="aspect-square relative overflow-hidden">

                    <Image

                      src={category.image}

                      alt={category.name}

                      fill

                      className="object-cover group-hover:scale-110 transition-transform duration-500"

                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

                  </div>

                  <div className="p-4 text-center">

                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-primary transition-colors">

                      {category.name}

                    </h3>

                    <p className="font-paragraph text-xs text-gray-300 mt-2 group-hover:text-gray-200 transition-colors">

                      {category.desc}

                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>



      {/* Admin Info Section - Only visible to admins */}

      {showAdminInfo && (

        <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-900 to-blue-800 text-white">

          <div className="max-w-4xl mx-auto px-6 lg:px-8">

            <div className="text-center mb-12">

              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">

                <Shield className="w-10 h-10 text-white" />

              </div>

              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">

                Admin Dashboard Access

              </h2>

              <p className="font-paragraph text-xl text-blue-200">

                Welcome to the Counterfit admin panel. Here's what you can do:

              </p>

            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">

                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">

                  <Package className="w-6 h-6 text-white" />

                </div>

                <h3 className="font-heading text-xl font-bold mb-2">Product Management</h3>

                <p className="text-blue-200 text-sm">

                  Add, edit, and manage products with full image upload capabilities

                </p>

              </div>

              

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">

                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">

                  <Tag className="w-6 h-6 text-white" />

                </div>

                <h3 className="font-heading text-xl font-bold mb-2">Collection Management</h3>

                <p className="text-blue-200 text-sm">

                  Create and manage product collections with bulk import features

                </p>

              </div>

              

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">

                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">

                  <ShoppingCart className="w-6 h-6 text-white" />

                </div>

                <h3 className="font-heading text-xl font-bold mb-2">Order Management</h3>

                <p className="text-blue-200 text-sm">

                  View and manage customer orders with shipment tracking

                </p>

              </div>

              

              <div className="bg-white/10 rounded-lg p-6 border border-white/20">

                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">

                  <TrendingUp className="w-6 h-6 text-white" />

                </div>

                <h3 className="font-heading text-xl font-bold mb-2">Analytics & Stats</h3>

                <p className="text-blue-200 text-sm">

                  Monitor sales, user growth, and product performance

                </p>

              </div>

            </div>

            

            <div className="text-center">

              <Link href="/admin">

                <Button className="bg-white text-blue-900 hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-full text-lg">

                  Access Admin Dashboard

                  <ArrowRight className="ml-2 h-6 w-6" />

                </Button>

              </Link>

            </div>

          </div>

        </section>

      )}



      {/* Brand Values - Redesigned */}

      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-white to-secondary/5">

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-20">

            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6">

              Our Foundation

            </h2>

            <p className="font-paragraph text-xl text-secondary max-w-3xl mx-auto">

              Every stitch tells a story of resilience. Every design reflects the journey from setback to success.

            </p>

          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {[

              { icon: TrendingUp, title: 'Resilience', desc: 'Built from losses, we understand that every failure is a stepping stone to greatness.' },

              { icon: Star, title: 'Excellence', desc: 'Every garment is crafted with precision, quality, and the determination to exceed expectations.' },

              { icon: Users, title: 'Community', desc: "We're building more than a brand - we're creating a movement of winners who never give up." }

            ].map((value) => (

              <div key={value.title} className="text-center group">

                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">

                  <value.icon className="w-12 h-12 text-white" />

                </div>

                <h3 className="font-heading text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">

                  {value.title}

                </h3>

                <p className="font-paragraph text-lg text-secondary leading-relaxed">

                  {value.desc}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Newsletter Signup - Redesigned */}

      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">

          <div className="w-32 h-32 mx-auto mb-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">

            <Sparkles className="w-16 h-16 text-white" />

          </div>

          

          <h2 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-8">

            Stay in the Loop

          </h2>

          

          <p className="font-paragraph text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">

            Be the first to know about new collections, exclusive drops, and behind-the-scenes content.

          </p>

          

          <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto mb-8">

            <input 

              type="email" 

              placeholder="Enter your email address" 

              className="flex-1 px-6 py-4 rounded-2xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"

            />

            <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 font-bold px-8 py-4 h-14 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">

              Subscribe

            </Button>

          </div>

          

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Button className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 h-12 rounded-2xl transition-all duration-300 hover:scale-105">

              Sign In for Exclusive Access

            </Button>

            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-2xl transition-all duration-300 hover:scale-105">

              Join the Movement

            </Button>

          </div>

        </div>

      </section>

    </div>

  )

}
