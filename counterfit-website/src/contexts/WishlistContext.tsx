"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface WishlistContextType {
  wishlist: string[]
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch user's wishlist on mount
  useEffect(() => {
    if (session?.user) {
      console.log('🔄 User session found, fetching wishlist for:', session.user.id)
      fetchWishlist()
    } else {
      console.log('🔄 No user session, clearing wishlist')
      setWishlist([])
    }
  }, [session])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/wishlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWishlist(data.data || [])
      } else {
        console.error('Failed to fetch wishlist:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!session?.user) {
      alert('Please sign in to add items to your wishlist')
      return
    }

    console.log('🔄 Adding product to wishlist:', productId)

    try {
      setLoading(true)
      const response = await fetch(`/api/users/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📥 Wishlist add response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('📄 Wishlist add response data:', data)
        setWishlist(data.wishlist || [])
        console.log('✅ Successfully added to wishlist')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Wishlist add failed:', errorData)
        throw new Error(errorData.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error)
      alert(`Failed to add to wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/users/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert(`Failed to remove from wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
