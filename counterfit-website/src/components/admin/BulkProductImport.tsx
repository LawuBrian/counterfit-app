"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'

interface ProductData {
  name: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  stockCode?: string
  sku?: string
  barcode?: string
  category: string
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  isNew: boolean
  isAvailable: boolean
  sizes?: string
  colors?: string
  inventory?: number
  lowStockThreshold?: number
}

interface ImportResult {
  success: boolean
  message: string
  product?: any
  error?: string
}

export default function BulkProductImport({ onImportComplete }: { onImportComplete?: () => void }) {
  const [importMethod, setImportMethod] = useState<'csv' | 'json'>('csv')
  const [csvData, setCsvData] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvData(text)
    }
    reader.readAsText(file)
  }

  const parseCSV = (csvText: string): ProductData[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const products: ProductData[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const product: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        // Handle boolean values
        if (header === 'featured' || header === 'isNew' || header === 'isAvailable') {
          product[header] = value.toLowerCase() === 'true' || value === '1'
        }
        // Handle numeric values
        else if (['price', 'comparePrice', 'costPrice', 'inventory', 'lowStockThreshold'].includes(header)) {
          product[header] = parseFloat(value) || 0
        }
        // Handle arrays (sizes, colors)
        else if (header === 'sizes' || header === 'colors') {
          product[header] = value ? value.split('|').map((v: string) => v.trim()) : []
        }
        // Handle default values
        else {
          product[header] = value
        }
      })

      // Set defaults for required fields
      product.status = product.status || 'draft'
      product.category = product.category || 'outerwear'
      product.featured = product.featured || false
      product.isNew = product.isNew || false
      product.isAvailable = product.isAvailable !== false

      products.push(product)
    }

    return products
  }

  const parseJSON = (jsonText: string): ProductData[] => {
    try {
      const data = JSON.parse(jsonText)
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  const importProducts = async (products: ProductData[]) => {
    setIsImporting(true)
    setResults([])
    setShowResults(true)

    const results: ImportResult[] = []

    for (const product of products) {
      try {
        // Transform the product data to match your API
        const transformedProduct = {
          ...product,
          images: [], // Will be empty for bulk import
          sizes: product.sizes ? product.sizes.map((size: string) => ({
            size,
            stock: product.inventory || 0,
            isAvailable: true
          })) : [],
          colors: product.colors ? product.colors.map((color: string) => ({
            name: color,
            hexCode: '#000000',
            stock: product.inventory || 0,
            isAvailable: true
          })) : [],
          inventory: {
            trackQuantity: true,
            quantity: product.inventory || 0,
            lowStockThreshold: product.lowStockThreshold || 10,
            allowBackorder: false
          },
          shipping: {
            weight: 0,
            dimensions: { length: 0, width: 0, height: 0 },
            requiresShipping: true
          },
          seo: {
            title: product.name,
            description: product.description,
            keywords: []
          }
        }

        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedProduct)
        })

        if (response.ok) {
          const result = await response.json()
          results.push({
            success: true,
            message: `✅ ${product.name} imported successfully`,
            product: result
          })
        } else {
          const error = await response.json()
          results.push({
            success: false,
            message: `❌ ${product.name} failed to import`,
            error: error.message || 'Unknown error'
          })
        }
      } catch (error) {
        results.push({
          success: false,
          message: `❌ ${product.name} failed to import`,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    setResults(results)
    setIsImporting(false)
    
    if (onImportComplete) {
      onImportComplete()
    }
  }

  const handleImport = async () => {
    try {
      let products: ProductData[] = []
      
      if (importMethod === 'csv') {
        if (!csvData.trim()) {
          alert('Please enter CSV data or upload a file')
          return
        }
        products = parseCSV(csvData)
      } else {
        if (!jsonData.trim()) {
          alert('Please enter JSON data')
          return
        }
        products = parseJSON(jsonData)
      }

      if (products.length === 0) {
        alert('No valid products found')
        return
      }

      await importProducts(products)
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getCSVTemplate = () => {
    const template = `name,description,shortDescription,price,comparePrice,costPrice,stockCode,sku,barcode,category,status,featured,isNew,isAvailable,sizes,colors,inventory,lowStockThreshold
"White Jacket","Elegant white jacket with premium materials and modern styling","Premium white jacket",299.99,399.99,150.00,"CF-JKT-001","WHITE-JKT-001","123456789","outerwear","active",true,true,true,"S|M|L|XL","White",50,10
"Black Jacket","Sleek black jacket for any occasion","Classic black jacket",299.99,399.99,150.00,"CF-JKT-002","BLACK-JKT-001","123456790","outerwear","active",true,true,true,"S|M|L|XL","Black",45,10`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Bulk Product Import</h2>
        <Button variant="outline" size="sm" onClick={getCSVTemplate}>
          <FileText className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>
      </div>

      {/* Import Method Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setImportMethod('csv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            importMethod === 'csv'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload className="inline mr-2 h-4 w-4" />
          CSV Import
        </button>
        <button
          onClick={() => setImportMethod('json')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            importMethod === 'json'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          JSON Import
        </button>
      </div>

      {/* CSV Import */}
      {importMethod === 'csv' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Paste CSV Data
            </label>
            <textarea
              rows={8}
              placeholder="Paste your CSV data here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* JSON Import */}
      {importMethod === 'json' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste JSON Data
          </label>
          <textarea
            rows={8}
            placeholder='[{"name": "Product Name", "description": "Description", "price": 99.99, "category": "outerwear"}]'
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
          />
        </div>
      )}

      {/* Import Button */}
      <div className="mt-6">
        <Button
          onClick={handleImport}
          disabled={isImporting || (!csvData.trim() && !jsonData.trim())}
          className="w-full"
        >
          {isImporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Products
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {showResults && results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </p>
                    {result.error && (
                      <p className="text-xs text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {results.filter(r => r.success).length} of {results.length} products imported successfully
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResults(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Hide Results
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Import Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Download the CSV template to see the required format</li>
          <li>• Required fields: name, description, price, category</li>
          <li>• Sizes and colors can be separated with | (e.g., "S|M|L|XL")</li>
          <li>• Boolean fields: use "true"/"false" or "1"/"0"</li>
          <li>• Products will be created as drafts by default</li>
        </ul>
      </div>
    </div>
  )
}
