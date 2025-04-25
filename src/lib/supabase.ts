import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = 'https://cmtvzzqsgfzpvoalznet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtdHZ6enFzZ2Z6cHZvYWx6bmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzEzNTMsImV4cCI6MjA2MDMwNzM1M30.ZScwf_Rlf9TWnW3sFrxoV8RilaZbgxd1Uf0WPxkW7Ow';

// Create a single supabase client instance - safe for both client and server
let supabase: any;

if (typeof window !== 'undefined') {
  // Browser-side initialization using the SSR package which handles cookies properly
  supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return document.cookie
          .split('; ')
          .find((c) => c.startsWith(`${name}=`))
          ?.split('=')[1];
      },
      set(name, value, options) {
        let cookie = `${name}=${value}`;
        if (options.maxAge) {
          cookie += `; Max-Age=${options.maxAge}`;
        }
        if (options.path) {
          cookie += `; Path=${options.path}`;
        }
        document.cookie = cookie;
      },
      remove(name, options) {
        document.cookie = `${name}=; Max-Age=0; Path=${options.path}`;
      },
    },
  });
} else {
  // Server-side initialization with minimal config
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });
}

// Export the initialized supabase client
export { supabase };

// Server-side Supabase client with cookies for middleware and server components
export const createServerClient = async (cookieStore: any) => {
  const { createServerClient } = await import('@supabase/ssr');
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: (name: string, value: string, options: any) => {
          cookieStore.set(name, value, options);
        },
        remove: (name: string, options: any) => {
          cookieStore.delete(name, options);
        },
      },
    }
  );
}; 