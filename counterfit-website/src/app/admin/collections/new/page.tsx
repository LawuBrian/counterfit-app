"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  price: number
  images: Array<{ url: string; alt: string; isPrimary: boolean }>
  colors?: string[]
  sizes?: string[]
}

interface ProductCategory {
  name: string
  products: Product[]
  maxSelections: number
  selectedProducts: string[]
}

interface CollectionImage {
  url: string
  alt: string
  isPrimary: boolean
}

export default function NewCollectionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [coverImage, setCoverImage] = useState<CollectionImage | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collectionType: 'combo',
    basePrice: 0,
    allowCustomSelection: true,
    maxSelections: 2,
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

  // Clean up any duplicate selections when categories change
  useEffect(() => {
    if (categories.length > 0) {
      // Small delay to ensure categories are fully loaded
      const timer = setTimeout(() => {
        cleanupAllCategories()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [categories.length])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        
        // Group products by category
        const productCategories = groupProductsByCategory(data.products || [])
        setCategories(productCategories)
      } else {
        console.error('Error fetching products:', response.status, response.statusText)
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
    setCategories(prev => prev.map((cat, index) => {
      if (index === categoryIndex) {
        if (field === 'maxSelections') {
          // Ensure maxSelections is a valid number
          const numValue = parseInt(value)
          if (isNaN(numValue) || numValue < 1) {
            console.log(`Invalid maxSelections value: ${value}`)
            return cat // Don't update if invalid
          }
          // Ensure maxSelections doesn't exceed available products
          const maxAllowed = Math.min(numValue, cat.products.length)
          
          console.log(`Updating maxSelections for ${cat.name}: ${cat.maxSelections} -> ${maxAllowed}`)
          
          // Clean up any invalid selections after changing maxSelections
          setTimeout(() => cleanupInvalidSelections(categoryIndex, maxAllowed), 0)
          
          return { ...cat, [field]: maxAllowed }
        }
        return { ...cat, [field]: value }
      }
      return cat
    }))
  }

  const handleProductSelection = (categoryIndex: number, productId: string, selected: boolean) => {
    setCategories(prev => prev.map((cat, index) => {
      if (index === categoryIndex) {
        const maxSelections = cat.maxSelections || 1
        
        console.log(`Selection attempt: ${selected ? 'add' : 'remove'} product ${productId}`)
        console.log(`Current selections: ${cat.selectedProducts.length}, Max allowed: ${maxSelections}`)
        console.log(`Current selected products: [${cat.selectedProducts.join(', ')}]`)
        
        if (selected) {
          // Check if product is already selected to prevent duplicates
          if (cat.selectedProducts.includes(productId)) {
            console.log(`Product ${productId} is already selected, ignoring`)
            return cat
          }
          
          // Check if we can add more products
          if (cat.selectedProducts.length < maxSelections) {
            const newSelectedProducts = [...cat.selectedProducts, productId]
            console.log(`Adding product ${productId}, new count: ${newSelectedProducts.length}`)
            console.log(`New selected products: [${newSelectedProducts.join(', ')}]`)
            return {
              ...cat,
              selectedProducts: newSelectedProducts
            }
          }
          // If we're at the limit, don't add more
          console.log(`Cannot add product ${productId}, already at limit ${maxSelections}`)
          return cat
        } else {
          // Always allow deselection
          const newSelectedProducts = cat.selectedProducts.filter(id => id !== productId)
          console.log(`Removing product ${productId}, new count: ${newSelectedProducts.length}`)
          console.log(`New selected products: [${newSelectedProducts.join(', ')}]`)
          return {
            ...cat,
            selectedProducts: newSelectedProducts
          }
        }
      }
      return cat
    }))
  }

  // Clean up any invalid selections when maxSelections changes
  const cleanupInvalidSelections = (categoryIndex: number, newMaxSelections: number) => {
    console.log(`Cleaning up selections for category ${categoryIndex}, new max: ${newMaxSelections}`)
    setCategories(prev => prev.map((cat, index) => {
      if (index === categoryIndex) {
        const currentSelections = cat.selectedProducts.length
        // Remove duplicates and limit to maxSelections
        const uniqueSelections = [...new Set(cat.selectedProducts)]
        const validSelections = uniqueSelections.slice(0, newMaxSelections)
        console.log(`Category ${cat.name}: ${currentSelections} -> ${validSelections.length} selections`)
        console.log(`Removed ${uniqueSelections.length - validSelections.length} excess selections`)
        return {
          ...cat,
          selectedProducts: validSelections
        }
      }
      return cat
    }))
  }

  // Clean up all categories to remove duplicates and invalid selections
  const cleanupAllCategories = () => {
    console.log('Cleaning up all categories...')
    setCategories(prev => prev.map(cat => {
      const maxSelections = cat.maxSelections || 1
      const uniqueSelections = [...new Set(cat.selectedProducts)]
      const validSelections = uniqueSelections.slice(0, maxSelections)
      
      if (uniqueSelections.length !== cat.selectedProducts.length) {
        console.log(`Category ${cat.name}: Removed ${cat.selectedProducts.length - uniqueSelections.length} duplicates`)
      }
      if (validSelections.length !== uniqueSelections.length) {
        console.log(`Category ${cat.name}: Removed ${uniqueSelections.length - validSelections.length} excess selections`)
      }
      
      return {
        ...cat,
        selectedProducts: validSelections
      }
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    try {
      const response = await fetch('/api/upload/collection-image', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data = await response.json()
        setCoverImage({
          url: data.data.url,
          alt: `Cover image for ${formData.name || 'collection'}`,
          isPrimary: true
        })
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
  }

  const calculateTotalPrice = () => {
    // Return the base price set by admin, not the sum of selected products
    return formData.basePrice || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate that we have products selected
      const totalSelectedProducts = categories.reduce((total, cat) => total + cat.selectedProducts.length, 0)
      if (totalSelectedProducts === 0) {
        alert('Please select at least one product for the collection')
        setLoading(false)
        return
      }

      // Validate that base price is set
      if (!formData.basePrice || formData.basePrice <= 0) {
        alert('Please set a valid base price for the collection')
        setLoading(false)
        return
      }

      // Validate that maxSelections matches the collection type
      if (formData.collectionType === 'duo' && formData.maxSelections !== 2) {
        alert('Duo collections must have exactly 2 products per order')
        setLoading(false)
        return
      }
      if (formData.collectionType === 'trio' && formData.maxSelections !== 3) {
        alert('Trio collections must have exactly 3 products per order')
        setLoading(false)
        return
      }

      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Prepare collection data
      const collectionData = {
        ...formData,
        slug,
        basePrice: calculateTotalPrice(),
        image: coverImage?.url || '',
        productCategories: categories.map(cat => ({
          name: cat.name,
          maxSelections: cat.maxSelections,
          selectedProducts: cat.selectedProducts
        }))
      }

      console.log('🚀 Creating collection with data:', collectionData)
      
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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-md font-medium text-blue-900 mb-2">💡 How to Create a Collection</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>1.</strong> Give your collection a descriptive name (e.g., "Premium Jacket + Skully Combo")</p>
            <p><strong>2.</strong> Set the <strong>base price</strong> customers will pay for the collection</p>
            <p><strong>3.</strong> Set how many products customers will receive in total</p>
            <p><strong>4.</strong> Upload a cover image that represents the collection</p>
            <p><strong>5.</strong> Select products from each category that customers can choose from</p>
            <p><strong>6.</strong> Set max selections per category (how many items customers can pick from each category)</p>
            <p className="text-xs text-blue-600 mt-2">
              💰 <strong>Pricing Model:</strong> Customers pay the base price and then choose from your selected products. 
              This allows you to offer value while maintaining profitability.
            </p>
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
                  placeholder="e.g., Premium Jacket + Skully Combo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Type *
                </label>
                <select
                  required
                  value={formData.collectionType}
                  onChange={(e) => {
                    const newType = e.target.value
                    let newMaxSelections = formData.maxSelections
                    
                    // Auto-adjust maxSelections based on collection type
                    if (newType === 'duo') newMaxSelections = 2
                    else if (newType === 'trio') newMaxSelections = 3
                    else if (newType === 'singular') newMaxSelections = 1
                    else if (newType === 'combo') newMaxSelections = 2
                    
                    setFormData(prev => ({ 
                      ...prev, 
                      collectionType: newType,
                      maxSelections: newMaxSelections
                    }))
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="combo">Combo Package (e.g., Jacket + Skully)</option>
                  <option value="duo">Duo Collection (2 items)</option>
                  <option value="trio">Trio Collection (3 items)</option>
                  <option value="mixed">Mixed Selection (Customer chooses)</option>
                  <option value="singular">Single Product</option>
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
                  Products in Collection
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxSelections}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxSelections: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 for Jacket + Skully"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total number of products customers will receive per order. 
                  {formData.collectionType === 'duo' && ' (Auto-set to 2 for Duo collections)'}
                  {formData.collectionType === 'trio' && ' (Auto-set to 3 for Trio collections)'}
                  {formData.collectionType === 'combo' && ' (Recommended: 2 for Jacket + Skully combo)'}
                </p>
                {(formData.collectionType === 'duo' && formData.maxSelections !== 2) && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Duo collections should have 2 products per order</p>
                )}
                {(formData.collectionType === 'trio' && formData.maxSelections !== 3) && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Trio collections should have 3 products per order</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Cover Image */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Collection Cover Image</h2>
            
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage.url}
                  alt={coverImage.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="cover-image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload collection cover image
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </label>
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Product Selection</h2>
                  <p className="text-sm text-gray-600">
                    Select products from each category that customers can choose from. 
                    For example, select all jackets for the "Outerwear" category and all skull caps for "Accessories".
                  </p>
                </div>
                <button
                  type="button"
                  onClick={cleanupAllCategories}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Clean Up Selections
                </button>
              </div>
            </div>
            
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
                          value={category.maxSelections || 1}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value === '') return // Don't update if empty
                            const numValue = parseInt(value)
                            if (!isNaN(numValue) && numValue >= 1) {
                              console.log(`Setting maxSelections for ${category.name} to ${numValue}`)
                              handleCategoryChange(categoryIndex, 'maxSelections', numValue)
                            }
                          }}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span className="text-xs text-gray-500">per customer</span>
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
                                {product.colors && product.colors.length > 0 && (
                                  <p className="text-xs text-gray-400">
                                    Colors: {product.colors.join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      Selected: {category.selectedProducts.length} / {category.maxSelections || 1}
                      {category.selectedProducts.length > (category.maxSelections || 1) && (
                        <span className="ml-2 text-red-600 font-medium">
                          ⚠️ Over limit!
                        </span>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Debug: maxSelections={category.maxSelections}, selectedCount={category.selectedProducts.length}
                        <button
                          type="button"
                          onClick={() => {
                            console.log(`Resetting selections for ${category.name}`)
                            setCategories(prev => prev.map((cat, idx) => 
                              idx === categoryIndex ? { ...cat, selectedProducts: [] } : cat
                            ))
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700 underline"
                        >
                          Reset
                        </button>
                      </div>
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
                <p className="text-xs text-gray-500 mt-1">
                  When enabled, customers can pick any combination from selected categories
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Type
                </label>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Combo:</strong> Fixed combination (e.g., Jacket + Skully)</p>
                  <p><strong>Duo:</strong> Choose 2 items from any category</p>
                  <p><strong>Trio:</strong> Choose 3 items from any category</p>
                  <p><strong>Mixed:</strong> Flexible selection up to max limit</p>
                </div>
              </div>
            </div>

            {/* Collection Base Price */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Base Price
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">R</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    basePrice: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="299.99"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is the price customers pay for the collection. They can then choose from the available products.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-blue-900 mb-4">Collection Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">
                  <span className="font-medium">Available Products:</span> {
                    categories.reduce((total, cat) => total + cat.selectedProducts.length, 0)
                  }
                  <span className="ml-2 text-xs text-blue-500">
                    (Debug: {categories.map(cat => `${cat.name}:${cat.selectedProducts.length}`).join(', ')})
                  </span>
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Categories:</span> {
                    categories.filter(cat => cat.selectedProducts.length > 0).length
                  }
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Cover Image:</span> {coverImage ? '✅ Set' : '❌ Not set'}
                </p>
              </div>
              <div>
                <p className="text-blue-700">
                  <span className="font-medium">Collection Base Price:</span> R{calculateTotalPrice()}
                </p>
                <p className="text-blue-600 text-sm">
                  <span className="font-medium">Available Products Value:</span> R{
                    categories.reduce((total, cat) => {
                      return total + cat.selectedProducts.reduce((catTotal, productId) => {
                        const product = cat.products.find(p => p.id === productId)
                        return catTotal + (product?.price || 0)
                      }, 0)
                    }, 0)
                  }
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  Customers pay the base price and choose from available products
                </p>
                <p className="text-blue-700 mt-2">
                  <span className="font-medium">Type:</span> {formData.collectionType}
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Products per Order:</span> {formData.maxSelections}
                </p>
              </div>
            </div>
            
            {/* Category breakdown */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h3 className="text-md font-medium text-blue-900 mb-2">Category Breakdown:</h3>
              <div className="space-y-1">
                {categories.filter(cat => cat.selectedProducts.length > 0).map((category) => (
                  <div key={category.name} className="flex justify-between text-sm">
                    <span className="text-blue-700 capitalize">{category.name}:</span>
                    <span className="text-blue-600">
                      {category.selectedProducts.length} products (max {category.maxSelections} per customer)
                    </span>
                  </div>
                ))}
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
              disabled={loading || !formData.name || !coverImage || !formData.basePrice || formData.basePrice <= 0 || categories.filter(cat => cat.selectedProducts.length > 0).length === 0}
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
