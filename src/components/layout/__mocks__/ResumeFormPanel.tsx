/**
 * Manual mock for layout/ResumeFormPanel
 * Captures props as data attributes for test assertions.
 */
export function ResumeFormPanel(props: Record<string, unknown>) {
  return (
    <div
      data-testid="resume-form-panel"
      data-is-generating={String(props.isGenerating)}
    />
  );
}
