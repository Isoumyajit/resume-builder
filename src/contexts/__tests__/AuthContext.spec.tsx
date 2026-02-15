import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

// Activate manual mocks — implementations live in __mocks__/ directories.
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
const mockCreateUserWithEmailAndPassword =
  createUserWithEmailAndPassword as jest.Mock;
const mockSignInWithPopup = signInWithPopup as jest.Mock;
const mockSignOut = firebaseSignOut as jest.Mock;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;
const mockUpdateProfile = updateProfile as jest.Mock;

/**
 * Test consumer that exposes AuthContext values for assertions.
 */
function TestConsumer({
  onRender,
}: {
  onRender: (ctx: ReturnType<typeof useAuth>) => void;
}) {
  const ctx = useAuth();
  onRender(ctx);
  return (
    <div>
      <span data-testid="loading-state">
        {ctx.loading ? "loading" : "ready"}
      </span>
      <span data-testid="user-state">
        {ctx.user
          ? `user:${(ctx.user as { email?: string }).email}`
          : "no-user"}
      </span>
    </div>
  );
}

function renderWithAuth(onRender: (ctx: ReturnType<typeof useAuth>) => void) {
  return render(
    <AuthProvider>
      <TestConsumer onRender={onRender} />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  it("should provide user from onAuthStateChanged", () => {
    renderWithAuth(() => {});
    // The default mock emits a test user immediately
    expect(screen.getByTestId("user-state")).toHaveTextContent(
      "user:test@example.com",
    );
    expect(screen.getByTestId("loading-state")).toHaveTextContent("ready");
  });

  it("should start in loading state and resolve when onAuthStateChanged fires", () => {
    // Override to not fire immediately
    let fireAuth: ((user: unknown) => void) | null = null;
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: unknown) => void) => {
        fireAuth = cb;
        return jest.fn();
      },
    );

    renderWithAuth(() => {});
    expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");
    expect(screen.getByTestId("user-state")).toHaveTextContent("no-user");

    // Simulate auth state resolving
    act(() => {
      fireAuth!({ email: "resolved@test.com", displayName: "Resolved" });
    });

    expect(screen.getByTestId("loading-state")).toHaveTextContent("ready");
    expect(screen.getByTestId("user-state")).toHaveTextContent(
      "user:resolved@test.com",
    );
  });

  it("should unsubscribe from onAuthStateChanged on unmount", () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: unknown) => void) => {
        cb(null);
        return unsubscribe;
      },
    );

    const { unmount } = renderWithAuth(() => {});
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe("AuthContext methods", () => {
  let capturedCtx: ReturnType<typeof useAuth>;

  beforeEach(() => {
    mockSignInWithEmailAndPassword.mockResolvedValue({});
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "new-uid" },
    });
    mockSignInWithPopup.mockResolvedValue({});
    mockSignOut.mockResolvedValue(undefined);
    mockSendPasswordResetEmail.mockResolvedValue(undefined);
    mockUpdateProfile.mockResolvedValue(undefined);

    renderWithAuth((ctx) => {
      capturedCtx = ctx;
    });
  });

  it("signIn should call signInWithEmailAndPassword", async () => {
    await act(async () => {
      await capturedCtx.signIn("a@b.com", "pass123");
    });
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "a@b.com",
      "pass123",
    );
  });

  it("signUp should call createUserWithEmailAndPassword and updateProfile", async () => {
    await act(async () => {
      await capturedCtx.signUp("a@b.com", "pass123", "Alice");
    });
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "a@b.com",
      "pass123",
    );
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      { uid: "new-uid" },
      { displayName: "Alice" },
    );
  });

  it("signInWithGoogle should call signInWithPopup", async () => {
    await act(async () => {
      await capturedCtx.signInWithGoogle();
    });
    expect(mockSignInWithPopup).toHaveBeenCalledWith({}, {});
  });

  it("signOut should call firebaseSignOut", async () => {
    await act(async () => {
      await capturedCtx.signOut();
    });
    expect(mockSignOut).toHaveBeenCalledWith({});
  });

  it("resetPassword should call sendPasswordResetEmail", async () => {
    await act(async () => {
      await capturedCtx.resetPassword("a@b.com");
    });
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({}, "a@b.com");
  });
});

describe("useAuth outside AuthProvider", () => {
  it("should throw an error when used outside AuthProvider", () => {
    // Suppress console.error for the expected error boundary
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer onRender={() => {}} />);
    }).toThrow("useAuth must be used within an AuthProvider");

    spy.mockRestore();
  });
});
