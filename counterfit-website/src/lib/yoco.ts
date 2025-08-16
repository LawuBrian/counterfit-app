// Yoco configuration using CDN approach
export const YOCO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY || '',
  currency: 'ZAR',
  name: 'Counterfit',
  description: 'Luxury Streetwear'
}

// Generate order number
export const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}-${random}`
}

// Generate tracking number
export const generateTrackingNumber = () => {
  const prefix = 'CF'
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  const suffix = 'SA'
  return `${prefix}${random}${suffix}`
}

// Yoco payment interface
export interface YocoPaymentData {
  id: string
  amount: number
  currency: string
  metadata: {
    orderId: string
    orderNumber: string
    customerEmail: string
  }
}

// Initialize Yoco popup (will be loaded from CDN)
export const initializeYoco = (callback: (result: any) => void) => {
  // Check if Yoco is already loaded
  if (typeof window !== 'undefined' && (window as any).Yoco) {
    return new (window as any).Yoco({
      publicKey: YOCO_CONFIG.publicKey
    })
  }
  
  // Load Yoco script if not already loaded
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.yoco.com/sdk/v1/checkout.js'
    script.onload = () => {
      if ((window as any).Yoco) {
        const yoco = new (window as any).Yoco({
          publicKey: YOCO_CONFIG.publicKey
        })
        resolve(yoco)
      } else {
        reject(new Error('Yoco failed to load'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load Yoco script'))
    document.head.appendChild(script)
  })
}
