import type { ResumeFormData } from "@/lib/validation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generate a PDF from resume data
 * Sends form data to backend, which compiles LaTeX and returns PDF
 */
export async function generatePdf(data: ResumeFormData): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "Failed to generate PDF",
      response.status
    );
  }

  const blob = await response.blob();
  return blob;
}

/**
 * Health check for the API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
