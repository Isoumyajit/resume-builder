/**
 * Manual mock for firebase/auth
 *
 * Stubs every Firebase Auth export used by the app so that tests
 * can run without a real Firebase project. `onAuthStateChanged`
 * immediately emits a test user by default — individual tests can
 * override this via jest.mock() factory if they need a different
 * auth state (e.g. signed-out).
 *
 * Because this is a root-level __mocks__ file for a node_module,
 * Jest auto-uses it whenever a test calls jest.mock("firebase/auth").
 */

const testUser = {
  displayName: "Test User",
  email: "test@example.com",
  photoURL: null,
  uid: "test-uid",
};

export const getAuth = jest.fn(() => ({}));

export const GoogleAuthProvider = jest.fn();

export const onAuthStateChanged = jest.fn(
  (_auth: unknown, cb: (user: unknown) => void) => {
    // Immediately emit the test user so AuthProvider resolves loading state
    cb(testUser);
    // Return unsubscribe function
    return jest.fn();
  },
);

export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithPopup = jest.fn();
export const signOut = jest.fn().mockResolvedValue(undefined);
export const sendPasswordResetEmail = jest.fn();
export const updateProfile = jest.fn();
