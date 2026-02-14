import { PdfPreview } from "@/components/preview";
import type { PreviewPanelProps } from "@/interfaces/components";

export function PreviewPanel({ pdfUrl, isLoading, error }: PreviewPanelProps) {
  return (
    <div className="rb-app__preview-panel h-full flex flex-col">
      <div className="rb-app__preview-wrapper flex-1">
        <PdfPreview pdfUrl={pdfUrl} isLoading={isLoading} error={error} />
      </div>

      {/* Keyboard shortcut hint */}
      <div
        data-testid="keyboard-shortcut-hint"
        className="rb-app__keyboard-hint text-center text-sm text-gray-500 dark:text-gray-400 mt-4 hidden md:block"
      >
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
          Ctrl
        </kbd>
        {" + "}
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
          S
        </kbd>{" "}
        to generate PDF
      </div>
    </div>
  );
}
