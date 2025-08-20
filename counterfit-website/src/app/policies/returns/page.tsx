import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, Clock, Package, AlertCircle, CheckCircle } from 'lucide-react'

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center mb-4">
            <RotateCcw className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Returns & Refunds Policy</h1>
          </div>
          <p className="text-lg text-secondary">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                Return Policy Overview
              </h2>
              <p className="text-secondary mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                we accept returns within 30 days of delivery for items in original condition.
              </p>
              <p className="text-secondary mb-4">
                All returns must be initiated within 30 days of the delivery date. Items returned after this 
                period will not be accepted.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Package className="h-6 w-6 mr-2" />
                Return Conditions
              </h2>
              <p className="text-secondary mb-4">
                To be eligible for a return, your item must meet the following criteria:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Item must be unworn and in original condition</li>
                <li>All original tags and labels must be attached</li>
                <li>Item must not show any signs of wear, damage, or alteration</li>
                <li>Item must be in its original packaging (if applicable)</li>
                <li>Return must be initiated within 30 days of delivery</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Items that have been worn, washed, altered, or damaged cannot be returned. 
                  This includes items with removed tags or signs of use.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Non-Returnable Items</h2>
              <p className="text-secondary mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Sale or clearance items (unless defective)</li>
                <li>Personalized or custom-made items</li>
                <li>Underwear, swimwear, and intimate apparel</li>
                <li>Items marked as "Final Sale"</li>
                <li>Gift cards and promotional items</li>
                <li>Items purchased from third-party sellers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <RotateCcw className="h-6 w-6 mr-2" />
                How to Return an Item
              </h2>
              <p className="text-secondary mb-4">
                Follow these steps to return an item:
              </p>
              <ol className="list-decimal list-inside text-secondary space-y-2 ml-4">
                <li><strong>Contact Customer Service:</strong> Email us at helpcounterfit@gmail.com or call +27 61 948 1028</li>
                <li><strong>Provide Order Details:</strong> Include your order number and reason for return</li>
                <li><strong>Receive Return Authorization:</strong> We'll provide you with a return authorization number</li>
                <li><strong>Package Your Return:</strong> Securely package the item with all original tags attached</li>
                <li><strong>Ship Your Return:</strong> Send the package to our returns address</li>
                <li><strong>Track Your Return:</strong> Use the provided tracking number to monitor your return</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Return Shipping</h2>
              <p className="text-secondary mb-4">
                <strong>Return shipping costs:</strong> Customers are responsible for return shipping costs unless the item is defective.
              </p>
              <p className="text-secondary mb-4">
                <strong>Return address:</strong> We'll provide the correct return address when you contact us for a return authorization.
              </p>
              <p className="text-secondary mb-4">
                <strong>Shipping method:</strong> We recommend using a trackable shipping method to ensure your return reaches us safely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Refund Process</h2>
              <p className="text-secondary mb-4">
                Once we receive and inspect your return:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>We'll process your return within 3-5 business days</li>
                <li>You'll receive an email confirmation when the refund is processed</li>
                <li>Refunds will be issued to your original payment method</li>
                <li>Processing time depends on your bank or payment provider (typically 5-10 business days)</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-blue-800">Processing Time</h3>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Total refund time: 8-15 business days from when we receive your return.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Defective Items</h2>
              <p className="text-secondary mb-4">
                If you receive a defective item:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Contact us immediately (within 7 days of delivery)</li>
                <li>Include photos of the defect</li>
                <li>We'll provide a prepaid return label</li>
                <li>You'll receive a full refund or replacement</li>
                <li>No return shipping costs for defective items</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Exchange Policy</h2>
              <p className="text-secondary mb-4">
                We currently offer refunds only. If you'd like a different size or color:
              </p>
              <ol className="list-decimal list-inside text-secondary space-y-2 ml-4">
                <li>Return the original item following our return process</li>
                <li>Place a new order for the desired item</li>
                <li>You'll receive a refund for the returned item</li>
                <li>New order will be processed normally</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-secondary mb-4">
                If you have any questions about returns or refunds, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-secondary">
                  <strong>Email:</strong> helpcounterfit@gmail.com<br />
                  <strong>Phone:</strong> +27 61 948 1028<br />
                  <strong>Hours:</strong> Mon-Fri 9AM-6PM SAST<br />
                  <strong>Response Time:</strong> Within 24 hours during business days
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                This returns and refunds policy is effective as of {new Date().toLocaleDateString()} and will remain 
                in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
