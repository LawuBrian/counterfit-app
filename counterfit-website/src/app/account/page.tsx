"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Package,
  CreditCard,
  Settings,
  LogOut,
  ShoppingBag,
  Truck
} from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  dateJoined: string
}

interface RecentOrder {
  id: string
  orderNumber: string
  date: string
  total: number
  status: string
  items: number
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'South Africa'
    },
    dateJoined: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserProfile()
    fetchRecentOrders()
  }, [session, status, router])

  const fetchUserProfile = async () => {
    try {
      setError('')
      const response = await fetch('/api/users/profile')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.profile) {
          setProfile(data.profile)
        } else {
          // Fallback to session data if profile is empty
          setProfile({
            firstName: session?.user?.firstName || '',
            lastName: session?.user?.lastName || '',
            email: session?.user?.email || '',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              postalCode: '',
              country: 'South Africa'
            },
            dateJoined: new Date().toISOString()
          })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.orders) {
          // Get only the 3 most recent orders
          const recent = data.orders
            .slice(0, 3)
            .map((order: any) => ({
              id: order.id,
              orderNumber: order.orderNumber || order.id,
              date: order.createdAt || order.date,
              total: order.totalAmount || order.total,
              status: order.status,
              items: order.items?.length || 0
            }))
          setRecentOrders(recent)
        } else {
          setRecentOrders([])
        }
      } else {
        setRecentOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setRecentOrders([])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setIsEditing(false)
          setError('')
          // Show success message
          alert('Profile updated successfully!')
        } else {
          setError(data.error || 'Failed to update profile')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchUserProfile() // Reset to original values
    setError('')
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                My Account
              </h1>
              <p className="text-secondary">Manage your profile and orders</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-secondary">{profile.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Link 
                  href="/account" 
                  className="flex items-center px-4 py-2 text-primary bg-primary/5 rounded-lg font-medium"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </Link>
                <Link 
                  href="/account/orders" 
                  className="flex items-center px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  <Package className="mr-3 h-4 w-4" />
                  Order History
                </Link>
                <Link 
                  href="/account/tracking" 
                  className="flex items-center px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  <Truck className="mr-3 h-4 w-4" />
                  Order Tracking
                </Link>
                <Link 
                  href="/account/addresses" 
                  className="flex items-center px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  <MapPin className="mr-3 h-4 w-4" />
                  Addresses
                </Link>
                <Link 
                  href="/account/payment" 
                  className="flex items-center px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  <CreditCard className="mr-3 h-4 w-4" />
                  Payment Methods
                </Link>
                <Link 
                  href="/account/settings" 
                  className="flex items-center px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold text-primary">
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-medium text-primary">Personal Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      ) : (
                        <p className="text-primary font-medium">{profile.firstName || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      ) : (
                        <p className="text-primary font-medium">{profile.lastName || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-primary font-medium">{profile.email}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+27 123 456 7890"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <p className="text-primary font-medium">{profile.phone || 'Not provided'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-medium text-primary">Address</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={profile.address.street}
                          onChange={(e) => setProfile(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, street: e.target.value }
                          }))}
                          placeholder="123 Main Street"
                        />
                      ) : (
                        <p className="text-primary font-medium">{profile.address.street || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={profile.address.city}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, city: e.target.value }
                            }))}
                            placeholder="Cape Town"
                          />
                        ) : (
                          <p className="text-primary font-medium">{profile.address.city || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={profile.address.state}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, state: e.target.value }
                            }))}
                            placeholder="Western Cape"
                          />
                        ) : (
                          <p className="text-primary font-medium">{profile.address.state || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={profile.address.postalCode}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, postalCode: e.target.value }
                            }))}
                            placeholder="8000"
                          />
                        ) : (
                          <p className="text-primary font-medium">{profile.address.postalCode || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        {isEditing ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={profile.address.country}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, country: e.target.value }
                            }))}
                          >
                            <option value="South Africa">South Africa</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                        ) : (
                          <p className="text-primary font-medium">{profile.address.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-heading text-lg font-medium text-primary mb-4">Account Information</h3>
                  <div className="flex items-center text-sm text-secondary">
                    <span>Member since: {profile.dateJoined ? new Date(profile.dateJoined).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold text-primary">
                    Recent Orders
                  </h2>
                  <Link href="/account/orders">
                    <Button variant="outline">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order: RecentOrder) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-primary">Order {order.orderNumber}</p>
                            <p className="text-sm text-secondary">
                              {new Date(order.date).toLocaleDateString()} • {order.items} item{order.items > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">R{order.total.toLocaleString()}</p>
                          <p className={`text-sm ${
                            order.status === 'delivered' ? 'text-green-600' :
                            order.status === 'processing' ? 'text-yellow-600' :
                            order.status === 'shipped' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-secondary">No orders yet</p>
                    <Link href="/shop">
                      <Button className="mt-4">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
