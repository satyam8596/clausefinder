"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Contract, ContractAnalysis } from '@/types';
import { getContractById, getContractAnalysis, getRiskLevelColor } from '@/utils/contractService';
import { FileText, ArrowLeft, AlertTriangle, Download, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    async function loadContractData() {
      try {
        setLoading(true);
        const contractData = await getContractById(contractId);
        if (!contractData) {
          setError('Contract not found');
          return;
        }
        
        setContract(contractData);
        const analysisData = await getContractAnalysis(contractId);
        setAnalysis(analysisData);
      } catch (err) {
        console.error('Error loading contract details:', err);
        setError('Failed to load contract details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadContractData();
  }, [contractId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCopyToClipboard = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis.summaryPlainEnglish);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error || 'Contract not found'}</p>
                <div className="mt-3">
                  <Link
                    href="/dashboard/contracts"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Contracts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock content for the detailed analysis - in a real implementation, this would come from the API
  const analysisContent = `
## 1. Executive Summary
This is a Limited Liability Partnership (LLP) Agreement between Mr. Nalinbhai Kantilal Shukla, Mr. Abhishek Nalinbhai Shukla, and Mr. Jaykumar Nalinbhai Shukla establishing SHUKLA LEGAL SERVICES LLP. The agreement outlines capital contributions, profit/loss sharing, and partnership responsibilities.

## 2. Key Clauses
- **Capital Contributions**: Partners contribute 60%, 20%, and 20% respectively
- **Profit Sharing**: Profits and losses are distributed according to contribution percentages
- **Management Structure**: Outlines partner responsibilities and decision-making authority
- **Termination Provisions**: Details how the partnership can be dissolved

## 3. Parties Involved
- Mr. Nalinbhai Kantilal Shukla (Partner, 60% contribution)
- Mr. Abhishek Nalinbhai Shukla (Partner, 20% contribution)
- Mr. Jaykumar Nalinbhai Shukla (Partner, 20% contribution)

## 4. Obligations
- Partners must contribute their agreed capital percentages
- Partners must fulfill their designated responsibilities
- All partners must act in the best interest of the LLP
- Partners must maintain financial records and transparency

## 5. Rights and Benefits
- Each partner has voting rights proportional to their contribution
- Partners receive profit distributions based on their percentage stake
- Partners can access all business records and information
- Limited liability protection for all partners

## 6. Payment Terms
- Profit distributions occur quarterly
- Capital can be withdrawn with majority approval
- Additional capital contributions require unanimous consent
- Partner loans to the LLP accrue 5% annual interest

## 7. Termination Conditions
- Unanimous agreement of all partners
- Bankruptcy of the LLP
- Court order dissolving the partnership
- Death or incapacity of a majority partner (unless succession plan activated)

## 8. Risks & Red Flags
- No clear dispute resolution mechanism
- Ambiguous succession planning
- Missing non-compete provisions
- Limited indemnification clauses

## 9. Important Dates & Durations
- Effective Date: January 1, 2023
- Initial Term: 5 years
- Renewal: Automatic 5-year renewals unless terminated
- Notice Period: 90 days for voluntary withdrawal

## 10. Suggestions
- Add comprehensive dispute resolution process
- Clarify succession rights and procedures
- Include non-compete and confidentiality provisions
- Strengthen indemnification language
- Add force majeure clause
`;

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
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard/contracts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to contracts
          </Link>
        </div>

        {/* Contract Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{contract.fileName}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Uploaded on {formatDate(contract.uploadedAt)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </button>
            </div>
          </div>
          
          {/* Analysis Status */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center">
              {analysis ? (
                analysis.status === 'completed' ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                ) : analysis.status === 'pending' ? (
                  <div className="flex items-center text-yellow-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Analysis in Progress</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Analysis Failed</span>
                  </div>
                )
              ) : (
                <div className="flex items-center text-gray-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Not Analyzed Yet</span>
                </div>
              )}
              
              {analysis && analysis.status === 'completed' && (
                <div className="ml-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(analysis.riskLevel)}`}>
                    {analysis.riskLevel} Risk
                  </span>
                </div>
              )}
              
              {!analysis && (
                <button
                  className="ml-6 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Analysis
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        {analysis && analysis.status === 'completed' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'summary' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('clauses')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'clauses' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Clauses
                </button>
                <button
                  onClick={() => setActiveTab('risks')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'risks' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Risks
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === 'full' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Full Report
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'summary' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Executive Summary</h3>
                    <button
                      onClick={handleCopyToClipboard}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      {analysis.summaryPlainEnglish}
                    </p>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">PARTIES INVOLVED</h4>
                      <ul className="space-y-2">
                        {analysis.parties.map((party, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-gray-900">{party}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">KEY DETAILS</h4>
                      <dl className="space-y-2">
                        {analysis.effectiveDate && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Effective Date:</dt>
                            <dd className="text-gray-900">{analysis.effectiveDate}</dd>
                          </div>
                        )}
                        {analysis.jurisdiction && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Jurisdiction:</dt>
                            <dd className="text-gray-900">{analysis.jurisdiction}</dd>
                          </div>
                        )}
                        {analysis.termPeriod && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Term Period:</dt>
                            <dd className="text-gray-900">{analysis.termPeriod}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'clauses' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Clauses</h3>
                  
                  <div className="divide-y divide-gray-200">
                    {analysis.clauses.map((clause) => (
                      <div key={clause.id} className="py-4">
                        <div className="flex justify-between">
                          <h4 className="text-base font-medium text-gray-900">{clause.clauseType}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(clause.riskLevel)}`}>
                            {clause.riskLevel} Risk
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 italic mb-2">{clause.originalText.substring(0, 150)}...</p>
                          <p className="text-sm text-gray-700">{clause.explanation}</p>
                          {clause.suggestions && (
                            <div className="mt-2 text-sm text-blue-600">
                              <strong>Suggestion:</strong> {clause.suggestions}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'risks' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risks and Red Flags</h3>
                  
                  {analysis.redFlags.length === 0 && analysis.missingClauses.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-700">No significant risks or red flags were found in this contract.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {analysis.redFlags.length > 0 && (
                        <div>
                          <h4 className="text-base font-medium text-gray-900 mb-3">Red Flags</h4>
                          <div className="space-y-4">
                            {analysis.redFlags.map((flag) => (
                              <div key={flag.id} className="bg-red-50 border border-red-100 rounded-md p-4">
                                <div className="flex">
                                  <AlertTriangle className="h-5 w-5 text-red-400" />
                                  <div className="ml-3">
                                    <h5 className="text-sm font-medium text-red-800">{flag.issue}</h5>
                                    <p className="text-sm text-red-700 mt-1">{flag.explanation}</p>
                                    {flag.suggestedFix && (
                                      <p className="text-sm text-red-700 mt-2">
                                        <strong>Suggested Fix:</strong> {flag.suggestedFix}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysis.missingClauses.length > 0 && (
                        <div>
                          <h4 className="text-base font-medium text-gray-900 mb-3">Missing Clauses</h4>
                          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                            <p className="text-sm text-yellow-800 mb-2">
                              This contract is missing the following standard clauses:
                            </p>
                            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                              {analysis.missingClauses.map((clause, idx) => (
                                <li key={idx}>{clause}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'full' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Full Analysis Report</h3>
                    <button
                      onClick={handleCopyToClipboard}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="prose prose-blue max-w-none">
                    {/* Here is where the full markdown report would be rendered */}
                    <ReactMarkdown>{analysisContent}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 