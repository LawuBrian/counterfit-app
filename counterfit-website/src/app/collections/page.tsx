import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Calendar, Users, Tag, Clock } from 'lucide-react'
import { getFeaturedCollections, getCollections, getImageUrl, getCollectionUrl, type Collection } from '@/lib/api'

async function CollectionsPage() {
  // Fetch collections from the backend
  const featuredCollectionsResponse = await getFeaturedCollections(6)
  const allCollectionsResponse = await getCollections({ status: 'published', limit: 10 })
  
  const featuredCollections = featuredCollectionsResponse.success ? featuredCollectionsResponse.data : []
  const allCollections = allCollectionsResponse.success ? allCollectionsResponse.data : []

  // If no collections exist, show empty state
  if (featuredCollections.length === 0 && allCollections.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Collections
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Discover our curated product collections
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No collections yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Collections will appear here once they're created.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Collections
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover our curated product collections
            </p>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Collections</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our most popular and trending collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredCollections.map((collection) => (
              <div key={collection.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={getImageUrl(collection.image)}
                    alt={collection.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {collection.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                      {collection.collectionType || 'Collection'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-white/90 mb-4 line-clamp-2">{collection.description}</p>
                  
                  <Link href={getCollectionUrl(collection.slug)}>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Collections Grid */}
      {allCollections.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">All Collections</h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse through all our available collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCollections.map((collection) => (
              <div key={collection.id} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={getImageUrl(collection.image)}
                    alt={collection.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {collection.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {collection.collectionType || 'Collection'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{collection.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{collection.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      R{collection.basePrice || 0}
                    </span>
                    
                    <Link href={getCollectionUrl(collection.slug)}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionsPage