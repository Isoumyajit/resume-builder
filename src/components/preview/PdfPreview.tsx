import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Loader2,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import type { PdfPreviewProps } from "@/interfaces/components";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfPreview({ pdfUrl, isLoading, error }: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const message = `It's recommended to have one pager resume for better readability`;

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

  if (isLoading) {
    return (
      <div className="rb-pdf-preview__loading flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Loader2 className="rb-pdf-preview__spinner h-12 w-12 animate-spin text-blue-500 dark:text-blue-400 mb-4" />
        <p className="rb-pdf-preview__loading-text text-lg font-medium">
          Generating PDF...
        </p>
        <p className="rb-pdf-preview__loading-subtext text-sm text-gray-400 dark:text-gray-500 mt-1">
          Compiling LaTeX (this may take a few seconds)
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rb-pdf-preview__error flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="rb-pdf-preview__error-icon flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-700 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
        <p className="rb-pdf-preview__error-title text-lg font-medium text-red-600 dark:text-red-400">
          Failed to generate PDF
        </p>
        <p className="rb-pdf-preview__error-message text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md text-center">
          {error}
        </p>
      </div>
    );
  }

  // Empty state (no PDF yet)
  if (!pdfUrl) {
    return (
      <div className="rb-pdf-preview__empty flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="rb-pdf-preview__empty-icon flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <FileText className="h-10 w-10 text-gray-400 dark:text-gray-400" />
        </div>
        <p className="rb-pdf-preview__empty-title text-lg font-medium text-gray-700 dark:text-gray-200">
          No Preview Yet
        </p>
        <p className="rb-pdf-preview__empty-message text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the form and press{" "}
          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
            Ctrl
          </kbd>
          {" + "}
          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
            S
          </kbd>{" "}
          to generate
        </p>
      </div>
    );
  }

  // PDF display
  return (
    <div className="rb-pdf-preview flex flex-col h-full">
      {numPages && numPages > 1 && (
        <div className="rb-pdf-preview__message flex items-center justify-center gap-2 text-center text-sm text-gray-500 dark:text-gray-400 mt-4 mb-4">
          <AlertCircle className=" text-blue-500 dark:text-blue-400" />
          <span className="font-medium">{message}</span>
        </div>
      )}
      {/* PDF Viewer */}
      <div className="rb-pdf-preview__canvas flex-1 flex items-center justify-center overflow-auto bg-gray-200 dark:bg-gray-700 rounded-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="rb-pdf-preview__document-loading flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
            </div>
          }
          error={
            <div className="rb-pdf-preview__document-error flex flex-col items-center justify-center p-8 text-red-500 dark:text-red-400">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load PDF</p>
              {pdfError && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {pdfError}
                </p>
              )}
            </div>
          }
          className="rb-pdf-preview__document"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="rb-pdf-preview__page shadow-lg"
            width={500}
          />
        </Document>
      </div>

      {/* Pagination Controls */}
      {numPages && numPages > 1 && (
        <div className="rb-pdf-preview__controls flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="rb-pdf-preview__prev-page cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="rb-pdf-preview__page-info text-sm text-gray-600 dark:text-gray-400">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="rb-pdf-preview__next-page cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
