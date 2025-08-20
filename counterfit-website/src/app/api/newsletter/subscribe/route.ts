import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, type EmailConfig } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

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

    // Create welcome email HTML
    const welcomeEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Counterfit Newsletter</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
          }
          .header { 
            background: #1a1a1a; 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold; 
          }
          .content { 
            padding: 40px 20px; 
            background: #f9f9f9; 
          }
          .welcome-box { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            text-align: center; 
          }
          .welcome-box h2 { 
            color: #1a1a1a; 
            margin-bottom: 20px; 
            font-size: 24px; 
          }
          .welcome-box p { 
            color: #666; 
            margin-bottom: 25px; 
            font-size: 16px; 
          }
          .cta-button { 
            display: inline-block; 
            background: #1a1a1a; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0; 
            transition: background 0.3s ease; 
          }
          .cta-button:hover { 
            background: #333; 
          }
          .benefits { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            margin-top: 20px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
          }
          .benefits h3 { 
            color: #1a1a1a; 
            margin-bottom: 20px; 
            font-size: 20px; 
            text-align: center; 
          }
          .benefits ul { 
            list-style: none; 
            padding: 0; 
            margin: 0; 
          }
          .benefits li { 
            padding: 10px 0; 
            border-bottom: 1px solid #eee; 
            color: #666; 
          }
          .benefits li:last-child { 
            border-bottom: none; 
          }
          .footer { 
            text-align: center; 
            padding: 30px 20px; 
            background: #1a1a1a; 
            color: #999; 
          }
          .footer a { 
            color: #ccc; 
            text-decoration: none; 
          }
          .footer a:hover { 
            text-decoration: underline; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Counterfit!</h1>
            <p>You're now part of our exclusive community</p>
          </div>
          
          <div class="content">
            <div class="welcome-box">
              <h2>Thank You for Subscribing!</h2>
              <p>Hi there! We're thrilled to have you join the Counterfit family. You'll now be the first to know about:</p>
              
              <a href="https://counterfit.co.za" class="cta-button">
                Explore Our Collection
              </a>
            </div>
            
            <div class="benefits">
              <h3>What You'll Get</h3>
              <ul>
                <li>✨ Early access to new collections and limited editions</li>
                <li>🎁 Exclusive subscriber-only discounts and promotions</li>
                <li>📱 Behind-the-scenes content and styling tips</li>
                <li>🚚 Free shipping on your first order</li>
                <li>🎯 Personalized recommendations based on your style</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
            <p>
              <a href="https://counterfit.co.za">Visit our website</a> | 
              <a href="mailto:helpcounterfit@gmail.com">Contact us</a> | 
              <a href="https://counterfit.co.za/policies/privacy">Privacy Policy</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
              You received this email because you subscribed to our newsletter. 
              <a href="#" style="color: #999;">Unsubscribe</a> if you no longer wish to receive these emails.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send welcome email to subscriber
    const welcomeEmailSent = await sendEmail(
      email,
      'Welcome to Counterfit! 🎉',
      welcomeEmailHtml,
      emailConfig
    )

    // Send notification email to admin
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscription</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .subscription-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Newsletter Subscription</h1>
            <p>Someone has subscribed to your newsletter</p>
          </div>
          
          <div class="content">
            <div class="subscription-details">
              <h2>Subscription Details</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <p><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
            <p>This email was sent from your website newsletter subscription</p>
          </div>
        </div>
      </body>
      </html>
    `

    const adminEmailSent = await sendEmail(
      'helpcounterfit@gmail.com',
      'New Newsletter Subscription',
      adminNotificationHtml,
      emailConfig
    )

    if (welcomeEmailSent && adminEmailSent) {
      console.log('✅ Newsletter subscription emails sent successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome to Counterfit! Check your email for exclusive offers.' 
      })
    } else {
      console.error('❌ Failed to send newsletter subscription emails')
      return NextResponse.json(
        { error: 'Failed to complete subscription. Please try again later.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Newsletter subscription API error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
