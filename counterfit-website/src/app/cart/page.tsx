"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Lock, Truck, Shield } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  const incrementQuantity = (id: number, size: string, color: string, currentQuantity: number) => {
    updateQuantity(id, size, color, currentQuantity + 1)
  }

  const decrementQuantity = (id: number, size: string, color: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, size, color, currentQuantity - 1)
    }
  }

  const handleRemoveItem = (id: number, size: string, color: string) => {
    removeFromCart(id, size, color)
  }

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  const shipping = getTotalPrice() >= 1000 ? 0 : 150
  const tax = Math.round(getTotalPrice() * 0.15) // 15% VAT
  const finalTotal = getTotalPrice() + shipping + tax

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/cart')
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            variantId: null, // You might want to add variant support
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert('Error creating checkout session. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error processing checkout. Please try again.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Empty Cart */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-primary/60" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="font-paragraph text-lg text-secondary mb-8 max-w-2xl mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our collections and find something you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-semibold">
                <Link href="/shop" className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/collections" className="flex items-center">
                  View Collections
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/shop" className="inline-flex items-center text-secondary hover:text-primary transition-colors mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
              <h1 className="font-heading text-4xl font-bold text-primary">Shopping Cart</h1>
              <p className="font-paragraph text-secondary mt-2">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={handleClearCart} className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="bg-background border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-secondary">
                              <span>Size: <span className="font-medium text-primary">{item.size}</span></span>
                              <span>Color: <span className="font-medium text-primary">{item.color}</span></span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                            className="p-2 text-secondary hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => decrementQuantity(item.id, item.size, item.color, item.quantity)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[60px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => incrementQuantity(item.id, item.size, item.color, item.quantity)}
                              className="p-2 text-primary hover:bg-gray-50 rounded-r-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-heading text-xl font-bold text-primary">
                              R{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-secondary">
                              R{item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primary/5 rounded-2xl p-6 sticky top-8">
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-paragraph text-secondary">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium text-primary">R{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-secondary">Shipping</span>
                    <span className="font-medium text-primary">
                      {shipping === 0 ? 'Free' : `R${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-secondary">VAT (15%)</span>
                    <span className="font-medium text-primary">R{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-heading text-lg font-semibold text-primary">Total</span>
                      <span className="font-heading text-2xl font-bold text-primary">R{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Truck className="inline w-4 h-4 mr-1" />
                      Add R{(1000 - getTotalPrice()).toLocaleString()} more for free shipping
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full font-semibold mb-4" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {session ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </Button>

                <div className="text-center mb-6">
                  <Link href="/shop" className="text-sm text-secondary hover:text-primary transition-colors">
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Security Features */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-4">Why Shop With Us?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm text-secondary">Secure SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-sm text-secondary">Free shipping over R1000</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">30</span>
                      </div>
                      <span className="text-sm text-secondary">30-day return policy</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="font-heading text-sm font-semibold text-primary mb-3">We Accept</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">VISA</div>
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">MC</div>
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">AMEX</div>
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">PAYPAL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">You Might Also Like</h2>
            <p className="font-paragraph text-secondary">Complete your streetwear collection with these premium pieces</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 3,
                name: "Premium Camo Hoodie",
                price: "R1,000",
                image: "/images/1d66cc_dae82150175d4010871e43fef851f81a_mv2.jpg"
              },
              {
                id: 4,
                name: "Black Skull Cap",
                price: "R200",
                image: "/images/1d66cc_770f254da8114e36a8c99b2ae2d76e57_mv2.jpg"
              },
              {
                id: 5,
                name: "Luxury Cream Jacket",
                price: "R1,100",
                image: "/images/1d66cc_b4b6f42d5bec4d1296ef5f4525844fb8_mv2.png"
              },
              {
                id: 6,
                name: "Platform Series Tee",
                price: "R450",
                image: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png"
              }
            ].map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-primary">
                        {product.price}
                      </span>
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
