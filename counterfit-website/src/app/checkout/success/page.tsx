"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      // Get order details (payment verification happens via webhook)
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data.order)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching order:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            Order Confirmed!
          </h1>
          <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been confirmed and we'll send you a confirmation email shortly.
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-2">
                Order Details
              </h2>
              <p className="text-secondary">
                Order Number: <span className="font-medium text-primary">{order.orderNumber}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Subtotal</span>
                    <span className="font-medium">R{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Shipping</span>
                    <span className="font-medium">
                      R{order.shipping.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">VAT (15%)</span>
                    <span className="font-medium">R{order.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-heading text-lg font-semibold text-primary">Total</span>
                      <span className="font-heading text-xl font-bold text-primary">
                        R{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-primary">Standard Shipping</div>
                      <div className="text-sm text-secondary">3-5 business days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-primary">Confirmation Email</div>
                      <div className="text-sm text-secondary">Sent to your email</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">
                  <Link href="/account/tracking" className="flex items-center">
                    Track Your Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Link href="/shop">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-secondary mb-6">
            If you have any questions about your order, please contact our customer support team.
          </p>
          <Button variant="outline">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
