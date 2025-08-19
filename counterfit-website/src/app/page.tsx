"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Zap, Tag, Sparkles, Shield, TrendingUp, Users } from 'lucide-react'
import SignupForm from '@/components/SignupForm'
import { useState } from 'react'

export default function HomePage() {
  const [showAdminInfo, setShowAdminInfo] = useState(false)

    // Admin bypass - redirect to full website
  if (typeof window !== 'undefined' && window.location.search.includes('admin')) {
    // Redirect to the original website structure
    window.location.href = '/shop'
    return null
  }

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
              Counterfit is built on failure turned to success. Every garment = a lesson in resilience.
            </p>
            <p className="font-paragraph text-lg sm:text-xl text-white/80 leading-relaxed">
              The drip is a reminder that "mistakes are not the end, they're the foundation."
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
                <strong>Style Influence:</strong> Fear of God / A-COLD-WALL (minimalist but raw, rooted in grind culture)
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
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    The drip is a reminder that "mistakes are not the end, they're the foundation"
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
                    src="/resources/Luxury_jersey.jpeg"
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
                    src="/resources/blackjacket.jpg"
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
                <strong>Style Influence:</strong> Off-White / Palm Angels (high fashion edge blended with street energy)
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
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    Streetwear as a crown for the self-made
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
                <strong>Style Influence:</strong> Supreme / Stüssy (provocative, unapologetic, rebellious)
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
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    Every drop is an act of defiance against the system
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
                    src="/resources/COMBOPANTSJACKET.jpeg"
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

          {/* Pillar 4: Cultural Movement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="order-1">
              <div className="relative group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/resources/DUONATURECAMOORBLACKWHITE MIX.jpeg"
                    alt="Cultural Movement - Duo Nature Camo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-heading text-sm font-semibold text-green-400">Cultural Movement</p>
                    <p className="font-paragraph text-xs text-white/80">Deeply tied to community, music, and heritage</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="inline-block mb-6 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Pillar 4
              </div>
              <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
                Cultural Movement
              </h3>
              <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                <strong>Style Influence:</strong> Daily Paper / Trapstar (deeply tied to community, music, and heritage)
              </p>
              <p className="font-paragraph text-lg text-gray-300 mb-6 leading-relaxed">
                <strong>Visuals:</strong> African-inspired patterns, amapiano & hip-hop collabs, storytelling designs
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    Counterfit is more than clothes — it's culture in motion
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    Our success = our people's success
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    Community is our runway
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="inline-block bg-white/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "Worn by the culture. Powered by the streets."
                </div>
                <div className="inline-block bg-white/10 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm font-semibold">
                  "From our block to the world."
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
                <strong>Style Influence:</strong> Corteiz / Nike SNKRS (scarcity-driven, digital-first)
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
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                  <p className="font-paragraph text-gray-300">
                    The hustle of tomorrow = digital, instant, and global
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
                    src="/resources/WHITEDUOCOLLECTION.jpg"
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