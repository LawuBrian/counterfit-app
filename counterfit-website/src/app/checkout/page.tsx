"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { createYocoCheckout, generateOrderNumber, generateTrackingNumber } from '@/lib/yoco'
import { useCart } from '@/contexts/CartContext'

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items: cartItems, getTotalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'South Africa'
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }
  }, [session, status, router, cartItems])

  const calculateTotal = () => {
    const subtotal = getTotalPrice()
    const shipping = 50 // Fixed shipping cost
    const tax = subtotal * 0.15 // 15% VAT
    return subtotal + shipping + tax
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckout = async () => {
    if (!session) return

    setLoading(true)
    try {
      // Structure the shipping address properly
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      }

      // Convert cart items to the format expected by the API
      const orderItems = cartItems.map(item => ({
        id: item.id.toString(), // Convert number to string
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color
      }))

      console.log('📦 Sending checkout data:', {
        items: orderItems,
        totalAmount: calculateTotal(),
        shippingAddress
      })

      // Create order first
      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: calculateTotal(),
          shippingAddress: shippingAddress,
          billingAddress: shippingAddress
        })
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error('❌ Checkout failed:', errorData)
        throw new Error(errorData.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()
      console.log('✅ Order created:', orderData)
      console.log('🔍 Order data structure:', JSON.stringify(orderData, null, 2))

      // Safely extract order information
      const order = orderData.data || orderData.order || orderData
      console.log('🔍 Extracted order:', order)

      if (!order || !order.id) {
        console.error('❌ Invalid order data structure:', orderData)
        throw new Error('Invalid order data received from server')
      }

      // Send order confirmation email to customer
      console.log('📧 Sending order confirmation email...')
      try {
        const emailData = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          totalAmount: order.totalAmount,
          items: order.items,
          shippingAddress: order.shippingAddress,
          trackingNumber: order.trackingNumber
        }

        await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'orderConfirmation',
            data: emailData
          })
        })

        // Send admin notification
        await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'adminOrderNotification',
            data: emailData,
            adminEmail: 'admin@counterfit.co.za'
          })
        })

        console.log('✅ Order confirmation emails sent')
      } catch (emailError) {
        console.warn('⚠️ Email sending failed, but order was created:', emailError)
        // Don't fail the checkout if emails fail
      }

      // Create Yoco checkout
      console.log('💳 Creating Yoco checkout...')
      
      try {
        const checkoutResponse = await fetch('/api/checkout/create-yoco', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: calculateTotal(),
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`
          })
        })

        if (!checkoutResponse.ok) {
          const errorData = await checkoutResponse.json()
          throw new Error(errorData.error || 'Failed to create YOCO checkout')
        }

        const checkout = await checkoutResponse.json()
        console.log('✅ Yoco checkout created:', checkout)
        
        console.log('✅ Yoco checkout created, redirecting customer...')
        
        // Redirect customer to Yoco checkout page
        if (checkout.checkout?.redirectUrl) {
          window.location.href = checkout.checkout.redirectUrl
        } else {
          throw new Error('No redirect URL received from YOCO')
        }
        
      } catch (yocoError) {
        console.error('💳 Yoco checkout creation failed:', yocoError)
        
        // Check if it's a configuration error
        if (yocoError instanceof Error && yocoError.message.includes('secret key')) {
          alert('Payment system not configured. Please contact support.')
        } else {
          alert('Payment system temporarily unavailable. Please try again later.')
        }
        
        throw yocoError
      }

    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/cart" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center p-4 border rounded-lg bg-primary/5">
                  <CreditCard className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <p className="font-medium">Secure Payment with Yoco</p>
                    <p className="text-sm text-secondary">Your payment information is encrypted and secure</p>
                  </div>
                </div>
                <div className="text-sm text-secondary bg-yellow-50 p-3 rounded-lg">
                  <p><strong>Note:</strong> If payment fails, your order will still be created and you can pay via bank transfer.</p>
                  <p className="mt-1"><strong>Test Mode:</strong> Use test card: 4111 1111 1111 1111</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-secondary">
                        Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                      </p>
                    </div>
                    <p className="font-medium">R{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>R50</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span>R{(getTotalPrice() * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full h-12 text-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Processing...' : `Pay R${calculateTotal().toFixed(2)}`}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-secondary">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure Payment</span>
              </div>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
