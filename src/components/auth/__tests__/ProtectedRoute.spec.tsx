import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "../ProtectedRoute";
import { onAuthStateChanged } from "firebase/auth";

// Activate manual mocks
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("should render protected content when user is authenticated", () => {
    // Default mock emits a test user
    renderProtectedRoute();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to /login when user is not authenticated", () => {
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: unknown) => void) => {
        cb(null);
        return jest.fn();
      },
    );

    renderProtectedRoute();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should show a loading spinner while auth state is being determined", () => {
    mockOnAuthStateChanged.mockImplementationOnce(() => {
      // Never fire the callback — stays in loading state
      return jest.fn();
    });

    renderProtectedRoute();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    // Loader2 renders an svg with the animate-spin class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
