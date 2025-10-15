import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react'

export default function ShippingPolicyPage() {
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
            <Truck className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Shipping Policy</h1>
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
                <Package className="h-6 w-6 mr-2" />
                Processing Time
              </h2>
              <p className="text-secondary mb-4">
                We aim to process and ship all orders within 1-3 business days from the time of order confirmation. 
                Orders placed on weekends or holidays will be processed on the next business day.
              </p>
              <p className="text-secondary mb-4">
                During peak seasons (holidays, sales, new collections), processing times may extend to 3-5 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Truck className="h-6 w-6 mr-2" />
                Shipping Methods & Delivery Times
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Standard Shipping</h3>
                <p className="text-secondary mb-3">
                  <strong>Cost:</strong> R99.00<br />
                  <strong>Delivery Time:</strong> 3-5 business days<br />
                  <strong>Coverage:</strong> Nationwide delivery across South Africa
                </p>
                <p className="text-sm text-gray-600">
                  Standard shipping is available for all orders and includes tracking.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Express Shipping</h3>
                <p className="text-secondary mb-3">
                  <strong>Cost:</strong> From R149<br />
                  <strong>Delivery Time:</strong> 1-2 business days<br />
                  <strong>Coverage:</strong> Major metropolitan areas
                </p>
                <p className="text-sm text-gray-600">
                  Express shipping is available for orders placed before 2 PM on business days.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Standard Shipping</h3>
                <p className="text-secondary mb-3">
                  <strong>Cost:</strong> From R89<br />
                  <strong>Delivery Time:</strong> 3-5 business days<br />
                  <strong>Coverage:</strong> Nationwide delivery
                </p>
                <p className="text-sm text-gray-600">
                  Shipping rates are calculated based on destination and package size.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                Delivery Areas
              </h2>
              <p className="text-secondary mb-4">
                We currently ship to all provinces within South Africa. Delivery times may vary based on your location:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Gauteng:</strong> 1-3 business days</li>
                <li><strong>Western Cape, KwaZulu-Natal, Free State:</strong> 2-4 business days</li>
                <li><strong>Eastern Cape, Mpumalanga, Limpopo:</strong> 3-5 business days</li>
                <li><strong>Northern Cape, North West:</strong> 4-6 business days</li>
              </ul>
              <p className="text-secondary mb-4">
                <strong>Note:</strong> Remote areas may experience slightly longer delivery times.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Order Tracking</h2>
              <p className="text-secondary mb-4">
                Once your order ships, you'll receive a confirmation email with:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Tracking number for your shipment</li>
                <li>Estimated delivery date</li>
                <li>Carrier information and contact details</li>
                <li>Link to track your package online</li>
              </ul>
              <p className="text-secondary mb-4">
                You can also track your order through your account dashboard or by contacting our customer service team.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Delivery Attempts</h2>
              <p className="text-secondary mb-4">
                Our delivery partners will attempt delivery during business hours. If you're not available:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>They will leave a delivery notice with instructions</li>
                <li>You can arrange redelivery or pickup from the nearest depot</li>
                <li>Packages are held for 5 business days before return</li>
                <li>Return shipping costs may apply for failed deliveries</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">International Shipping</h2>
              <p className="text-secondary mb-4">
                We currently only ship within South Africa. International shipping will be available soon.
              </p>
              <p className="text-secondary mb-4">
                For international customers, please contact us directly for special arrangements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Shipping Restrictions</h2>
              <p className="text-secondary mb-4">
                Some items may have shipping restrictions:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Fragile items require special handling</li>
                <li>Large or heavy items may incur additional charges</li>
                <li>Certain areas may have delivery limitations</li>
                <li>Holiday periods may affect delivery schedules</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-secondary mb-4">
                If you have any questions about shipping or delivery, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-secondary">
                  <strong>Email:</strong> helpcounterfit@gmail.com<br />
                  <strong>Phone:</strong> +27 61 948 1028<br />
                  <strong>Hours:</strong> Mon-Fri 9AM-6PM SAST
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                This shipping policy is effective as of {new Date().toLocaleDateString()} and will remain 
                in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
