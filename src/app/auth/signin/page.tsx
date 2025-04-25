"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';

function SignInContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Session check result:", data);
        
        if (data.session) {
          console.log("Already authenticated, redirecting to dashboard");
          router.push(redirectTo);
        } else {
          setSessionChecked(true);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, [redirectTo, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`
        }
      });

      if (signInError) {
        console.error("Sign-in error:", signInError);
        throw signInError;
      }
      
      console.log("Sign-in response:", data);
      
      if (!data.session) {
        throw new Error('No session created after successful sign in');
      }

      console.log('Sign in successful! Redirecting to:', redirectTo);
      
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError(error.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  // Loading screen while checking session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col justify-center">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image 
              src="/images/logo.svg" 
              alt="ClauseFinder Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold ml-2 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
              ClauseFinder
            </h1>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-slate-600">Don't have an account?</span>
            <Link href="/auth/signup" className="ml-1 text-sm text-blue-600 hover:text-blue-800">
              Sign up now
            </Link>
          </div>
          
          {/* Development helper */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setEmail('test@example.com');
                    setPassword('password123');
                  }}
                  type="button"
                  className="py-2 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  Fill Test User
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { data, error } = await supabase.auth.signUp({
                        email: 'test@example.com',
                        password: 'password123',
                      });
                      
                      if (error) {
                        alert(`Error: ${error.message}`);
                      } else {
                        alert('Test user created - now sign in');
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Error creating test user');
                    }
                  }}
                  type="button"
                  className="py-2 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  Create Test User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 