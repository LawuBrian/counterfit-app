import { useEffect, useRef } from 'react'

interface VisitorData {
  sessionId: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  pageUrl: string
  pageTitle?: string
  country?: string
  city?: string
  region?: string
  timezone?: string
  deviceType?: string
  browser?: string
  os?: string
  screenResolution?: string
  language?: string
}

class VisitorTracker {
  private sessionId: string
  private startTime: number
  private backendUrl: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  }

  private generateSessionId(): string {
    // Generate a unique session ID
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet'
    }
    return 'desktop'
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getOS(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getScreenResolution(): string {
    return `${screen.width}x${screen.height}`
  }

  async trackPageView(pageUrl: string, pageTitle?: string): Promise<void> {
    try {
      const visitorData: VisitorData = {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
        pageUrl,
        pageTitle: pageTitle || document.title,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceType: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screenResolution: this.getScreenResolution(),
        language: navigator.language
      }

      // Try to get location data if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          })
          
          // Note: We don't store exact coordinates for privacy, but we could use them to get city/country
          // For now, we'll skip this to respect user privacy
        } catch (error) {
          // Geolocation failed or was denied - this is normal
        }
      }

      await fetch(`${this.backendUrl}/api/visitors/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitorData)
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  async updateVisitDuration(): Promise<void> {
    try {
      const duration = Math.floor((Date.now() - this.startTime) / 1000)
      
      await fetch(`${this.backendUrl}/api/visitors/duration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          duration
        })
      })
    } catch (error) {
      console.error('Failed to update visit duration:', error)
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

// Global tracker instance
let tracker: VisitorTracker | null = null

export function getVisitorTracker(): VisitorTracker {
  if (!tracker) {
    tracker = new VisitorTracker()
  }
  return tracker
}

export function useVisitorTracking(pageUrl: string, pageTitle?: string) {
  const trackerRef = useRef<VisitorTracker | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackerRef.current = getVisitorTracker()
      
      // Track page view
      trackerRef.current.trackPageView(pageUrl, pageTitle)

      // Track when user leaves the page
      const handleBeforeUnload = () => {
        if (trackerRef.current) {
          trackerRef.current.updateVisitDuration()
        }
      }

      // Track when user navigates away (for SPA navigation)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && trackerRef.current) {
          trackerRef.current.updateVisitDuration()
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        
        // Update duration when component unmounts
        if (trackerRef.current) {
          trackerRef.current.updateVisitDuration()
        }
      }
    }
  }, [pageUrl, pageTitle])

  return trackerRef.current
}
