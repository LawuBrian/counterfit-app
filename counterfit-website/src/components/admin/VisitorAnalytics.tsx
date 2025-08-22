"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Monitor, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  BarChart3,
  MapPin,
  Smartphone,
  Laptop
} from 'lucide-react'

interface VisitorAnalytics {
  period: string
  overview: {
    totalVisitors: number
    uniqueVisitors: number
    returningVisitors: number
    totalPageViews: number
    avgVisitDuration: number
    bounceRate: number
  }
  topPages: Array<{
    url: string
    title: string
    views: number
  }>
  deviceTypes: Array<{
    type: string
    count: number
  }>
  countries: Array<{
    name: string
    count: number
  }>
  timeDistribution: Array<{
    hour?: number
    date?: string
    count: number
  }>
}

interface RecentVisitor {
  id: string
  sessionid: string
  pageurl: string
  pagetitle: string
  country: string
  city: string
  devicetype: string
  browser: string
  os: string
  pagesviewed: number
  visitduration: number
  lastactivity: string
  createdat: string
}

export default function VisitorAnalytics() {
  const [analytics, setAnalytics] = useState<VisitorAnalytics | null>(null)
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([])
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const [analyticsRes, visitorsRes] = await Promise.all([
        fetch(`/api/admin/visitors/analytics?period=${period}`),
        fetch('/api/admin/visitors/recent?limit=10')
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.data)
      }

      if (visitorsRes.ok) {
        const visitorsData = await visitorsRes.json()
        setRecentVisitors(visitorsData.data)
      }
    } catch (error) {
      console.error('Error fetching visitor analytics:', error)
      setError('Failed to fetch visitor analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const formatDuration = (minutes: number): string => {
    if (minutes < 1) return '< 1 min'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'tablet':
        return <Monitor className="w-4 h-4" />
      case 'desktop':
        return <Laptop className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No visitor data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Analytics</h2>
          <p className="text-gray-600">Track your website traffic and user behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={period === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('24h')}
          >
            24h
          </Button>
          <Button
            variant={period === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('7d')}
          >
            7d
          </Button>
          <Button
            variant={period === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('30d')}
          >
            30d
          </Button>
          <Button
            variant={period === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('90d')}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.overview.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-3xl font-bold text-green-600">{analytics.overview.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Eye className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.overview.totalPageViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
              <p className="text-3xl font-bold text-orange-600">{formatDuration(analytics.overview.avgVisitDuration)}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Returning Visitors</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.overview.returningVisitors.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics.overview.uniqueVisitors > 0 
              ? Math.round((analytics.overview.returningVisitors / analytics.overview.uniqueVisitors) * 100)
              : 0}% of total visitors
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bounce Rate</h3>
            <TrendingUp className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{analytics.overview.bounceRate}%</p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics.overview.bounceRate > 70 ? 'High' : 
             analytics.overview.bounceRate > 40 ? 'Medium' : 'Low'} bounce rate
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pages per Visit</h3>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {analytics.overview.uniqueVisitors > 0 
              ? (analytics.overview.totalPageViews / analytics.overview.uniqueVisitors).toFixed(1)
              : 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">Average pages viewed per visitor</p>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.topPages.slice(0, 5).map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                  <p className="text-xs text-gray-500 truncate">{page.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{page.views}</span>
                  <span className="text-xs text-gray-500">views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-3">
            {analytics.deviceTypes.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(device.type)}
                  <span className="text-sm font-medium text-gray-900 capitalize">{device.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{device.count}</span>
                  <span className="text-xs text-gray-500">visitors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Visitors</h3>
        </div>
        <div className="p-6">
          {recentVisitors.length > 0 ? (
            <div className="space-y-4">
              {recentVisitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(visitor.devicetype)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {visitor.pagetitle || 'Unknown Page'}
                        </p>
                        <p className="text-xs text-gray-500">{visitor.pageurl}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{visitor.country || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Monitor className="w-4 h-4" />
                      <span>{visitor.browser} on {visitor.os}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{visitor.pagesviewed} pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{visitor.visitduration > 0 ? formatDuration(visitor.visitduration) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(visitor.lastactivity)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No recent visitors</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
