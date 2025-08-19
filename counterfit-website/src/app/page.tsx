"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Zap, Tag, Sparkles, Shield, TrendingUp, Users, ShoppingBag, Eye, Heart } from 'lucide-react'
import SignupForm from '@/components/SignupForm'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getFeaturedProducts, getFeaturedCollections, Product, Collection } from '@/lib/api'

export default function HomePage() {
  const [showAdminInfo, setShowAdminInfo] = useState(false)
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  // Check if user is admin
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

  // Fetch featured products and collections
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

    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  // If admin, show product-focused home page
  if (isAdmin) {
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
              Premium Streetwear Collection
            </div>
            
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
              COUNTERFIT
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                STREETWEAR
              </span>
            </h1>
            
            <p className="font-paragraph text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built from losses. Worn by winners. Every garment tells a story of resilience and success.
            </p>
            
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

        {/* Featured Products - NOW FIRST! */}
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
                          <div className="inline-flex items-center rounded-full bg-primary text-white px-3 py-1 text-xs font-bold">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </div>
                        )}
                        {product.isNew && (
                          <div className="inline-flex items-center rounded-full bg-green-500 text-white px-3 py-1 text-xs font-bold">
                            NEW
                          </div>
                        )}
                      </div>
                      
                      {/* Quick actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <Heart className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <Eye className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-heading text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-paragraph text-sm text-secondary/70 mb-4 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-2xl font-bold text-primary">
                            R{product.price.toLocaleString()}
                          </span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="font-paragraph text-sm text-secondary/60 line-through">
                              R{product.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-secondary/50">
                          {product.inventory?.quantity || 0} in stock
                        </div>
                      </div>
                      
                      <Link href={`/product/${product.slug}`}>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-gray-600 mb-4">No Featured Products Yet</h3>
                <p className="font-paragraph text-gray-500 mb-8 max-w-md mx-auto">
                  We're currently setting up our featured products. Check back soon for our latest drops!
                </p>
                <Link href="/admin/products">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Add Products
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="text-center mt-16">
              <Link href="/shop">
                <Button className="group bg-primary text-white hover:bg-primary/90 font-semibold px-8 py-4 h-12 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                  View All Products
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
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
                            R{collection.basePrice.toLocaleString()}
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
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: 'Outerwear', image: '/images/outerwear/blackjacket.jpg', desc: 'Premium jackets, blazers, and coats', href: '/shop?category=outerwear' },
                { name: 'Tops', image: '/images/tops/WHITEDUOCOLLECTION.jpg', desc: 'Hoodies, tees, and performance wear', href: '/shop?category=tops' },
                { name: 'Bottoms', image: '/images/bottoms/DUONATURECAMOORBLACKWHITE MIX.jpeg', desc: 'Denim, joggers, and technical pants', href: '/shop?category=bottoms' },
                { name: 'Footwear', image: '/images/footwear/COMBOPANTSJACKET.jpeg', desc: 'Statement sneakers and street shoes', href: '/shop?category=footwear' },
                { name: 'Accessories', image: '/images/accessories/SKULLCAP.jpg', desc: 'Bags, caps, and luxury details', href: '/shop?category=accessories' }
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

  // If not admin, show landing page content
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/Luxury_jersey.jpeg"
            alt="Counterfit Luxury Streetwear"
            fill
            className="object-cover object-[50%_25%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Brand Badge */}
          <div className="inline-block mb-8 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold rounded-full border">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Coming Soon
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
            Built from losses.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Worn by winners.
            </span>
          </h1>

          {/* Brand Story */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="font-paragraph text-xl sm:text-2xl text-white/90 mb-6 leading-relaxed">
              For the ones that don't fit in.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 w-full sm:w-auto h-12 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Join the Movement
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              onClick={() => document.getElementById('brand-story-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 w-full sm:w-auto h-12 rounded-full text-lg bg-transparent shadow-lg backdrop-blur-sm"
            >
              Learn Our Story
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </div>
      </section>

             {/* Signup Section */}
       <section id="signup-section" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="inline-block mb-6 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-semibold rounded-full border">
                <Shield className="w-4 h-4 inline mr-2" />
                Early Access
              </div>
              
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
                Be First in Line
              </h2>
              
              <p className="font-paragraph text-lg text-secondary mb-8 leading-relaxed">
                While we're crafting the ultimate streetwear experience, secure your spot in the Counterfit family. 
                Get exclusive early access to drops, behind-the-scenes content, and the chance to shape our future.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-paragraph text-secondary">Exclusive early access to new collections</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-paragraph text-secondary">Behind-the-scenes content and updates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-paragraph text-secondary">Member-only pricing and perks</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/10">
                <p className="font-paragraph text-sm text-secondary">
                  <strong>Note:</strong> Our full website is currently under construction. 
                  By signing up now, you'll be notified as soon as we launch and get exclusive early access.
                </p>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                  Join the Movement
                </h3>
                <p className="font-paragraph text-secondary">
                  Create your account and be part of something bigger
                </p>
              </div>
              
              <SignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section - The Five Pillars */}
      <section id="brand-story-section" className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl lg:text-6xl font-bold mb-6">
              Our Story
            </h2>
                         <p className="font-paragraph text-xl text-gray-300 max-w-3xl mx-auto">
               Five pillars that define who we are and what we stand for. Each represents a different facet of the Counterfit movement.
             </p>
          </div>

                     {/* Pillar 1: The Hustler's Blueprint */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
             <div className="order-2 lg:order-1">
               <div className="inline-block mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 text-sm font-semibold rounded-full">
                 Pillar 1
               </div>
               <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                 The Hustler's Blueprint
               </h3>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Style:</strong> Minimalist but raw, rooted in grind culture
               </p>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Visuals:</strong> Neutral tones, oversized silhouettes, distressed textures
               </p>
               <div className="space-y-4 mb-8">
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Counterfit is built on failure turned to success
                   </p>
                 </div>
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Every garment = a lesson in resilience
                   </p>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="inline-block bg-white/10 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                   "Built from losses. Worn by winners."
                 </div>
                 <div className="inline-block bg-white/10 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                   "Grind stitched in every thread."
                 </div>
               </div>
             </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/hero/Luxury_jersey.jpeg"
                    alt="The Hustler's Blueprint - Luxury Jersey"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-amber-400">The Hustler's Blueprint</p>
                    <p className="font-paragraph text-xs text-white/80">Minimalist but raw, rooted in grind culture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Street Luxury Movement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="order-1">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/outerwear/blackjacket.jpg"
                    alt="Street Luxury Movement - Black Jacket"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-purple-400">Street Luxury Movement</p>
                    <p className="font-paragraph text-xs text-white/80">High fashion edge blended with street energy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="inline-block mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Pillar 2
              </div>
                             <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                 Street Luxury Movement
               </h3>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Style:</strong> High fashion edge blended with street energy
               </p>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Visuals:</strong> Bold graphics, statement prints, elevated cuts, striking typography
               </p>
               <div className="space-y-4 mb-8">
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Counterfit redefines what it means to "make it out"
                   </p>
                 </div>
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Luxury is no longer gated — it's the reward of ambition
                   </p>
                 </div>
               </div>
              <div className="space-y-3">
                <div className="inline-block bg-white/10 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Luxury born in the streets."
                </div>
                <div className="inline-block bg-white/10 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Your hustle is high fashion."
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Rebel Energy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Pillar 3
              </div>
                             <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                 Rebel Energy
               </h3>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Style:</strong> Provocative, unapologetic, rebellious
               </p>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Visuals:</strong> Loud colors, bold logos, disruptive slogans
               </p>
               <div className="space-y-4 mb-8">
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Counterfit is for the ones who don't conform
                   </p>
                 </div>
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Success is not about fitting in, it's about breaking rules live and loud
                   </p>
                 </div>
               </div>
              <div className="space-y-3">
                <div className="inline-block bg-white/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "For the ones who don't fit in."
                </div>
                <div className="inline-block bg-white/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Rules are for the counterfeit. We are Counterfit."
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/footwear/COMBOPANTSJACKET.jpeg"
                    alt="Rebel Energy - Combo Pants Jacket"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-red-400">Rebel Energy</p>
                    <p className="font-paragraph text-xs text-white/80">Provocative, unapologetic, rebellious</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4: Community First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="order-1">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/collections/group photo different jackets.jpg"
                    alt="Community First - Group Photo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-green-400">Community First</p>
                    <p className="font-paragraph text-xs text-white/80">Building a movement, not just a brand</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="inline-block mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Pillar 4
              </div>
                             <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                 Community First
               </h3>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Style:</strong> Inclusive, empowering, community-driven
               </p>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Visuals:</strong> Group shots, diverse representation, unity themes
               </p>
               <div className="space-y-4 mb-8">
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Counterfit is more than clothing — it's a family
                   </p>
                 </div>
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Success is sweeter when shared with those who understand the journey
                   </p>
                 </div>
               </div>
              <div className="space-y-3">
                <div className="inline-block bg-white/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "We rise together."
                </div>
                <div className="inline-block bg-white/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Your success is our success."
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 5: Tech-Driven Hype */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Pillar 5
              </div>
                             <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                 Tech-Driven Hype
               </h3>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Style:</strong> Scarcity-driven, digital-first experience
               </p>
               <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                 <strong>Visuals:</strong> QR codes on garments, live-drop exclusives, futuristic graphics
               </p>
               <div className="space-y-4 mb-8">
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     Counterfit isn't just fashion — it's an experience
                   </p>
                 </div>
                 <div className="flex items-start">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                   <p className="font-paragraph text-gray-300">
                     The brand lives where live-stream meets streetwear
                   </p>
                 </div>
               </div>
              <div className="space-y-3">
                <div className="inline-block bg-white/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Live. Limited. Legendary."
                </div>
                <div className="inline-block bg-white/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "The streetwear you can't pause."
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/tops/WHITEDUOCOLLECTION.jpg"
                    alt="Tech-Driven Hype - White Duo Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-blue-400">Tech-Driven Hype</p>
                    <p className="font-paragraph text-xs text-white/80">Scarcity-driven, digital-first experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-12 border border-white/10">
              <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                Ready to Join the Movement?
              </h3>
                             <p className="font-paragraph text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                 These five pillars represent the foundation of Counterfit. Each tells a story of resilience, ambition, and unapologetic success. 
                 Which pillar resonates with you?
               </p>
              <Button 
                onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Join the Movement
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section id="story-section" className="py-20 lg:py-32 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
              Our Foundation
            </h2>
            <p className="font-paragraph text-xl text-gray-300 max-w-3xl mx-auto">
              Every stitch tells a story of resilience. Every design reflects the journey from setback to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Resilience
              </h3>
              <p className="font-paragraph text-gray-300">
                Built from losses, we understand that every failure is a stepping stone to greatness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Excellence
              </h3>
              <p className="font-paragraph text-gray-300">
                Every garment is crafted with precision, quality, and the determination to exceed expectations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Community
              </h3>
              <p className="font-paragraph text-gray-300">
                We're building more than a brand - we're creating a movement of winners who never give up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
            Something Big is Coming
          </h2>
          
          <p className="font-paragraph text-xl text-gray-300 mb-8 leading-relaxed">
            We're not just building a website - we're crafting an experience that matches the quality of our streetwear. 
            Every detail matters, from the user interface to the checkout process.
          </p>
          
          <div className="bg-white/5 rounded-lg p-8 border border-white/10">
            <h3 className="font-heading text-2xl font-bold mb-4">
              What to Expect
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-heading font-semibold mb-2">Premium Shopping Experience</h4>
                <p className="font-paragraph text-sm text-gray-300">Seamless browsing, secure checkout, and personalized recommendations</p>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Exclusive Member Benefits</h4>
                <p className="font-paragraph text-sm text-gray-300">Early access, member pricing, and exclusive content</p>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Mobile-First Design</h4>
                <p className="font-paragraph text-sm text-gray-300">Optimized for every device, ensuring the best experience anywhere</p>
              </div>
              <div>
                <h4 className="font-heading font-semibold mb-2">24/7 Support</h4>
                <p className="font-paragraph text-sm text-gray-300">Dedicated customer service for the Counterfit family</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          
          <p className="font-paragraph text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don't wait for the launch. Be part of the foundation. Sign up now and secure your place in the Counterfit family.
          </p>
          
          <Button 
            onClick={() => document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 h-12 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          
          <p className="font-paragraph text-sm text-white/70 mt-6">
            Join thousands of others who are already part of the movement
          </p>
        </div>
      </section>
    </div>
  )
}