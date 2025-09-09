import { OrderConfirmationTemplate, OrderShippedTemplate, OrderDeliveredTemplate } from './email-templates'
import { renderToStaticMarkup } from 'react-dom/server'

interface EmailConfig {
  service: 'sendgrid' | 'smtp'
  apiKey?: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPass?: string
  fromEmail: string
  fromName: string
}

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    id: string
    productName: string
    quantity: number
    price: number
    size?: string
    color?: string
    image?: string
  }>
  totalAmount: number
  status: string
  paymentStatus: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postalCode: string
    country: string
    phone?: string
  }
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  orderDate: string
}

class OrderEmailService {
  private config: EmailConfig

  constructor() {
    this.config = {
      service: (process.env.EMAIL_SERVICE as 'sendgrid' | 'smtp') || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY,
      smtpHost: process.env.EMAIL_SMTP_HOST,
      smtpPort: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
      smtpUser: process.env.EMAIL_SMTP_USER,
      smtpPass: process.env.EMAIL_SMTP_PASS,
      fromEmail: process.env.EMAIL_FROM || 'hello@counterfit.co.za',
      fromName: process.env.EMAIL_FROM_NAME || 'Counterfit'
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (this.config.service === 'sendgrid') {
      return this.sendWithSendGrid(to, subject, html)
    } else {
      return this.sendWithSMTP(to, subject, html)
    }
  }

  private async sendWithSendGrid(to: string, subject: string, html: string) {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured')
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        content: [{
          type: 'text/html',
          value: html
        }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid error: ${error}`)
    }

    return { success: true }
  }

  private async sendWithSMTP(to: string, subject: string, html: string) {
    // For SMTP, you'd typically use nodemailer or similar
    // This is a placeholder implementation
    console.log('SMTP email would be sent:', { to, subject })
    return { success: true }
  }

  async sendOrderConfirmation(orderData: OrderEmailData) {
    try {
      const html = renderToStaticMarkup(OrderConfirmationTemplate({ order: orderData }))
      const subject = `Order Confirmation - ${orderData.orderNumber}`
      
      await this.sendEmail(orderData.customerEmail, subject, html)
      
      console.log('✅ Order confirmation email sent:', orderData.orderNumber)
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to send order confirmation:', error)
      throw error
    }
  }

  async sendOrderShipped(orderData: OrderEmailData) {
    try {
      const html = renderToStaticMarkup(OrderShippedTemplate({ order: orderData }))
      const subject = `Your Order is on the Way! - ${orderData.orderNumber}`
      
      await this.sendEmail(orderData.customerEmail, subject, html)
      
      console.log('✅ Order shipped email sent:', orderData.orderNumber)
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to send order shipped email:', error)
      throw error
    }
  }

  async sendOrderDelivered(orderData: OrderEmailData) {
    try {
      const html = renderToStaticMarkup(OrderDeliveredTemplate({ order: orderData }))
      const subject = `Order Delivered! - ${orderData.orderNumber}`
      
      await this.sendEmail(orderData.customerEmail, subject, html)
      
      console.log('✅ Order delivered email sent:', orderData.orderNumber)
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to send order delivered email:', error)
      throw error
    }
  }

  async sendStatusChangeEmail(orderData: OrderEmailData, oldStatus: string, newStatus: string) {
    try {
      // Determine which email template to use based on the new status
      switch (newStatus.toLowerCase()) {
        case 'confirmed':
          return this.sendOrderConfirmation(orderData)
        case 'shipped':
          return this.sendOrderShipped(orderData)
        case 'delivered':
          return this.sendOrderDelivered(orderData)
        default:
          // For other status changes, send a generic update email
          const html = this.generateGenericStatusEmail(orderData, oldStatus, newStatus)
          const subject = `Order Update - ${orderData.orderNumber}`
          await this.sendEmail(orderData.customerEmail, subject, html)
          console.log('✅ Generic status update email sent:', orderData.orderNumber)
          return { success: true }
      }
    } catch (error) {
      console.error('❌ Failed to send status change email:', error)
      throw error
    }
  }

  private generateGenericStatusEmail(orderData: OrderEmailData, oldStatus: string, newStatus: string): string {
    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Order Update - Counterfit</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #000000; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">COUNTERFIT</h1>
            <p style="margin: 5px 0 0 0;">Luxury Streetwear</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #343a40;">Order Status Update</h2>
            <p>Hi ${orderData.customerName},</p>
            <p>Your order <strong>${orderData.orderNumber}</strong> has been updated:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Status changed from:</strong> ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</p>
              <p><strong>Status changed to:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
              <p><strong>Order Total:</strong> R${orderData.totalAmount.toFixed(2)}</p>
            </div>
            
            <p>If you have any questions, please contact us at hello@counterfit.co.za</p>
            
            <p>Thank you for choosing Counterfit!</p>
          </div>
          
          <div style="background-color: #343a40; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">© 2025 Counterfit. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  }
}

export const orderEmailService = new OrderEmailService()
export type { OrderEmailData }
