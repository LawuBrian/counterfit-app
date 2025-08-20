"use client"

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    console.log('🔄 SignInPage component mounted')
    console.log('🔍 signIn function available:', typeof signIn)
    console.log('🔍 getSession function available:', typeof getSession)
    console.log('🔍 router available:', typeof router)
    
    // Check environment variables
    console.log('🌐 NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
    console.log('🔐 NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Form submitted!')
    setIsLoading(true)
    setError('')

    try {
      console.log('🔍 NextAuth signIn function:', typeof signIn)
      console.log('🔍 NextAuth getSession function:', typeof getSession)
      console.log('🔐 Calling signIn with:', { email, password })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      console.log('📥 signIn result:', result)

      if (result?.error) {
        console.error('❌ signIn error:', result.error)
        setError('Invalid email or password')
      } else {
        console.log('✅ signIn successful')
        const session = await getSession()
        console.log('🔑 Session:', session)
        if (session?.user?.role === 'ADMIN') {
          console.log('👑 Admin user detected, redirecting to admin panel')
          router.push('/admin')
        } else {
          console.log('👤 Regular user, redirecting to home')
          router.push('/')
        }
      }
    } catch (error) {
      console.error('💥 signIn exception:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Sign in to your Counterfit account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary/60" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary/60 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-secondary">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
