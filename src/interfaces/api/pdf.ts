/**
 * API-related interfaces for PDF generation
 */

// API response type for PDF generation
export interface GeneratePdfResponse {
  success: boolean;
  pdfBlob?: Blob;
  error?: string;
}

// API error class interface
export interface ApiErrorInterface extends Error {
  status: number;
}
