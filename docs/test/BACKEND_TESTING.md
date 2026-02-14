# Backend Testing Architecture

## Overview

Unit and integration testing for the Resume Builder Express backend using **Jest** and **supertest**. Tests cover models (validation, data transformation), middleware, route handlers, template generators, utilities, and configuration — while skipping Puppeteer PDF generation and Gemini AI services.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Jest | Test runner and assertion library |
| supertest | HTTP integration testing for Express routes |

> The backend is plain JavaScript (CommonJS), so no TypeScript transformer is needed.

---

## Configuration Files

### `server/jest.config.cjs`

Root-level Jest configuration (CommonJS — avoids ESM issues with Jest config loading).

- **Environment**: `node` (not jsdom — this is a server)
- **Test match**: `src/**/__tests__/**/*.test.js`
- **Setup file**: `src/setupTests.js`
- **Coverage directory**: `coverage/` (matches CI artifact upload path)

### `server/src/setupTests.js`

Global test setup:

- Sets `NODE_ENV=test`
- Silences `console.log` / `console.info` during tests (config validation logs)
- Mocks the Pino logger module globally (loggers are used throughout but should not output during tests)

### `server/package.json` Script

```json
"test": "jest"
```

This makes the CI command `npm test -- --coverage --watchAll=false` work correctly.

---

## Test Directory Structure

```
server/src/
├── models/
│   └── __tests__/
│       ├── PersonalInfo.test.js
│       ├── Experience.test.js
│       ├── Education.test.js
│       ├── Project.test.js
│       ├── Skills.test.js
│       ├── Achievement.test.js
│       ├── ProfileLinks.test.js
│       └── ResumeData.test.js
│
├── services/
│   ├── utils/
│   │   └── __tests__/
│   │       └── escapeHtml.test.js
│   ├── templates/
│   │   └── __tests__/
│   │       ├── headerCreator.test.js
│   │       ├── experienceCreator.test.js
│   │       ├── educationCreator.test.js
│   │       ├── projectsCreator.test.js
│   │       ├── skillsCreator.test.js
│   │       ├── achievementsCreator.test.js
│   │       ├── profileLinksCreator.test.js
│   │       └── sectionSeparator.test.js
│   ├── styles/
│   │   └── __tests__/
│   │       └── index.test.js
│   └── __tests__/
│       └── htmlTemplateGenerator.test.js
│
├── config/
│   └── __tests__/
│       └── api.test.js
│
├── middleware/
│   └── __tests__/
│       ├── validation.test.js
│       └── index.test.js
│
└── routes/
    └── __tests__/
        ├── health.test.js
        ├── resume.test.js
        └── index.test.js
```

---

## Test Layers

Testing is organized in 5 layers, ordered by dependency and value. Each layer is independently useful.

```
┌─────────────────────────────────────────────────┐
│  Layer 5: Integration Tests (Routes + supertest) │
├─────────────────────────────────────────────────┤
│  Layer 4: Middleware Tests                       │
├─────────────────────────────────────────────────┤
│  Layer 3: Config Tests                           │
├─────────────────────────────────────────────────┤
│  Layer 2: Service Tests (Templates, Styles, Utils)│
├─────────────────────────────────────────────────┤
│  Layer 1: Model Unit Tests (highest value)       │
└─────────────────────────────────────────────────┘
```

---

## Layer 1 — Model Unit Tests

The richest test targets. Each model has `validate()`, `toJSON()`, `isComplete()`, helper methods, and edge cases.

### `PersonalInfo.js` (~20 tests)

| Test Area | What to Test |
|-----------|-------------|
| Constructor | Default values, data assignment, LinkedIn handling (null vs object) |
| `validate()` | Required fields (name, location, phone, email), email format, optional LinkedIn URL |
| `isComplete()` | True when all required fields present with valid email |
| `getDisplayName()` | Returns name or `"Unknown"` |
| `getFormattedContact()` | LaTeX escaping applied to all fields |
| `escapeLatex()` | Special chars: `$`, `&`, `%`, `#`, `^`, `_`, `~`, `\`, `{}`, `"` |
| `isValidEmail()` | Valid/invalid email formats |
| `isValidUrl()` | Valid/invalid URLs |
| `toJSON()` | Returns plain object with all fields |
| `fromRequest()` | Static factory, throws on invalid input |

### `Experience.js` (~25 tests)

| Test Area | What to Test |
|-----------|-------------|
| Constructor | Default values, bullets array handling |
| `validate()` | Required fields, date-in-future, currently-working/endDate consistency, date range, bullets required |
| `parseDate()` | `"Present"` → today, `"Jan 2022"` → Date, `"2022"` → Jan 1 of year, invalid → null, empty → null |
| `isDateInFuture()` | Past date, today, future date, `"Present"` always false |
| `getDuration()` | Years/months calculation, unknown when dates invalid |
| `getFormattedForLatex()` | LaTeX escaping, empty bullet filtering |
| `isComplete()` | True when all required fields + at least one bullet |
| `toJSON()` | Filters empty bullets |
| `escapeLatex()` | All special characters |

### `Education.js` (~15 tests)

| Test Area | What to Test |
|-----------|-------------|
| `validate()` | Required fields, year-in-future, year range ordering |
| `getDuration()` | Year difference, edge cases |
| `parseDate()` | Year-only format, month-year format |
| `isYearInFuture()` | Current year vs future year |

### `Skills.js` (~15 tests)

| Test Area | What to Test |
|-----------|-------------|
| `validate()` | Min 2 chars if provided, empty is valid |
| `hasAnySkills()` | True when any category has content |
| `getPopulatedCategories()` | Returns only non-empty categories with parsed arrays |
| `parseSkillsString()` | Comma splitting, semicolon splitting, trimming, empty handling |
| `getTotalSkillsCount()` | Sum across categories |
| `getSummary()` | Correct boolean flags and counts |
| `toJSON()` | Only includes non-empty fields |

### `Achievement.js` (~10 tests)

| Test Area | What to Test |
|-----------|-------------|
| `validate()` | Required bullet, max 100 chars without spaces |
| `getCharCountWithoutSpaces()` | Correct count excluding whitespace |
| `escapeHtml()` | Static method: `&`, `<`, `>`, `"`, `'`, null/empty handling |

### `ProfileLinks.js` (~8 tests)

| Test Area | What to Test |
|-----------|-------------|
| `validate()` | Optional URLs, invalid URL format |
| `hasAnyLinks()` | True when any link provided |
| `toJSON()` | Returns all link fields |

### `Project.js` (~8 tests)

| Test Area | What to Test |
|-----------|-------------|
| `validate()` | Required name/techStack/description, optional URL validation |
| `isComplete()` | True when required fields present |
| `toJSON()` | Returns plain object |

### `ResumeData.js` (~20 tests)

| Test Area | What to Test |
|-----------|-------------|
| Constructor | Composes all sub-models, handles empty/missing data |
| `transformedAchievements()` | Splits comma-separated bullets into separate Achievement instances |
| `validate()` | Aggregates errors from all sub-models with correct prefixes |
| `hasMinimumContent()` | PersonalInfo complete + at least one section (experience/education/projects) |
| `getStats()` | Correct counts, booleans, totalBullets calculation |
| `getFileName()` | Sanitizes name: lowercase, remove special chars, spaces → underscores, max 50 chars |
| `toJSON()` | Returns composed plain object with metadata |
| `validateRequest()` | Static: returns `{ isValid, errors, data }`, handles invalid input |
| `fromRequest()` | Static: throws on null/non-object input |

---

## Layer 2 — Service Unit Tests

### `escapeHtml.js` (~8 tests)

| Input | Expected Output |
|-------|----------------|
| `"<script>"` | `"&lt;script&gt;"` |
| `'He said "hello"'` | `"He said &quot;hello&quot;"` |
| `"Tom & Jerry"` | `"Tom &amp; Jerry"` |
| `"it's"` | `"it&#39;s"` |
| `null` / `undefined` / `""` | `""` |
| `"plain text"` | `"plain text"` (unchanged) |

### Template Creators (each ~5-8 tests)

All template creators receive model data and return HTML strings.

| Creator | Key Tests |
|---------|-----------|
| `headerCreator.js` | Name with emphasized initials, contact info with icons, conditional LinkedIn, empty name handling |
| `experienceCreator.js` | Renders company/title/dates, tech stack, bullets list, empty array returns empty string |
| `educationCreator.js` | Renders institution/degree/location/years, empty array handling |
| `projectsCreator.js` | Renders name with URL link, tech stack, description |
| `skillsCreator.js` | Renders categories, only populated categories shown |
| `achievementsCreator.js` | Renders bullet list, HTML escaping applied |
| `profileLinksCreator.js` | Renders GitHub/LeetCode/Portfolio links, skips empty |
| `sectionSeparator.js` | Wraps content with section title and icon |

### `htmlTemplateGenerator.js` (~5 tests)

- Generates complete `<!DOCTYPE html>` document
- Includes `<style>` block with all styles
- Includes all section generators
- Handles empty/missing sections gracefully
- Title uses escaped personal info name

### `styles/index.js` (~3 tests)

- `getAllStyles()` returns non-empty CSS string
- Contains expected style blocks (base, header, section, etc.)

---

## Layer 3 — Config Tests

### `config/api.js` (~8 tests)

| Test Area | What to Test |
|-----------|-------------|
| `API_CONFIG` | Default values: VERSION `"v1"`, PORT `3001`, NODE_ENV `"development"` |
| `API_CONFIG.CORS` | Default origin `"http://localhost:5173"` |
| `API_CONFIG.RATE_LIMIT` | Default window and max values |
| `API_ENDPOINTS` | Correct path construction from `BASE_PATH` |
| `VERSION_INFO` | Contains API_VERSION, supported versions array |
| `validateConfig()` | Runs without throwing |

---

## Layer 4 — Middleware Tests

### `validation.js` (~12 tests)

Uses mock `req`, `res`, `next` objects.

| Middleware | Test Cases |
|-----------|------------|
| `validateResumeData()` | Valid data: calls `next()`, attaches `req.resumeData` |
| | Invalid data: returns 400 with validation errors |
| | Empty/null body: returns 400 "Invalid request body" |
| | Throws during validation: returns 400 with error message |
| `validateRequestStructure()` | Wrong Content-Type: returns 400 |
| | Oversized body (>1MB): returns 413 |
| | Valid request: calls `next()` |
| `handleValidationError()` | `ValidationError`: returns 400 |
| | Other errors: calls `next(error)` |

### `middleware/index.js` (~4 tests)

- `setupBasicMiddleware()`: Configures CORS, body parsing, HTTP logging on app
- `setupErrorHandling()`: Adds 404 handler and global error handler

---

## Layer 5 — Integration Tests (Routes with supertest)

Route tests use `supertest` against the Express app. The `pdfGenerator` is mocked to avoid Puppeteer dependency.

### `health.test.js` (~6 tests)

```js
const request = require("supertest");
const { createApp } = require("../../app");
const app = createApp();
```

| Endpoint | Test Cases |
|----------|------------|
| `GET /api/v1/health` | Returns 200 with `status: "healthy"`, uptime, memory, version |
| `GET /api/v1/health/detailed` | Returns health checks object with server/latex/filesystem/memory |

### `resume.test.js` (~8 tests)

```js
jest.mock("../../services/pdfGenerator", () => ({
  generateResumePdf: jest.fn().mockResolvedValue(Buffer.from("fake-pdf")),
}));
```

| Endpoint | Test Cases |
|----------|------------|
| `POST /api/v1/generate-pdf` (valid) | Returns 200 with PDF headers, `Content-Type: application/pdf` |
| `POST /api/v1/generate-pdf` (invalid) | Returns 400 with validation errors |
| `POST /api/v1/generate-pdf` (insufficient) | Returns 400 "Insufficient content" |
| `POST /api/v1/generate-pdf` (service error) | Returns 500 with error message |

### `routes/index.test.js` (~4 tests)

| Endpoint | Test Cases |
|----------|------------|
| `GET /` | Returns server info with name, version, status |
| `GET /api` | Returns API documentation with all endpoint URLs |

---

## Skipped Services

The following services are **intentionally excluded** from testing:

| Service | Reason |
|---------|--------|
| `services/pdfGenerator.js` | Requires Puppeteer/Chromium — mocked in route tests |
| `services/ai/text-generation.js` | Requires Gemini API key — external dependency |

These can be added later as integration tests with proper CI infrastructure (Chromium in Docker, API key secrets).

---

## Coverage Configuration

### Thresholds

| Metric | Target |
|--------|--------|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

> Higher than frontend because the backend is pure logic with no UI complexity.

### Collection Scope

Coverage is collected from `server/src/**/*.js` **excluding**:

- `src/index.js` — Server startup / entry point
- `src/services/pdfGenerator.js` — Puppeteer (skipped)
- `src/services/ai/**` — Gemini AI (skipped)
- `src/config/logger.js` — Logging infrastructure
- `src/**/__tests__/**` — Test files

---

## Mocking Strategy

### Global Mocks (in `setupTests.js`)

| Mock | Reason |
|------|--------|
| `console.log` / `console.info` | Silence config validation output during tests |
| `config/logger` | All Pino loggers return no-op functions |

### Per-Test Mocks

| Pattern | Usage |
|---------|-------|
| `jest.mock("../services/pdfGenerator")` | Route tests — returns fake `Buffer` |
| `jest.mock("child_process")` | Health route — mock `exec` for LaTeX check |
| `jest.mock("fs")` | Health route — mock filesystem access check |
| Mock `req` / `res` / `next` | Middleware unit tests |

### Mock `req` / `res` / `next` Pattern

```js
function createMockReq(overrides = {}) {
  return {
    body: {},
    headers: { "content-type": "application/json" },
    is: jest.fn((type) => type === "application/json"),
    ...overrides,
  };
}

function createMockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    send: jest.fn(),
  };
  return res;
}

const mockNext = jest.fn();
```

---

## CI Integration

The GitHub Actions workflow (`.github/workflows/rb_unit-tests.yml`) runs in the `server/` working directory:

```bash
npm test -- --coverage --watchAll=false
```

- `NODE_ENV=test` is set in the CI environment
- Coverage artifacts are uploaded from `server/coverage/` with 7-day retention
- Both frontend and backend tests must pass before deployment

---

## Test Data Fixtures

### Valid Resume Data (reusable across tests)

```js
const validResumeData = {
  personalInfo: {
    name: "John Doe",
    location: "San Francisco, CA",
    phone: "+1-555-0123",
    email: "john@example.com",
    linkedin: {
      url: "https://linkedin.com/in/johndoe",
      displayText: "johndoe",
    },
  },
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      title: "Senior Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      techStack: "React, Node.js",
      currentlyWorking: true,
      bullets: ["Led team of 5 engineers", "Improved performance by 40%"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "MIT",
      degree: "B.S. Computer Science",
      location: "Cambridge, MA",
      startYear: "2016",
      endYear: "2020",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Resume Builder",
      url: "https://github.com/johndoe/resume-builder",
      techStack: "React, Express, Puppeteer",
      description: "A web app to build professional resumes",
    },
  ],
  profileLinks: {
    github: "https://github.com/johndoe",
    leetcode: "https://leetcode.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
  skills: {
    languages: "JavaScript, TypeScript, Python",
    technologies: "React, Node.js, Docker",
    other: "Agile, CI/CD",
  },
  achievements: [
    { id: "ach-1", bullet: "Won company hackathon 2023" },
  ],
};
```

---

## Running Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in CI mode
npm test -- --coverage --watchAll=false

# Run a specific test file
npx jest src/models/__tests__/Experience.test.js

# Run tests matching a pattern
npx jest --testPathPattern="models"

# Run with verbose output
npx jest --verbose
```

---

## Implementation Order

| Step | Layer | Files | Estimated Tests |
|------|-------|-------|-----------------|
| 1 | Setup | `jest.config.cjs`, `setupTests.js`, `package.json` | — |
| 2 | Models (simple) | Achievement, Education, PersonalInfo, ProfileLinks, Skills, Project | ~70 |
| 3 | Models (complex) | Experience, ResumeData | ~45 |
| 4 | Services | escapeHtml, template creators, styles, htmlTemplateGenerator | ~55 |
| 5 | Config | api.js | ~8 |
| 6 | Middleware | validation.js, middleware/index.js | ~16 |
| 7 | Routes | health, resume, routes/index | ~18 |
| **Total** | | | **~212 tests** |
