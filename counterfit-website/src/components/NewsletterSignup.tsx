"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NewsletterSignupProps {
  title?: string
  description?: string
  className?: string
}

export default function NewsletterSignup({ 
  title = "Stay Connected", 
  description = "Subscribe to our newsletter for exclusive updates and early access to new collections.",
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Thank you for subscribing! You\'ll receive our latest updates soon.')
    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <div className={`text-center ${className}`}>
      <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
        {title}
      </h2>
      <p className="font-paragraph text-lg mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg border-0 bg-white text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-white/20"
          required
        />
        <Button 
          type="submit"
          className="bg-white text-black hover:bg-white/90 px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  )
}
