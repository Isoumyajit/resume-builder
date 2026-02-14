/**
 * Jest Setup File
 * Runs before each test suite to configure the test environment
 */

// Ensure test environment
process.env.NODE_ENV = "test";

// Silence console output during tests (config/api.js validateConfig() logs)
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

// Global mock for the logger module — prevents Pino from running during tests
jest.mock("./config/logger", () => {
  const noop = jest.fn();
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    child: jest.fn().mockReturnThis(),
  };

  const createComponentLogger = () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    child: jest.fn().mockReturnThis(),
  });

  return {
    logger: mockLogger,
    loggers: {
      app: createComponentLogger(),
      api: createComponentLogger(),
      pdf: createComponentLogger(),
      validation: createComponentLogger(),
      health: createComponentLogger(),
      latex: createComponentLogger(),
      db: createComponentLogger(),
    },
    createHttpLogger: jest.fn(() => (req, res, next) => next()),
    logPdfEvent: jest.fn(),
    logApi: jest.fn(),
    logValidation: jest.fn(),
    PerformanceTimer: jest.fn().mockImplementation(() => ({
      end: jest.fn().mockReturnValue(0),
    })),
  };
});
