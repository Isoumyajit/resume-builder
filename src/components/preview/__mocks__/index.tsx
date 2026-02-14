/**
 * Manual mock for @/components/preview
 *
 * PdfPreview depends on react-pdf and PDF.js workers which don't work in jsdom.
 * This lightweight mock renders the props it receives so tests can verify
 * that parent components pass the correct data.
 *
 * Usage: add `jest.mock("@/components/preview")` in your test file —
 * Jest will automatically resolve to this __mocks__/index.tsx file.
 */
export function PdfPreview({
  pdfUrl,
  isLoading,
  error,
}: {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div data-testid="pdf-preview">
      {isLoading && <span data-testid="pdf-preview-loading">Loading...</span>}
      {error && <span data-testid="pdf-preview-error">{error}</span>}
      {pdfUrl && <span data-testid="pdf-preview-url">{pdfUrl}</span>}
    </div>
  );
}
