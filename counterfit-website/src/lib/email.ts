// Email configuration and utilities for Counterfit
export interface EmailConfig {
  service: 'sendgrid' | 'mailgun' | 'resend' | 'smtp'
  apiKey?: string
  fromEmail: string
  fromName: string
  smtp?: {
    host: string
    port: number
    user: string
    pass: string
  }
}

export interface OrderEmailData {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{
    name: string
    price: number
    quantity: number
    size: string
    color?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingNumber: string
  estimatedDelivery?: string
}

export interface PaymentEmailData {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  amount: number
  paymentId: string
  paymentMethod: string
  status: 'success' | 'failed' | 'refunded'
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (data: OrderEmailData) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order, ${data.customerName}!</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              
              <h3>Items Ordered:</h3>
              ${data.items.map(item => `
                <div class="item">
                  <strong>${item.name}</strong><br>
                  Size: ${item.size}${item.color ? ` | Color: ${item.color}` : ''}<br>
                  Quantity: ${item.quantity} | Price: R${item.price}
                </div>
              `).join('')}
              
              <div class="total">
                Total Amount: R${data.totalAmount}
              </div>
            </div>
            
            <div class="order-details">
              <h3>Shipping Address</h3>
              <p>
                ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                ${data.shippingAddress.address}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.country}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://counterfit.co.za/account/orders" class="button">View Order Status</a>
            </div>
            
            <p>We'll send you updates on your order status and tracking information.</p>
            <p>If you have any questions, please contact us at helpcounterfit@gmail.com</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
            <p>Luxury Streetwear</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  paymentSuccess: (data: PaymentEmailData) => ({
    subject: `Payment Successful - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Successful!</h1>
            <p>Your payment has been processed successfully</p>
          </div>
          
          <div class="content">
            <div class="payment-details">
              <h2>Payment Details</h2>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Amount Paid:</strong> R${data.amount}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
              <p><strong>Payment ID:</strong> ${data.paymentId}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            </div>
            
            <p>Your order is now being processed and will be shipped soon!</p>
            <p>You'll receive tracking information once your order ships.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminOrderNotification: (data: OrderEmailData) => ({
    subject: `New Order Received - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🆕 New Order Received!</h1>
            <p>Order ${data.orderNumber} has been placed</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <h2>Customer Information</h2>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Order Amount:</strong> R${data.totalAmount}</p>
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
            </div>
            
            <div class="order-details">
              <h3>Shipping Address</h3>
              <p>
                ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                ${data.shippingAddress.address}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
                ${data.shippingAddress.country}
              </p>
            </div>
            
            <p>Please process this order and update the status accordingly.</p>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

// Email sending functions
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  config: EmailConfig
): Promise<boolean> {
  try {
    switch (config.service) {
      case 'sendgrid':
        return await sendViaSendGrid(to, subject, html, config)
      case 'mailgun':
        return await sendViaMailgun(to, subject, html, config)
      case 'resend':
        return await sendViaResend(to, subject, html, config)
      case 'smtp':
        return await sendViaSMTP(to, subject, html, config)
      default:
        throw new Error(`Unsupported email service: ${config.service}`)
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// SendGrid implementation
async function sendViaSendGrid(
  to: string,
  subject: string,
  html: string,
  config: EmailConfig
): Promise<boolean> {
  if (!config.apiKey) throw new Error('SendGrid API key required')
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: config.fromEmail, name: config.fromName },
        subject,
        content: [{ type: 'text/html', value: html }]
      })
    })
    
    if (response.ok) {
      console.log('📧 Email sent successfully via SendGrid')
      console.log('To:', to)
      console.log('Subject:', subject)
      return true
    } else {
      console.error('❌ SendGrid API error:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('❌ SendGrid email sending failed:', error)
    return false
  }
}

// Mailgun implementation
async function sendViaMailgun(
  to: string,
  subject: string,
  html: string,
  config: EmailConfig
): Promise<boolean> {
  if (!config.apiKey) throw new Error('Mailgun API key required')
  
  const formData = new FormData()
  formData.append('from', `${config.fromName} <${config.fromEmail}>`)
  formData.append('to', to)
  formData.append('subject', subject)
  formData.append('html', html)
  
  const response = await fetch(`https://api.mailgun.net/v3/${config.fromEmail.split('@')[1]}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`api:${config.apiKey}`)}`
    },
    body: formData
  })
  
  return response.ok
}

// Resend implementation
async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  config: EmailConfig
): Promise<boolean> {
  if (!config.apiKey) throw new Error('Resend API key required')
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [to],
      subject,
      html
    })
  })
  
  return response.ok
}

// SMTP implementation using nodemailer
async function sendViaSMTP(
  to: string,
  subject: string,
  html: string,
  config: EmailConfig
): Promise<boolean> {
  if (!config.smtp) throw new Error('SMTP configuration required')
  
  try {
    // For now, just log the email (SMTP will be implemented when needed)
    console.log('📧 Email would be sent via SMTP:')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('From:', config.fromEmail)
    console.log('SMTP Host:', config.smtp.host)
    
    // TODO: Implement actual SMTP sending when needed
    // const nodemailer = await import('nodemailer')
    // const transporter = nodemailer.createTransport({...})
    // const info = await transporter.sendMail({...})
    
    return true
  } catch (error) {
    console.error('❌ SMTP email sending failed:', error)
    return false
  }
}

// Convenience functions for common emails
export async function sendOrderConfirmation(
  data: OrderEmailData,
  config: EmailConfig
): Promise<boolean> {
  const template = emailTemplates.orderConfirmation(data)
  return await sendEmail(data.customerEmail, template.subject, template.html, config)
}

export async function sendPaymentSuccess(
  data: PaymentEmailData,
  config: EmailConfig
): Promise<boolean> {
  const template = emailTemplates.paymentSuccess(data)
  return await sendEmail(data.customerEmail, template.subject, template.html, config)
}

export async function sendAdminOrderNotification(
  data: OrderEmailData,
  adminEmail: string,
  config: EmailConfig
): Promise<boolean> {
  const template = emailTemplates.adminOrderNotification(data)
  return await sendEmail(adminEmail, template.subject, template.html, config)
}
