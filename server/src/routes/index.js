/**
 * Routes configuration
 * Centralized route setup with API versioning and documentation
 */

const { API_CONFIG } = require("../config/api");
const healthRoutes = require("./health");
const resumeRoutes = require("./resume");

/**
 * Configure all application routes
 */
function setupRoutes(app) {
  app.use(API_CONFIG.BASE_PATH, healthRoutes);
  app.use(API_CONFIG.BASE_PATH, resumeRoutes);

  app.get("/api", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      message: "Resume Builder API",
      version: API_CONFIG.VERSION,
      serverVersion: process.env.npm_package_version || "1.0.0",
      endpoints: {
        health: `${API_CONFIG.BASE_PATH}/health`,
        healthDetailed: `${API_CONFIG.BASE_PATH}/health/detailed`,
        generatePdf: `${API_CONFIG.BASE_PATH}/generate-pdf`,
        templates: `${API_CONFIG.BASE_PATH}/templates`,
      },
      documentation: {
        github: "https://github.com/soumyajit/resume-builder#api-documentation",
      },
      supportedVersions: ["v1"],
    });
  });

  app.get("/", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      name: "Resume Builder API Server",
      version: process.env.npm_package_version || "1.0.0",
      status: "running",
      apiVersion: API_CONFIG.VERSION,
      endpoints: {
        api: "/api",
        health: `${API_CONFIG.BASE_PATH}/health`,
      },
      quickStart: {
        healthCheck: `${baseUrl}${API_CONFIG.BASE_PATH}/health`,
        example: `curl -X POST ${baseUrl}${API_CONFIG.BASE_PATH}/generate-pdf -H "Content-Type: application/json" -d @example.json`,
      },
    });
  });
}

module.exports = { setupRoutes };
