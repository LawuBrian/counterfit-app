// Email templates as HTML strings to avoid client-side rendering issues

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
          email: 'orders@counterfit.co.za', // Use dedicated transactional email
          name: 'Counterfit Orders'
        },
        reply_to: {
          email: 'hello@counterfit.co.za',
          name: 'Counterfit Support'
        },
        // Anti-spam headers
        headers: {
          'X-Entity-ID': 'counterfit-orders',
          'X-Entity-Ref-ID': Date.now().toString(),
          'List-Unsubscribe': '<mailto:unsubscribe@counterfit.co.za>'
        },
        // Email categories for tracking
        categories: ['order-notifications', 'transactional'],
        // Custom arguments for tracking
        custom_args: {
          email_type: 'order_update',
          source: 'admin_panel'
        },
        // Improved content with plain text version
        content: [
          {
            type: 'text/plain',
            value: this.htmlToPlainText(html)
          },
          {
            type: 'text/html',
            value: html
          }
        ],
        // Mail settings to improve deliverability
        mail_settings: {
          spam_check: {
            enable: true,
            threshold: 1
          }
        },
        // Tracking settings
        tracking_settings: {
          click_tracking: {
            enable: true,
            enable_text: false
          },
          open_tracking: {
            enable: true
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid error: ${error}`)
    }

    return { success: true }
  }

  // Helper method to convert HTML to plain text
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove style blocks
      .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove script blocks
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/^\s+|\s+$/gm, '') // Trim lines
      .trim()
  }

  private async sendWithSMTP(to: string, subject: string, html: string) {
    // For SMTP, you'd typically use nodemailer or similar
    // This is a placeholder implementation
    console.log('SMTP email would be sent:', { to, subject })
    return { success: true }
  }

  async sendOrderConfirmation(orderData: OrderEmailData) {
    try {
      const html = this.generateOrderConfirmationHTML(orderData)
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
      const html = this.generateOrderShippedHTML(orderData)
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
      const html = this.generateOrderDeliveredHTML(orderData)
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

  private generateOrderConfirmationHTML(orderData: OrderEmailData): string {
    const itemsHTML = orderData.items.map(item => `
      <div style="display: flex; padding: 15px; border-bottom: 1px solid #e9ecef; align-items: center;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; color: #343a40; font-size: 16px;">${item.productName}</h4>
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            Quantity: ${item.quantity} × R${item.price.toFixed(2)}
            ${item.size ? ` • Size: ${item.size}` : ''}
            ${item.color ? ` • Color: ${item.color}` : ''}
          </p>
        </div>
        <div style="font-weight: bold; color: #343a40;">R${(item.quantity * item.price).toFixed(2)}</div>
      </div>
    `).join('')

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Confirmation - Counterfit</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #000000; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">COUNTERFIT</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">Luxury Streetwear</p>
            </div>

            <!-- Order Confirmed -->
            <div style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 24px;">Order Confirmation</h2>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Hello ${orderData.customerName}, your order has been confirmed</p>
            </div>

            <!-- Order Details -->
            <div style="padding: 0 30px;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #343a40;">Order Details</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6c757d;">Order Number:</span>
                  <span style="font-weight: bold; color: #343a40;">${orderData.orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6c757d;">Order Date:</span>
                  <span style="color: #343a40;">${new Date(orderData.orderDate).toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6c757d;">Status:</span>
                  <span style="color: #ffffff; background-color: ${orderData.status === 'confirmed' ? '#28a745' : '#ffc107'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${orderData.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6c757d;">Total Amount:</span>
                  <span style="font-weight: bold; color: #343a40; font-size: 18px;">R${orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <!-- Products -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; color: #343a40;">Items Ordered</h3>
                ${itemsHTML}
              </div>

              <!-- Shipping Address -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #343a40;">Shipping Address</h3>
                <p style="margin: 0; color: #343a40; line-height: 1.5;">
                  ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br />
                  ${orderData.shippingAddress.address1}<br />
                  ${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 + '<br />' : ''}
                  ${orderData.shippingAddress.city}, ${orderData.shippingAddress.province} ${orderData.shippingAddress.postalCode}<br />
                  ${orderData.shippingAddress.country}
                  ${orderData.shippingAddress.phone ? '<br />Phone: ' + orderData.shippingAddress.phone : ''}
                </p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1976d2;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #343a40;">
                  <li style="margin-bottom: 8px;">We'll prepare your order for shipping</li>
                  <li style="margin-bottom: 8px;">You'll receive a tracking number once shipped</li>
                  <li style="margin-bottom: 8px;">Estimated delivery: 4-5 business days</li>
                  <li>Contact us if you have any questions</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #343a40; padding: 30px; text-align: center; color: #ffffff;">
              <h3 style="margin: 0 0 15px 0;">Need Help?</h3>
              <p style="margin: 0 0 15px 0;">Contact us at <a href="mailto:hello@counterfit.co.za" style="color: #ffffff;">hello@counterfit.co.za</a></p>
              <p style="margin: 0; font-size: 14px; color: #adb5bd;">© 2025 Counterfit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateOrderShippedHTML(orderData: OrderEmailData): string {
    const itemsHTML = orderData.items.map(item => `
      <div style="display: flex; padding: 10px; border-bottom: 1px solid #e9ecef; align-items: center;">
        <div style="flex: 1;">
          <span style="color: #343a40; font-size: 16px;">${item.productName} × ${item.quantity}</span>
        </div>
      </div>
    `).join('')

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Shipped - Counterfit</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #000000; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">COUNTERFIT</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">Luxury Streetwear</p>
            </div>

            <!-- Order Shipped -->
            <div style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 24px;">Order Shipped</h2>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Hello ${orderData.customerName}, your order has been shipped</p>
            </div>

            <!-- Tracking Info -->
            <div style="padding: 0 30px;">
              ${orderData.trackingNumber ? `
                <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                  <h3 style="margin: 0 0 10px 0; color: #155724;">Tracking Information</h3>
                  <p style="margin: 0 0 10px 0; color: #155724;"><strong>Tracking Number: ${orderData.trackingNumber}</strong></p>
                  ${orderData.carrier ? `<p style="margin: 0 0 10px 0; color: #155724;">Carrier: ${orderData.carrier}</p>` : ''}
                  ${orderData.estimatedDelivery ? `<p style="margin: 0; color: #155724;">Estimated Delivery: ${new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>` : ''}
                </div>
              ` : ''}

              <!-- Order Summary -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #343a40;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6c757d;">Order Number:</span>
                  <span style="font-weight: bold; color: #343a40;">${orderData.orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6c757d;">Total Amount:</span>
                  <span style="font-weight: bold; color: #343a40;">R${orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <!-- Items -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px 0; color: #343a40;">Items in this Shipment</h3>
                ${itemsHTML}
              </div>

              <!-- Delivery Address -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #343a40;">Delivery Address</h3>
                <p style="margin: 0; color: #343a40; line-height: 1.5;">
                  ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br />
                  ${orderData.shippingAddress.address1}<br />
                  ${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 + '<br />' : ''}
                  ${orderData.shippingAddress.city}, ${orderData.shippingAddress.province} ${orderData.shippingAddress.postalCode}<br />
                  ${orderData.shippingAddress.country}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #343a40; padding: 30px; text-align: center; color: #ffffff;">
              <h3 style="margin: 0 0 15px 0;">Questions about your delivery?</h3>
              <p style="margin: 0 0 15px 0;">Contact us at <a href="mailto:hello@counterfit.co.za" style="color: #ffffff;">hello@counterfit.co.za</a></p>
              <p style="margin: 0; font-size: 14px; color: #adb5bd;">© 2025 Counterfit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateOrderDeliveredHTML(orderData: OrderEmailData): string {
    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Delivered - Counterfit</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background-color: #000000; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">COUNTERFIT</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">Luxury Streetwear</p>
            </div>

            <!-- Order Delivered -->
            <div style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <h2 style="color: #28a745; margin: 0 0 10px 0; font-size: 24px;">Order Delivered</h2>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Hello ${orderData.customerName}, your order has been delivered successfully</p>
            </div>

            <!-- Content -->
            <div style="padding: 0 30px;">
              <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #155724;">Thank you for choosing Counterfit!</h3>
                <p style="margin: 0; color: #155724;">We hope you love your new streetwear. Tag us @counterfit on social media to show off your style!</p>
              </div>

              <!-- Order Summary -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #343a40;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #6c757d;">Order Number:</span>
                  <span style="font-weight: bold; color: #343a40;">${orderData.orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6c757d;">Total Amount:</span>
                  <span style="font-weight: bold; color: #343a40;">R${orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <!-- Review Request -->
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #856404;">Love your purchase?</h3>
                <p style="margin: 0 0 15px 0; color: #856404;">Help other streetwear enthusiasts by leaving a review!</p>
                <a href="https://counterfit.co.za/reviews" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Leave a Review</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #343a40; padding: 30px; text-align: center; color: #ffffff;">
              <h3 style="margin: 0 0 15px 0;">Stay Connected</h3>
              <p style="margin: 0 0 15px 0;">Follow us for the latest drops and exclusive content</p>
              <p style="margin: 0; font-size: 14px; color: #adb5bd;">© 2025 Counterfit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export const orderEmailService = new OrderEmailService()
export type { OrderEmailData }
