"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  RotateCcw,
  Search,
  Filter,
  ShoppingBag,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchOrders()
  }, [session, status, router])

  useEffect(() => {
    filterOrders()
  }, [orders, filters])

  const fetchOrders = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15T10:30:00Z',
          status: 'delivered',
          total: 2500,
          items: [
            {
              id: '1',
              name: 'Premium Streetwear Item',
              price: 1500,
              quantity: 1,
              size: 'L',
              color: 'Green',
              image: '/images/hoodie-1.jpg'
            },
            {
              id: '2',
              name: 'Urban Streetwear T-Shirt',
              price: 1000,
              quantity: 1,
              size: 'M',
              color: 'Black',
              image: '/images/tshirt-1.jpg'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'Cape Town',
            state: 'Western Cape',
            postalCode: '8000',
            country: 'South Africa'
          },
          trackingNumber: 'CF-TR-123456789',
          estimatedDelivery: '2024-01-18T17:00:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: '2024-01-10T14:15:00Z',
          status: 'processing',
          total: 1800,
          items: [
            {
              id: '3',
              name: 'Executive Polo Shirt',
              price: 1800,
              quantity: 1,
              size: 'L',
              color: 'Navy',
              image: '/images/polo-1.jpg'
            }
          ],
          shippingAddress: {
            street: '456 Oak Avenue',
            city: 'Johannesburg',
            state: 'Gauteng',
            postalCode: '2000',
            country: 'South Africa'
          },
          estimatedDelivery: '2024-01-20T17:00:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          date: '2024-01-05T09:45:00Z',
          status: 'cancelled',
          total: 3200,
          items: [
            {
              id: '4',
              name: 'Luxury Jacket Set',
              price: 3200,
              quantity: 1,
              size: 'XL',
              color: 'Black',
              image: '/images/jacket-1.jpg'
            }
          ],
          shippingAddress: {
            street: '789 Pine Road',
            city: 'Durban',
            state: 'KwaZulu-Natal',
            postalCode: '4000',
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

  const filterOrders = () => {
    let filtered = [...orders]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date()
      let startDate = new Date()
      
      switch (filters.dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7)
          break
        case '30days':
          startDate.setDate(now.getDate() - 30)
          break
        case '90days':
          startDate.setDate(now.getDate() - 90)
          break
        case '1year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      if (filters.dateRange !== '') {
        filtered = filtered.filter(order => new Date(order.date) >= startDate)
      }
    }

    setFilteredOrders(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

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
                  Order History
                </h1>
                <p className="text-secondary">Track and manage your orders</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or product..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-secondary flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.date).toLocaleDateString('en-ZA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-xl font-bold text-primary">
                        R{order.total.toLocaleString()}
                      </p>
                      <p className="text-sm text-secondary">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-primary">{item.name}</h4>
                          <p className="text-sm text-secondary">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-sm text-secondary">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">
                            R{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {order.trackingNumber && (
                          <div className="text-sm">
                            <span className="text-secondary">Tracking: </span>
                            <span className="font-medium text-primary">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && order.status !== 'delivered' && (
                          <div className="text-sm">
                            <span className="text-secondary">Est. Delivery: </span>
                            <span className="font-medium text-primary">
                              {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Return
                          </Button>
                        )}
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            <Truck className="mr-2 h-4 w-4" />
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                No orders found
              </h3>
              <p className="text-secondary mb-6">
                {filters.search || filters.status || filters.dateRange
                  ? "No orders match your current filters."
                  : "You haven't placed any orders yet."}
              </p>
              <div className="flex gap-4 justify-center">
                {(filters.search || filters.status || filters.dateRange) && (
                  <Button 
                    variant="outline"
                    onClick={() => setFilters({ search: '', status: '', dateRange: '' })}
                  >
                    Clear Filters
                  </Button>
                )}
                <Link href="/shop">
                  <Button>
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
