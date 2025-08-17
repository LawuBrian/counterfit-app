"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface ImageUploadProps {
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  onChange: (images: Array<{ url: string; alt: string; isPrimary: boolean }>) => void
  maxImages?: number
}

export default function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // Upload files one by one to avoid body size limit issues
      const uploadPromises = filesToUpload.map(async (file, index) => {
        console.log(`🔄 Uploading file ${index + 1}/${filesToUpload.length}:`, {
          name: file.name,
          size: file.size,
          type: file.type
        })
        
        const formData = new FormData()
        formData.append('image', file)
        
        console.log('📤 FormData created:', {
          hasImage: formData.has('image'),
          imageValue: formData.get('image')
        })

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com';
        console.log('🌐 Making request directly to backend:', `${backendUrl}/api/upload/product-image`)
        const response = await fetch(`${backendUrl}/api/upload/product-image`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })

        console.log('📥 Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })

        const data = await response.json()
        console.log('📄 Response data:', data)

        if (!response.ok) {
          throw new Error(data.message || 'Upload failed')
        }

        console.log('✅ File uploaded successfully:', data.data.url)
        return {
          url: data.data.url,
          alt: '',
          isPrimary: false
        }
      })

      const newImages = await Promise.all(uploadPromises)
      console.log('🎉 All files uploaded:', newImages)
      
      // Set first image as primary if no images exist
      if (images.length === 0 && newImages.length > 0) {
        newImages[0].isPrimary = true
        console.log('⭐ Set first image as primary')
      }

      const updatedImages = [...images, ...newImages]
      console.log('🔄 Updating images state:', updatedImages)
      onChange(updatedImages)
      
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

  const updateImage = (index: number, field: string, value: any) => {
    const updatedImages = images.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    )
    
    // If setting as primary, unset others
    if (field === 'isPrimary' && value) {
      updatedImages.forEach((img, i) => {
        if (i !== index) img.isPrimary = false
      })
    }
    
    onChange(updatedImages)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    
    // If removed image was primary and there are other images, make first one primary
    if (images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true
    }
    
    onChange(updatedImages)
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
              <span className="ml-2 text-sm text-gray-600">Uploading...</span>
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
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
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
                  <input
                    type="text"
                    placeholder="Alt text (optional)"
                    value={image.alt}
                    onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={image.isPrimary}
                      onChange={(e) => updateImage(index, 'isPrimary', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <span className="text-gray-700">Primary image</span>
                    {image.isPrimary && (
                      <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                        Primary
                      </span>
                    )}
                  </label>
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
    </div>
  )
}
