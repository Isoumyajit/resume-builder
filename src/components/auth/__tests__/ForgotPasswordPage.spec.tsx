import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ForgotPasswordPage } from "../ForgotPasswordPage";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

// Activate manual mocks
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;

/**
 * Render ForgotPasswordPage with no authenticated user.
 */
function renderForgotPasswordPage() {
  mockOnAuthStateChanged.mockImplementation(
    (_auth: unknown, cb: (user: unknown) => void) => {
      cb(null);
      return jest.fn();
    },
  );

  return render(
    <MemoryRouter initialEntries={["/forgot-password"]}>
      <AuthProvider>
        <ForgotPasswordPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ForgotPasswordPage rendering", () => {
  beforeEach(() => {
    renderForgotPasswordPage();
  });

  it("should render the page heading", () => {
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
  });

  it("should render the email field", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it("should render a back to sign in link", () => {
    expect(screen.getByText("Back to sign in")).toBeInTheDocument();
  });
});

describe("ForgotPasswordPage success flow", () => {
  it("should show success message after sending reset email", async () => {
    mockSendPasswordResetEmail.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderForgotPasswordPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      {},
      "test@example.com",
    );
  });

  it("should allow sending another link after success", async () => {
    mockSendPasswordResetEmail.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderForgotPasswordPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /send another link/i }),
    );

    // Should be back to the form
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });
});

describe("ForgotPasswordPage error handling", () => {
  it("should display error for invalid email", async () => {
    mockSendPasswordResetEmail.mockRejectedValue({
      code: "auth/invalid-email",
    });
    const user = userEvent.setup();
    renderForgotPasswordPage();

    await user.type(screen.getByLabelText("Email"), "bad@email.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter a valid email address",
      );
    });
  });

  it("should display error for too many requests", async () => {
    mockSendPasswordResetEmail.mockRejectedValue({
      code: "auth/too-many-requests",
    });
    const user = userEvent.setup();
    renderForgotPasswordPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Too many attempts");
    });
  });

  it("should display error for network failure", async () => {
    mockSendPasswordResetEmail.mockRejectedValue({
      code: "auth/network-request-failed",
    });
    const user = userEvent.setup();
    renderForgotPasswordPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    });
  });
});
