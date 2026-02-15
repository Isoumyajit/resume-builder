import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestRoute } from "../GuestRoute";
import { onAuthStateChanged } from "firebase/auth";

// Activate manual mocks
jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

function renderGuestRoute() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("GuestRoute", () => {
  it("should render guest content when user is not authenticated", () => {
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, cb: (user: unknown) => void) => {
        cb(null);
        return jest.fn();
      },
    );

    renderGuestRoute();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should redirect to / when user is authenticated", () => {
    // Default mock emits a test user
    renderGuestRoute();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("should show a loading spinner while auth state is being determined", () => {
    mockOnAuthStateChanged.mockImplementationOnce(() => {
      // Never fire the callback — stays in loading state
      return jest.fn();
    });

    renderGuestRoute();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
