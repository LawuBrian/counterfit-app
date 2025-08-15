import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Calendar, Users, Tag, Clock } from 'lucide-react'
import { getFeaturedCollections, getCollections, getImageUrl, getCollectionUrl, type Collection } from '@/lib/api'

async function CollectionsPage() {
  // Fetch collections from the backend
  const featuredCollectionsResponse = await getFeaturedCollections(6)
  const allCollectionsResponse = await getCollections({ status: 'active', limit: 10 })
  
  const featuredCollections = featuredCollectionsResponse.success ? featuredCollectionsResponse.data : []
  const allCollections = allCollectionsResponse.success ? allCollectionsResponse.data : []

  // Fallback collections for demo purposes when no collections exist
  const fallbackCollections = [
    {
      id: 1,
      name: "Platform Series",
      subtitle: "Elevated Streetwear",
      description: "Elevated streetwear that puts you on another level. Clean lines, premium materials, and statement silhouettes.",
      image: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png",
      badge: "Signature",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      status: "Coming Soon",
      featuredItems: [
        { name: "Platform Blazer", price: "R1,350" },
        { name: "Elevated Denim", price: "R840" },
        { name: "Statement Sneakers", price: "R960" }
      ]
    },
    {
      id: 2,
      name: "Dynamic Motion",
      subtitle: "Athletic Luxury",
      description: "For those who move with purpose. Athletic-inspired pieces that blur the line between performance and style.",
      image: "/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png",
      badge: "Performance",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      status: "Coming Soon",
      featuredItems: [
        { name: "Motion Track Jacket", price: "R1,140" },
        { name: "Technical Cargo Pants", price: "R960" },
        { name: "Performance Tee", price: "R360" }
      ]
    }
  ]

  // Use actual collections or fallback for demo
  const displayCollections = featuredCollections.length > 0 ? featuredCollections.slice(0, 2) : fallbackCollections
  const gridCollections = allCollections.length > 0 ? allCollections.slice(2) : []

  // Additional fallback collections for the grid section
  const fallbackGridCollections = [
    {
      name: "Urban Explorer",
      description: "Bold patterns and textures for the modern adventurer. Pieces that make a statement without saying a word.",
      image: "/images/1d66cc_cde498cebe1e46d6a5caf466f6343ed9_mv2.png",
      badge: "Limited",
      items: 3,
      priceFrom: "R540",
      status: "Coming Soon"
    },
    {
      name: "Spotlight Series",
      description: "For those who command attention. Premium pieces designed for moments that matter.",
      image: "/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png",
      badge: "Premium",
      items: 3,
      priceFrom: "R255",
      status: "Coming Soon"
    },
    {
      name: "Retro Athletics",
      description: "Classic athletic aesthetics reimagined for today. Vintage-inspired pieces with modern construction.",
      image: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png",
      badge: "Heritage",
      items: 3,
      priceFrom: "R480",
      status: "Coming Soon"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Matching scraped HTML exactly */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/resources/DSC00158.jpeg"
            alt="Counterfit Collections - Group Streetwear"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            Luxury Streetwear Collections
          </div>
          <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">Our Collections</h1>
          <p className="font-paragraph text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover Paki and Jareed's vision brought to life through collections that redefine streetwear with luxury, innovation, and timeless design. Each piece tells a story of exceptional craftsmanship.
          </p>
        </div>
      </section>

      {/* Signature Collections - Matching scraped HTML layout */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Signature Collections</h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">Our most iconic collections that define the Counterfit aesthetic</p>
          </div>
          
          <div className="space-y-16">
            {displayCollections.map((collection, index) => (
              <div key={collection._id || collection.id || index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Image */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="rounded-xl text-primary bg-background overflow-hidden border-0 shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={getImageUrl(collection.image || '/placeholder-collection.jpg')}
                        alt={collection.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div>
                    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20 mb-4">
                      <Tag className="w-3 h-3 mr-1" />
                      Collection
                    </div>
                    <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-4">
                      {collection.name}
                    </h3>
                    <p className="font-paragraph text-lg text-secondary leading-relaxed mb-6">
                      {collection.description || 'Discover unique pieces that define our brand aesthetic and showcase premium craftsmanship.'}
                    </p>
                    
                    {/* Status */}
                    <div className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow mb-6 bg-green-100 text-green-800 border-green-300">
                      <Clock className="w-4 h-4 mr-2" />
                      Available Now
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={getCollectionUrl(collection)}>
                      <Button className="flex-1 sm:flex-none">
                        <div className="flex items-center">
                          Explore Collection
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Collection Range - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-primary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Complete Collection Range</h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">Explore our full range of collections, each with its own unique character and style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(gridCollections.length > 0 ? gridCollections : fallbackGridCollections).map((collection, index) => (
              <Link key={collection._id || index} href={getCollectionUrl(collection)} className="rounded-xl text-primary bg-background group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={getImageUrl(collection.image || '/placeholder-collection.jpg')}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6">
                    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-white/20 text-white border-white/30">
                      Collection
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-3">{collection.name}</h3>
                    <p className="font-paragraph text-white/90 text-sm mb-4 line-clamp-3">
                      {collection.description || 'Explore this curated collection of premium streetwear pieces.'}
                    </p>
                    <Button className="bg-white text-black hover:bg-white/90 w-full group-hover:scale-105 transition-transform">
                      <div className="flex items-center justify-center">
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">Premium Quality</h3>
              <p className="font-paragraph text-secondary">Every piece is crafted with the finest materials and attention to detail.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">Limited Drops</h3>
              <p className="font-paragraph text-secondary">Exclusive releases that ensure you stand out from the crowd.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">Authentic Style</h3>
              <p className="font-paragraph text-secondary">Designs that reflect genuine streetwear culture and innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Elevate Your Style?</h2>
          <p className="font-paragraph text-lg text-white/90 mb-8 max-w-2xl mx-auto">Browse our complete collection or get personalized styling recommendations from our team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8" disabled>
              <Link href="#" className="flex items-center">
                Collections Coming Soon
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
              <Link href="/contact">
                Personal Styling
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CollectionsPage