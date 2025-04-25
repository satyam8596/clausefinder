import { v4 as uuidv4 } from 'uuid';
import { ContractAnalysis, ContractClause, RedFlag } from '@/types';

// Initialize Deepseek AI client if API key is available
const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com';
let deepseekApiKey: string | null = null;

if (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
  deepseekApiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
} else if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_CLIENT_API_KEY === 'true') {
  // This approach is for demo purposes only and not recommended for production
  // as it exposes the API key to the client
  const clientApiKey = localStorage.getItem('deepseek_api_key');
  if (clientApiKey) {
    deepseekApiKey = clientApiKey;
  }
}

/**
 * Makes a request to the Deepseek AI API
 */
async function callDeepseekAPI(prompt: string, userMessage: string): Promise<any> {
  if (!deepseekApiKey) {
    throw new Error('Deepseek API key is not available. Please provide an API key.');
  }

  try {
    const response = await fetch(`${DEEPSEEK_API_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Deepseek API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Deepseek API:', error);
    throw error;
  }
}

/**
 * Analyzes a contract using Deepseek AI
 */
export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  // System prompt with instructions for contract analysis
  const systemPrompt = `
    You are an expert legal AI assistant specialized in contract analysis. You will be given a contract text to analyze.
    Please extract and analyze the following information from the contract:
    
    1. Parties involved in the contract
    2. Effective date of the contract
    3. Jurisdiction governing the contract
    4. Term period and termination conditions
    5. Identify all clauses in the contract and categorize them (e.g., indemnification, non-compete, confidentiality)
    6. Provide a plain English explanation for each clause
    7. Assess the risk level (Low, Moderate, High) for each clause
    8. Identify any red flags or concerning clauses with explanations
    9. List any standard clauses that might be missing from the contract
    10. Provide an overall risk assessment (Low, Moderate, High)
    11. Generate a plain English summary of the entire contract
    
    Format your response as valid JSON with the following structure:
    {
      "parties": ["Party 1", "Party 2"],
      "effectiveDate": "YYYY-MM-DD",
      "jurisdiction": "Jurisdiction",
      "termPeriod": "Description of term and termination",
      "riskLevel": "Low/Moderate/High",
      "summaryPlainEnglish": "Plain English summary of the contract",
      "clauses": [
        {
          "clauseType": "Type of clause",
          "originalText": "Original clause text",
          "explanation": "Plain English explanation",
          "riskLevel": "Low/Moderate/High",
          "suggestions": "Suggested improvements (if any)"
        }
      ],
      "redFlags": [
        {
          "issue": "Description of the issue",
          "explanation": "Why this is a problem",
          "severity": "Low/Moderate/High",
          "suggestedFix": "Suggestion to fix this issue"
        }
      ],
      "missingClauses": ["List of standard clauses missing from the contract"]
    }
  `;

  try {
    // Call Deepseek API
    const analysisText = await callDeepseekAPI(systemPrompt, contractText);
    const analysisData = JSON.parse(analysisText);
    
    // Create a well-typed contract analysis
    const contractAnalysis: ContractAnalysis = {
      id: uuidv4(),
      contractId: uuidv4(), // This would normally be the ID of the saved contract
      status: 'completed',
      parties: analysisData.parties || [],
      effectiveDate: analysisData.effectiveDate,
      jurisdiction: analysisData.jurisdiction,
      termPeriod: analysisData.termPeriod,
      riskLevel: analysisData.riskLevel || 'Moderate',
      summaryPlainEnglish: analysisData.summaryPlainEnglish || 'No summary available',
      clauses: (analysisData.clauses || []).map((clause: any): ContractClause => ({
        id: uuidv4(),
        contractId: uuidv4(), // This would normally be the ID of the saved contract
        analysisId: uuidv4(), // This would normally be the ID of this analysis
        clauseType: clause.clauseType || 'Unknown',
        originalText: clause.originalText || '',
        explanation: clause.explanation || '',
        riskLevel: clause.riskLevel || 'Moderate',
        suggestions: clause.suggestions
      })),
      redFlags: (analysisData.redFlags || []).map((flag: any): RedFlag => ({
        id: uuidv4(),
        analysisId: uuidv4(), // This would normally be the ID of this analysis
        issue: flag.issue || 'Unknown issue',
        explanation: flag.explanation || '',
        severity: flag.severity || 'Moderate',
        suggestedFix: flag.suggestedFix
      })),
      missingClauses: analysisData.missingClauses || [],
      createdAt: new Date()
    };

    return contractAnalysis;
  } catch (error) {
    console.error('Error analyzing contract:', error);
    throw new Error('Failed to analyze contract');
  }
}

/**
 * Generates plain English explanation for a clause
 */
export async function explainClause(clauseText: string): Promise<string> {
  try {
    const systemPrompt = "You are a legal expert. Explain the following contract clause in plain, simple English that a non-lawyer can understand. Focus on the practical implications.";
    
    const explanation = await callDeepseekAPI(systemPrompt, clauseText);
    return explanation || 'No explanation available';
  } catch (error) {
    console.error('Error explaining clause:', error);
    return 'Failed to generate explanation.';
  }
}

/**
 * Suggests alternative wording for a problematic clause
 */
export async function suggestAlternativeClause(clauseText: string, issue: string): Promise<string> {
  try {
    const systemPrompt = "You are a legal expert. The following contract clause has an issue. Suggest an alternative wording that addresses the issue while maintaining the intent of the clause.";
    
    const userMessage = `Clause: ${clauseText}\n\nIssue: ${issue}\n\nPlease suggest an alternative wording.`;
    const suggestion = await callDeepseekAPI(systemPrompt, userMessage);
    return suggestion || 'No suggestion available';
  } catch (error) {
    console.error('Error suggesting alternative clause:', error);
    return 'Failed to generate suggestion.';
  }
} 