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
  Trash2
} from 'lucide-react'
import Link from 'next/link'

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
        setStats(statsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData.orders)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.data || productsData.products || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Total Products</p>
                <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Total Users</p>
                <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Revenue</p>
                <p className="text-2xl font-bold text-primary">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <p className="font-medium text-primary">#{order.orderNumber}</p>
                        <p className="text-sm text-secondary">{order.user?.name || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">R{order.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-secondary">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-center py-8">No recent orders</p>
              )}
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
                  {products.slice(0, 5).map((product: any) => (
                    <div key={product._id || product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 && product.images[0] && (
                          <img 
                            src={product.images[0].url || product.images[0]} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-primary">{product.name}</p>
                          <p className="text-sm text-secondary">R{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Link href={`/admin/products/${product._id || product.id}/edit`}>
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
    </div>
  )
}
