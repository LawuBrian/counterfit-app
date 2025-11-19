"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface PreOrderItem {
  productId: string
  productName: string
  size?: string
  color?: string
  quantity: number
  price: number
  image?: string
}

interface PreOrder {
  id: string
  orderNumber: string
  userId: string
  User?: {
    firstName: string
    lastName: string
    email: string
  }
  items: PreOrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  paymentId?: string
  shippingAddress: any
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminPreOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [preOrders, setPreOrders] = useState<PreOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<PreOrder | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchPreOrders()
  }, [session, status, router])

  const fetchPreOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch all paid orders and filter for pre-orders
      const response = await fetch('/api/admin/orders')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Filter for paid orders that contain pre-order items
          // Pre-orders are identified by having items with preOrder flag or order notes indicating pre-order
          const allOrders = data.orders || []
          const preOrderList = allOrders.filter((order: PreOrder) => {
            // Check if payment is confirmed
            if (order.paymentStatus !== 'paid' && !order.paymentId) {
              return false
            }
            
            // Check if order contains pre-order items or has pre-order in notes
            const hasPreOrderItems = order.items?.some((item: any) => item.preOrder === true)
            const hasPreOrderNote = order.notes?.toLowerCase().includes('pre-order') || 
                                   order.notes?.toLowerCase().includes('preorder')
            
            return hasPreOrderItems || hasPreOrderNote
          })
          
          setPreOrders(preOrderList)
        } else {
          setError(data.error || 'Failed to fetch pre-orders')
        }
      } else {
        setError('Failed to fetch pre-orders')
      }
    } catch (error) {
      console.error('Error fetching pre-orders:', error)
      setError('Failed to fetch pre-orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </span>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary flex items-center">
                <Package className="mr-3 h-8 w-8" />
                Pre-Orders
              </h1>
              <p className="text-secondary mt-1">Manage pre-orders (paid orders only)</p>
              <p className="text-sm text-gray-500 mt-1">
                Pre-order deadline: November 25, 2024
              </p>
            </div>
            <Button variant="outline">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {preOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pre-Orders Found</h3>
            <p className="text-gray-500">
              Paid pre-orders will appear here once customers place orders.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} item(s)
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items?.slice(0, 2).map((item: any) => item.productName || 'Product').join(', ')}
                        {order.items?.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status, order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary">Pre-Order Details</h2>
                <button
                  onClick={() => {
                    setShowOrderDetails(false)
                    setSelectedOrder(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-primary">
                      R{selectedOrder.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    {getStatusBadge(selectedOrder.status, selectedOrder.paymentStatus)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="text-gray-600">Name: </span>
                    <span className="font-medium">
                      {selectedOrder.User?.firstName || 'Unknown'} {selectedOrder.User?.lastName || 'User'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email: </span>
                    <span className="font-medium">{selectedOrder.User?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pre-Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.productName || 'Product'}</h4>
                          {item.size && (
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                          )}
                          {item.color && (
                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                          )}
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">
                            R{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">R{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {selectedOrder.shippingAddress.street || ''}
                      {selectedOrder.shippingAddress.city && `, ${selectedOrder.shippingAddress.city}`}
                      {selectedOrder.shippingAddress.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                    </p>
                    {selectedOrder.shippingAddress.country && (
                      <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
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

