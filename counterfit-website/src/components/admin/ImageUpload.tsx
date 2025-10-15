"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon, FolderOpen } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface ImageUploadProps {
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  onChange: (images: Array<{ url: string; alt: string; isPrimary: boolean }>) => void
  maxImages?: number
  category?: string // Add category prop for organizing images
}

export default function ImageUpload({ images, onChange, maxImages = 10, category = 'products' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to determine the appropriate folder based on category
  const getImageFolder = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'outerwear': 'images/outerwear',
      'tops': 'images/tops',
      'bottoms': 'images/bottoms',
      'accessories': 'images/accessories',
      'collections': 'images/collections',
      'hero': 'images/hero',
      'products': 'images/products'
    }
    return categoryMap[category] || 'images/products'
  }

  const handleFiles = async (files: FileList | null) => {
    console.log('🖼️ handleFiles called with:', files)
    
    if (!files || files.length === 0) {
      console.log('❌ No files provided')
      return
    }

    const remainingSlots = maxImages - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    
    console.log('📊 Upload stats:', {
      totalFiles: files.length,
      remainingSlots,
      filesToUpload: filesToUpload.length
    })

    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      // Upload files to backend
      const newImages = []
      
      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append('image', file)
        
        console.log('📤 Uploading file:', file.name)
        
        const response = await fetch(`/api/upload/product-image?category=${category}`, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          // Backend now returns the correct organized path
          const organizedPath = result.data.url
          const filename = result.data.filename
          
          console.log('📁 Backend returned organized path:', organizedPath)
          
          newImages.push({
            url: organizedPath,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            isPrimary: false
          })
        } else {
          throw new Error(result.message || 'Upload failed')
        }
      }

      console.log('🎉 All files uploaded:', newImages)
      
      // Set first image as primary if no images exist
      if (images.length === 0 && newImages.length > 0) {
        newImages[0].isPrimary = true
        console.log('⭐ Set first image as primary')
      }

      const updatedImages = [...images, ...newImages]
      
      // Validate the final image list
      const validatedImages = validateImages(updatedImages)
      
      console.log('🔄 Updating images state:', validatedImages)
      onChange(validatedImages)
      
    } catch (error) {
      console.error('❌ Upload error:', error)
      alert(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      console.log('🏁 Upload process completed')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  // Validation function to ensure image data integrity
  const validateImages = (imageList: typeof images) => {
    const primaryCount = imageList.filter(img => img.isPrimary).length
    if (primaryCount === 0 && imageList.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No primary image found, setting first image as primary')
      }
      imageList[0].isPrimary = true
    } else if (primaryCount > 1) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Multiple primary images found (${primaryCount}), keeping only the first one`)
      }
      let foundFirst = false
      imageList.forEach(img => {
        if (img.isPrimary && !foundFirst) {
          foundFirst = true
        } else if (img.isPrimary) {
          img.isPrimary = false
        }
      })
    }
    return imageList
  }

  const updateImage = (index: number, field: string, value: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ImageUpload: Updating image ${index}, field: ${field}, value: ${value}`)
      console.log('📋 Before update:', images.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'} (${img.url.split('/').pop()})`).join(' '))
    }
    
    // Create a deep copy to avoid mutation issues
    const updatedImages = images.map((img, i) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      ...(i === index ? { [field]: value } : {})
    }))
    
    // If setting as primary, unset others
    if (field === 'isPrimary' && value === true) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Setting as primary, unsetting others...')
      }
      updatedImages.forEach((img, i) => {
        if (i !== index && img.isPrimary) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`   Unsetting image ${i}`)
          }
          img.isPrimary = false
        }
      })
    }
    
    // Validate and fix any issues
    const validatedImages = validateImages(updatedImages)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 After update:', validatedImages.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'} (${img.url.split('/').pop()})`).join(' '))
      console.log('🚀 Calling onChange with updated images')
    }
    onChange(validatedImages)
  }

  const removeImage = (index: number) => {
    console.log(`🗑️ Removing image ${index}`)
    const wasRemovingPrimary = images[index].isPrimary
    const updatedImages = images.filter((_, i) => i !== index)
    
    // If removed image was primary and there are other images, make first one primary
    if (wasRemovingPrimary && updatedImages.length > 0) {
      console.log('🎯 Removed image was primary, setting first remaining image as primary')
      updatedImages[0].isPrimary = true
    }
    
    // Validate the final image list
    const validatedImages = validateImages(updatedImages)
    
    console.log('📋 After removal:', validatedImages.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'} (${img.url.split('/').pop()})`).join(' '))
    onChange(validatedImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Saving to: {getImageFolder(category)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Drop images here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-primary/80 font-medium"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 100MB each. Maximum {maxImages} images.
            </p>
          </div>
          
          {!uploading && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Images
            </Button>
          )}
          
          {uploading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Images ({images.length}/{maxImages})</h4>
          
          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                image.isPrimary 
                  ? 'border-2 border-primary bg-primary/5 shadow-md' 
                  : 'border border-gray-200 bg-gray-50'
              }`}>
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.alt || `Product image ${index + 1}`}
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                </div>
                
                {/* Image Details */}
                <div className="flex-1 space-y-2">
                  <div className="text-xs text-gray-500 font-mono">
                    {image.url}
                  </div>
                  <input
                    type="text"
                    placeholder="Alt text (optional)"
                    value={image.alt}
                    onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={image.isPrimary}
                        onChange={(e) => {
                          console.log(`🎯 Checkbox clicked for image ${index}, checked: ${e.target.checked}`)
                          updateImage(index, 'isPrimary', e.target.checked)
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 cursor-pointer"
                      />
                      <span className={`${image.isPrimary ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                        Primary image
                      </span>
                    </label>
                    {image.isPrimary && (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
                        ⭐ PRIMARY
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {images.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No images uploaded yet
        </div>
      )}
      
      {/* Debug info - remove in production */}
      {images.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-medium text-blue-800 mb-2">Primary Image Status:</h5>
          <div className="text-xs text-blue-700">
            {(() => {
              const primaryImages = images.filter(img => img.isPrimary)
              if (primaryImages.length === 0) {
                return '⚠️ No primary image set'
              } else if (primaryImages.length === 1) {
                const primaryIndex = images.findIndex(img => img.isPrimary)
                return `✅ Image ${primaryIndex + 1} is set as primary: ${primaryImages[0].url.split('/').pop()}`
              } else {
                return `❌ Multiple primary images detected (${primaryImages.length})`
              }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
