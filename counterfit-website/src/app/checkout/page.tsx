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
import { ShippingRate } from '@/lib/fastway'

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'ZA'
  })

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')

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

  // Calculate shipping rates when postal code changes
  const calculateShippingRates = async (postalCode: string) => {
    if (!postalCode || postalCode.length !== 4) return

    setShippingLoading(true)
    setShippingError('')

    try {
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode,
          items: cartItems,
          packageWeight: 0.5 * cartItems.length, // 0.5kg per item
          packageDimensions: {
            length: 30,
            width: 20,
            height: 10
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShippingRates(data.rates)
        
        // Auto-select the first (cheapest) rate
        if (data.rates.length > 0) {
          setSelectedShippingRate(data.rates[0])
        }
      } else {
        const errorData = await response.json()
        setShippingError(errorData.error || 'Failed to calculate shipping rates')
      }
    } catch (error) {
      console.error('Shipping rate calculation failed:', error)
      setShippingError('Failed to calculate shipping rates. Please try again.')
    } finally {
      setShippingLoading(false)
    }
  }

  // Handle postal code change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const postalCode = e.target.value
    setFormData(prev => ({ ...prev, postalCode }))
    
    // Calculate shipping rates when postal code is complete
    if (postalCode.length === 4) {
      calculateShippingRates(postalCode)
    } else {
      setShippingRates([])
      setSelectedShippingRate(null)
    }
  }

  // Calculate total with shipping
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const shippingCost = selectedShippingRate ? selectedShippingRate.price : 0
    return subtotal + shippingCost
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
        address: formData.street, // Use street from formData
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
        // Use the original cart items and form data for email since order.items might not be expanded
        const emailData = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          totalAmount: order.totalAmount,
          items: cartItems, // Use cart items instead of order.items
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country
          },
          trackingNumber: order.trackingNumber
        }

        const emailResponse = await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'orderConfirmation',
            data: emailData
          })
        })

        if (emailResponse.ok) {
          console.log('✅ Customer order confirmation email sent')
        } else {
          console.warn('⚠️ Customer email failed, but continuing with checkout')
        }

        // Send admin notification
        try {
          const adminEmailResponse = await fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'adminOrderNotification',
              data: emailData,
              adminEmail: 'admin@counterfit.co.za'
            })
          })

          if (adminEmailResponse.ok) {
            console.log('✅ Admin notification email sent')
          } else {
            console.warn('⚠️ Admin email failed, but continuing with checkout')
          }
        } catch (adminEmailError) {
          console.warn('⚠️ Admin email failed, but continuing with checkout:', adminEmailError)
        }

        console.log('✅ Order confirmation emails processed')
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
          
          // Check if it's a configuration error
          if (errorData.error && (
            errorData.error.includes('secret key') || 
            errorData.error.includes('API key') ||
            errorData.error.includes('configuration')
          )) {
            throw new Error('Payment system not configured. Please contact support.')
          } else {
            throw new Error(errorData.error || 'Failed to create YOCO checkout')
          }
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
        if (yocoError instanceof Error && (
          yocoError.message.includes('secret key') ||
          yocoError.message.includes('not configured') ||
          yocoError.message.includes('API key')
        )) {
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
            {/* Shipping Address Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="State/Province"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                  maxLength={4}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Shipping Rates Section */}
            {shippingRates.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Options</h2>
                
                {shippingLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Calculating shipping rates...</p>
                  </div>
                )}

                {shippingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600">{shippingError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {shippingRates.map((rate, index) => (
                    <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingRate"
                        value={index}
                        checked={selectedShippingRate === rate}
                        onChange={() => setSelectedShippingRate(rate)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{rate.service}</p>
                            <p className="text-sm text-gray-600">{rate.description}</p>
                            <p className="text-sm text-gray-600">{rate.deliveryTime}</p>
                          </div>
                          <p className="text-lg font-semibold">R{rate.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

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
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <hr className="my-3" />
                
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                
                {selectedShippingRate && (
                  <div className="flex justify-between">
                    <span>Shipping ({selectedShippingRate.service}):</span>
                    <span>R{selectedShippingRate.price.toFixed(2)}</span>
                  </div>
                )}
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading || !selectedShippingRate || shippingLoading}
              className="w-full h-12 text-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Processing...' : 
               !selectedShippingRate ? 'Select Shipping Method' :
               shippingLoading ? 'Loading Shipping Rates...' :
               `Pay R${calculateTotal().toFixed(2)}`}
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
