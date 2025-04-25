"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { FileText, BarChart2, Users, Shield } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          // No user found, redirect to login
          window.location.href = '/auth/signin';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/auth/signin';
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logo.svg" 
                  alt="ClauseFinder Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8"
                />
                <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                  ClauseFinder
                </h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-slate-700">
                Welcome, {user?.email || 'User'}
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Welcome to ClauseFinder. Analyze, manage, and understand your contracts with AI.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Your ClauseFinder dashboard is ready. Upload contracts to analyze and manage your legal documents.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/dashboard/upload"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Contract</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a contract for AI-powered analysis and risk assessment.
                </p>
              </div>
            </Link>
            
            <Link 
              href="/dashboard/contracts"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Contracts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Browse and manage your uploaded and analyzed contracts.
                </p>
              </div>
            </Link>
            
            <Link 
              href="/dashboard/compare"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Contracts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Compare two contracts side by side to identify differences.
                </p>
              </div>
            </Link>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow opacity-60">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View overall risk assessment across all your contracts.
                </p>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          <div className="border-t border-gray-200">
            <div className="py-4 flex items-center">
              <div className="bg-blue-100 p-2 rounded">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Contract Uploaded</p>
                <p className="text-xs text-gray-500">NDA-TechCorp-2023.pdf - 3 days ago</p>
              </div>
            </div>
            
            <div className="py-4 flex items-center border-t border-gray-200">
              <div className="bg-green-100 p-2 rounded">
                <BarChart2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Analysis Completed</p>
                <p className="text-xs text-gray-500">ServiceAgreement-ConsultingInc.docx - 1 week ago</p>
              </div>
            </div>
            
            <div className="py-4 flex items-center border-t border-gray-200">
              <div className="bg-purple-100 p-2 rounded">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Contracts Compared</p>
                <p className="text-xs text-gray-500">NDA-v1 and NDA-v2 - 2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 