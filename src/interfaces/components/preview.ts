/**
 * Component prop interfaces for Preview components
 */

// PdfPreview component props
export interface PdfPreviewProps {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
}
