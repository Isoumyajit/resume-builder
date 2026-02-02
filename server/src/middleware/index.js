/**
 * Middleware configuration
 * Centralized middleware setup for the Express application
 */

const cors = require("cors");
const express = require("express");
const { API_CONFIG } = require("../config/api");
const { createHttpLogger, loggers } = require("../config/logger");

/**
 * Configure basic middleware stack
 */
function setupBasicMiddleware(app) {
  // CORS configuration
  app.use(cors(API_CONFIG.CORS));

  // Body parsing middleware
  app.use(express.json({ limit: API_CONFIG.REQUEST.JSON_LIMIT }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: API_CONFIG.REQUEST.URL_LIMIT,
    }),
  );

  // HTTP request logging with Pino
  app.use(createHttpLogger());
}

/**
 * Configure error handling middleware
 */
function setupErrorHandling(app) {
  // Global error handler
  app.use((err, req, res, next) => {
    loggers.app.error(
      {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
      },
      `💥 Unhandled error: ${err.message}`,
    );

    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Not found",
      message: `Route ${req.originalUrl} not found`,
    });
  });
}

module.exports = {
  setupBasicMiddleware,
  setupErrorHandling,
};
