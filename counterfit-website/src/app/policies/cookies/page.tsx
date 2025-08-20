import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Cookie, Settings, Shield, Info } from 'lucide-react'

export default function CookiesPolicyPage() {
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
            <Cookie className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Cookies Policy</h1>
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
                <Info className="h-6 w-6 mr-2" />
                What Are Cookies?
              </h2>
              <p className="text-secondary mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling certain functionality.
              </p>
              <p className="text-secondary mb-4">
                Cookies do not contain any personal information that can identify you individually, 
                but they may contain information about your browsing behavior and preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                How We Use Cookies
              </h2>
              <p className="text-secondary mb-4">
                We use cookies for several purposes to enhance your experience on our website:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements and content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Types of Cookies We Use</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Essential Cookies</h3>
                <p className="text-secondary mb-3">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They are usually only set in response to actions made by you such as setting your 
                  privacy preferences, logging in, or filling in forms.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Shopping cart functionality, user authentication, security features
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Functional Cookies</h3>
                <p className="text-secondary mb-3">
                  These cookies enable the website to provide enhanced functionality and personalization. 
                  They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Language preferences, region settings, user interface customization
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Analytics Cookies</h3>
                <p className="text-secondary mb-3">
                  These cookies allow us to count visits and traffic sources so we can measure and 
                  improve the performance of our site. They help us know which pages are the most 
                  and least popular and see how visitors move around the site.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Google Analytics, page view tracking, user behavior analysis
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Marketing Cookies</h3>
                <p className="text-secondary mb-3">
                  These cookies may be set through our site by our advertising partners. They may 
                  be used by those companies to build a profile of your interests and show you 
                  relevant advertisements on other sites.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Social media integration, targeted advertising, affiliate tracking
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Third-Party Cookies</h2>
              <p className="text-secondary mb-4">
                Some cookies are placed by third-party services that appear on our pages. 
                These third parties may include:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Google Analytics for website analytics</li>
                <li>Yoco for payment processing</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Advertising networks for targeted content</li>
              </ul>
              <p className="text-secondary mb-4">
                We do not control these third-party cookies and they are subject to the privacy 
                policies of the respective third-party providers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Managing Your Cookie Preferences
              </h2>
              <p className="text-secondary mb-4">
                You have several options for managing cookies:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings</li>
                <li><strong>Cookie Consent:</strong> Use our cookie consent banner to manage preferences</li>
                <li><strong>Third-Party Opt-Out:</strong> Visit third-party websites to opt out of their cookies</li>
                <li><strong>Delete Cookies:</strong> Clear existing cookies from your browser</li>
              </ul>
              <p className="text-secondary mb-4">
                Please note that disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Cookie Duration</h2>
              <p className="text-secondary mb-4">
                Cookies have different lifespans:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                <li><strong>First-Party Cookies:</strong> Set by our website and typically last longer</li>
                <li><strong>Third-Party Cookies:</strong> Set by external services with varying expiration times</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Updates to This Policy</h2>
              <p className="text-secondary mb-4">
                We may update this Cookies Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the new policy on this page.
              </p>
              <p className="text-secondary mb-4">
                Your continued use of our website after any changes indicates your acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
              <p className="text-secondary mb-4">
                If you have any questions about our use of cookies or this Cookies Policy, please contact us:
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
                This cookies policy is effective as of {new Date().toLocaleDateString()} and will remain 
                in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
