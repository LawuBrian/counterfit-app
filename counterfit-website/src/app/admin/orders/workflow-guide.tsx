import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  Home,
  XCircle,
  RefreshCw
} from 'lucide-react'

export default function OrderWorkflowGuide() {
  const [showGuide, setShowGuide] = useState(false)

  const workflowSteps = [
    {
      status: 'pending',
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
      title: 'Pending',
      description: 'Order created, waiting for payment confirmation',
      adminAction: 'Wait for Yoco webhook or manually verify payment',
      nextSteps: ['confirmed', 'cancelled']
    },
    {
      status: 'confirmed',
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100',
      title: 'Confirmed',
      description: 'Payment confirmed, ready for processing',
      adminAction: 'Prepare order for packaging and shipping',
      nextSteps: ['processing', 'cancelled']
    },
    {
      status: 'processing',
      icon: Package,
      color: 'text-purple-600 bg-purple-100',
      title: 'Processing',
      description: 'Order is being packaged and prepared for shipment',
      adminAction: 'Package items, add tracking number, set carrier',
      nextSteps: ['shipped', 'cancelled']
    },
    {
      status: 'shipped',
      icon: Truck,
      color: 'text-green-600 bg-green-100',
      title: 'Shipped',
      description: 'Order has been shipped to customer',
      adminAction: 'Monitor delivery status, update estimated delivery',
      nextSteps: ['delivered', 'cancelled']
    },
    {
      status: 'delivered',
      icon: Home,
      color: 'text-emerald-600 bg-emerald-100',
      title: 'Delivered',
      description: 'Order successfully delivered to customer',
      adminAction: 'Order complete - no further action needed',
      nextSteps: []
    },
    {
      status: 'cancelled',
      icon: XCircle,
      color: 'text-red-600 bg-red-100',
      title: 'Cancelled',
      description: 'Order was cancelled (payment failed or admin cancelled)',
      adminAction: 'Process refund if payment was made',
      nextSteps: []
    }
  ]

  const paymentStatuses = [
    {
      status: 'pending',
      description: 'Waiting for payment',
      action: 'Automatically updated by Yoco webhook'
    },
    {
      status: 'paid',
      description: 'Payment successful',
      action: 'Move order to "confirmed" status'
    },
    {
      status: 'failed',
      description: 'Payment failed',
      action: 'Cancel order, notify customer'
    },
    {
      status: 'refunded',
      description: 'Payment refunded',
      action: 'Process through Yoco dashboard'
    }
  ]

  if (!showGuide) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowGuide(true)}
        className="flex items-center gap-2"
      >
        <HelpCircle className="w-4 h-4" />
        Order Workflow Guide
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-primary">
              Order Management Workflow
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowGuide(false)}
            >
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Status Workflow */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-primary">Order Status Workflow</h3>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={step.status} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg capitalize">{step.title}</h4>
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <h5 className="font-medium text-sm text-gray-800 mb-1">Admin Action Required:</h5>
                          <p className="text-sm text-gray-600">{step.adminAction}</p>
                        </div>
                        
                        {step.nextSteps.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm text-gray-800 mb-2">Next Possible Steps:</h5>
                            <div className="flex flex-wrap gap-2">
                              {step.nextSteps.map((nextStep) => (
                                <span
                                  key={nextStep}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                                >
                                  {nextStep}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Status Guide */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-primary">Payment Status Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentStatuses.map((payment) => (
                <div key={payment.status} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold capitalize mb-2">{payment.status}</h4>
                  <p className="text-gray-700 text-sm mb-3">{payment.description}</p>
                  <div className="bg-blue-50 rounded-md p-2">
                    <p className="text-blue-800 text-xs">{payment.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 text-yellow-800">🔑 Key Points</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Payment status is automatically updated by Yoco webhooks when customers pay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Always add tracking numbers when moving orders to "shipped" status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Set estimated delivery dates to keep customers informed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Use admin notes to track internal information about orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Customers receive automatic email updates when order status changes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
