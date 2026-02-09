/**
 * Resume Builder Server
 * Clean entry point - starts the server with minimal responsibility
 */

const { createApp } = require("./app");
const { API_CONFIG } = require("./config/api");
const { loggers } = require("./config/logger");

const PORT = parseInt(process.env.PORT, 10) || 8080;

console.log(`[STARTUP] PORT from env: ${process.env.PORT}`);
console.log(`[STARTUP] Using PORT: ${PORT}`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);

const app = createApp();

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[STARTUP] Server listening on 0.0.0.0:${PORT}`);

  loggers.app.info(
    {
      event: "server_start",
      port: PORT,
      version: API_CONFIG.VERSION,
      environment: API_CONFIG.NODE_ENV,
    },
    `🚀 Resume Builder Server running on port ${PORT}`,
  );
});

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
