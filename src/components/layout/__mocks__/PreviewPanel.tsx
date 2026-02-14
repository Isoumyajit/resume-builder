/**
 * Manual mock for layout/PreviewPanel
 * Captures props as data attributes for test assertions.
 */
export function PreviewPanel(props: Record<string, unknown>) {
  return (
    <div
      data-testid="preview-panel"
      data-pdf-url={String(props.pdfUrl)}
      data-is-loading={String(props.isLoading)}
      data-error={String(props.error)}
    />
  );
}
