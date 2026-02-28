/**
 * AI Generation API
 * Functions for calling AI-powered content generation endpoints
 */

import { API_ENDPOINTS, REQUEST_CONFIG } from "@/config/api";
import type {
  GenerateBulletParams,
  GenerateProjectDescriptionParams,
  GenerateSummaryParams,
} from "@/interfaces/ai/ai";

const AI_ENDPOINTS = {
  GENERATE_BULLET: `${API_ENDPOINTS.HEALTH.replace(
    "/health",
    "",
  )}/ai/generate-bullet`,
  GENERATE_DESCRIPTION: `${API_ENDPOINTS.HEALTH.replace(
    "/health",
    "",
  )}/ai/generate-description`,
  GENERATE_SUMMARY: `${API_ENDPOINTS.HEALTH.replace(
    "/health",
    "",
  )}/ai/generate-summary`,
};

/**
 * Generate a professional project description with streaming
 */
export async function generateProjectDescription(
  params: GenerateProjectDescriptionParams,
  onUpdate: (chunks: string[]) => void,
): Promise<void> {
  const response = await fetch(AI_ENDPOINTS.GENERATE_DESCRIPTION, {
    method: "POST",
    headers: REQUEST_CONFIG.headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate description");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    chunks.push(text);
    onUpdate(chunks);
  }
}

export async function fetchBullets(
  params: GenerateBulletParams,
  onBulletsUpdate: (chunks: string[]) => void,
): Promise<void> {
  const response = await fetch(AI_ENDPOINTS.GENERATE_BULLET, {
    method: "POST",
    headers: REQUEST_CONFIG.headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate bullets");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    chunks.push(text);
    onBulletsUpdate(chunks);
  }
}

/**
 * Generate a professional summary with streaming
 */
export async function generateSummaryText(
  params: GenerateSummaryParams,
  onUpdate: (chunks: string[]) => void,
): Promise<void> {
  const response = await fetch(AI_ENDPOINTS.GENERATE_SUMMARY, {
    method: "POST",
    headers: REQUEST_CONFIG.headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to generate summary");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    chunks.push(text);
    onUpdate(chunks);
  }
}
