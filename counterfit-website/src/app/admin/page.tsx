"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Truck,
  Sparkles,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'
import AuthDebug from '@/components/debug/AuthDebug'
import FeaturedProductOrderManager from '@/components/admin/FeaturedProductOrderManager'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    // Fetch admin dashboard data
    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders?limit=5'),
        fetch('/api/admin/products?limit=10')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalProducts: statsData.totalProducts || 0,
          totalOrders: statsData.totalOrders || 0,
          totalUsers: statsData.totalUsers || 0,
          totalRevenue: statsData.totalRevenue || 0
        })
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData.orders || [])
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.data || productsData.products || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default values on error
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
      })
      setRecentOrders([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
              <h1 className="font-heading text-3xl font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-secondary">Welcome back, {session.user?.name}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">
                <Link href="/" className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Site
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="/admin/collections/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Collection
                </Link>
              </Button>
              <Button>
                <Link href="/admin/products/new" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            {stats.totalProducts === 0 && (
              <p className="text-xs text-gray-500 mt-2">No products yet. Start by adding your first product!</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-500" />
              </div>
            </div>
            {stats.totalOrders === 0 && (
              <p className="text-xs text-gray-500 mt-2">No orders yet. Orders will appear here when customers start shopping!</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            {stats.totalUsers === 0 && (
              <p className="text-xs text-gray-500 mt-2">No registered users yet. Users will appear here when they sign up!</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-primary">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            {stats.totalRevenue === 0 && (
              <p className="text-xs text-gray-500 mt-2">No revenue yet. Revenue will appear here when orders are placed!</p>
            )}
          </div>
        </div>

        {/* Getting Started Guide - Show when no orders/users */}
        {(stats.totalOrders === 0 || stats.totalUsers === 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Getting Started with Counterfit</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">✅ Products Ready</h4>
                <p className="text-sm text-blue-700">You have {stats.totalProducts} products set up and ready to sell!</p>
              </div>
              
              {stats.totalUsers === 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">👥 Next: Get Customers</h4>
                  <p className="text-sm text-blue-700">Share your store link and encourage customers to sign up for accounts.</p>
                </div>
              )}
              
              {stats.totalOrders === 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">🛒 Next: Start Selling</h4>
                  <p className="text-sm text-blue-700">Once customers place orders, you'll see revenue and order data here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-primary">Recent Orders</h2>
                <Button variant="outline" size="sm">
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-primary">#{order.orderNumber || 'Unknown'}</p>
                        <p className="text-sm text-secondary">{order.user?.name || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">R{(order.totalAmount || 0).toLocaleString()}</p>
                        <p className="text-sm text-secondary">{order.status || 'Unknown'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-secondary mb-2">No orders yet</p>
                  <p className="text-xs text-gray-500">Orders will appear here when customers start shopping</p>
                </div>
              )}
            </div>
          </div>

          {/* Collections Management */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-primary">Collections</h2>
                <Button variant="outline" size="sm">
                  <Link href="/admin/collections">Manage All</Link>
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-secondary mb-2">No collections yet</p>
                <p className="text-xs text-gray-500 mb-4">Create collections to group related products together</p>
                <Button size="sm">
                  <Link href="/admin/collections/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Shipments Management */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-primary">Shipments</h2>
                <Button variant="outline" size="sm">
                  <Link href="/admin/shipments">Manage All</Link>
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-secondary mb-2">No shipments yet</p>
                <p className="text-xs text-gray-500 mb-4">Shipments will appear here when you create them for orders</p>
                <Button size="sm">
                  <Link href="/admin/shipments">
                    <Truck className="mr-2 h-4 w-4" />
                    View Shipments
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Product Order Management */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-primary">Featured Product Order</h2>
              </div>
            </div>
            <div className="p-6">
              <FeaturedProductOrderManager />
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-primary">Products</h2>
                <Button variant="outline" size="sm">
                  <Link href="/admin/products">Manage All</Link>
                </Button>
              </div>
            </div>
            <div className="p-6">
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product: any, index: number) => (
                    <div key={product.id || product._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 && product.images[0] && (
                          <img 
                            src={getImageUrl(product.images[0].url || product.images[0])} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-primary">{product.name || 'Unnamed Product'}</p>
                          <p className="text-sm text-secondary">R{(product.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Link href={`/admin/products/${product.id || product._id || 'new'}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-center py-8">No products yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug component - only shows in development */}
      <AuthDebug />
    </div>
  )
}
