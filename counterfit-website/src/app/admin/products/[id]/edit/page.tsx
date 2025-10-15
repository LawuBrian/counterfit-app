"use client"

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Plus,
  Trash2,
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
  sizeGuide?: {
    enabled: boolean
    title: string
    measurements: Array<{
      size: string
      chest?: string
      waist?: string
      hips?: string
      length?: string
    }>
    instructions?: string
  }
}

const availableSizes = ['One Size Fits All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export default function EditProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [formData, setFormData] = useState<ProductFormData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    if (id) {
      fetchProduct()
    }
  }, [session, status, router, id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      const data = await response.json()

      if (response.ok) {
        setFormData({
          name: data.data.name || '',
          description: data.data.description || '',
          shortDescription: data.data.shortDescription || '',
          price: data.data.price || 0,
          comparePrice: data.data.comparePrice || 0,
          costPrice: data.data.costPrice || 0,
          stockCode: data.data.stockCode || '',
          sku: data.data.sku || '',
          barcode: data.data.barcode || '',
          category: data.data.category || 'tops',
          status: data.data.status || 'draft',
          featured: data.data.featured || false,
          isNew: data.data.isNew || false,
          isAvailable: data.data.isAvailable || true,
          images: data.data.images || [],
          sizes: data.data.sizes || [],
          colors: data.data.colors || [],
          inventory: {
            trackQuantity: data.data.inventory?.trackQuantity ?? true,
            quantity: data.data.inventory?.quantity || 0,
            lowStockThreshold: data.data.inventory?.lowStockThreshold || 10,
            allowBackorder: data.data.inventory?.allowBackorder || false
          },
          shipping: {
            weight: data.data.shipping?.weight || 0,
            dimensions: {
              length: data.data.shipping?.dimensions?.length || 0,
              width: data.data.shipping?.dimensions?.width || 0,
              height: data.data.shipping?.dimensions?.height || 0
            },
            requiresShipping: data.data.shipping?.requiresShipping ?? true
          },
          seo: {
            title: data.data.seo?.title || '',
            description: data.data.seo?.description || '',
            keywords: data.data.seo?.keywords || []
          },
          sizeGuide: {
            enabled: data.data.sizeGuide?.enabled || false,
            title: data.data.sizeGuide?.title || 'Size Guide',
            measurements: data.data.sizeGuide?.measurements || [],
            instructions: data.data.sizeGuide?.instructions || ''
          }
        })
      } else {
        setErrors({ general: data.message || 'Failed to fetch product' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === 'images') {
      console.log('📸 Edit Product: Images updated')
      console.log('📋 New images:', value.map((img: any, i: number) => `${i}: ${img.isPrimary ? '⭐' : '○'} (${img.url.split('/').pop()})`).join(' '))
    }
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null)
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProductFormData] as any,
        [field]: value
      }
    }) : null)
  }

  const addSize = (size: string) => {
    if (!formData || formData.sizes.find(s => s.size === size)) return
    
    setFormData(prev => prev ? ({
      ...prev,
      sizes: [...prev.sizes, { size, stock: 0, isAvailable: true }]
    }) : null)
  }

  const updateSize = (index: number, field: string, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: value } : size
      )
    }) : null)
  }

  const removeSize = (index: number) => {
    setFormData(prev => prev ? ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }) : null)
  }

  const addColor = () => {
    setFormData(prev => prev ? ({
      ...prev,
      colors: [...prev.colors, { name: '', hexCode: '#000000', stock: 0, isAvailable: true }]
    }) : null)
  }

  const updateColor = (index: number, field: string, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }) : null)
  }

  const removeColor = (index: number) => {
    setFormData(prev => prev ? ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }) : null)
  }

  // Calculate total stock from sizes and colors
  const calculateTotalStock = (sizes: typeof formData.sizes, colors: typeof formData.colors) => {
    if (!formData) return 0
    
    if (colors.length > 0 && sizes.length > 0) {
      // If both sizes and colors exist, multiply them (each size-color combination)
      const sizeStock = sizes.reduce((sum, size) => sum + size.stock, 0)
      const colorStock = colors.reduce((sum, color) => sum + color.stock, 0)
      return Math.min(sizeStock, colorStock) // Use the limiting factor
    } else if (sizes.length > 0) {
      // Only sizes exist
      return sizes.reduce((sum, size) => sum + size.stock, 0)
    } else if (colors.length > 0) {
      // Only colors exist
      return colors.reduce((sum, color) => sum + color.stock, 0)
    }
    return 0
  }

  // Update total stock whenever sizes or colors change (but not when inventory.quantity changes to prevent loops)
  useEffect(() => {
    if (formData?.inventory.trackQuantity) {
      const totalStock = calculateTotalStock(formData.sizes, formData.colors)
      // Only update if there's a significant difference to prevent infinite loops
      if (Math.abs(totalStock - formData.inventory.quantity) > 0) {
        setFormData(prev => prev ? ({
          ...prev,
          inventory: {
            ...prev.inventory,
            quantity: totalStock
          }
        }) : null)
      }
    }
    // Deliberately exclude formData.inventory.quantity from dependencies to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.sizes, formData?.colors, formData?.inventory.trackQuantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
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
          setErrors({ general: data.message || 'Failed to update product' })
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || fetchLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
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
                  Edit Product
                </h1>
                <p className="text-secondary mt-1">Update product information</p>
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
                category={formData.category}
              />
            </div>

            {/* Sizes & Colors */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sizes & Colors</h2>
              
              {/* Sizes */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Available Sizes</h3>
                  {formData.sizes.length > 0 && (
                    <span className="text-sm text-gray-600">
                      Total size stock: {formData.sizes.reduce((sum, size) => sum + size.stock, 0)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select sizes for your product. Use "One Size Fits All" for accessories like caps, scarves, or items that don't require specific sizing.
                </p>
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
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-medium text-gray-900">Available Colors</h3>
                    {formData.colors.length > 0 && (
                      <span className="text-sm text-gray-600">
                        Total color stock: {formData.colors.reduce((sum, color) => sum + color.stock, 0)}
                      </span>
                    )}
                  </div>
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

            {/* Size Guide */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Size Guide</h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sizeGuide?.enabled || false}
                    onChange={(e) => handleNestedInputChange('sizeGuide', 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Size Guide</span>
                </label>

                {formData.sizeGuide?.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size Guide Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.sizeGuide?.title || ''}
                        onChange={(e) => handleNestedInputChange('sizeGuide', 'title', e.target.value)}
                        placeholder="Size Guide"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fitting Instructions
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.sizeGuide?.instructions || ''}
                        onChange={(e) => handleNestedInputChange('sizeGuide', 'instructions', e.target.value)}
                        placeholder="How to measure instructions..."
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Size Measurements</h3>
                        <Button 
                          type="button" 
                          onClick={() => {
                            const newMeasurements = [...(formData.sizeGuide?.measurements || []), {
                              size: '',
                              chest: '',
                              waist: '',
                              hips: '',
                              length: ''
                            }]
                            handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Size
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {formData.sizeGuide?.measurements?.map((measurement, index) => (
                          <div key={index} className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              placeholder="Size"
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              value={measurement.size}
                              onChange={(e) => {
                                const newMeasurements = [...(formData.sizeGuide?.measurements || [])]
                                newMeasurements[index] = { ...newMeasurements[index], size: e.target.value }
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Chest (cm)"
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              value={measurement.chest || ''}
                              onChange={(e) => {
                                const newMeasurements = [...(formData.sizeGuide?.measurements || [])]
                                newMeasurements[index] = { ...newMeasurements[index], chest: e.target.value }
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Waist (cm)"
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              value={measurement.waist || ''}
                              onChange={(e) => {
                                const newMeasurements = [...(formData.sizeGuide?.measurements || [])]
                                newMeasurements[index] = { ...newMeasurements[index], waist: e.target.value }
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Hips (cm)"
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              value={measurement.hips || ''}
                              onChange={(e) => {
                                const newMeasurements = [...(formData.sizeGuide?.measurements || [])]
                                newMeasurements[index] = { ...newMeasurements[index], hips: e.target.value }
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Length (cm)"
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              value={measurement.length || ''}
                              onChange={(e) => {
                                const newMeasurements = [...(formData.sizeGuide?.measurements || [])]
                                newMeasurements[index] = { ...newMeasurements[index], length: e.target.value }
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newMeasurements = formData.sizeGuide?.measurements?.filter((_, i) => i !== index) || []
                                handleNestedInputChange('sizeGuide', 'measurements', newMeasurements)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
                    <option value="accessories">Accessories</option>
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
                        Total Quantity
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={formData.inventory.quantity}
                          onChange={(e) => handleNestedInputChange('inventory', 'quantity', parseInt(e.target.value) || 0)}
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div>
                            {formData.sizes.length > 0 || formData.colors.length > 0 ? (
                              <>
                                Calculated from sizes/colors: {calculateTotalStock(formData.sizes, formData.colors)}
                                {calculateTotalStock(formData.sizes, formData.colors) !== formData.inventory.quantity && (
                                  <span className="text-amber-600 ml-2">⚠️ Manual override active</span>
                                )}
                              </>
                            ) : (
                              'Add sizes or colors to auto-calculate total stock'
                            )}
                          </div>
                          {(formData.sizes.length > 0 || formData.colors.length > 0) && 
                           calculateTotalStock(formData.sizes, formData.colors) !== formData.inventory.quantity && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const calculatedStock = calculateTotalStock(formData.sizes, formData.colors)
                                handleNestedInputChange('inventory', 'quantity', calculatedStock)
                              }}
                            >
                              Sync Stock
                            </Button>
                          )}
                        </div>
                      </div>
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
                  {loading ? 'Updating...' : 'Update Product'}
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
