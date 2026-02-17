import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginPage } from "../LoginPage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Activate manual mocks
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.Mock;
const mockSignInWithPopup = signInWithPopup as jest.Mock;

/**
 * Render LoginPage with no authenticated user.
 */
function renderLoginPage() {
  // Emit null user so the page renders its form
  mockOnAuthStateChanged.mockImplementation(
    (_auth: unknown, cb: (user: unknown) => void) => {
      cb(null);
      return jest.fn();
    },
  );

  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("LoginPage rendering", () => {
  beforeEach(() => {
    renderLoginPage();
  });

  it("should render the page heading", () => {
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("should render the email and password fields", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("should render the sign-in button", () => {
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should render the Google sign-in button", () => {
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeInTheDocument();
  });

  it("should render links to sign-up and forgot-password", () => {
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });
});

describe("LoginPage email/password sign-in", () => {
  it("should call signIn with email and password on form submit", async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({});
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password123",
      );
    });
  });

  it("should display an error message when sign-in fails", async () => {
    mockSignInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
    });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("Email"), "bad@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password",
      );
    });
  });
});

describe("LoginPage Google sign-in", () => {
  it("should call signInWithPopup when Google button is clicked", async () => {
    mockSignInWithPopup.mockResolvedValue({});
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledWith({}, {});
    });
  });

  it("should display an error when Google sign-in is cancelled", async () => {
    mockSignInWithPopup.mockRejectedValue({
      code: "auth/popup-closed-by-user",
    });
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Sign-in popup was closed",
      );
    });
  });
});

describe("LoginPage password visibility toggle", () => {
  it("should toggle password visibility when eye icon is clicked", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByLabelText("Show password"));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText("Hide password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
