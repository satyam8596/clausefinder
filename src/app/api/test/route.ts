import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Backend API is working',
    env: {
      hasDeepseekKey: !!process.env.DEEPSEEK_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasPusherAppId: !!process.env.PUSHER_APP_ID
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'POST request received',
      received: body
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error processing request',
      error: error.message
    }, { status: 400 });
  }
} 