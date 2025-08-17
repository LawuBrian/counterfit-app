"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FolderOpen, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Star,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import BulkCollectionImport from '@/components/admin/BulkCollectionImport'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  collectionType: 'singular' | 'combo' | 'duo' | 'trio' | 'mixed'
  basePrice: number
  allowCustomSelection: boolean
  maxSelections?: number
  productCategories: string[]
  createdAt: string
  updatedAt: string
}

interface Filters {
  search: string
  status: string
  featured: string
}

export default function AdminCollectionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    featured: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchCollections()
  }, [session, status, router, currentPage, filters])

  const fetchCollections = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      })

      const response = await fetch(`/api/admin/collections?${queryParams}`)
      
      if (response.ok) {
        const data = await response.json()
        setCollections(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        console.error('Failed to fetch collections')
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return
    
    try {
      const response = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setCollections(prev => prev.filter(c => c.id !== id))
        console.log('Collection deleted successfully')
      } else {
        console.error('Failed to delete collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/collections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !featured })
      })
      
      if (response.ok) {
        setCollections(prev => prev.map(c => 
          c.id === id ? { ...c, featured: !featured } : c
        ))
      }
    } catch (error) {
      console.error('Error updating collection:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
            <p className="text-gray-600">Manage your product collections and combo packages</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowBulkImport(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Import</span>
            </Button>
            <Link href="/admin/collections/new">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Collection</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchCollections}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Collections ({collections.length})
              </h2>
              {selectedCollections.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedCollections([])}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
          
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new collection.
              </p>
              <div className="mt-6">
                <Link href="/admin/collections/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Collection
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {collection.image ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={collection.image}
                                alt={collection.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {collection.name}
                              {collection.featured && (
                                <Star className="inline h-4 w-4 text-yellow-400 ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {collection.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {collection.collectionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          collection.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : collection.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {collection.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R{collection.basePrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleFeatured(collection.id, collection.featured)}
                          >
                            {collection.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Link href={`/admin/collections/${collection.id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCollection(collection.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <BulkCollectionImport
          onClose={() => setShowBulkImport(false)}
          onSuccess={() => {
            setShowBulkImport(false)
            fetchCollections()
          }}
        />
      )}
    </div>
  )
}
