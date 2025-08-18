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
      service: (process.env.EMAIL_SERVICE as any) || 'smtp',
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
    const success = await sendEmail(
      'helpcounterfit@gmail.com',
      `Contact Form: ${subject}`,
      contactEmailHtml,
      emailConfig
    )

    if (success) {
      console.log('✅ Contact form email sent successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.' 
      })
    } else {
      console.error('❌ Failed to send contact form email')
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
