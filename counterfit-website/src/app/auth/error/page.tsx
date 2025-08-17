"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The verification link has expired or has already been used.'
      case 'Default':
        return 'An error occurred during authentication.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            asChild
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Link href="/auth/signin">
              <ArrowLeft className="h-4 w-4" />
              Try Again
            </Link>
          </Button>

          <Button
            asChild
            className="w-full flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a
              href="mailto:support@counterfit.co.za"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              support@counterfit.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
