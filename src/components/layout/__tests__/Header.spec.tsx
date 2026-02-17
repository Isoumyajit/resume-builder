import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DOWNLOAD_BUTTON_TEXT, Header, SUBTITLE, TITLE } from "../Header";
import type { HeaderProps } from "@/interfaces/components/layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { signOut as firebaseSignOut } from "firebase/auth";

jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockSignOut = firebaseSignOut as jest.Mock;

function renderHeader(props = {}) {
  const defaultProps = {
    onDownload: jest.fn(),
    canDownload: true,
    isGenerating: false,
  } as HeaderProps;

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <Header {...mergedProps} />
      </ThemeProvider>
    </AuthProvider>,
  );
}

describe("Header Component should be rendered correctly", () => {
  beforeEach(() => {
    renderHeader();
  });
  it("should render the header", () => {
    expect(screen.getByText(TITLE)).toBeInTheDocument();
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument();
  });

  it("should render the download button", () => {
    expect(screen.getByText(DOWNLOAD_BUTTON_TEXT)).toBeInTheDocument();
  });

  it("should render the theme toggle", () => {
    expect(
      screen.getByLabelText(/switch to (dark|light) mode/i),
    ).toBeInTheDocument();
  });
});

describe("Header component should be functioning correctly", () => {
  it("should call the onDownload function when the download button is clicked", async () => {
    const user = userEvent.setup();
    const onDownloadMock = jest.fn();
    renderHeader({ onDownload: onDownloadMock });
    const downloadButton = screen.getByText(DOWNLOAD_BUTTON_TEXT);
    await user.click(downloadButton);
    expect(onDownloadMock).toHaveBeenCalled();
  });

  it("should disable the download button when the canDownload prop is false", () => {
    renderHeader({ canDownload: false });
    const downloadButton = screen.getByText(DOWNLOAD_BUTTON_TEXT);
    expect(downloadButton).toBeDisabled();
  });

  it("should disable the download button when the isGenerating prop is true", () => {
    renderHeader({ isGenerating: true });
    const downloadButton = screen.getByText(DOWNLOAD_BUTTON_TEXT);
    expect(downloadButton).toBeDisabled();
  });
});

describe("Theme Toggle component should be functioning correctly", () => {
  beforeEach(() => {
    renderHeader();
  });
  it("should toggle the theme when the theme toggle is clicked", async () => {
    const user = userEvent.setup();
    const themeToggleSun = screen.getByTestId("theme-toggle-sun");
    const themeToggleMoon = screen.getByTestId("theme-toggle-moon");
    const themeToggle = screen.getByTestId("theme-toggle");
    await user.click(themeToggle);
    expect(themeToggleSun).toBeInTheDocument();
    await user.click(themeToggle);
    expect(themeToggleMoon).toBeInTheDocument();
  });
});

describe("User avatar and sign-out", () => {
  beforeEach(() => {
    mockSignOut.mockClear();
  });

  it("should render the user avatar button", () => {
    renderHeader();
    expect(screen.getByLabelText("User menu")).toBeInTheDocument();
  });

  it("should show initials fallback when no photo URL", () => {
    renderHeader();
    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it("should show user info and sign-out button when avatar is clicked", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByLabelText("User menu"));
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("should call signOut when sign-out button is clicked", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByLabelText("User menu"));
    await user.click(screen.getByText("Sign out"));
    // AuthProvider delegates to firebase/auth signOut with the auth instance
    expect(mockSignOut).toHaveBeenCalledWith({});
  });
});
