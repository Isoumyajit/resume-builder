/**
 * Validation middleware for resume data using data models
 */

const { ResumeData } = require("../models");
const { logValidation, loggers } = require("../config/logger");

/**
 * Middleware to validate resume data using ResumeData model
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
function validateResumeData(req, res, next) {
  const { body } = req;

  if (!body || typeof body !== "object") {
    return res.status(400).json({
      error: "Invalid request body",
      message: "Request body must be a valid JSON object",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Use ResumeData model for comprehensive validation
    const validation = ResumeData.validateRequest(body);

    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Resume data validation failed",
        details: validation.errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Attach validated resume data to request for use in route handlers
    req.resumeData = validation.data;

    // Log validation success
    logValidation(true, {
      userName: validation.data.personalInfo.name,
      stats: validation.data.getStats(),
    });

    next();
  } catch (error) {
    loggers.validation.error(
      {
        error: error.message,
        stack: error.stack,
      },
      `❌ Validation error: ${error.message}`,
    );

    return res.status(400).json({
      error: "Validation error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware to validate request body size and structure
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
function validateRequestStructure(req, res, next) {
  // Check Content-Type
  if (!req.is("application/json")) {
    return res.status(400).json({
      error: "Invalid Content-Type",
      message: "Request must have Content-Type: application/json",
      timestamp: new Date().toISOString(),
    });
  }

  const bodyString = JSON.stringify(req.body || {});
  if (bodyString.length > 1024 * 1024) {
    // 1MB limit
    return res.status(413).json({
      error: "Request too large",
      message: "Request body exceeds 1MB limit",
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

/**
 * Generic validation error handler
 * @param {Error} error Validation error
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next function
 */
function handleValidationError(error, req, res, next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      message: error.message,
      details: error.details || [],
      timestamp: new Date().toISOString(),
    });
  }

  next(error);
}

module.exports = {
  validateResumeData,
  validateRequestStructure,
  handleValidationError,
};
