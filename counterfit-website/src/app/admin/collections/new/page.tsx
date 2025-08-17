"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'

interface CollectionFormData {
  name: string
  description: string
  image: string
  featured: boolean
  status: 'active' | 'draft' | 'archived'
  collectionType: 'singular' | 'combo' | 'duo' | 'trio' | 'mixed'
  basePrice: number
  allowCustomSelection: boolean
  maxSelections?: number
  productCategories: string[]
}

const initialFormData: CollectionFormData = {
  name: '',
  description: '',
  image: '',
  featured: false,
  status: 'draft',
  collectionType: 'singular',
  basePrice: 0,
  allowCustomSelection: false,
  maxSelections: 1,
  productCategories: []
}

export default function NewCollectionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState<CollectionFormData>(initialFormData)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload/product-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        handleInputChange('image', data.data.url)
      } else {
        alert(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/collections')
      } else {
        if (data.errors) {
          const errorObj: Record<string, string> = {}
          data.errors.forEach((error: any) => {
            errorObj[error.path] = error.msg
          })
          setErrors(errorObj)
        } else {
          setErrors({ general: data.message || 'Failed to create collection' })
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
                href="/admin/collections"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="font-heading text-3xl font-bold text-primary">
                  Create New Collection
                </h1>
                <p className="text-secondary mt-1">Add a new collection to organize your products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Summer Collection 2024"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe this collection and what makes it special..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Collection Configuration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Collection Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.collectionType}
                    onChange={(e) => handleInputChange('collectionType', e.target.value)}
                  >
                    <option value="singular">Singular Product</option>
                    <option value="combo">Combo Package</option>
                    <option value="duo">Duo Collection (2 items)</option>
                    <option value="trio">Trio Collection (3 items)</option>
                    <option value="mixed">Mixed Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price (R) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', parseInt(e.target.value) || 0)}
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowCustomSelection}
                      onChange={(e) => handleInputChange('allowCustomSelection', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Allow Customer Customization</span>
                  </label>
                  <p className="text-xs text-gray-500">Customers can select specific products for this collection</p>
                </div>

                {formData.allowCustomSelection && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Selections
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.maxSelections || 1}
                      onChange={(e) => handleInputChange('maxSelections', parseInt(e.target.value) || 1)}
                      placeholder="2"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories
                  </label>
                  <div className="space-y-2">
                    {['jackets', 'pants', 'accessories', 'collections'].map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.productCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('productCategories', [...formData.productCategories, category])
                            } else {
                              handleInputChange('productCategories', formData.productCategories.filter(c => c !== category))
                            }
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Image */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Collection Image</h2>
              
              <div className="space-y-4">
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Collection preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload collection image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
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

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Collection</span>
                  </label>
                  <p className="text-xs text-gray-500">Featured collections appear prominently on the website</p>
                </div>
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
                  {loading ? 'Creating...' : 'Create Collection'}
                </Button>
                
                <Link href="/admin/collections">
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
