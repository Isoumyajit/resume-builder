import { useState, useCallback } from "react";
import { generatePdf } from "@/api/resume";
import type { ResumeFormData } from "@/lib/validation";

export function usePdfGeneration() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (data: ResumeFormData) => {
      setIsLoading(true);
      setError(null);
      console.log("Generating PDF", data);

      try {
        const blob = await generatePdf(data);
        console.log("blob", blob);

        // Revoke previous URL to prevent memory leak
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate PDF");
      } finally {
        setIsLoading(false);
      }
    },
    [pdfUrl],
  );

  const downloadPdf = useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfUrl]);

  return { pdfUrl, isLoading, error, generate, downloadPdf };
}
