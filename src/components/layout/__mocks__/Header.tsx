/**
 * Manual mock for layout/Header
 * Captures props as data attributes for test assertions.
 */
export function Header(props: Record<string, unknown>) {
  return (
    <div
      data-testid="header"
      data-can-download={String(props.canDownload)}
      data-is-generating={String(props.isGenerating)}
    />
  );
}
