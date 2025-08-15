"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Home,
  Building,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  street: string
  apartment?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export default function AddressesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'home',
    isDefault: false,
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'South Africa',
    phone: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchAddresses()
  }, [session, status, router])

  const fetchAddresses = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          isDefault: true,
          firstName: 'John',
          lastName: 'Doe',
          street: '123 Main Street',
          apartment: 'Apt 4B',
          city: 'Cape Town',
          state: 'Western Cape',
          postalCode: '8000',
          country: 'South Africa',
          phone: '+27 21 123 4567'
        },
        {
          id: '2',
          type: 'work',
          isDefault: false,
          firstName: 'John',
          lastName: 'Doe',
          company: 'Tech Company',
          street: '456 Business Ave',
          city: 'Cape Town',
          state: 'Western Cape',
          postalCode: '8001',
          country: 'South Africa'
        }
      ]
      setAddresses(mockAddresses)
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        // Update existing address
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...formData, id: editingAddress.id }
            : addr
        ))
      } else {
        // Add new address
        const newAddress: Address = {
          ...formData,
          id: Date.now().toString()
        }
        setAddresses(prev => [...prev, newAddress])
      }
      
      // Reset form
      setShowForm(false)
      setEditingAddress(null)
      setFormData({
        type: 'home',
        isDefault: false,
        firstName: '',
        lastName: '',
        company: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'South Africa',
        phone: ''
      })
      
      alert(editingAddress ? 'Address updated!' : 'Address added!')
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address')
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData(address)
    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    try {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      alert('Address deleted!')
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })))
      alert('Default address updated!')
    } catch (error) {
      console.error('Error updating default address:', error)
      alert('Failed to update default address')
    }
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-4 h-4" />
      case 'work':
        return <Building className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
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
                  Addresses
                </h1>
                <p className="text-secondary">Manage your shipping addresses</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-semibold text-primary">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <Button variant="outline" onClick={() => {
                setShowForm(false)
                setEditingAddress(null)
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'home' | 'work' | 'other' }))}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment/Unit (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.apartment}
                  onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  >
                    <option value="South Africa">South Africa</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+27 21 123 4567"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingAddress(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-primary">
                      {getAddressIcon(address.type)}
                      <span className="font-medium capitalize">{address.type}</span>
                    </div>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-900">
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    {address.company && (
                      <p className="text-sm text-gray-600">{address.company}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {address.street}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="font-heading text-xl font-semibold text-primary mb-2">
              No addresses yet
            </h3>
            <p className="text-secondary mb-6">
              Add your first address to make checkout faster
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
