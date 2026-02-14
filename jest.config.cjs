const config = {
  preset: "ts-jest",

  testEnvironment: "jest-environment-jsdom",

  // TypeScript configuration for ts-jest
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },

  // Map the @/* path alias to src/* (matches tsconfig paths)
  moduleNameMapper: {
    // Path alias
    "^@/(.*)$": "<rootDir>/src/$1",

    // Mock CSS/SCSS module imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Test file patterns
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
  ],

  // Files to ignore
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    // Exclude entry points
    "!src/main.tsx",
    "!src/App.tsx",
    // Exclude type declarations
    "!src/**/*.d.ts",
    // Exclude UI component wrappers (thin shadcn wrappers, lower priority)
    "!src/components/ui/**",
    // Exclude test files and mocks
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/setupTests.ts",
    // Exclude files using import.meta (Vite-only, incompatible with ts-jest)
    "!src/config/**",
  ],

  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },

  coverageDirectory: "coverage",

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
};

module.exports = config;
