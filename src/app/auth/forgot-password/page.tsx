"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the password reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col justify-center">
      <div className="container-custom max-w-md mx-auto px-4 py-8">
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Reset Password</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Check your email</h3>
              <p className="text-sm">We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.</p>
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
            <>
              <p className="text-slate-600 mb-6 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
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
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-800">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 