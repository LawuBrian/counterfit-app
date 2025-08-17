"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  price: number
  images: Array<{ url: string; alt: string; isPrimary: boolean }>
}

interface ProductCategory {
  name: string
  products: Product[]
  maxSelections: number
  selectedProducts: string[]
}

export default function NewCollectionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collectionType: 'singular',
    basePrice: 0,
    allowCustomSelection: false,
    maxSelections: 1,
    status: 'draft',
    featured: false
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
        
        // Group products by category
        const productCategories = groupProductsByCategory(data.data || [])
        setCategories(productCategories)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const groupProductsByCategory = (products: Product[]): ProductCategory[] => {
    const categoryMap = new Map<string, Product[]>()
    
    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, [])
      }
      categoryMap.get(product.category)!.push(product)
    })

    return Array.from(categoryMap.entries()).map(([name, products]) => ({
      name,
      products,
      maxSelections: 1, // Default to 1, can be adjusted
      selectedProducts: []
    }))
  }

  const handleCategoryChange = (categoryIndex: number, field: keyof ProductCategory, value: any) => {
    setCategories(prev => prev.map((cat, index) => 
      index === categoryIndex ? { ...cat, [field]: value } : cat
    )))
  }

  const handleProductSelection = (categoryIndex: number, productId: string, selected: boolean) => {
    setCategories(prev => prev.map((cat, index) => {
      if (index === categoryIndex) {
        if (selected) {
          // Check if we can add more products
          if (cat.selectedProducts.length < cat.maxSelections) {
            return {
              ...cat,
              selectedProducts: [...cat.selectedProducts, productId]
            }
          }
        } else {
          return {
            ...cat,
            selectedProducts: cat.selectedProducts.filter(id => id !== productId)
          }
        }
      }
      return cat
    }))
  }

  const calculateTotalPrice = () => {
    let total = 0
    categories.forEach(category => {
      category.selectedProducts.forEach(productId => {
        const product = category.products.find(p => p.id === productId)
        if (product) {
          total += product.price
        }
      })
    })
    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare collection data
      const collectionData = {
        ...formData,
        basePrice: calculateTotalPrice(),
        productCategories: categories.map(cat => ({
          name: cat.name,
          maxSelections: cat.maxSelections,
          selectedProducts: cat.selectedProducts
        }))
      }

      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      })

      if (response.ok) {
        router.push('/admin/collections')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create collection')
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      alert('Failed to create collection')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/admin/collections">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-900">Create New Collection</h1>
            <p className="text-gray-600">Build a new product collection or combo package</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Premium Jacket Combo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Type *
                </label>
                <select
                  required
                  value={formData.collectionType}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectionType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="singular">Single Product</option>
                  <option value="combo">Combo Package</option>
                  <option value="duo">Duo Collection</option>
                  <option value="trio">Trio Collection</option>
                  <option value="mixed">Mixed Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Collection
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Feature this collection</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your collection..."
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Selection</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found. Please add products first.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category, categoryIndex) => (
                  <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-medium text-gray-900 capitalize">
                        {category.name} ({category.products.length} available)
                      </h3>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Max selections:</label>
                        <input
                          type="number"
                          min="1"
                          max={category.products.length}
                          value={category.maxSelections}
                          onChange={(e) => handleCategoryChange(categoryIndex, 'maxSelections', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.products.map((product) => {
                        const isSelected = category.selectedProducts.includes(product.id)
                        const canSelect = category.selectedProducts.length < category.maxSelections || isSelected
                        
                        return (
                          <div
                            key={product.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : canSelect 
                                  ? 'border-gray-200 hover:border-gray-300' 
                                  : 'border-gray-200 bg-gray-100 opacity-50'
                            }`}
                            onClick={() => canSelect && handleProductSelection(categoryIndex, product.id, !isSelected)}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!canSelect}
                                onChange={(e) => handleProductSelection(categoryIndex, product.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  R{product.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      Selected: {category.selectedProducts.length} / {category.maxSelections}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collection Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Collection Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allow Custom Selection
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowCustomSelection}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowCustomSelection: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Let customers choose their own combination
                  </span>
                </div>
              </div>

              {formData.allowCustomSelection && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Selections
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxSelections}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxSelections: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-blue-900 mb-4">Collection Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">
                  <span className="font-medium">Total Products:</span> {
                    categories.reduce((total, cat) => total + cat.selectedProducts.length, 0)
                  }
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Categories:</span> {
                    categories.filter(cat => cat.selectedProducts.length > 0).length
                  }
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-medium">Base Price:</span> R{calculateTotalPrice()}
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Type:</span> {formData.collectionType}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/collections">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading || !formData.name}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Collection'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
