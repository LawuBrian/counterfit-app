"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Eye, Trash2, ArrowLeft } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, Product } from '@/lib/api'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist()
  const { addToCart } = useCart()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin?callbackUrl=/wishlist')
    }
  }, [session, status, router])

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlist.length) {
        setWishlistProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch each product by ID
        const productPromises = wishlist.map(async (productId) => {
          try {
            const response = await fetch(`/api/products/${productId}`)
            if (response.ok) {
              const data = await response.json()
              return data.data
            }
            return null
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error)
            return null
          }
        })

        const products = await Promise.all(productPromises)
        const validProducts = products.filter((product): product is Product => product !== null)
        
        setWishlistProducts(validProducts)
      } catch (error) {
        console.error('Error fetching wishlist products:', error)
        setError('Failed to load wishlist items')
      } finally {
        setLoading(false)
      }
    }

    if (wishlist.length > 0) {
      fetchWishlistProducts()
    } else {
      setWishlistProducts([])
      setLoading(false)
    }
  }, [wishlist])

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId)
  }

  const handleAddToCart = (product: Product) => {
    // Add to cart with default size (first available size)
    const defaultSize = product.sizes?.[0]?.size || 'One Size'
    addToCart(product.id, defaultSize, 1)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-6 border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-1">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist
              </p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.images?.[0]?.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      disabled={wishlistLoading}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>

                    {/* Quick view button */}
                    <Link href={`/product/${product.id}`}>
                      <button className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to cart button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
