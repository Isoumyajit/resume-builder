/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";

// Construct versioned base URL
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  VERSION: API_VERSION,
  BASE_PATH: `${API_BASE_URL}/api/${API_VERSION}`,
  TIMEOUT: 30000, // 30 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Health & Status
  HEALTH: `${API_CONFIG.BASE_PATH}/health`,
  HEALTH_DETAILED: `${API_CONFIG.BASE_PATH}/health/detailed`,

  // Resume Operations
  GENERATE_PDF: `${API_CONFIG.BASE_PATH}/generate-pdf`,
  TEMPLATES: `${API_CONFIG.BASE_PATH}/templates`,

  // Future endpoints can be added here
  // SAVE_RESUME: `${API_CONFIG.BASE_PATH}/resumes`,
  // LOAD_RESUME: `${API_CONFIG.BASE_PATH}/resumes/{id}`,
} as const;

// Request configuration
export const REQUEST_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: API_CONFIG.TIMEOUT,
} as const;

// Version compatibility check
export function isVersionCompatible(serverVersion: string): boolean {
  const clientVersion = API_CONFIG.VERSION;

  // For now, only check major version compatibility
  const clientMajor = clientVersion.split(".")[0];
  const serverMajor = serverVersion.split(".")[0];

  return clientMajor === serverMajor;
}

// Environment info for debugging
export const ENV_INFO = {
  NODE_ENV: import.meta.env.MODE || "development",
  API_BASE_URL,
  API_VERSION,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;
