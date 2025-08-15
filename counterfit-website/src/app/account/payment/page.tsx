"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Check,
  X,
  Shield,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank_account'
  isDefault: boolean
  // Card fields
  cardNumber?: string
  cardholderName?: string
  expiryMonth?: string
  expiryYear?: string
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover'
  // PayPal fields
  paypalEmail?: string
  // Bank account fields
  bankName?: string
  accountNumber?: string
  routingNumber?: string
  accountType?: 'checking' | 'savings'
}

export default function PaymentMethodsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id'>>({
    type: 'card',
    isDefault: false,
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cardType: 'visa'
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchPaymentMethods()
  }, [session, status, router])

  const fetchPaymentMethods = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          isDefault: true,
          cardNumber: '**** **** **** 4242',
          cardholderName: 'John Doe',
          expiryMonth: '12',
          expiryYear: '2026',
          cardType: 'visa'
        },
        {
          id: '2',
          type: 'paypal',
          isDefault: false,
          paypalEmail: 'john.doe@example.com'
        }
      ]
      setPaymentMethods(mockMethods)
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingMethod) {
        // Update existing payment method
        setPaymentMethods(prev => prev.map(method => 
          method.id === editingMethod.id 
            ? { ...formData, id: editingMethod.id }
            : method
        ))
      } else {
        // Add new payment method
        const newMethod: PaymentMethod = {
          ...formData,
          id: Date.now().toString()
        }
        setPaymentMethods(prev => [...prev, newMethod])
      }
      
      // Reset form
      setShowForm(false)
      setEditingMethod(null)
      resetForm()
      
      alert(editingMethod ? 'Payment method updated!' : 'Payment method added!')
    } catch (error) {
      console.error('Error saving payment method:', error)
      alert('Failed to save payment method')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'card',
      isDefault: false,
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cardType: 'visa'
    })
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData(method)
    setShowForm(true)
  }

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    
    try {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
      alert('Payment method deleted!')
    } catch (error) {
      console.error('Error deleting payment method:', error)
      alert('Failed to delete payment method')
    }
  }

  const handleSetDefault = async (methodId: string) => {
    try {
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })))
      alert('Default payment method updated!')
    } catch (error) {
      console.error('Error updating default payment method:', error)
      alert('Failed to update default payment method')
    }
  }

  const getCardIcon = (cardType?: string) => {
    // In a real app, you'd use actual card brand icons
    return <CreditCard className="w-6 h-6" />
  }

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber
    return `**** **** **** ${cardNumber.slice(-4)}`
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
                  Payment Methods
                </h1>
                <p className="text-secondary">Manage your payment options</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Secure Payment Processing</h3>
              <p className="text-sm text-blue-600">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-semibold text-primary">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
              <Button variant="outline" onClick={() => {
                setShowForm(false)
                setEditingMethod(null)
                resetForm()
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'card' | 'paypal' | 'bank_account' 
                    }))}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_account">Bank Account</option>
                  </select>
                </div>
                
                <div className="flex items-center mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <span className="text-sm text-gray-700">Set as default</span>
                  </label>
                </div>
              </div>

              {formData.type === 'card' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Month *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.expiryMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Year *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.expiryYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryYear: e.target.value }))}
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() + i
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.cardType}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          cardType: e.target.value as 'visa' | 'mastercard' | 'amex' | 'discover' 
                        }))}
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                        <option value="discover">Discover</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.paypalEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    placeholder="your-email@example.com"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {editingMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingMethod(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {method.type === 'card' && getCardIcon(method.cardType)}
                    {method.type === 'paypal' && <div className="text-blue-600 font-bold text-sm">PP</div>}
                    {method.type === 'bank_account' && <div className="text-green-600 font-bold text-sm">BANK</div>}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {method.type === 'card' && `${method.cardType?.toUpperCase()} ending in ${method.cardNumber?.slice(-4)}`}
                        {method.type === 'paypal' && `PayPal (${method.paypalEmail})`}
                        {method.type === 'bank_account' && `${method.bankName} ${method.accountType}`}
                      </h3>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    
                    {method.type === 'card' && (
                      <p className="text-sm text-gray-600">
                        {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(method)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="font-heading text-xl font-semibold text-primary mb-2">
              No payment methods yet
            </h3>
            <p className="text-secondary mb-6">
              Add a payment method to make checkout faster
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
