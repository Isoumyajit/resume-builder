/**
 * Resume Builder Server
 * Clean entry point - starts the server with minimal responsibility
 */

const { createApp } = require("./app");
const { API_CONFIG } = require("./config/api");
const { loggers } = require("./config/logger");

// Create configured Express application
const app = createApp();

// Start the server
const server = app.listen(API_CONFIG.PORT, () => {
  loggers.app.info(
    {
      event: "server_start",
      port: API_CONFIG.PORT,
      version: API_CONFIG.VERSION,
      environment: API_CONFIG.NODE_ENV,
      endpoints: {
        health: `${API_CONFIG.BASE_URL}${API_CONFIG.BASE_PATH}/health`,
        generatePdf: `${API_CONFIG.BASE_URL}${API_CONFIG.BASE_PATH}/generate-pdf`,
        api: `${API_CONFIG.BASE_URL}/api`,
      },
    },
    `🚀 Resume Builder Server running on port ${API_CONFIG.PORT}`,
  );

  // Console output for development convenience
  if (API_CONFIG.NODE_ENV === "development") {
    console.log(`📡 API Version: ${API_CONFIG.VERSION}`);
    console.log(`🌍 Environment: ${API_CONFIG.NODE_ENV}`);
    console.log(
      `📊 Health check: ${API_CONFIG.BASE_URL}${API_CONFIG.BASE_PATH}/health`,
    );
    console.log(
      `📄 PDF Generation: ${API_CONFIG.BASE_URL}${API_CONFIG.BASE_PATH}/generate-pdf`,
    );
    console.log(`📋 API Documentation: ${API_CONFIG.BASE_URL}/api`);
    console.log(`🔗 Legacy redirect: /api/* → ${API_CONFIG.BASE_PATH}/*`);
  }
});

// Graceful shutdown handling
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

function gracefulShutdown(signal) {
  loggers.app.info(
    {
      event: "server_shutdown_start",
      signal: signal,
    },
    `🛑 Received ${signal}. Starting graceful shutdown...`,
  );

  server.close(() => {
    loggers.app.info(
      {
        event: "server_shutdown_complete",
      },
      "✅ HTTP server closed gracefully",
    );
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    loggers.app.warn(
      {
        event: "server_shutdown_forced",
      },
      "❌ Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
}

module.exports = app;
