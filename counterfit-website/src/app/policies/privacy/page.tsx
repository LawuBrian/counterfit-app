import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            <Shield className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
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
                <Lock className="h-6 w-6 mr-2" />
                Information We Collect
              </h2>
              <p className="text-secondary mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Personal information (name, email, phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through Yoco)</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2" />
                How We Use Your Information
              </h2>
              <p className="text-secondary mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and tracking information</li>
                <li>Provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2" />
                Data Security
              </h2>
              <p className="text-secondary mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through Yoco</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Your Rights</h2>
              <p className="text-secondary mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with data protection authorities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-secondary mb-4">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-secondary">
                  <strong>Email:</strong> privacy@counterfit.co.za<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                This privacy policy is effective as of {new Date().toLocaleDateString()} and will remain 
                in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
