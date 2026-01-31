import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, FileText, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function PdfPreview({ pdfUrl, isLoading, error }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setPdfError(error.message);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg font-medium">Generating PDF...</p>
        <p className="text-sm text-gray-400 mt-1">
          Compiling LaTeX (this may take a few seconds)
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-lg font-medium text-red-600">Failed to generate PDF</p>
        <p className="text-sm text-gray-500 mt-1 max-w-md text-center">{error}</p>
      </div>
    );
  }

  // Empty state (no PDF yet)
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-4">
          <FileText className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-700">No Preview Yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the form and press{" "}
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl</kbd>
          {" + "}
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">S</kbd>
          {" "}to generate
        </p>
      </div>
    );
  }

  // PDF display
  return (
    <div className="flex flex-col h-full">
      {/* PDF Viewer */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-200 rounded-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load PDF</p>
              {pdfError && <p className="text-sm text-gray-500 mt-1">{pdfError}</p>}
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
            width={550}
          />
        </Document>
      </div>

      {/* Pagination Controls */}
      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
