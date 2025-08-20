import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Award, Users, Globe, Zap, Crown, Shield, Rocket, Star, Flame } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Redesigned with dynamic elements */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/1d66cc_02957a89db7f40e2a786b097e46c6c79_mv2.png"
            alt="COUNTERFIT Team - Luxury Streetwear Excellence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary/60"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              Built Different
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 tracking-tight leading-tight">
              Built from Losses.<br />
              Worn by Winners.
            </h1>
            <p className="font-paragraph text-base lg:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl">
              Founded by Paki and Jareed, Counterfit creates premium streetwear that embodies the hustle, the grind, and the unbreakable spirit of those who refuse to quit.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary-foreground to-primary-foreground/90 text-primary hover:from-primary-foreground/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary-foreground/25">
                <Link href="/collections" className="flex items-center">
                  <span className="relative z-10">Explore Collections</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section - Modular Design */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">The Four Pillars</h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              These are the foundations that drive everything we create and every story we tell
            </p>
          </div>
          
          {/* Pillar 1: The Hustler's Blueprint */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 mb-4 bg-primary text-primary-foreground">
                Pillar 1
              </div>
              <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">The Hustler's Blueprint</h3>
              <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
                Counterfit is built on failure turned to success. Every garment represents a lesson in resilience, a testament to the grind that never stops.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">Every piece embodies the spirit of turning setbacks into comebacks</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">The drip serves as a reminder that mistakes are not the end, they're the foundation</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                <p className="font-paragraph text-primary font-semibold italic">"Built from losses. Worn by winners."</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png"
                  alt="The Hustler's Blueprint - Premium COUNTERFIT Collection"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pillar 2: Street Luxury Movement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png"
                  alt="Street Luxury Movement - Premium Streetwear"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 mb-4 bg-primary text-primary-foreground">
                Pillar 2
              </div>
              <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">Street Luxury Movement</h3>
              <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
                We're redefining what it means to "make it out." Luxury is no longer gated—it's the reward of ambition and the crown for the self-made.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">Streetwear becomes a symbol of achievement and self-determination</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">Every collection celebrates the journey from the streets to success</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                <p className="font-paragraph text-primary font-semibold italic">"Luxury born in the streets."</p>
              </div>
            </div>
          </div>

          {/* Pillar 3: Rebel Energy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 mb-4 bg-primary text-primary-foreground">
                Pillar 3
              </div>
              <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">Rebel Energy</h3>
              <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
                Counterfit is for the ones who don't conform. Success isn't about fitting in—it's about breaking rules and living loud, unapologetically.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">Every drop is an act of defiance against the conventional system</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">We celebrate individuality and the courage to stand apart from the crowd</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                <p className="font-paragraph text-primary font-semibold italic">"For the ones who don't fit in."</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png"
                  alt="Rebel Energy - Premium Streetwear"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pillar 4: Tech-Driven Hype */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png"
                  alt="Tech-Driven Hype - Future of Streetwear"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 mb-4 bg-primary text-primary-foreground">
                Pillar 4
              </div>
              <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">Tech-Driven Hype</h3>
              <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
                Counterfit isn't just fashion—it's an experience. The brand lives where live-stream meets streetwear, creating instant global connections.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">The hustle of tomorrow is digital, instant, and globally accessible</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-paragraph text-secondary">Every piece connects you to a worldwide community of hustlers</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-l-4 border-primary">
                <p className="font-paragraph text-primary font-semibold italic">"Live. Limited. Legendary."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section - Redesigned with more personality */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary/5 to-primary/5 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary/10 text-primary border-primary/20">
              The Visionaries
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Paki & Jareed</h2>
            <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
              Two hustlers who turned their vision into reality. They built Counterfit from the ground up with one simple belief: luxury should be earned, not given.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="text-center group">
              <div className="rounded-2xl text-primary bg-background overflow-hidden border-0 shadow-xl mb-6 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src="/1d66cc_66511221e56e4b67affdb858a760d1d1_mv2.jpg"
                  alt="Jareed - Co-Founder & Creative Visionary"
                  className="w-full h-96 object-cover object-top"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">Jareed</h3>
              <p className="font-paragraph text-primary/80 font-medium mb-4">Co-Founder & Creative Director</p>
              <p className="font-paragraph text-secondary leading-relaxed">
                The creative force behind Counterfit's aesthetic. Jareed brings raw street energy and innovative design to every collection, ensuring each piece tells a story of resilience and ambition.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="rounded-2xl text-primary bg-background overflow-hidden border-0 shadow-xl mb-6 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src="/1d66cc_683d78523e1245cca8cd52071e84612c_mv2.png"
                  alt="Paki - Co-Founder & Brand Strategist"
                  className="w-full h-96 object-cover object-top"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">Paki</h3>
              <p className="font-paragraph text-primary/80 font-medium mb-4">Co-Founder & Brand Strategist</p>
              <p className="font-paragraph text-secondary leading-relaxed">
                The strategic mind that shapes Counterfit's future. Paki's understanding of culture and community ensures every drop connects with the hustlers who refuse to quit on their dreams.
              </p>
            </div>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-8 border border-primary/20">
              <blockquote className="font-paragraph text-xl text-primary leading-relaxed mb-4 italic">
                "We're not just creating clothes—we're crafting the future of premium streetwear. Every detail matters, every piece tells a story of excellence, and every collection is built for those who understand that the grind never stops."
              </blockquote>
              <p className="font-paragraph text-secondary font-medium">- Paki & Jareed</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/25">
                <Link href="/collections" className="flex items-center">
                  <span className="relative z-10">View Collections</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground to-primary-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group relative overflow-hidden border-2 border-primary text-primary hover:text-primary-foreground hover:bg-primary transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/25">
                <Link href="/contact" className="flex items-center">
                  <span className="relative z-10">Connect With Us</span>
                  <Zap className="ml-2 h-5 w-5 relative z-10 group-hover:animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Redesigned with more urgency */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Ready to Join The Movement?</h2>
          <p className="font-paragraph text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            This isn't just about fashion. It's about joining thousands of others who refuse to quit on their dreams. The grind never stops, and neither do we.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary-foreground to-primary-foreground/90 text-primary hover:from-primary-foreground/90 hover:to-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary-foreground/25 font-semibold">
              <Link href="/shop" className="flex items-center">
                <span className="relative z-10">Shop Now</span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group relative overflow-hidden border-2 border-primary-foreground text-primary-foreground hover:text-primary hover:bg-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary-foreground/25 font-semibold">
              <Link href="/contact" className="flex items-center">
                <span className="relative z-10">Get In Touch</span>
                <Star className="ml-2 h-5 w-5 relative z-10 group-hover:animate-spin" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}