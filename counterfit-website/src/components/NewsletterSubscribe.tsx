'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message
        })
        setEmail('')
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to subscribe. Please try again.'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-3 py-2 bg-primary-foreground/20 border border-primary-foreground/20 rounded-l-md text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-primary-foreground text-primary font-medium rounded-r-md hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground/50 transition-colors text-sm ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </div>

        {submitStatus.type && (
          <div className={`flex items-center space-x-2 text-xs ${
            submitStatus.type === 'success' 
              ? 'text-green-300' 
              : 'text-red-300'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{submitStatus.message}</span>
          </div>
        )}
      </form>
    </div>
  )
}
