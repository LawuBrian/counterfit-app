"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color?: string // Make color optional
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (id: string, size: string, color?: string) => void
  updateQuantity: (id: string, size: string, color?: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    console.log('🛒 Adding to cart:', item)
    console.log('🛒 Quantity being added:', item.quantity)
    
    setItems(currentItems => {
      const existingItem = currentItems.find(
        cartItem => cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
      )

      if (existingItem) {
        console.log('🛒 Existing item found, updating quantity')
        return currentItems.map(cartItem =>
          cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        )
      }

      console.log('🛒 New item, adding to cart')
      return [...currentItems, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (id: string, size: string, color?: string) => {
    setItems(currentItems =>
      currentItems.filter(item => !(item.id === id && item.size === size && item.color === color))
    )
  }

  const updateQuantity = (id: string, size: string, color?: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
