"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  price: number
  comparePrice: number
  costPrice: number
  stockCode: string
  sku: string
  barcode: string
  category: string
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  isNew: boolean
  isAvailable: boolean
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  sizes: Array<{
    size: string
    stock: number
    isAvailable: boolean
  }>
  colors: Array<{
    name: string
    hexCode: string
    stock: number
    isAvailable: boolean
  }>
  inventory: {
    trackQuantity: boolean
    quantity: number
    lowStockThreshold: number
    allowBackorder: boolean
  }
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    requiresShipping: boolean
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  comparePrice: 0,
  costPrice: 0,
  stockCode: '',
  sku: '',
  barcode: '',
  category: 'tops',
  status: 'draft',
  featured: false,
  isNew: false,
  isAvailable: true,
  images: [],
  sizes: [],
  colors: [],
  inventory: {
    trackQuantity: true,
    quantity: 0,
    lowStockThreshold: 10,
    allowBackorder: false
  },
  shipping: {
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    requiresShipping: true
  },
  seo: {
    title: '',
    description: '',
    keywords: []
  }
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProductFormData] as any,
        [field]: value
      }
    }))
  }



  const addSize = (size: string) => {
    if (formData.sizes.find(s => s.size === size)) return
    
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size, stock: 0, isAvailable: true }]
    }))
  }

  const updateSize = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }))
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hexCode: '#000000', stock: 0, isAvailable: true }]
    }))
  }

  const updateColor = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }))
  }

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/products')
      } else {
        if (data.errors) {
          const errorObj: Record<string, string> = {}
          data.errors.forEach((error: any) => {
            errorObj[error.path] = error.msg
          })
          setErrors(errorObj)
        } else {
          setErrors({ general: data.message || 'Failed to create product' })
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
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
            <div className="flex items-center">
              <Link 
                href="/admin/products"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="font-heading text-3xl font-bold text-primary">
                  Add New Product
                </h1>
                <p className="text-secondary mt-1">Create a new product in your catalog</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.comparePrice}
                        onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
              <ImageUpload
                images={formData.images}
                onChange={(images) => handleInputChange('images', images)}
                maxImages={10}
              />
            </div>

            {/* Sizes & Colors */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sizes & Colors</h2>
              
              {/* Sizes */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Sizes</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableSizes.map(size => (
                    <Button
                      key={size}
                      type="button"
                      variant={formData.sizes.find(s => s.size === size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => addSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="w-12 text-sm font-medium">{size.size}</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={size.stock}
                        onChange={(e) => updateSize(index, 'stock', parseInt(e.target.value) || 0)}
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={size.isAvailable}
                          onChange={(e) => updateSize(index, 'isAvailable', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Available</span>
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSize(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Available Colors</h3>
                  <Button type="button" onClick={addColor}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Color name"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={color.name}
                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                      />
                      <input
                        type="color"
                        className="w-12 h-8 border border-gray-300 rounded-md"
                        value={color.hexCode}
                        onChange={(e) => updateColor(index, 'hexCode', e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={color.stock}
                        onChange={(e) => updateColor(index, 'stock', parseInt(e.target.value) || 0)}
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={color.isAvailable}
                          onChange={(e) => updateColor(index, 'isAvailable', e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Available</span>
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeColor(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status & Visibility */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Status & Visibility</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tops">Tops</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="athletic">Athletic</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => handleInputChange('isNew', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">New Product</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available for Purchase</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Product Codes */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Codes</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.stockCode}
                    onChange={(e) => handleInputChange('stockCode', e.target.value.toUpperCase())}
                    placeholder="e.g., CF-TOP-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Inventory</h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inventory.trackQuantity}
                    onChange={(e) => handleNestedInputChange('inventory', 'trackQuantity', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Track Quantity</span>
                </label>

                {formData.inventory.trackQuantity && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.inventory.quantity}
                        onChange={(e) => handleNestedInputChange('inventory', 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.inventory.lowStockThreshold}
                        onChange={(e) => handleNestedInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.inventory.allowBackorder}
                        onChange={(e) => handleNestedInputChange('inventory', 'allowBackorder', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow Backorders</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
                
                <Link href="/admin/products">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
              
              {errors.general && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
