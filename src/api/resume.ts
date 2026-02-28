import type { ResumeFormData } from "@/lib/validation";
import {
  API_ENDPOINTS,
  REQUEST_CONFIG,
  isVersionCompatible,
} from "@/config/api";

export class ApiError extends Error {
  status: number;
  endpoint?: string;

  constructor(message: string, status: number, endpoint?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Generate a PDF from resume data
 * Sends form data to backend, which compiles LaTeX and returns PDF
 */
export async function generatePdf(
  data: ResumeFormData,
  templateId: string = "classic",
): Promise<Blob> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_CONFIG.timeout,
  );

  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_PDF, {
      method: "POST",
      headers: REQUEST_CONFIG.headers,
      body: JSON.stringify({ ...data, templateType: templateId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Failed to generate PDF",
        response.status,
      );
    }

    const blob = await response.blob();
    return blob;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout - PDF generation took too long", 408);
    }
    throw error;
  }
}

/**
 * Health check for the API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Detailed health check with version compatibility
 */
export async function detailedHealthCheck(): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverInfo?: any;
  versionCompatible: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH_DETAILED);

    if (!response.ok) {
      return {
        status: "unhealthy",
        versionCompatible: false,
        error: `Server responded with status ${response.status}`,
      };
    }

    const serverInfo = await response.json();
    const versionCompatible = isVersionCompatible(serverInfo.api.version);

    return {
      status: serverInfo.status,
      serverInfo,
      versionCompatible,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      versionCompatible: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get available resume templates
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTemplates(): Promise<any[]> {
  try {
    const response = await fetch(API_ENDPOINTS.TEMPLATES);

    if (!response.ok) {
      throw new ApiError("Failed to fetch templates", response.status);
    }

    const data = await response.json();
    return data.templates || [];
  } catch {
    return [];
  }
}
