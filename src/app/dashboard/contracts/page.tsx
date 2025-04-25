"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Contract, ContractAnalysis } from '@/types';
import { 
  getUserContracts, 
  getContractAnalysis, 
  getStatusColor, 
  getRiskLevelColor 
} from '@/utils/contractService';
import { FileText, ChevronRight, Search, Upload, AlertTriangle } from 'lucide-react';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, ContractAnalysis | null>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContracts() {
      try {
        setLoading(true);
        // For demo purposes we're using a hardcoded user ID
        const userContracts = await getUserContracts('user123');
        setContracts(userContracts);
        
        // Fetch analyses for all contracts
        const analysesMap: Record<string, ContractAnalysis | null> = {};
        for (const contract of userContracts) {
          analysesMap[contract.id] = await getContractAnalysis(contract.id);
        }
        setAnalyses(analysesMap);
      } catch (err) {
        console.error('Error loading contracts:', err);
        setError('Failed to load contracts. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadContracts();
  }, []);

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    contract.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
                <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ClauseFinder
                </h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/dashboard/contracts" className="text-blue-600 font-medium">
                  Contracts
                </Link>
                <Link href="/dashboard/compare" className="text-gray-600 hover:text-gray-900">
                  Compare
                </Link>
              </nav>
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Contracts</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your uploaded contracts
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Link 
              href="/dashboard/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Contract
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No contracts found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'No contracts match your search.' : 'Upload your first contract to get started.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/dashboard/upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Contract
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredContracts.map((contract) => {
                const analysis = analyses[contract.id];
                return (
                  <li key={contract.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {contract.fileName}
                              </p>
                              <p className="mt-1 flex items-center text-xs text-gray-500">
                                <span>Uploaded {formatDate(contract.uploadedAt)}</span>
                                <span className="mx-1">•</span>
                                <span>{formatFileSize(contract.fileSize)}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center ml-4 space-x-4">
                          <div>
                            {analysis ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                                {analysis.status === 'completed' ? 'Analyzed' : 
                                 analysis.status === 'pending' ? 'Processing' : 'Failed'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not Analyzed
                              </span>
                            )}
                          </div>
                          {analysis?.status === 'completed' && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(analysis.riskLevel)}`}>
                              {analysis.riskLevel} Risk
                            </span>
                          )}
                          <Link
                            href={`/dashboard/contracts/${contract.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            {analysis?.status === 'completed' ? 'View Analysis' : 'Analyze'}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
} 