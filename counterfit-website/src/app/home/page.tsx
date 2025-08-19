"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react'

export default function OriginalHomePage() {
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Brand Badge */}
          <div className="inline-block mb-8 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold rounded-full border">
            <Star className="w-4 h-4 inline mr-2" />
            Premium Streetwear
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
            COUNTERFIT
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              STREETWEAR
            </span>
          </h1>

          {/* Brand Story */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="font-paragraph text-xl sm:text-2xl text-white/90 mb-6 leading-relaxed">
              Built from losses. Worn by winners. Every garment tells a story of resilience and success.
            </p>
            <p className="font-paragraph text-lg sm:text-xl text-white/80 leading-relaxed">
              Join the movement that redefines what it means to make it out.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/shop">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 w-full sm:w-auto h-12 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                Shop Now
                <ShoppingBag className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 w-full sm:w-auto h-12 rounded-full text-lg bg-transparent shadow-lg backdrop-blur-sm"
              >
                View Collections
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Collections
            </h2>
            <p className="font-paragraph text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our latest drops and exclusive pieces that define the Counterfit aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Collection 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg mb-4">
                <Image
                  src="/resources/blackjacket.jpg"
                  alt="Black Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-xl font-bold text-white">Black Collection</h3>
                  <p className="font-paragraph text-white/80">Timeless elegance</p>
                </div>
              </div>
            </div>

            {/* Collection 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg mb-4">
                <Image
                  src="/resources/WHITEJACKET.jpeg"
                  alt="White Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-xl font-bold text-white">White Collection</h3>
                  <p className="font-paragraph text-white/80">Pure sophistication</p>
                </div>
              </div>
            </div>

            {/* Collection 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg mb-4">
                <Image
                  src="/resources/DUONATURECAMOORBLACKWHITE MIX.jpeg"
                  alt="Camo Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-xl font-bold text-white">Camo Collection</h3>
                  <p className="font-paragraph text-white/80">Urban warrior</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/collections">
              <Button className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-4 h-12 rounded-full text-lg">
                View All Collections
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="font-paragraph text-lg text-gray-600 mb-6 leading-relaxed">
                Counterfit was born from the streets, built on the foundation of failure turned to success. 
                Every garment we create carries the DNA of resilience and the spirit of those who never give up.
              </p>
              <p className="font-paragraph text-lg text-gray-600 mb-8 leading-relaxed">
                We're not just selling clothes - we're building a movement. A movement of winners who understand 
                that every setback is a setup for a comeback.
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white font-semibold px-8 py-4 h-12 rounded-full text-lg">
                  Learn More
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/resources/COMBOPANTSJACKET.jpeg"
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
      <section className="py-20 lg:py-32 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-3xl font-bold mb-2">10K+</h3>
              <p className="font-paragraph text-gray-300">Members Worldwide</p>
            </div>
            
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-3xl font-bold mb-2">50+</h3>
              <p className="font-paragraph text-gray-300">Exclusive Pieces</p>
            </div>
            
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-heading text-3xl font-bold mb-2">100%</h3>
              <p className="font-paragraph text-gray-300">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="font-paragraph text-xl text-gray-600 mb-8">
            Don't just wear clothes. Wear your story. Wear your success. Wear Counterfit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-4 h-12 rounded-full text-lg">
                Shop Now
                <ShoppingBag className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white font-semibold px-8 py-4 h-12 rounded-full text-lg">
                Contact Us
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
