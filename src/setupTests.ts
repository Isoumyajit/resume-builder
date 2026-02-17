/* eslint-disable @typescript-eslint/no-explicit-any */

// Import jest-dom matchers (toBeInTheDocument, toHaveClass, etc.)
import "@testing-library/jest-dom";

// ---------------------------------------------------------------------------
// Polyfill: TextEncoder / TextDecoder
// ---------------------------------------------------------------------------
// react-router-dom v7 uses TextEncoder internally. jsdom does not provide it.
import { TextEncoder, TextDecoder } from "util";

if (typeof globalThis.TextEncoder === "undefined") {
  (globalThis as any).TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  (globalThis as any).TextDecoder = TextDecoder;
}

// ---------------------------------------------------------------------------
// Mock: localStorage
// ---------------------------------------------------------------------------
// ThemeContext reads/writes localStorage. Provide a working in-memory mock.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// ---------------------------------------------------------------------------
// Mock: matchMedia
// ---------------------------------------------------------------------------
// ThemeContext uses window.matchMedia("(prefers-color-scheme: dark)")
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false, // default: light mode
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ---------------------------------------------------------------------------
// Mock: import.meta.env
// ---------------------------------------------------------------------------
// Vite's import.meta.env is not available in Jest. Provide sensible defaults
// so modules like src/config/api.ts can be imported without errors.
//
// ts-jest doesn't support import.meta natively, so we define a global mock
// that individual test files can override via jest.mock() if needed.
(globalThis as any).importMetaEnv = {
  VITE_API_URL: "http://localhost:3001",
  VITE_API_VERSION: "v1",
  MODE: "test",
  DEV: true,
  PROD: false,
};

// ---------------------------------------------------------------------------
// Mock: URL.createObjectURL / URL.revokeObjectURL
// ---------------------------------------------------------------------------
// Used by usePdfGeneration hook to create download URLs from blobs.
if (typeof URL.createObjectURL === "undefined") {
  URL.createObjectURL = () => "blob:mock-url";
}
if (typeof URL.revokeObjectURL === "undefined") {
  URL.revokeObjectURL = () => {};
}

// ---------------------------------------------------------------------------
// Mock: ResizeObserver
// ---------------------------------------------------------------------------
// Many UI components (especially Radix-based ones) use ResizeObserver.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock as any;
