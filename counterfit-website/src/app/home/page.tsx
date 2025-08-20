"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, ShoppingBag, Users, TrendingUp, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { useState, useRef } from 'react'

export default function OriginalHomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

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
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Brand Badge */}
          <div className="inline-block mb-12 bg-white/15 text-white border-white/25 backdrop-blur-md px-6 py-3 text-sm font-semibold rounded-full border tracking-wide">
            <Star className="w-4 h-4 inline mr-2" />
            Premium Streetwear
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-12 tracking-tighter leading-none">
            COUNTERFIT
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              STREETWEAR
            </span>
          </h1>

          {/* Brand Story */}
          <div className="max-w-5xl mx-auto mb-16">
            <p className="font-paragraph text-2xl sm:text-3xl text-white/95 mb-8 leading-relaxed font-medium">
              Built from losses. Worn by winners. Every garment tells a story of resilience and success.
            </p>
            <p className="font-paragraph text-xl sm:text-2xl text-white/85 leading-relaxed">
              Join the movement that redefines what it means to make it out.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-white/90 font-bold px-12 py-6 w-full sm:w-auto h-16 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0">
                Shop Now
                <ShoppingBag className="ml-3 h-7 w-7" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/15 font-bold px-12 py-6 w-full sm:w-auto h-16 rounded-full text-xl bg-transparent shadow-2xl backdrop-blur-md transition-all duration-300"
              >
                View Collections
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-8 h-8 text-white rotate-90" />
          </div>
        </div>
      </section>

      {/* Featured Collections with Horizontal Scroll */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
              Featured Collections
            </h2>
            <p className="font-paragraph text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover our latest drops and exclusive pieces that define the Counterfit aesthetic.
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative group">
            {/* Scroll Navigation Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-6"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-6"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Scrollable Collections */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Collection 1 */}
              <div className="group cursor-pointer flex-shrink-0 w-80">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src="/images/outerwear/blackjacket.jpg"
                    alt="Black Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">Black Collection</h3>
                    <p className="font-paragraph text-white/90 text-lg">Timeless elegance</p>
                  </div>
                </div>
              </div>

              {/* Collection 2 */}
              <div className="group cursor-pointer flex-shrink-0 w-80">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src="/images/collections/WHITEJACKET.jpeg"
                    alt="White Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">White Collection</h3>
                    <p className="font-paragraph text-white/90 text-lg">Pure sophistication</p>
                  </div>
                </div>
              </div>

              {/* Collection 3 */}
              <div className="group cursor-pointer flex-shrink-0 w-80">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src="/images/bottoms/DUONATURECAMOORBLACKWHITE MIX.jpeg"
                    alt="Camo Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">Camo Collection</h3>
                    <p className="font-paragraph text-white/90 text-lg">Urban warrior</p>
                  </div>
                </div>
              </div>

              {/* Collection 4 */}
              <div className="group cursor-pointer flex-shrink-0 w-80">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src="/images/collections/WHITEDUOCOLLECTION.jpg"
                    alt="Combo Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">Combo Collection</h3>
                    <p className="font-paragraph text-white/90 text-lg">Complete looks</p>
                  </div>
                </div>
              </div>

              {/* Collection 5 */}
              <div className="group cursor-pointer flex-shrink-0 w-80">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <Image
                    src="/images/collections/LUXURYJACKET.jpeg"
                    alt="Luxury Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">Luxury Collection</h3>
                    <p className="font-paragraph text-white/90 text-lg">Premium materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/collections">
              <Button className="bg-black text-white hover:bg-gray-800 font-bold px-12 py-6 h-16 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                View All Collections
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
                Our Story
              </h2>
              <p className="font-paragraph text-xl text-gray-600 mb-8 leading-relaxed">
                Counterfit was born from the streets, built on the foundation of failure turned to success. 
                Every garment we create carries the DNA of resilience and the spirit of those who never give up.
              </p>
              <p className="font-paragraph text-xl text-gray-600 mb-10 leading-relaxed">
                We're not just selling clothes - we're building a movement. A movement of winners who understand 
                that every setback is a setup for a comeback.
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white font-bold px-12 py-6 h-16 rounded-full text-xl transition-all duration-300">
                  Learn More
                  <ArrowRight className="ml-3 h-7 w-7" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/collections/LUXURYJACKET.jpeg"
                  alt="Counterfit Story"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="w-24 h-24 mx-auto mb-8 bg-white/15 rounded-full flex items-center justify-center border border-white/25">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-heading text-4xl font-black mb-4">10K+</h3>
              <p className="font-paragraph text-gray-300 text-lg">Members Worldwide</p>
            </div>
            
            <div>
              <div className="w-24 h-24 mx-auto mb-8 bg-white/15 rounded-full flex items-center justify-center border border-white/25">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-heading text-4xl font-black mb-4">50+</h3>
              <p className="font-paragraph text-gray-300 text-lg">Exclusive Pieces</p>
            </div>
            
            <div>
              <div className="w-24 h-24 mx-auto mb-8 bg-white/15 rounded-full flex items-center justify-center border border-white/25">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-heading text-4xl font-black mb-4">100%</h3>
              <p className="font-paragraph text-gray-300 text-lg">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight">
            Ready to Join the Movement?
          </h2>
          <p className="font-paragraph text-2xl text-gray-600 mb-12 leading-relaxed">
            Don't just wear clothes. Wear your story. Wear your success. Wear Counterfit.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800 font-bold px-12 py-6 h-16 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                Shop Now
                <ShoppingBag className="ml-3 h-7 w-7" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white font-bold px-12 py-6 h-16 rounded-full text-xl transition-all duration-300">
                Contact Us
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
