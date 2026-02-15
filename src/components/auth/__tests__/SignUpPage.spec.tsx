import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SignUpPage } from "../SignUpPage";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

// Activate manual mocks
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

afterEach(cleanup);

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockCreateUser = createUserWithEmailAndPassword as jest.Mock;
const mockSignInWithPopup = signInWithPopup as jest.Mock;
const mockUpdateProfile = updateProfile as jest.Mock;

const VALID_PASSWORD = "Pass1!word";

function renderSignUpPage() {
  mockOnAuthStateChanged.mockImplementation(
    (_auth: unknown, cb: (user: unknown) => void) => {
      cb(null);
      return jest.fn();
    },
  );

  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {},
) {
  const {
    name = "Alice Smith",
    email = "alice@example.com",
    password = VALID_PASSWORD,
    confirmPassword = password,
  } = overrides;

  await user.type(screen.getByLabelText("Full name"), name);
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.type(screen.getByLabelText("Confirm password"), confirmPassword);
}

/** Click the "Create account" submit button. */
async function submitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /create account/i }));
}

describe("SignUpPage rendering", () => {
  beforeEach(() => {
    renderSignUpPage();
  });

  it("should render the page heading", () => {
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("should render all form fields", () => {
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("should render the create account and Google buttons", () => {
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeInTheDocument();
  });

  it("should render a link to sign in", () => {
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});

describe("SignUpPage client-side validation", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    renderSignUpPage();
  });

  /**
   * Fill, submit, and assert that at least one alert contains the
   * expected message. Uses `getAllByRole` because the component may
   * render both a form-level error banner and an inline mismatch hint.
   */
  async function expectValidationError(
    overrides: Parameters<typeof fillForm>[1],
    expectedMessage: string,
  ) {
    await fillForm(user, overrides);
    await submitForm(user);

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(
        alerts.some((el) => el.textContent?.includes(expectedMessage)),
      ).toBe(true);
    });
    expect(mockCreateUser).not.toHaveBeenCalled();
  }

  it("should show error when name is too short", async () => {
    await expectValidationError(
      { name: "A" },
      "Name must be at least 2 characters",
    );
  });

  it.each([
    ["abc", "too short, missing uppercase/number/special"],
    ["pass1!word", "missing uppercase"],
    ["Pass1word", "missing special character"],
  ])("should reject password '%s' (%s)", async (password) => {
    await expectValidationError(
      { password, confirmPassword: password },
      "Password does not meet all requirements",
    );
  });

  it("should show error when passwords do not match", async () => {
    await expectValidationError(
      { password: VALID_PASSWORD, confirmPassword: "Different1!" },
      "Passwords do not match",
    );
  });
});

describe("SignUpPage password requirements", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    renderSignUpPage();
  });

  it("should render a tooltip info icon next to the Password label", () => {
    expect(
      screen.getByLabelText("Password requirements info"),
    ).toBeInTheDocument();
  });

  it("should show inline checklist when user starts typing", async () => {
    expect(
      screen.queryByRole("list", { name: "Password requirements" }),
    ).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Password"), "a");

    expect(
      screen.getByRole("list", { name: "Password requirements" }),
    ).toBeInTheDocument();
    expect(screen.getByText("At least 6 characters")).toBeInTheDocument();
    expect(screen.getByText("One uppercase letter (A-Z)")).toBeInTheDocument();
    expect(screen.getByText("One lowercase letter (a-z)")).toBeInTheDocument();
    expect(screen.getByText("One number (0-9)")).toBeInTheDocument();
    expect(
      screen.getByText("One special character (!@#$%...)"),
    ).toBeInTheDocument();
  });

  it("should show met/unmet indicators for a partial password", async () => {
    await user.type(screen.getByLabelText("Password"), "Pa");

    const requirementsList = await screen.findByRole("list", {
      name: "Password requirements",
    });
    const items = requirementsList.querySelectorAll("li");

    const met = Array.from(items).filter((li) =>
      li.className.includes("text-green-600"),
    );
    const unmet = Array.from(items).filter(
      (li) => !li.className.includes("text-green-600"),
    );

    expect(met.length).toBeGreaterThan(0);
    expect(unmet.length).toBeGreaterThan(0);
  });

  it("should hide the checklist once all requirements are satisfied", async () => {
    await user.type(screen.getByLabelText("Password"), VALID_PASSWORD);

    expect(
      screen.queryByRole("list", { name: "Password requirements" }),
    ).not.toBeInTheDocument();
  });
});

describe("SignUpPage email/password sign-up", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    renderSignUpPage();
  });

  it("should call createUserWithEmailAndPassword and updateProfile on valid submit", async () => {
    mockCreateUser.mockResolvedValue({ user: { uid: "new-uid" } });
    mockUpdateProfile.mockResolvedValue(undefined);

    await fillForm(user);
    await submitForm(user);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        {},
        "alice@example.com",
        VALID_PASSWORD,
      );
    });
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      { uid: "new-uid" },
      { displayName: "Alice Smith" },
    );
  });

  it("should display an error when sign-up fails with duplicate email", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/email-already-in-use" });

    await fillForm(user);
    await submitForm(user);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "An account with this email already exists",
      );
    });
  });
});

describe("SignUpPage Google sign-up", () => {
  it("should call signInWithPopup when Google button is clicked", async () => {
    mockSignInWithPopup.mockResolvedValue({});
    const user = userEvent.setup();
    renderSignUpPage();

    await user.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledWith({}, {});
    });
  });
});

describe("SignUpPage password visibility toggles", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    renderSignUpPage();
  });

  it("should toggle password field visibility", async () => {
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getAllByLabelText("Show password")[0]);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("should toggle confirm password field visibility", async () => {
    const confirmInput = screen.getByLabelText("Confirm password");
    expect(confirmInput).toHaveAttribute("type", "password");

    await user.click(screen.getAllByLabelText("Show password")[1]);
    expect(confirmInput).toHaveAttribute("type", "text");
  });
});
