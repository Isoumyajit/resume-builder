/**
 * Manual mock for @/config/firebase
 *
 * Provides lightweight stubs for the Firebase app, auth, and Firestore
 * instances so that modules importing from @/config/firebase can be
 * tested without initialising a real Firebase app.
 *
 * Usage: jest.mock("@/config/firebase");
 */
export const auth = {};
export const googleProvider = {};
export const db = {};
export default {};
