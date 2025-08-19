"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Truck, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface Shipment {
  id: string
  orderNumber: string
  trackingNumber: string
  status: string
  estimatedDelivery: string
  recipient: string
  address: string
  labelUrl?: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    image: string
  }>
  totalAmount: number
}

export default function ShipmentManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [creatingShipment, setCreatingShipment] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Fetch orders from admin API
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        
        // Show message if backend is unavailable
        if (data.message) {
          console.log('ℹ️', data.message)
        }
      } else {
        console.error('Failed to fetch orders:', response.status)
        // Set empty orders to prevent errors
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      // Set empty orders to prevent errors
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const createShipment = async (order: Order) => {
    try {
      setCreatingShipment(true)
      
      const response = await fetch('/api/shipping/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          recipientName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          recipientPhone: '', // You might want to add phone to your order data
          recipientEmail: '', // You might want to add email to your order data
          recipientAddress: order.shippingAddress.street,
          recipientCity: order.shippingAddress.city,
          recipientPostalCode: order.shippingAddress.postalCode,
          recipientCountry: order.shippingAddress.country,
          packageWeight: 0.5 * order.items.length,
          packageDimensions: {
            length: 30,
            width: 20,
            height: 10
          },
          packageDescription: `Order ${order.orderNumber}`
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Shipment created:', data)
        
        // Refresh orders to get updated tracking info
        await fetchOrders()
        
        // Show success message
        alert('Shipment created successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to create shipment: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to create shipment:', error)
      alert('Failed to create shipment. Please try again.')
    } finally {
      setCreatingShipment(false)
    }
  }

  const downloadLabel = async (shipmentId: string) => {
    try {
      const response = await fetch(`/api/shipping/label/${shipmentId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `shipping-label-${shipmentId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download label:', error)
      alert('Failed to download shipping label.')
    }
  }

  const trackShipment = async (trackingNumber: string) => {
    try {
      const response = await fetch(`/api/shipping/track?trackingNumber=${trackingNumber}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Tracking data:', data)
        // You could show this in a modal or update the UI
      }
    } catch (error) {
      console.error('Failed to track shipment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'shipped': return 'text-purple-600 bg-purple-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shipment Management</h2>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Orders that need shipments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Orders Pending Shipment</h3>
        
        {orders.filter(order => !order.trackingNumber).length === 0 ? (
          <p className="text-gray-500">All orders have been shipped!</p>
        ) : (
          <div className="space-y-4">
            {orders
              .filter(order => !order.trackingNumber)
              .map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order {order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item(s) - R{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      onClick={() => createShipment(order)}
                      disabled={creatingShipment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {creatingShipment ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Package className="w-4 h-4 mr-2" />
                      )}
                      Create Shipment
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Shipped orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Shipped Orders</h3>
        
        {orders.filter(order => order.trackingNumber).length === 0 ? (
          <p className="text-gray-500">No orders have been shipped yet.</p>
        ) : (
          <div className="space-y-4">
            {orders
              .filter(order => order.trackingNumber)
              .map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order {order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tracking: {order.trackingNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Carrier: {order.carrier || 'Unknown'}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-sm text-gray-600">
                          Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => trackShipment(order.trackingNumber!)}
                        variant="outline"
                        size="sm"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Track
                      </Button>
                      <Button
                        onClick={() => window.open(`https://www.fastway.co.za/track?number=${order.trackingNumber}`, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Fastway
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
