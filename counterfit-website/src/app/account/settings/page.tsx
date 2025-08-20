"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Save,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface UserSettings {
  // Profile Settings
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // Notification Settings
  emailNotifications: {
    orderUpdates: boolean
    promotions: boolean
    newsletter: boolean
    stockAlerts: boolean
  }
  smsNotifications: {
    orderUpdates: boolean
    deliveryUpdates: boolean
  }
  
  // Privacy Settings
  profileVisibility: 'public' | 'private'
  showPurchaseHistory: boolean
  allowDataCollection: boolean
  
  // Display Settings
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  
  // Security Settings
  twoFactorEnabled: boolean
  loginAlerts: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emailNotifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      stockAlerts: true
    },
    smsNotifications: {
      orderUpdates: true,
      deliveryUpdates: true
    },
    profileVisibility: 'private',
    showPurchaseHistory: false,
    allowDataCollection: true,
    theme: 'system',
    language: 'en',
    currency: 'ZAR',
    twoFactorEnabled: false,
    loginAlerts: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchSettings()
  }, [session, status, router])

  const fetchSettings = async () => {
    try {
      setError('')
      setLoading(true)
      const response = await fetch('/api/users/settings')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.settings) {
          setSettings(data.settings)
        } else {
          // Fallback to session data if settings are empty
          setSettings(prev => ({
            ...prev,
            firstName: session?.user?.firstName || '',
            lastName: session?.user?.lastName || '',
            email: session?.user?.email || ''
          }))
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setError('')
    setSuccessMessage('')
    
    try {
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuccessMessage('Settings saved successfully!')
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setError(data.error || 'Failed to save settings')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccessMessage('')
      
      const response = await fetch('/api/users/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword,
          newPassword
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setSuccessMessage('Password changed successfully!')
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setError(data.error || 'Failed to change password')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setError('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action cannot be undone and will permanently delete your account and all associated data.')) {
      return
    }

    try {
      setSaving(true)
      setError('')
      
      const response = await fetch('/api/users/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'delete-account',
          confirm: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert('Account deleted successfully')
          router.push('/')
        } else {
          setError(data.error || 'Failed to delete account')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      setError('')
      setSuccessMessage('')
      
      const response = await fetch('/api/users/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'export-data'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Create data export
          const exportData = {
            profile: settings,
            exportDate: new Date().toISOString(),
            dataTypes: ['profile', 'orders', 'addresses', 'payment_methods']
          }
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `counterfit-data-export-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          setSuccessMessage('Data export downloaded successfully!')
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          setError(data.error || 'Failed to export data')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to export data')
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      setError('Failed to export data')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/account"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="font-heading text-3xl font-bold text-primary">
                  Account Settings
                </h1>
                <p className="text-secondary">Manage your preferences and privacy</p>
              </div>
            </div>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-heading text-xl font-semibold text-primary mb-6">
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.firstName}
                onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.lastName}
                onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.dateOfBirth}
                onChange={(e) => setSettings(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <h2 className="font-heading text-xl font-semibold text-primary">
              Notification Preferences
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-3">
                {Object.entries(settings.emailNotifications).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        emailNotifications: {
                          ...prev.emailNotifications,
                          [key]: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4">SMS Notifications</h3>
              <div className="space-y-3">
                {Object.entries(settings.smsNotifications).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        smsNotifications: {
                          ...prev.smsNotifications,
                          [key]: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <h2 className="font-heading text-xl font-semibold text-primary">
              Privacy & Data
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.profileVisibility}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  profileVisibility: e.target.value as 'public' | 'private' 
                }))}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showPurchaseHistory}
                  onChange={(e) => setSettings(prev => ({ ...prev, showPurchaseHistory: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm text-gray-700">Show purchase history on profile</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowDataCollection}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowDataCollection: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm text-gray-700">Allow data collection for personalized recommendations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Globe className="w-5 h-5 text-primary mr-2" />
            <h2 className="font-heading text-xl font-semibold text-primary">
              Display & Language
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'light', icon: Sun, label: 'Light' },
                  { value: 'dark', icon: Moon, label: 'Dark' },
                  { value: 'system', icon: Monitor, label: 'System' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setSettings(prev => ({ ...prev, theme: value as 'light' | 'dark' | 'system' }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                      settings.theme === value 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
                <option value="xh">Xhosa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="ZAR">South African Rand (R)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <h2 className="font-heading text-xl font-semibold text-primary">
              Security
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm text-gray-700">Enable two-factor authentication</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.loginAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                />
                <span className="text-sm text-gray-700">Send email alerts for new logins</span>
              </label>
            </div>
            
            {/* Change Password */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? 'Changing Password...' : 'Change Password'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-heading text-xl font-semibold text-primary mb-6">
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Export Your Data</h3>
                <p className="text-sm text-gray-600">Download a copy of your account data</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-900 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account
                </h3>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDeleteAccount}
                disabled={saving}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {saving ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
