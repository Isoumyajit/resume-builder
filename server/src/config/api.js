/**
 * API Configuration
 * Centralized configuration for API settings, versioning, and endpoints
 */

require("dotenv").config();

const API_CONFIG = {
  VERSION: process.env.API_VERSION || "v1",
  BASE_URL:
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
  BASE_PATH: `/api/${process.env.API_VERSION || "v1"}`,

  PORT: parseInt(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",

  CORS: {
    ORIGIN: process.env.FRONTEND_URL || "http://localhost:5173",
    CREDENTIALS: true,
  },

  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  },

  LATEX: {
    TIMEOUT: parseInt(process.env.LATEX_TIMEOUT) || 30000,
    TEMP_DIR: process.env.TEMP_DIR || "./temp",
  },

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  REQUEST: {
    JSON_LIMIT: "10mb",
    URL_LIMIT: "10mb",
  },
};

// API Endpoints (for documentation and testing)
const API_ENDPOINTS = {
  HEALTH: `${API_CONFIG.BASE_PATH}/health`,
  HEALTH_DETAILED: `${API_CONFIG.BASE_PATH}/health/detailed`,
  GENERATE_PDF: `${API_CONFIG.BASE_PATH}/generate-pdf`,
};

// Version information
const VERSION_INFO = {
  API_VERSION: API_CONFIG.VERSION,
  SERVER_VERSION: process.env.npm_package_version || "1.0.0",
  NODE_VERSION: process.version,
  SUPPORTED_VERSIONS: ["v1"], // Add v2, v3 as you create them
};

// Validation functions
function validateConfig() {
  console.log("✅ API configuration validated");
  console.log(`   PORT: ${API_CONFIG.PORT}`);
  console.log(`   CORS Origin: ${API_CONFIG.CORS.ORIGIN}`);
}

// Export configuration
module.exports = {
  API_CONFIG,
  API_ENDPOINTS,
  VERSION_INFO,
  validateConfig,
};
