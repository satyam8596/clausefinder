// Landing page types can be added here if needed
export {};

// Contract types for the application
export interface Contract {
  id: string;
  fileName: string;
  uploadedAt: Date;
  fileType: string;
  fileSize: number;
  content?: string;
  userId: string;
}

export interface ContractClause {
  id: string;
  contractId: string;
  analysisId: string;
  clauseType: string;
  originalText: string;
  explanation: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  suggestions: string | null;
}

export interface RedFlag {
  id: string;
  analysisId: string;
  issue: string;
  explanation: string;
  severity: 'Low' | 'Moderate' | 'High';
  suggestedFix: string | null;
}

export interface ContractAnalysis {
  id: string;
  contractId: string;
  status: 'pending' | 'completed' | 'failed';
  parties: string[];
  effectiveDate?: string;
  jurisdiction?: string;
  termPeriod?: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  summaryPlainEnglish: string;
  clauses: ContractClause[];
  redFlags: RedFlag[];
  missingClauses: string[];
  createdAt: Date;
}
