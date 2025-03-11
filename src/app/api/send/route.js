// app/api/send/route.js
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export async function POST(request) {
  try {
    // Parse the request body
    const { name, email, subject, message } = await request.json()

    // Validate the data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use your verified domain
      to: 'office@visiongoal.ch', // Your company email
      subject: `New Contact Form Submission: ${subject}`,
      reply_to: email,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      // Optionally add HTML version
      html: `
      <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .email-header {
            background-color: #2C5282;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
          }
          .email-body {
            padding: 20px;
            background-color: #fff;
          }
          .email-field {
            margin-bottom: 20px;
          }
          .email-field label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #2C5282;
          }
          .email-field-content {
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            border-left: 3px solid #2C5282;
          }
          .email-message {
            margin-top: 25px;
          }
          .email-message label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #2C5282;
          }
          .email-message-content {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            border-left: 3px solid #2C5282;
            white-space: pre-line;
          }
          .email-footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          @media only screen and (max-width: 480px) {
            body {
              padding: 10px;
            }
            .email-header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="email-body">
            <div class="email-field">
              <label>Name:</label>
              <div class="email-field-content">${name}</div>
            </div>
            
            <div class="email-field">
              <label>Email:</label>
              <div class="email-field-content">${email}</div>
            </div>
            
            <div class="email-field">
              <label>Subject:</label>
              <div class="email-field-content">${subject}</div>
            </div>
            
            <div class="email-message">
              <label>Message:</label>
              <div class="email-message-content">${message}</div>
            </div>
          </div>
          <div class="email-footer">
            <p>This email was sent from the contact form on VisionGoal.ch</p>
          </div>
        </div>
      </body>
    </html>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
