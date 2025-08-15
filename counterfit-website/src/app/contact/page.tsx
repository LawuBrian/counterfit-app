"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      inquiryType: 'general',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Matching scraped HTML exactly */}
      <section className="py-20 lg:py-32 bg-primary/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 mb-6 bg-primary/10 text-primary border-primary/20">
            Get In Touch
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl font-bold text-primary mb-6 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="font-paragraph text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            Have a question about our products, need styling advice, or want to collaborate? Our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Main Contact Section - Matching scraped HTML layout */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="rounded-xl text-primary bg-background border-0 shadow-xl">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="tracking-tight font-heading text-2xl font-bold text-primary flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Send us a Message
                  </h3>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-paragraph text-sm font-medium text-primary mb-2 block" htmlFor="name">
                          Full Name *
                        </label>
                        <input
                          className="flex w-full rounded-md border border-primary/30 bg-transparent px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-border focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12"
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-paragraph text-sm font-medium text-primary mb-2 block" htmlFor="email">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="flex w-full rounded-md border border-primary/30 bg-transparent px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-border focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12"
                          id="email"
                          name="email"
                          placeholder="your.email@example.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-paragraph text-sm font-medium text-primary mb-2 block" htmlFor="inquiryType">
                          Inquiry Type
                        </label>
                        <select
                          className="flex w-full items-center justify-between whitespace-nowrap rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-border disabled:cursor-not-allowed disabled:opacity-50 h-12"
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                        >
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="returns">Returns & Exchanges</option>
                          <option value="wholesale">Wholesale</option>
                          <option value="press">Press & Media</option>
                          <option value="collaboration">Collaboration</option>
                        </select>
                      </div>
                      <div>
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-paragraph text-sm font-medium text-primary mb-2 block" htmlFor="subject">
                          Subject *
                        </label>
                        <input
                          className="flex w-full rounded-md border border-primary/30 bg-transparent px-3 py-1 text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-border focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-12"
                          id="subject"
                          name="subject"
                          placeholder="Brief subject line"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-paragraph text-sm font-medium text-primary mb-2 block" htmlFor="message">
                        Message *
                      </label>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-base text-foreground shadow-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-border focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help you..."
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Info Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Email */}
              <div className="rounded-xl text-primary bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">Email Us</h3>
                      <p className="font-paragraph text-primary font-medium mb-1">pakilawu0@gmail.com</p>
                      <p className="font-paragraph text-sm text-secondary">Send us an email and we'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-xl text-primary bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">Call Us</h3>
                      <p className="font-paragraph text-primary font-medium mb-1">+27 61 948 1028</p>
                      <p className="font-paragraph text-sm text-secondary">Mon-Fri 9AM-6PM SAST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl text-primary bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">Visit Us</h3>
                      <p className="font-paragraph text-primary font-medium mb-1">Cnr Juno St & Kitchener Ave, Johannesburg 2101</p>
                      <p className="font-paragraph text-sm text-secondary">Our flagship store and headquarters</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="rounded-xl text-primary bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">Business Hours</h3>
                      <p className="font-paragraph text-primary font-medium mb-1">Mon-Fri: 9AM-6PM SAST</p>
                      <p className="font-paragraph text-sm text-secondary">Weekend support available via email</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32 bg-primary/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="font-paragraph text-lg text-secondary">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for all unworn items in original condition with tags attached."
              },
              {
                question: "How long does shipping take?",
                answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days."
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes, we ship worldwide. International shipping times vary by location, typically 7-14 business days."
              },
              {
                question: "How do I track my order?",
                answer: "You'll receive a tracking number via email once your order ships. You can track it on our website or the carrier's site."
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-xl text-primary bg-background border-0 shadow-lg">
                <div className="p-8">
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                    {faq.question}
                  </h3>
                  <p className="font-paragraph text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Store Section - Matching scraped HTML */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              Visit Our Flagship Store
            </h2>
            <p className="font-paragraph text-lg text-secondary max-w-2xl mx-auto">
              Experience Counterfit in person at our flagship location in the heart of Johannesburg's Fashion District.
            </p>
          </div>
          <div className="rounded-xl text-primary bg-background overflow-hidden border-0 shadow-xl">
            <div className="aspect-[16/9] bg-secondary/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-semibold text-primary mb-2">
                  Counterfit Flagship Store
                </h3>
                <p className="font-paragraph text-secondary">
                  Cnr Juno St & Kitchener Ave, Johannesburg 2101
                </p>
                <p className="font-paragraph text-sm text-secondary mt-2">
                  Open Mon-Fri 9AM-6PM SAST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}