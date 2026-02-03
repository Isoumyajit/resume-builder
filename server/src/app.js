/**
 * Express Application Setup
 * Clean separation of app configuration from server startup
 */

const express = require("express");
const { validateConfig } = require("./config/api");
const { setupBasicMiddleware, setupErrorHandling } = require("./middleware");
const { setupRoutes } = require("./routes/index");
const { generateText } = require("./services/ai/text-generation");
/**
 * Create and configure Express application
 */
function createApp() {
  // Validate configuration first

  validateConfig();

  // Create Express app
  const app = express();

  // Setup middleware
  setupBasicMiddleware(app);

  // Setup routes
  setupRoutes(app);

  // Setup error handling (must be last)
  setupErrorHandling(app);

  return app;
}

module.exports = { createApp };
