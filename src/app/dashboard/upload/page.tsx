"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Upload, ArrowLeft, X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { uploadContract, createAnalysis } from '@/utils/contractService';

export default function UploadContractPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // For file drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Please upload a file smaller than 10MB.');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // If we want to show a preview of the contract text
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          // For text files, we could show the content directly
          // For PDFs and DOCXs, in a real app we would use a proper parser
          const text = e.target.result.toString().substring(0, 1000) + '...';
          setExtractedText(text);
        } catch (err) {
          console.error('Error extracting text:', err);
          setExtractedText('Text preview not available');
        }
      }
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
      setExtractedText('Text preview not available for this file type');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setExtractedText(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);
      
      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // Upload contract (in a real app, this would upload to storage)
      const contract = await uploadContract(selectedFile, 'user123');
      setContractId(contract.id);
      setUploadComplete(true);
      clearInterval(progressInterval);
      setProgress(100);
      
      // Start analysis process
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // In a real app, this would initiate a backend process
      // to analyze the contract with Gemini AI
      await createAnalysis(contract.id);
      
      // In a real app, we would redirect to the analysis page
      // after getting a webhook or checking for completion
      setTimeout(() => {
        router.push(`/dashboard/contracts/${contract.id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error uploading and analyzing contract:', err);
      setError('Failed to upload and analyze the contract. Please try again.');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
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

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upload Contract</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload a contract to analyze its clauses, risks, and get a plain English summary.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {(isUploading || isAnalyzing) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p className="text-sm text-gray-500">
                        {isUploading ? 'Uploading...' : 'Analyzing...'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="py-4 text-center">
                  {isUploading ? (
                    <p className="text-sm text-gray-600">
                      Uploading contract... This might take a moment.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Our AI is analyzing your contract. This will take a few moments.
                      </p>
                      <div className="text-xs text-gray-500 max-w-md mx-auto">
                        We're extracting key clauses, identifying risks, and preparing a plain English summary.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedFile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelUpload}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {extractedText && (
                  <div className="border rounded-md p-3 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content Preview:</h4>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{extractedText}</p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelUpload}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadAndAnalyze}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Analysis
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileInputChange}
                />
                
                <div className="space-y-3">
                  <div className="mx-auto flex justify-center">
                    {dragActive ? (
                      <Upload className="h-12 w-12 text-blue-500" />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {dragActive ? 'Drop your file here' : 'Upload your contract file'}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Drag and drop your contract file, or click the button below to browse your files.
                    We support PDF, DOCX, and TXT formats.
                  </p>
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {uploadComplete && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between items-center">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                File uploaded successfully
              </div>
              <p className="text-xs text-gray-500">Contract ID: {contractId}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium">Upload your contract</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    We accept PDF, DOCX, and TXT files up to 10MB in size.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium">AI-powered analysis</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Our AI uses Google Gemini to extract and analyze all contract clauses, identify risks, and 
                    generate plain English explanations.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium">Review insights</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Get a comprehensive breakdown of your contract with key clauses, risk assessments, 
                    and suggestions for improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 