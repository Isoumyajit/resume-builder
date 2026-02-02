/**
 * Logging Configuration
 * Centralized logging setup for the Resume Builder API
 */

const pino = require("pino");

// Get configuration from environment
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Create Pino logger configuration
 */
function createLoggerConfig() {
  const config = {
    level: LOG_LEVEL,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      pid: process.pid,
      hostname: require("os").hostname(),
      service: "resume-builder-api",
      version: process.env.npm_package_version || "1.0.0",
    },
  };

  // Development: Pretty print for readability
  if (NODE_ENV === "development") {
    config.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        colorizeObjects: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname,service",
        singleLine: false,
        hideObject: false,
        messageFormat: "{levelname} - {msg}",
        errorLikeObjectKeys: ["err", "error"],
      },
    };
  }

  // Production: JSON output for log aggregation
  if (NODE_ENV === "production") {
    config.redact = [
      "req.headers.authorization",
      "req.headers.cookie",
      "personalInfo.email",
      "personalInfo.phone",
    ]; // Hide sensitive data in production logs
  }

  return config;
}

// Create logger instance
const logger = pino(createLoggerConfig());

/**
 * Create HTTP request logger middleware
 */
function createHttpLogger() {
  const pinoHttp = require("pino-http");

  return pinoHttp({
    logger: logger,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return "silent"; // Don't log redirects
      }
      return "info";
    },
    customReceivedMessage: (req) => {
      return `${req.method} ${req.url}`;
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
    },
    customAttributeKeys: {
      req: "request",
      res: "response",
      err: "error",
      responseTime: "duration",
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"],
        ip: req.ip || req.connection?.remoteAddress,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  });
}

/**
 * Create contextual loggers for different parts of the application
 */
const loggers = {
  // Main application logger
  app: logger.child({ component: "app" }),

  // API request/response logger
  api: logger.child({ component: "api" }),

  // PDF generation logger
  pdf: logger.child({ component: "pdf-generator" }),

  // Validation logger
  validation: logger.child({ component: "validation" }),

  // Health check logger
  health: logger.child({ component: "health" }),

  // LaTeX compilation logger
  latex: logger.child({ component: "latex" }),

  // Database logger (future use)
  db: logger.child({ component: "database" }),
};

/**
 * Helper function to log PDF generation events
 * @param {string} event Event type (start, success, error)
 * @param {Object} data Event data
 */
function logPdfEvent(event, data = {}) {
  const pdfLogger = loggers.pdf;

  switch (event) {
    case "start":
      pdfLogger.info(
        {
          event: "pdf_generation_start",
          user: data.userName,
          contentStats: data.stats,
        },
        `📝 Starting PDF generation for ${data.userName}`,
      );
      break;

    case "success":
      pdfLogger.info(
        {
          event: "pdf_generation_success",
          user: data.userName,
          filename: data.filename,
          size: data.fileSize,
          duration: data.duration,
        },
        `✅ PDF generated successfully: ${data.filename}`,
      );
      break;

    case "error":
      pdfLogger.error(
        {
          event: "pdf_generation_error",
          user: data.userName,
          error: data.error,
          duration: data.duration,
        },
        `❌ PDF generation failed: ${data.error}`,
      );
      break;
  }
}

/**
 * Helper function to log API events
 * @param {string} level Log level (info, warn, error)
 * @param {string} message Log message
 * @param {Object} data Additional data
 */
function logApi(level, message, data = {}) {
  loggers.api[level](data, message);
}

/**
 * Helper function to log validation events
 * @param {boolean} success Whether validation passed
 * @param {Object} data Validation data
 */
function logValidation(success, data = {}) {
  if (success) {
    loggers.validation.info(
      {
        event: "validation_success",
        user: data.userName,
        stats: data.stats,
      },
      `✅ Validation passed for ${data.userName}`,
    );
  } else {
    loggers.validation.warn(
      {
        event: "validation_failed",
        errors: data.errors,
        errorCount: data.errors?.length || 0,
      },
      `❌ Validation failed: ${data.errors?.length || 0} errors`,
    );
  }
}

/**
 * Performance timing helper
 */
class PerformanceTimer {
  constructor(operation, logger = loggers.app) {
    this.operation = operation;
    this.logger = logger;
    this.startTime = process.hrtime.bigint();
  }

  end(data = {}) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - this.startTime) / 1000000; // Convert to milliseconds

    this.logger.info(
      {
        event: "performance_timing",
        operation: this.operation,
        duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
        ...data,
      },
      `⏱️  ${this.operation} completed in ${Math.round(duration)}ms`,
    );

    return duration;
  }
}

module.exports = {
  logger,
  loggers,
  createHttpLogger,
  logPdfEvent,
  logApi,
  logValidation,
  PerformanceTimer,
};
