// app/api/hello/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    name: 'John Doe',
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  });
}