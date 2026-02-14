/**
 * Jest Configuration for Resume Builder Server
 * @type {import('jest').Config}
 */
module.exports = {
  testEnvironment: "node",

  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.js"],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  clearMocks: true,
  restoreMocks: true,

  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
    "!src/services/pdfGenerator.js",
    "!src/services/ai/**",
    "!src/config/logger.js",
    "!src/**/__tests__/**",
  ],
};
