import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Simple middleware that checks if user is authenticated by looking for cookies
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only check auth for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    try {
      // Initialize Supabase with the request cookies
      const supabase = await createServerClient(request.cookies);
      
      // Check if the user has a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log(`Middleware running: ${pathname}`);
      console.log(`User authenticated: ${!!session}`);
      
      // If no session found, redirect to signin
      if (!session) {
        console.log(`Redirecting to signin from ${pathname}`);
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Middleware authentication error:', error);
      // On error, redirect to signin as a fallback
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/dashboard/:path*'],
}; 