// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateContactForm, sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { name, email, phone, message, agreement } = body;

    // Validate form data
    const validationErrors = validateContactForm({ name, email, phone, message, agreement });
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({ name, email, phone, message, agreement });

    if (result.success) {
      return NextResponse.json(
        { message: 'Email sent successfully', messageId: result.messageId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Rate limiting (you can add this later)
export const config = {
  api: {
    bodyParser: true,
  },
};