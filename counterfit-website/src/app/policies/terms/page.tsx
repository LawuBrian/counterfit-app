import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Terms of Service</h1>
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
                Acceptance of Terms
              </h2>
              <p className="text-secondary mb-4">
                By accessing and using Counterfit's website and services, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Scale className="h-6 w-6 mr-2" />
                Use License
              </h2>
              <p className="text-secondary mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) 
                on Counterfit's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-secondary mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Product Information</h2>
              <p className="text-secondary mb-4">
                While we strive to display accurate product information, including prices and availability, 
                we do not warrant that product descriptions or other content is accurate, complete, reliable, 
                current, or error-free.
              </p>
              <p className="text-secondary mb-4">
                Product images are representative and may vary from actual products. We reserve the right to 
                modify or discontinue any product without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Pricing and Payment</h2>
              <p className="text-secondary mb-4">
                All prices are in South African Rand (ZAR) and include VAT where applicable. We reserve 
                the right to change prices at any time without notice.
              </p>
              <p className="text-secondary mb-4">
                Payment is processed securely through Yoco. By placing an order, you authorize us to charge 
                your payment method for the total amount of your order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Shipping and Delivery</h2>
              <p className="text-secondary mb-4">
                We aim to process and ship orders within 1-3 business days. Delivery times vary by location 
                and shipping method selected.
              </p>
              <p className="text-secondary mb-4">
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Returns and Refunds</h2>
              <p className="text-secondary mb-4">
                We accept returns within 30 days of delivery for items in original condition. 
                Return shipping costs are the responsibility of the customer unless the item is defective.
              </p>
              <p className="text-secondary mb-4">
                Refunds will be processed within 5-10 business days after we receive and inspect the returned item.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Disclaimer
              </h2>
              <p className="text-secondary mb-4">
                The materials on Counterfit's website are provided on an 'as is' basis. Counterfit makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties including 
                without limitation, implied warranties or conditions of merchantability, fitness for a particular 
                purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Limitations</h2>
              <p className="text-secondary mb-4">
                In no event shall Counterfit or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising out 
                of the use or inability to use the materials on Counterfit's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Governing Law</h2>
              <p className="text-secondary mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of 
                South Africa and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-secondary mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-secondary">
                  <strong>Email:</strong> legal@counterfit.co.za<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                These terms of service are effective as of {new Date().toLocaleDateString()} and will remain 
                in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
