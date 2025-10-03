"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Package,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Shield,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import OrderWorkflowGuide from './workflow-guide'

interface OrderUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
}

interface OrderItem {
  id: string
  productId?: string
  productName?: string
  name?: string // Alternative name field
  quantity: number
  price: number
  size?: string
  color?: string
  image?: string // Product image
}

interface Order {
  id: string
  orderNumber: string
  userId: string
  User?: OrderUser
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod?: string
  paymentId?: string // Payment ID from Yoco
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  shippingAddress: any
  billingAddress?: any
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')
  const [localTrackingNumber, setLocalTrackingNumber] = useState('')
  const [localNotes, setLocalNotes] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/admin/orders')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders || [])
        } else {
          setError(data.error || 'Failed to fetch orders')
        }
      } else {
        setError('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, additionalData?: any) => {
    try {
      const oldOrder = orders.find(o => o.id === orderId)
      const oldStatus = oldOrder?.status || 'unknown'
      
      const updateData = { status: newStatus, ...additionalData }
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        // Send email notification for status change
        try {
          const emailResponse = await fetch(`/api/admin/orders/${orderId}/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oldStatus,
              newStatus
            })
          })

          if (emailResponse.ok) {
            console.log('✅ Status change email sent successfully')
          } else {
            console.warn('⚠️ Failed to send status change email')
          }
        } catch (emailError) {
          console.warn('⚠️ Email sending failed:', emailError)
        }

        await fetchOrders()
        setSelectedOrder(null) // Close modal if open
        alert('Order updated successfully! Customer has been notified via email.')
      } else {
        const errorData = await response.json()
        alert(`Failed to update order: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.User?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.User?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <Package className="w-8 h-8 text-primary mr-3" />
                <div>
                  <h1 className="font-heading text-3xl font-bold text-primary">Order Management</h1>
                  <p className="text-secondary">View and manage all customer orders</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <OrderWorkflowGuide />
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {order.User?.firstName || 'Unknown'} {order.User?.lastName || 'User'}
                          </div>
                          <div className="text-sm text-gray-500">{order.User?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setLocalTrackingNumber(order.trackingNumber || '')
                            setLocalNotes(order.notes || '')
                            setShowOrderDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="font-heading text-xl font-semibold text-primary mb-2">
              No orders found
            </h3>
            <p className="text-secondary">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers make purchases'}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-primary">
                    Order Management - {selectedOrder.orderNumber}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      Payment: {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowOrderDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Admin Control Panel */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center text-blue-800">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Order Status</label>
                    <select
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Payment Status</label>
                    <select
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.status, { paymentStatus: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Carrier</label>
                    <select
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedOrder.carrier || 'PostNet'}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.status, { carrier: e.target.value })}
                    >
                      <option value="PostNet">PostNet</option>
                      <option value="Fastway">Fastway</option>
                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="Aramex">Aramex</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={localTrackingNumber}
                      onChange={(e) => setLocalTrackingNumber(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value !== selectedOrder.trackingNumber) {
                          updateOrderStatus(selectedOrder.id, selectedOrder.status, { trackingNumber: e.target.value })
                        }
                      }}
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Estimated Delivery</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          updateOrderStatus(selectedOrder.id, selectedOrder.status, { estimatedDelivery: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Admin Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value !== selectedOrder.notes) {
                        updateOrderStatus(selectedOrder.id, selectedOrder.status, { notes: e.target.value })
                      }
                    }}
                    placeholder="Add internal notes about this order..."
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">
                        {selectedOrder.User?.firstName} {selectedOrder.User?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedOrder.User?.email}
                      </p>
                    </div>
                    {selectedOrder.User?.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {selectedOrder.User.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Number</label>
                      <p className="text-gray-900">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-gray-900 font-semibold">R{selectedOrder.totalAmount?.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 font-medium">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                    </p>
                    {selectedOrder.shippingAddress.street && (
                      <p className="text-gray-600">{selectedOrder.shippingAddress.street}</p>
                    )}
                    {selectedOrder.shippingAddress.address && (
                      <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                    )}
                    {selectedOrder.shippingAddress.apartment && (
                      <p className="text-gray-600">{selectedOrder.shippingAddress.apartment}</p>
                    )}
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Payment Validation Warning */}
              {selectedOrder.paymentStatus === 'pending' && !selectedOrder.paymentId && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <div>
                      <h4 className="font-semibold text-red-800">⚠️ Payment Not Confirmed</h4>
                      <p className="text-red-700 text-sm mt-1">
                        This order was created without payment confirmation. Customer may not have completed payment.
                        <br />
                        <strong>Do not ship</strong> until payment is verified in your Yoco dashboard.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button 
                          onClick={() => window.open('https://dashboard.yoco.com', '_blank')}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                        >
                          Check Yoco Dashboard
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items - Enhanced Display */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items ({selectedOrder.items?.length || 0} items)
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => {
                    // Parse items if it's a string
                    let parsedItem = item;
                    if (typeof item === 'string') {
                      try {
                        parsedItem = JSON.parse(item);
                      } catch (e) {
                        console.warn('Failed to parse item:', item);
                      }
                    }
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          {parsedItem.image && (
                            <div className="flex-shrink-0">
                              <img 
                                src={parsedItem.image} 
                                alt={parsedItem.name || parsedItem.productName}
                                className="w-16 h-16 object-cover rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-product.jpg';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {parsedItem.name || parsedItem.productName || 'Unknown Product'}
                            </h4>
                            
                            {/* Product Attributes */}
                            <div className="mt-2 space-y-1">
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <strong>Qty:</strong> <span className="ml-1 font-medium">{parsedItem.quantity}</span>
                                </span>
                                {parsedItem.size && (
                                  <span className="flex items-center">
                                    <strong>Size:</strong> <span className="ml-1 font-medium">{parsedItem.size}</span>
                                  </span>
                                )}
                                {parsedItem.color && (
                                  <span className="flex items-center">
                                    <strong>Color:</strong> <span className="ml-1 font-medium">{parsedItem.color}</span>
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <strong>Unit Price:</strong> <span className="ml-1 font-medium">R{parsedItem.price?.toFixed(2)}</span>
                                </span>
                              </div>
                              
                              {/* Product ID for tracking */}
                              {parsedItem.id && (
                                <div className="text-xs text-gray-500 font-mono">
                                  Product ID: {parsedItem.id}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              R{((parsedItem.price || 0) * (parsedItem.quantity || 1)).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parsedItem.quantity} × R{(parsedItem.price || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Tracking Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                    {selectedOrder.carrier && <p><strong>Carrier:</strong> {selectedOrder.carrier}</p>}
                    {selectedOrder.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
