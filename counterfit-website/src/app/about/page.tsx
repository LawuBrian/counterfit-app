import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Award, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Matching scraped HTML exactly */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/1d66cc_dc09395d524b42e2a9c625edaf733302_mv2.png"
            alt="About Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              Our Story
            </div>
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 tracking-tight">
              Redefining streetwear with a blend of luxury, innovation, and timeless design
            </h1>
            <p className="font-paragraph text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl">
              Counterfit represents the evolution of streetwear—where luxury meets innovation and timeless design. Founded by visionary Paki and Jareed, our brand redefines what premium streetwear can be, creating pieces that transcend trends and establish new standards of excellence in contemporary fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Counterfit Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img
            src="/Counterfit.png"
            alt="Counterfit Logo Background"
            className="max-w-full max-h-full object-contain"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '80%',
              maxHeight: '80%'
            }}
          />
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-8">Paki and Jareed's Vision</h2>
            <p className="font-paragraph text-xl text-secondary leading-relaxed mb-8">
              "Redefining streetwear with a blend of luxury, innovation, and timeless design" isn't just our tagline— it's the foundation of everything we create. Our mission is to bridge the gap between high fashion and street culture, crafting pieces that honor both heritage and future possibilities.
            </p>
            <p className="font-paragraph text-xl text-secondary leading-relaxed mb-8">
              Every collection tells a story of meticulous craftsmanship, innovative materials, and design philosophy that respects the past while boldly stepping into the future. We create for individuals who appreciate the artistry behind exceptional streetwear and understand that true luxury lies in the details.
            </p>
            <p className="font-paragraph text-xl text-secondary leading-relaxed mb-12">
              Our commitment extends beyond creating beautiful garments. We're building a community of individuals who share our passion for excellence, innovation, and authentic self-expression. Each piece we design is a testament to our belief that luxury streetwear should not only look exceptional but also tell a story of craftsmanship, creativity, and cultural relevance.
            </p>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8">
              <Link href="/collections" className="flex items-center">
                Explore Our Collections
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </button>
          </div>
        </div>
      </section>
      {/* Values Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-primary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Our Values</h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              These core principles guide everything we do, from design to production to customer service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-xl text-primary bg-background text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Innovation & Excellence</h3>
                <p className="font-paragraph text-secondary leading-relaxed">
                  We believe in pushing boundaries and never settling for mediocrity. Every piece we create embodies the spirit of innovation and timeless design.
                </p>
              </div>
            </div>

            <div className="rounded-xl text-primary bg-background text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Premium Quality</h3>
                <p className="font-paragraph text-secondary leading-relaxed">
                  Using only the finest materials and craftsmanship, we ensure every product meets our exacting standards of luxury and durability.
                </p>
              </div>
            </div>

            <div className="rounded-xl text-primary bg-background text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Community First</h3>
                <p className="font-paragraph text-secondary leading-relaxed">
                  Our customers are more than buyers - they're part of a movement. We build products for a community that shares our values.
                </p>
              </div>
            </div>

            <div className="rounded-xl text-primary bg-background text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-4">Global Impact</h3>
                <p className="font-paragraph text-secondary leading-relaxed">
                  From local communities to global markets, we strive to make a positive impact through sustainable practices and ethical production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Our Journey</h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              From humble beginnings to global recognition, here's how we've grown while staying true to our values
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 hidden lg:block"></div>
            <div className="space-y-12 lg:space-y-16">
              {[
                { year: "2020", title: "The Beginning", description: "Founded with a vision to create luxury streetwear that blends innovation, quality, and timeless design.", align: "left" },
                { year: "2021", title: "First Collection", description: "Launched our debut collection, introducing Paki and Jareed's vision of luxury streetwear with innovative design and premium materials.", align: "right" },
                { year: "2022", title: "Design Innovation", description: "Pioneered new techniques in streetwear construction, blending traditional craftsmanship with modern innovation.", align: "left" },
                { year: "2023", title: "Timeless Collections", description: "Established our signature aesthetic of timeless design, creating pieces that transcend seasonal trends.", align: "right" },
                { year: "2024", title: "Luxury Redefined", description: "Recognized globally for redefining streetwear through our unique blend of luxury, innovation, and timeless design.", align: "left" }
              ].map((item, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${item.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                  <div className="flex-1 lg:text-right lg:pr-8">
                    <div className={`rounded-xl text-primary bg-background border-0 shadow-lg ${item.align === 'right' ? 'lg:mr-auto' : 'lg:ml-auto'} max-w-md`}>
                      <div className="p-6">
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 mb-3 bg-primary text-primary-foreground">
                          {item.year}
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-primary mb-3">{item.title}</h3>
                        <p className="font-paragraph text-secondary">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg hidden lg:block relative z-10"></div>
                  <div className="flex-1 lg:pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-secondary/10 relative overflow-hidden">
        {/* Counterfit Logo Background - Lighter */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
          <img
            src="/Counterfit.png"
            alt="Counterfit Logo Background"
            className="max-w-full max-h-full object-contain"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '70%',
              maxHeight: '70%'
            }}
          />
        </div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary/10 text-primary border-primary/20">
              Founders & Visionaries
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Meet Paki and Jareed</h2>
            <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
              The visionaries behind Counterfit, Paki and Jareed embody the innovation and excellence that defines our brand. With an unwavering commitment to quality and a deep understanding of streetwear culture, they have built Counterfit from the ground up with one simple belief: luxury should be earned, not given.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="text-center">
              <div className="rounded-xl text-primary bg-background overflow-hidden border-0 shadow-xl mb-6">
                <img
                  src="/1d66cc_66511221e56e4b67affdb858a760d1d1_mv2.jpg"
                  alt="Jareed - Co-Founder"
                  className="w-full h-96 object-cover object-top"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">Jareed</h3>
              <p className="font-paragraph text-primary/80 font-medium mb-4">Co-Founder & Creative Director</p>
              <p className="font-paragraph text-secondary leading-relaxed">
                Jareed brings a unique vision to luxury streetwear, combining innovative design with authentic street culture. His attention to detail and commitment to quality drives Counterfit's creative direction.
              </p>
            </div>
            <div className="text-center">
              <div className="rounded-xl text-primary bg-background overflow-hidden border-0 shadow-xl mb-6">
                <img
                  src="/1d66cc_683d78523e1245cca8cd52071e84612c_mv2.png"
                  alt="Paki - Co-Founder"
                  className="w-full h-96 object-cover object-top"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">Paki</h3>
              <p className="font-paragraph text-primary/80 font-medium mb-4">Co-Founder & Brand Strategist</p>
              <p className="font-paragraph text-secondary leading-relaxed">
                Paki's strategic vision and deep understanding of fashion culture helps shape Counterfit's brand identity. His passion for excellence ensures every piece reflects the brand's commitment to luxury streetwear.
              </p>
            </div>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
              Drawing from a deep appreciation for both luxury fashion and authentic street culture, Paki and Jareed created Counterfit to bridge these worlds through innovative design and uncompromising quality. Every piece reflects their shared vision of streetwear that transcends temporary trends to become timeless statements.
            </p>
            <blockquote className="font-paragraph text-xl text-primary leading-relaxed mb-8 italic border-l-4 border-primary pl-6">
              "Our vision for Counterfit is simple: redefining streetwear with a blend of luxury, innovation, and timeless design. We're not just creating clothes—we're crafting the future of premium streetwear, where every detail matters and every piece tells a story of excellence."
            </blockquote>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8">
                <Link href="/collections" className="flex items-center">
                  View Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary text-primary bg-transparent shadow-sm hover:bg-primary/90 hover:text-primary-foreground h-10 rounded-md px-8">
                <Link href="/contact">Connect With Us</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Join The Movement</h2>
          <p className="font-paragraph text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Ready to be part of something bigger? Discover our collections and join thousands of others who refuse to quit on their dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-10 rounded-md bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8">
              <Link href="/shop" className="flex items-center">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-transparent shadow-sm hover:text-primary-foreground h-10 rounded-md border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
              <Link href="/contact">Get In Touch</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}