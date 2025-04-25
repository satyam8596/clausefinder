import { v4 as uuidv4 } from 'uuid';
import { Contract, ContractAnalysis } from '@/types';

// Mock data for contracts
let mockContracts: Contract[] = [
  {
    id: '1',
    fileName: 'NDA-TechCorp-2023.pdf',
    uploadedAt: new Date('2023-09-15'),
    fileType: 'application/pdf',
    fileSize: 456789,
    userId: 'user123'
  },
  {
    id: '2',
    fileName: 'ServiceAgreement-ConsultingInc.docx',
    uploadedAt: new Date('2023-10-20'),
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 567890,
    userId: 'user123'
  },
  {
    id: '3',
    fileName: 'Employment-Contract-JohnDoe.pdf',
    uploadedAt: new Date('2023-11-05'),
    fileType: 'application/pdf',
    fileSize: 345678,
    userId: 'user123'
  }
];

// Mock data for analyses
let mockAnalyses: ContractAnalysis[] = [
  {
    id: '1',
    contractId: '1',
    status: 'completed',
    parties: ['TechCorp Inc.', 'ABC Innovations LLC'],
    effectiveDate: '2023-09-01',
    jurisdiction: 'California',
    termPeriod: '24 months from effective date',
    riskLevel: 'Low',
    summaryPlainEnglish: 'This is a standard non-disclosure agreement between TechCorp and ABC Innovations, protecting shared confidential information for 24 months.',
    clauses: [
      {
        id: uuidv4(),
        contractId: '1',
        analysisId: '1',
        clauseType: 'Confidentiality',
        originalText: 'Each party shall maintain all Confidential Information in strict confidence...',
        explanation: 'Both companies must keep all shared secret information private.',
        riskLevel: 'Low',
        suggestions: null
      }
    ],
    redFlags: [],
    missingClauses: [],
    createdAt: new Date('2023-09-15T14:30:00')
  },
  {
    id: '2',
    contractId: '2',
    status: 'completed',
    parties: ['Consulting Inc.', 'Global Services Corp'],
    effectiveDate: '2023-10-15',
    jurisdiction: 'New York',
    termPeriod: '12 months with automatic renewal',
    riskLevel: 'Moderate',
    summaryPlainEnglish: 'This service agreement outlines IT consulting services provided by Consulting Inc. to Global Services Corp for 12 months with automatic renewal.',
    clauses: [
      {
        id: uuidv4(),
        contractId: '2',
        analysisId: '2',
        clauseType: 'Payment Terms',
        originalText: 'Payment shall be made within 30 days of invoice receipt.',
        explanation: 'Global Services must pay within 30 days after receiving an invoice.',
        riskLevel: 'Low',
        suggestions: null
      },
      {
        id: uuidv4(),
        contractId: '2',
        analysisId: '2',
        clauseType: 'Termination',
        originalText: 'Either party may terminate with 30 days written notice.',
        explanation: 'Both companies can end the agreement by providing written notice 30 days in advance.',
        riskLevel: 'Moderate',
        suggestions: 'Consider adding terms for termination due to breach of contract.'
      }
    ],
    redFlags: [
      {
        id: uuidv4(),
        analysisId: '2',
        issue: 'Missing Liability Clause',
        explanation: 'The contract does not specify liability limits for either party.',
        severity: 'High',
        suggestedFix: 'Add a mutual limitation of liability clause capping damages.'
      }
    ],
    missingClauses: ['Force Majeure', 'Confidentiality'],
    createdAt: new Date('2023-10-20T10:15:00')
  },
  {
    id: '3',
    contractId: '3',
    status: 'pending',
    parties: [],
    riskLevel: 'Moderate',
    summaryPlainEnglish: 'Analysis in progress...',
    clauses: [],
    redFlags: [],
    missingClauses: [],
    createdAt: new Date('2023-11-05T16:45:00')
  }
];

// Get all contracts for a user
export const getUserContracts = async (userId: string): Promise<Contract[]> => {
  // In a real app, you would fetch from a database
  return mockContracts.filter(contract => contract.userId === userId);
};

// Get a single contract by ID
export const getContractById = async (id: string): Promise<Contract | null> => {
  const contract = mockContracts.find(c => c.id === id);
  return contract || null;
};

// Get analysis for a contract
export const getContractAnalysis = async (contractId: string): Promise<ContractAnalysis | null> => {
  const analysis = mockAnalyses.find(a => a.contractId === contractId);
  return analysis || null;
};

// Upload a new contract
export const uploadContract = async (file: File, userId: string): Promise<Contract> => {
  // In a real app, you would upload the file to storage and create a database record
  const newContract: Contract = {
    id: uuidv4(),
    fileName: file.name,
    uploadedAt: new Date(),
    fileType: file.type,
    fileSize: file.size,
    userId
  };
  
  mockContracts.push(newContract);
  return newContract;
};

// Create a new analysis for a contract
export const createAnalysis = async (contractId: string): Promise<ContractAnalysis> => {
  // In a real app, you would start an analysis job and store the result
  const newAnalysis: ContractAnalysis = {
    id: uuidv4(),
    contractId,
    status: 'pending',
    parties: [],
    riskLevel: 'Moderate',
    summaryPlainEnglish: 'Analysis in progress...',
    clauses: [],
    redFlags: [],
    missingClauses: [],
    createdAt: new Date()
  };
  
  mockAnalyses.push(newAnalysis);
  return newAnalysis;
};

// Helper to get status badge color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper to get risk level badge color
export const getRiskLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 