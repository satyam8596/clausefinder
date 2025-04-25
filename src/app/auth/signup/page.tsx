"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        }
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Failed to create user account');
      }
      
      setSuccess(true);
      
      // Auto-redirect after signup if auto-confirmation is enabled
      if (data.session) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Sign-up error:', error);
      setError(error.message || 'An error occurred during sign up');
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create an Account</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Registration successful!</h3>
              <p className="text-sm">Please check your email for a confirmation link to complete your registration.</p>
              <div className="mt-4">
                <Link 
                  href="/auth/signin"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
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
                  minLength={6}
                />
                <p className="mt-1 text-xs text-slate-500">Password must be at least 6 characters</p>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
          )}
          
          {!success && (
            <div className="mt-6 text-center">
              <span className="text-sm text-slate-600">Already have an account?</span>
              <Link href="/auth/signin" className="ml-1 text-sm text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 