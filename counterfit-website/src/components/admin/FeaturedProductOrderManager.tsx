"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Save, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/api'

interface Product {
  id: string
  name: string
  images: Array<{ url: string; alt: string }>
  featuredOrder?: number
  status: string
}

// Sortable Product Item Component
function SortableProductItem({ product, index }: { product: Product; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg bg-white ${
        isDragging ? 'shadow-lg rotate-2 opacity-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          {product.images?.[0]?.url ? (
            <Image
              src={getImageUrl(product.images.find(img => img.isPrimary)?.url || product.images[0]?.url)}
              alt={product.images.find(img => img.isPrimary)?.alt || product.images[0]?.alt || product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">
            Order: {index + 1} • Status: {product.status}
          </p>
        </div>
      </div>
      
      <div className="text-sm text-gray-400">
        #{index + 1}
      </div>
    </div>
  )
}

export default function FeaturedProductOrderManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products/featured-order')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Ensure featuredOrder is set for all products
          const productsWithOrder = data.data.map((product: Product, index: number) => ({
            ...product,
            featuredOrder: product.featuredOrder ?? index
          }))
          setProducts(productsWithOrder)
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
      setMessage('Failed to fetch featured products')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update featuredOrder for all items
        return newItems.map((item, index) => ({
          ...item,
          featuredOrder: index
        }))
      })
    }
  }

  const saveOrder = async () => {
    try {
      setSaving(true)
      setMessage('')

      const productOrders = products.map((product, index) => ({
        id: product.id,
        featuredOrder: index
      }))

      const response = await fetch('/api/admin/products/featured-order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productOrders })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessage('Featured product order saved successfully!')
          setTimeout(() => setMessage(''), 3000)
        }
      } else {
        setMessage('Failed to save order')
      }
    } catch (error) {
      console.error('Error saving order:', error)
      setMessage('Failed to save order')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Product Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Featured Product Order</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={fetchFeaturedProducts}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={saveOrder}
              disabled={saving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Drag and drop products to rearrange their order on the home page
        </p>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No featured products found
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={products.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {products.map((product, index) => (
                  <SortableProductItem
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
