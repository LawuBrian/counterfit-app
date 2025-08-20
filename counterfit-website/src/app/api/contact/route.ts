import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, type EmailConfig } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create contact form email HTML
    const contactEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .contact-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .message-box { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>Someone has contacted you through your website</p>
          </div>
          
          <div class="content">
            <div class="contact-details">
              <h2>Contact Information</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="message-box">
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Counterfit. All rights reserved.</p>
            <p>This email was sent from your website contact form</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email to your Gmail address
    const adminEmailSent = await sendEmail(
      'helpcounterfit@gmail.com',
      `Contact Form: ${subject}`,
      contactEmailHtml,
      emailConfig
    )

    // Create confirmation email for the user
    const userConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received - Counterfit</title>
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
          .confirmation-box { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
            text-align: center; 
          }
          .confirmation-box h2 { 
            color: #1a1a1a; 
            margin-bottom: 20px; 
            font-size: 24px; 
          }
          .confirmation-box p { 
            color: #666; 
            margin-bottom: 25px; 
            font-size: 16px; 
          }
          .message-details { 
            background: #f0f0f0; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            text-align: left; 
          }
          .message-details h3 { 
            color: #1a1a1a; 
            margin-bottom: 15px; 
            font-size: 18px; 
          }
          .message-details p { 
            margin: 10px 0; 
            color: #666; 
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
            <h1>📧 Message Received!</h1>
            <p>Thank you for contacting Counterfit</p>
          </div>
          
          <div class="content">
            <div class="confirmation-box">
              <h2>We've Got Your Message</h2>
              <p>Hi ${name}, thank you for reaching out to us! We've received your message and will get back to you within 24 hours.</p>
              
              <div class="message-details">
                <h3>Your Message Details</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1a1a1a;">
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
              
              <a href="https://counterfit.co.za" class="cta-button">
                Continue Shopping
              </a>
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
              This is an automated confirmation of your contact form submission.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send confirmation email to the user
    const userEmailSent = await sendEmail(
      email,
      'Message Received - Counterfit',
      userConfirmationHtml,
      emailConfig
    )

    if (adminEmailSent && userEmailSent) {
      console.log('✅ Contact form emails sent successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon. Check your email for confirmation.' 
      })
    } else {
      console.error('❌ Failed to send contact form emails')
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Contact form API error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
