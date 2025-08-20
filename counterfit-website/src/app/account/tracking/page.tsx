"use client"

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertCircle,
  Navigation
} from 'lucide-react'
import Link from 'next/link'

interface TrackingUpdate {
  status: string
  description: string
  location: string
  timestamp: string
  scanType?: string
}

interface OrderTracking {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  items: Array<{
    name: string
    quantity: number
    image: string
  }>
  totalAmount: number
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingUpdates?: TrackingUpdate[]
  currentLocation?: string
}

function TrackingPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  
  const [orders, setOrders] = useState<OrderTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingError, setTrackingError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchOrders()
  }, [session, status, router])

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId)
      if (order) {
        setSelectedOrder(order)
        if (order.trackingNumber) {
          fetchTrackingUpdates(order.trackingNumber)
        }
      }
    }
  }, [orderId, orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrackingUpdates = async (trackingNumber: string) => {
    try {
      setTrackingLoading(true)
      setTrackingError('')

      const response = await fetch(`/api/shipping/track?trackingNumber=${trackingNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        const tracking = data.tracking
        
        // Update the selected order with tracking information
        if (selectedOrder) {
          setSelectedOrder(prev => prev ? {
            ...prev,
            status: tracking.status,
            currentLocation: tracking.currentLocation,
            estimatedDelivery: tracking.estimatedDelivery,
            trackingUpdates: tracking.updates
          } : null)
        }
      } else {
        const errorData = await response.json()
        setTrackingError(errorData.error || 'Failed to fetch tracking updates')
      }
    } catch (error) {
      console.error('Failed to fetch tracking updates:', error)
      setTrackingError('Failed to fetch tracking updates. Please try again.')
    } finally {
      setTrackingLoading(false)
    }
  }

  const copyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber)
    // You could add a toast notification here
  }

  const refreshTracking = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order?.trackingNumber) {
      await fetchTrackingUpdates(order.trackingNumber)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'out_for_delivery':
        return <Navigation className="w-5 h-5 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
      case 'in_transit':
        return 'text-purple-600 bg-purple-100'
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading tracking information...</p>
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
          <Link href="/account" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, tracking number, or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
              
              {filteredOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">Order {order.orderNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.items.length} item(s) • R{order.totalAmount.toFixed(2)}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-blue-600 font-mono mt-1">
                          {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tracking Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-sm border">
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Order {selectedOrder.orderNumber}</h2>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2 capitalize">{selectedOrder.status}</span>
                      </span>
                      {selectedOrder.trackingNumber && (
                        <Button
                          onClick={() => refreshTracking(selectedOrder.id)}
                          disabled={trackingLoading}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${trackingLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Information */}
                {selectedOrder.trackingNumber ? (
                  <div className="p-6">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                        <p className="text-lg font-mono text-blue-700">{selectedOrder.trackingNumber}</p>
                        {selectedOrder.carrier && (
                          <p className="text-sm text-blue-600">via {selectedOrder.carrier}</p>
                        )}
                        {selectedOrder.currentLocation && (
                          <p className="text-sm text-blue-600">
                            Current Location: {selectedOrder.currentLocation}
                          </p>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <p className="text-sm text-blue-600">
                            Estimated Delivery: {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyTrackingNumber(selectedOrder.trackingNumber!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {selectedOrder.carrier === 'Fastway' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://www.fastway.co.za/track?number=${selectedOrder.trackingNumber}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Tracking Updates</h3>
                        <div className="space-y-4">
                          {selectedOrder.trackingUpdates.map((update, index) => (
                            <div key={index} className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                                {index < selectedOrder.trackingUpdates!.length - 1 && (
                                  <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{update.status}</p>
                                <p className="text-sm text-gray-600">{update.description}</p>
                                <p className="text-xs text-gray-500">
                                  {update.location} • {new Date(update.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {trackingLoading ? 'Loading tracking updates...' : 'No tracking updates available yet.'}
                        </p>
                        {trackingError && (
                          <p className="text-red-500 text-sm mt-2">{trackingError}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tracking Number</h3>
                    <p className="text-gray-500">This order doesn't have a tracking number yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select an Order</h3>
                <p className="text-gray-500">Choose an order from the list to view tracking information.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackingPageContent />
    </Suspense>
  )
}
