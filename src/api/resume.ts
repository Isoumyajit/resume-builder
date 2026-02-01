import type { ResumeFormData } from "@/lib/validation";
import {
  API_ENDPOINTS,
  REQUEST_CONFIG,
  isVersionCompatible,
} from "@/config/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.endpoint = endpoint;
  }
}

/**
 * Generate a PDF from resume data
 * Sends form data to backend, which compiles LaTeX and returns PDF
 */
export async function generatePdf(data: ResumeFormData): Promise<Blob> {
  console.log(`📡 Calling API: ${API_ENDPOINTS.GENERATE_PDF}`);

  console.log("data", data);

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_CONFIG.timeout,
  );

  try {
    const response = await fetch(API_ENDPOINTS.GENERATE_PDF, {
      method: "POST",
      headers: REQUEST_CONFIG.headers,
      body: JSON.stringify(data),
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
    console.log("blob", blob);
    return blob;
  } catch (error) {
    if (error.name === "AbortError") {
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
export async function getTemplates(): Promise<any[]> {
  try {
    const response = await fetch(API_ENDPOINTS.TEMPLATES);

    if (!response.ok) {
      throw new ApiError("Failed to fetch templates", response.status);
    }

    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return [];
  }
}
