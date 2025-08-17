"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'

interface CollectionData {
  name: string
  description?: string
  image?: string
  featured: boolean
  status: 'draft' | 'active' | 'archived'
  collectionType: 'singular' | 'combo' | 'duo' | 'trio' | 'mixed'
  basePrice: number
  allowCustomSelection: boolean
  maxSelections?: number
  productCategories?: string
}

interface ImportResult {
  success: boolean
  message: string
  collection?: any
  error?: string
}

export default function BulkCollectionImport({ onImportComplete }: { onImportComplete?: () => void }) {
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

  const parseCSV = (csvText: string): CollectionData[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const collections: CollectionData[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const collection: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        // Handle boolean values
        if (header === 'featured' || header === 'allowCustomSelection') {
          collection[header] = value.toLowerCase() === 'true' || value === '1'
        }
        // Handle numeric values
        else if (['basePrice', 'maxSelections'].includes(header)) {
          collection[header] = parseFloat(value) || 0
        }
        // Handle arrays (productCategories)
        else if (header === 'productCategories') {
          collection[header] = value ? value.split('|').map((v: string) => v.trim()) : []
        }
        // Handle default values
        else {
          collection[header] = value
        }
      })

      // Set defaults for required fields
      collection.status = collection.status || 'draft'
      collection.collectionType = collection.collectionType || 'singular'
      collection.featured = collection.featured || false
      collection.allowCustomSelection = collection.allowCustomSelection || false
      collection.basePrice = collection.basePrice || 0
      collection.maxSelections = collection.maxSelections || 1

      collections.push(collection)
    }

    return collections
  }

  const parseJSON = (jsonText: string): CollectionData[] => {
    try {
      const data = JSON.parse(jsonText)
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  const importCollections = async (collections: CollectionData[]) => {
    setIsImporting(true)
    setResults([])
    setShowResults(true)

    const results: ImportResult[] = []

    for (const collection of collections) {
      try {
        // Transform the collection data to match your API
        const transformedCollection = {
          ...collection,
          productCategories: collection.productCategories || []
        }

        const response = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedCollection)
        })

        if (response.ok) {
          const result = await response.json()
          results.push({
            success: true,
            message: `✅ ${collection.name} imported successfully`,
            collection: result
          })
        } else {
          const error = await response.json()
          results.push({
            success: false,
            message: `❌ ${collection.name} failed to import`,
            error: error.message || 'Unknown error'
          })
        }
      } catch (error) {
        results.push({
          success: false,
          message: `❌ ${collection.name} failed to import`,
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
      let collections: CollectionData[] = []
      
      if (importMethod === 'csv') {
        if (!csvData.trim()) {
          alert('Please enter CSV data or upload a file')
          return
        }
        collections = parseCSV(csvData)
      } else {
        if (!jsonData.trim()) {
          alert('Please enter JSON data')
          return
        }
        collections = parseJSON(jsonData)
      }

      if (collections.length === 0) {
        alert('No valid collections found')
        return
      }

      await importCollections(collections)
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getCSVTemplate = () => {
    const template = `name,description,image,featured,status,collectionType,basePrice,allowCustomSelection,maxSelections,productCategories
"Summer Collection","Fresh summer styles for the season","https://example.com/summer.jpg",true,"active","combo",1500,true,3,"jackets|pants|accessories"
"Winter Essentials","Warm winter clothing collection","https://example.com/winter.jpg",false,"draft","duo",2000,false,2,"jackets|pants"
"Luxury Line","Premium luxury collection","https://example.com/luxury.jpg",true,"active","singular",3000,false,1,"jackets"`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'collection-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Bulk Collection Import</h2>
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
            placeholder='[{"name": "Collection Name", "description": "Description", "collectionType": "combo", "basePrice": 1500}]'
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
              Import Collections
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
              {results.filter(r => r.success).length} of {results.length} collections imported successfully
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
          <li>• Required fields: name, collectionType, basePrice</li>
          <li>• Collection types: singular, combo, duo, trio, mixed</li>
          <li>• Product categories can be separated with | (e.g., "jackets|pants")</li>
          <li>• Boolean fields: use "true"/"false" or "1"/"0"</li>
          <li>• Collections will be created as drafts by default</li>
        </ul>
      </div>
    </div>
  )
}
