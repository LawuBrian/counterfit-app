"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface TrackingUpdate {
  status: string
  description: string
  location: string
  timestamp: string
}

interface OrderTracking {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  trackingUrl?: string
  trackingUpdates: TrackingUpdate[]
  items: Array<{
    name: string
    quantity: number
    image: string
  }>
  total: number
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default function TrackingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockOrders: OrderTracking[] = [
        {
          id: '1',
          orderNumber: 'ORD-202412-0001',
          status: 'shipped',
          trackingNumber: 'CF123456789SA',
          carrier: 'PostNet',
          estimatedDelivery: '2024-12-20',
          trackingUrl: 'https://www.postnet.co.za/track?number=CF123456789SA',
          trackingUpdates: [
            {
              status: 'shipped',
              description: 'Package has been shipped and is on its way',
              location: 'Cape Town Distribution Center',
              timestamp: '2024-12-15T14:30:00Z'
            },
            {
              status: 'processing',
              description: 'Package is being prepared for shipment',
              location: 'Counterfit Warehouse',
              timestamp: '2024-12-14T10:15:00Z'
            },
            {
              status: 'confirmed',
              description: 'Order confirmed and payment received',
              location: 'Counterfit HQ',
              timestamp: '2024-12-13T16:45:00Z'
            }
          ],
          items: [
            {
              name: 'Premium Camo Hoodie',
              quantity: 1,
              image: '/api/placeholder/100/100'
            }
          ],
          total: 899,
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main Street',
            city: 'Cape Town',
            state: 'Western Cape',
            postalCode: '8000',
            country: 'South Africa'
          }
        },
        {
          id: '2',
          orderNumber: 'ORD-202412-0002',
          status: 'processing',
          trackingUpdates: [
            {
              status: 'processing',
              description: 'Order is being prepared',
              location: 'Counterfit Warehouse',
              timestamp: '2024-12-16T09:00:00Z'
            },
            {
              status: 'confirmed',
              description: 'Order confirmed and payment received',
              location: 'Counterfit HQ',
              timestamp: '2024-12-15T11:30:00Z'
            }
          ],
          items: [
            {
              name: 'Classic Black Tee',
              quantity: 2,
              image: '/api/placeholder/100/100'
            }
          ],
          total: 598,
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main Street',
            city: 'Cape Town',
            state: 'Western Cape',
            postalCode: '8000',
            country: 'South Africa'
          }
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshTracking = async (orderId: string) => {
    try {
      // API call to refresh tracking data
      console.log('Refreshing tracking for order:', orderId)
      // For now, just show a success message
      alert('Tracking information updated!')
    } catch (error) {
      console.error('Error refreshing tracking:', error)
      alert('Failed to refresh tracking information')
    }
  }

  const copyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber)
    alert('Tracking number copied to clipboard!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/account"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="font-heading text-3xl font-bold text-primary">
                  Order Tracking
                </h1>
                <p className="text-secondary">Track your orders and shipments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number or tracking number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-xl font-semibold text-primary mb-4">
              Your Orders
            </h2>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    {getStatusIcon(order.status)}
                    <span>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                    <span>•</span>
                    <span>R{order.total.toLocaleString()}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tracking:</span> {order.trackingNumber}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                  No orders found
                </h3>
                <p className="text-secondary">
                  {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
                </p>
              </div>
            )}
          </div>

          {/* Tracking Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-heading text-2xl font-semibold text-primary">
                        {selectedOrder.orderNumber}
                      </h2>
                      <p className="text-secondary">
                        {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items • R{selectedOrder.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      {selectedOrder.estimatedDelivery && (
                        <p className="text-sm text-gray-600 mt-1">
                          Est. delivery: {formatDate(selectedOrder.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                        <p className="text-lg font-mono">{selectedOrder.trackingNumber}</p>
                        {selectedOrder.carrier && (
                          <p className="text-sm text-gray-600">via {selectedOrder.carrier}</p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refreshTracking(selectedOrder.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        {selectedOrder.trackingUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedOrder.trackingUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-6">
                    Tracking History
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-gray-300'
                          }`} />
                          {index < selectedOrder.trackingUpdates.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 capitalize">
                              {update.status.replace('_', ' ')}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(update.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{update.description}</p>
                          {update.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {update.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                    Order Items
                  </h3>
                  
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                    Shipping Address
                  </h3>
                  
                  <div className="text-gray-700">
                    <p className="font-medium">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <Truck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  Select an order to track
                </h3>
                <p className="text-secondary">
                  Choose an order from the list to view detailed tracking information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
