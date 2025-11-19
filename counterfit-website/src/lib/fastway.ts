// Fastway API Integration for Counterfit
// API Key: 716180395a51ca35608ca88bee56492e

export interface FastwayConfig {
  apiKey: string
  baseUrl: string
  environment: 'test' | 'live'
}

export interface ShippingRate {
  service: string
  price: number
  deliveryTime: string
  description: string
}

export interface TrackingUpdate {
  status: string
  description: string
  location: string
  timestamp: string
  scanType: string
}

export interface FastwayTracking {
  trackingNumber: string
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception'
  estimatedDelivery: string
  currentLocation: string
  updates: TrackingUpdate[]
  recipient: string
  address: string
}

export interface CreateShipmentData {
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  recipientAddress: string
  recipientCity: string
  recipientPostalCode: string
  recipientCountry: string
  packageWeight: number // in kg
  packageLength: number // in cm
  packageWidth: number // in cm
  packageHeight: number // in cm
  packageDescription: string
  orderNumber: string
  orderId: string
}

export interface FastwayShipment {
  id: string
  trackingNumber: string
  labelUrl: string
  estimatedDelivery: string
  cost: number
  status: string
}

// Fastway API Configuration - Updated to match env config
export const FASTWAY_CONFIG: FastwayConfig = {
  apiKey: process.env.FASTWAY_API_KEY || '716180395a51ca35608ca88bee56492e',
  baseUrl: process.env.FASTWAY_BASE_URL || 'https://api.fastway.co.za',
  environment: (process.env.FASTWAY_ENVIRONMENT as 'test' | 'live') || 'test'
}

/**
 * Get shipping rates for a destination
 * Updated for Fastway v3 API
 */
export async function getShippingRates(
  destinationPostalCode: string,
  packageWeight: number,
  packageDimensions: { length: number; width: number; height: number }
): Promise<ShippingRate[]> {
  try {
    console.log('🚚 Getting Fastway shipping rates for:', destinationPostalCode)
    
    // Use the base URL directly without version
    const response = await fetch(`${FASTWAY_CONFIG.baseUrl}/rates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FASTWAY_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        origin: '8001', // Cape Town origin (adjust as needed)
        destination: destinationPostalCode,
        weight: packageWeight,
        length: packageDimensions.length,
        width: packageDimensions.width,
        height: packageDimensions.height,
        service_type: 'parcel'
      })
    })

    if (!response.ok) {
      throw new Error(`Fastway API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Fastway rates received:', data)

    // Transform Fastway response to our format
    return data.services.map((service: any) => ({
      service: service.service_name,
      price: service.total_price,
      deliveryTime: service.delivery_time,
      description: service.description || `${service.service_name} delivery`
    }))

  } catch (error) {
    console.error('❌ Failed to get Fastway shipping rates:', error)
    
    // Return fallback rate - Standard shipping at R149
    return [
      {
        service: 'Standard Delivery',
        price: 149.00,
        deliveryTime: '4-5 business days',
        description: 'Standard delivery service'
      }
    ]
  }
}

/**
 * Create a new shipment
 */
export async function createShipment(shipmentData: CreateShipmentData): Promise<FastwayShipment> {
  try {
    console.log('📦 Creating Fastway shipment for order:', shipmentData.orderNumber)
    
    const response = await fetch(`${FASTWAY_CONFIG.baseUrl}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FASTWAY_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: {
          name: shipmentData.recipientName,
          phone: shipmentData.recipientPhone,
          email: shipmentData.recipientEmail,
          address: shipmentData.recipientAddress,
          city: shipmentData.recipientCity,
          postal_code: shipmentData.recipientPostalCode,
          country: shipmentData.recipientCountry
        },
        package: {
          weight: shipmentData.packageWeight,
          length: shipmentData.packageLength,
          width: shipmentData.packageWidth,
          height: shipmentData.packageHeight,
          description: shipmentData.packageDescription
        },
        reference: shipmentData.orderNumber,
        metadata: {
          order_id: shipmentData.orderId
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Fastway shipment creation failed: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Fastway shipment created:', data)

    return {
      id: data.shipment_id,
      trackingNumber: data.tracking_number,
      labelUrl: data.label_url,
      estimatedDelivery: data.estimated_delivery,
      cost: data.cost,
      status: data.status
    }

  } catch (error) {
    console.error('❌ Failed to create Fastway shipment:', error)
    throw error
  }
}

/**
 * Track a shipment
 */
export async function trackShipment(trackingNumber: string): Promise<FastwayTracking> {
  try {
    console.log('🔍 Tracking Fastway shipment:', trackingNumber)
    
    const response = await fetch(`${FASTWAY_CONFIG.baseUrl}/tracking/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${FASTWAY_CONFIG.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Fastway tracking error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Fastway tracking data received:', data)

    // Transform Fastway tracking data to our format
    return {
      trackingNumber: data.tracking_number,
      status: mapFastwayStatus(data.status),
      estimatedDelivery: data.estimated_delivery,
      currentLocation: data.current_location || 'Unknown',
      updates: data.scan_history?.map((scan: any) => ({
        status: scan.status,
        description: scan.description,
        location: scan.location,
        timestamp: scan.timestamp,
        scanType: scan.scan_type
      })) || [],
      recipient: data.recipient_name,
      address: data.delivery_address
    }

  } catch (error) {
    console.error('❌ Failed to track Fastway shipment:', error)
    throw error
  }
}

/**
 * Get shipping label for a shipment
 */
export async function getShippingLabel(shipmentId: string): Promise<string> {
  try {
    console.log('🏷️ Getting shipping label for shipment:', shipmentId)
    
    const response = await fetch(`${FASTWAY_CONFIG.baseUrl}/shipments/${shipmentId}/label`, {
      headers: {
        'Authorization': `Bearer ${FASTWAY_CONFIG.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get shipping label: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    
    console.log('✅ Shipping label URL generated')
    return url

  } catch (error) {
    console.error('❌ Failed to get shipping label:', error)
    throw error
  }
}

/**
 * Map Fastway status to our status format
 */
function mapFastwayStatus(fastwayStatus: string): FastwayTracking['status'] {
  const statusMap: Record<string, FastwayTracking['status']> = {
    'pending': 'pending',
    'in_transit': 'in_transit',
    'out_for_delivery': 'out_for_delivery',
    'delivered': 'delivered',
    'exception': 'exception'
  }
  
  return statusMap[fastwayStatus] || 'pending'
}

/**
 * Calculate package weight and dimensions from order items
 */
export function calculatePackageDetails(items: any[]): {
  weight: number
  dimensions: { length: number; width: number; height: number }
} {
  // Default package dimensions (adjust based on your products)
  const defaultDimensions = {
    length: 30, // cm
    width: 20,  // cm
    height: 10  // cm
  }

  // Calculate total weight (assuming each item is ~0.5kg)
  const totalWeight = Math.max(0.5, items.length * 0.5)

  return {
    weight: totalWeight,
    dimensions: defaultDimensions
  }
}

/**
 * Validate postal code format for South Africa
 */
export function validateSAPostalCode(postalCode: string): boolean {
  // South African postal codes are 4 digits
  const postalCodeRegex = /^\d{4}$/
  return postalCodeRegex.test(postalCode)
}
