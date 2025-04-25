import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';

/**
 * Extracts text content from various file types
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (!fileType || !['pdf', 'docx', 'txt'].includes(fileType)) {
    throw new Error('Unsupported file type. Only PDF, DOCX, and TXT files are supported.');
  }
  
  const buffer = await file.arrayBuffer();
  
  switch (fileType) {
    case 'pdf':
      return extractTextFromPdf(buffer);
    case 'docx':
      return extractTextFromDocx(buffer);
    case 'txt':
      return extractTextFromTxt(buffer);
    default:
      throw new Error('Unsupported file type');
  }
}

/**
 * Extracts text from PDF files
 */
async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(buffer);
  const pdfData = await pdfParse(uint8Array);
  return pdfData.text;
}

/**
 * Extracts text from DOCX files
 */
async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

/**
 * Extracts text from TXT files
 */
function extractTextFromTxt(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(buffer));
}

/**
 * Validates file type
 */
export function isValidFileType(fileName: string): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? ['pdf', 'docx', 'txt'].includes(extension) : false;
} 