import { NextRequest, NextResponse } from 'next/server'
import { 
  sendOrderConfirmation, 
  sendPaymentSuccess, 
  sendAdminOrderNotification,
  type EmailConfig,
  type OrderEmailData,
  type PaymentEmailData
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      data, 
      adminEmail 
    } = await request.json()

    // Get email configuration from environment variables
    const emailConfig: EmailConfig = {
      service: (process.env.EMAIL_SERVICE as any) || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY,
      fromEmail: process.env.EMAIL_FROM || 'helpcounterfit@gmail.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Counterfit',
      smtp: process.env.EMAIL_SMTP_HOST ? {
        host: process.env.EMAIL_SMTP_HOST,
        port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
        user: process.env.EMAIL_SMTP_USER || 'helpcounterfit@gmail.com',
        pass: process.env.EMAIL_SMTP_PASS || ''
      } : undefined
    }

    console.log('📧 Sending email:', { type, config: emailConfig })

    // Validate email configuration
    if (!emailConfig.apiKey && emailConfig.service === 'sendgrid') {
      console.error('❌ Missing EMAIL_API_KEY for SendGrid')
      return NextResponse.json(
        { error: 'Email service not configured - missing API key' },
        { status: 500 }
      )
    }

    if (emailConfig.service === 'smtp' && (!emailConfig.smtp?.host || !emailConfig.smtp?.user || !emailConfig.smtp?.pass)) {
      console.error('❌ Missing SMTP configuration')
      return NextResponse.json(
        { error: 'Email service not configured - missing SMTP settings' },
        { status: 500 }
      )
    }

    let success = false

    switch (type) {
      case 'orderConfirmation':
        success = await sendOrderConfirmation(data as OrderEmailData, emailConfig)
        break
      
      case 'paymentSuccess':
        success = await sendPaymentSuccess(data as PaymentEmailData, emailConfig)
        break
      
      case 'adminOrderNotification':
        if (!adminEmail) {
          return NextResponse.json(
            { error: 'Admin email required for admin notifications' },
            { status: 400 }
          )
        }
        success = await sendAdminOrderNotification(data as OrderEmailData, adminEmail, emailConfig)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (success) {
      console.log('✅ Email sent successfully:', type)
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      console.error('❌ Failed to send email:', type)
      return NextResponse.json(
        { error: 'Failed to send email - check email service configuration' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - email service unavailable' },
      { status: 500 }
    )
  }
}
