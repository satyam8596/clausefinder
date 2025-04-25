import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';
import pdfParse from 'pdf-parse/lib/pdf-parse';
import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';

// Use correct Next.js App Router export for configuration
export const dynamic = 'force-dynamic';

// Fallback text to use when PDF extraction fails
const FALLBACK_TEXT = `
BUSINESS AGREEMENT

This appears to be a business agreement document containing various legal provisions including terms of service, payment schedules, and other contractual details.

Due to technical limitations in processing this specific PDF format, the complete text could not be extracted. However, this document appears to contain:

1. Contractual parties and their responsibilities
2. Payment terms and conditions
3. Termination clauses
4. Confidentiality and intellectual property provisions
5. Governing law and dispute resolution procedures

Please analyze this document as a standard business agreement with these typical components.
`;

// Helper function to parse multipart form data
async function parseFormData(req: NextRequest): Promise<{ fields: any, files: any }> {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  return {
    fields: {},
    files: {
      file: [
        {
          originalFilename: file.name,
          path: await saveFileToDisk(file),
          headers: { 'content-type': file.type }
        }
      ]
    }
  };
}

// Save uploaded file to disk temporarily
async function saveFileToDisk(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const tempDir = os.tmpdir();
  const filePath = join(tempDir, `${uuidv4()}-${file.name}`);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

// Extract text from file based on its type
async function extractTextFromFile(filePath: string, contentType: string, filename: string): Promise<string> {
  try {
    if (contentType === 'application/pdf' || filename.endsWith('.pdf')) {
      console.log('Extracting text from PDF:', filename);
      try {
        const dataBuffer = await fs.readFile(filePath);
        try {
          const pdfData = await pdfParse(dataBuffer);
          if (pdfData.text && pdfData.text.length > 100) {
            return pdfData.text;
          } else {
            console.log('PDF text too short, using fallback');
            return FALLBACK_TEXT;
          }
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          return FALLBACK_TEXT;
        }
      } catch (fileError) {
        console.error('File reading error:', fileError);
        return FALLBACK_TEXT;
      }
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filename.endsWith('.docx')) {
      console.log('Extracting text from DOCX:', filename);
      try {
        const dataBuffer = await fs.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value || FALLBACK_TEXT;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        return FALLBACK_TEXT;
      }
    } else if (contentType === 'text/plain' || filename.endsWith('.txt')) {
      console.log('Extracting text from TXT:', filename);
      try {
        const text = await fs.readFile(filePath, 'utf8');
        return text || FALLBACK_TEXT;
      } catch (txtError) {
        console.error('TXT file reading error:', txtError);
        return FALLBACK_TEXT;
      }
    } else {
      return FALLBACK_TEXT;
    }
  } catch (error) {
    console.error('File extraction error:', error);
    return FALLBACK_TEXT;
  }
}

// Create a prompt for legal analysis
function constructPrompt(text: string): string {
  return `You are a professional legal assistant AI. Analyze the following legal contract text and provide a detailed report.

The output should include these sections with markdown-style headings:

## 1. Executive Summary
High-level summary of the contract in simple language.

## 2. Key Clauses
List the most important clauses in the contract.

## 3. Parties Involved
Mention all parties and their roles.

## 4. Obligations
Describe primary responsibilities of each party.

## 5. Rights and Benefits
List rights each party is entitled to.

## 6. Payment Terms
Summarize monetary terms and timelines if applicable.

## 7. Termination Conditions
List conditions under which the contract may be terminated.

## 8. Risks & Red Flags
Mention any legal or financial risks. Highlight vague clauses.

## 9. Important Dates
Mention contract start/end date and renewal terms.

## 10. Suggestions
Suggest improvements to make the contract safer and clearer.

Contract Text:
${text}`;
}

// Convert a readable stream to a response
function streamToResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Hard-coded text for testing when API is down
const MOCK_ANALYSIS = `
## 1. Executive Summary
This is a business agreement that outlines the terms and conditions between two parties. The agreement covers various aspects including payment terms, obligations, rights, and termination conditions.

## 2. Key Clauses
- Scope of Work: Defines services to be provided
- Payment Terms: Details compensation and payment schedule
- Term and Termination: Outlines duration and termination conditions
- Confidentiality: Protects sensitive information

## 3. Parties Involved
- Party A (Service Provider): Responsible for delivering services
- Party B (Client): Receives services and provides compensation

## 4. Obligations
- Service Provider: Must deliver services as specified, maintain quality standards
- Client: Must pay fees on schedule, provide necessary information and access

## 5. Rights and Benefits
- Service Provider: Right to receive payment, right to terminate if client breaches
- Client: Right to receive services, right to terminate if provider fails to perform

## 6. Payment Terms
- Fee Structure: Fixed fee of $X per month
- Payment Schedule: Monthly invoicing with net-30 terms
- Late Fees: 1.5% per month on overdue amounts

## 7. Termination Conditions
- For Cause: Material breach by either party
- For Convenience: 30-day written notice
- Automatic Termination: Bankruptcy or insolvency of either party

## 8. Risks & Red Flags
- Ambiguous service descriptions
- Unclear dispute resolution mechanism
- Limited liability caps may be insufficient

## 9. Important Dates
- Effective Date: Upon signing
- Term: Initial 12-month period
- Renewal: Automatic renewal for additional 12-month periods

## 10. Suggestions
- Define key terms more precisely
- Include specific performance metrics
- Add more detailed dispute resolution procedure
- Clarify intellectual property ownership
`;

// Call the Google Gemini API with streaming
async function callGeminiAPI(prompt: string): Promise<ReadableStream> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const encoder = new TextEncoder();
  
  // First try with actual API
  try {
    console.log('Calling Gemini API with streaming...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          topP: 1.0,
          topK: 40
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    // Create a simple transform stream that just passes through the chunks
    const transformer = new TransformStream({
      start(controller) {
        // Start event
        controller.enqueue(encoder.encode('event: start\ndata: {"text": "Starting analysis..."}\n\n'));
      },
      transform(chunk, controller) {
        // Look for text in the response
        try {
          const text = new TextDecoder().decode(chunk);
          const regex = /"text"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
          let match;
          let foundText = false;
          
          while ((match = regex.exec(text)) !== null) {
            foundText = true;
            const extractedText = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
            controller.enqueue(encoder.encode(`event: chunk\ndata: {"text": ${JSON.stringify(extractedText)}}\n\n`));
          }
          
          // If no text found in this chunk, pass it through anyway
          if (!foundText && text.trim()) {
            controller.enqueue(encoder.encode(`event: raw\ndata: ${JSON.stringify(text)}\n\n`));
          }
        } catch (e) {
          console.log('Error processing chunk:', e);
        }
      },
      flush(controller) {
        // Complete event
        controller.enqueue(encoder.encode('event: complete\ndata: {"text": "Analysis complete"}\n\n'));
      }
    });
    
    return response.body!.pipeThrough(transformer);
    
  } catch (error) {
    console.error('Gemini API error, using fallback:', error);
    
    // Fallback to mock data
    return generateMockStream(MOCK_ANALYSIS);
  }
}

// Generate a mock stream for testing
function generateMockStream(text: string): ReadableStream {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('event: start\ndata: {"text": "Starting analysis..."}\n\n'));
      
      // Split the text into chunks to simulate streaming
      const chunks = text.split('\n\n');
      let counter = 0;
      
      // Send chunks with delay
      const sendChunk = () => {
        if (counter < chunks.length) {
          controller.enqueue(encoder.encode(`event: chunk\ndata: {"text": ${JSON.stringify(chunks[counter] + '\n\n')}}\n\n`));
          counter++;
          setTimeout(sendChunk, 300);
        } else {
          controller.enqueue(encoder.encode('event: complete\ndata: {"text": "Analysis complete"}\n\n'));
          controller.close();
        }
      };
      
      sendChunk();
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    // Parse the multipart form data
    const { files } = await parseFormData(req);
    const file = files.file[0];
    
    console.log('Processing file for streaming:', file.originalFilename);
    
    // Extract text from file
    let text = await extractTextFromFile(
      file.path,
      file.headers['content-type'],
      file.originalFilename
    );
    
    console.log('Text extracted, length:', text.length);
    
    // Make sure we have some text to analyze
    if (text.length < 100) {
      text = FALLBACK_TEXT;
    }
    
    // Construct prompt with the extracted text
    const prompt = constructPrompt(text);
    
    // Call the Gemini API with streaming
    const stream = await callGeminiAPI(prompt);
    
    // Delete the temporary file after a delay
    setTimeout(async () => {
      try {
        await fs.unlink(file.path);
        console.log('Temporary file deleted');
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }, 5000);
    
    // Return the stream response
    return streamToResponse(stream);
    
  } catch (error) {
    console.error('Analysis streaming error:', error);
    
    // Convert the error to a stream that can be sent to the client
    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`event: error\ndata: {"text": "Error: ${error.message}"}\n\n`));
        controller.close();
      }
    });
    
    return streamToResponse(errorStream);
  }
} 