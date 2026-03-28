import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  DOWNLOAD_BUTTON_TEXT,
  GENERATE_BUTTON_TEXT,
  GENERATING_BUTTON_TEXT,
  Header,
  SUBTITLE,
  TITLE,
} from "../Header";
import type { HeaderProps } from "@/interfaces/components/layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TemplateProvider } from "@/contexts/TemplateContext";
import { signOut as firebaseSignOut } from "firebase/auth";

jest.mock("firebase/auth");
jest.mock("@/config/firebase");

const mockSignOut = firebaseSignOut as jest.Mock;

function renderHeader(props = {}) {
  const defaultProps = {
    onGenerate: jest.fn(),
    onDownload: jest.fn(),
    canDownload: true,
    isGenerating: false,
  } as HeaderProps;

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <MemoryRouter>
      <AuthProvider>
        <TemplateProvider>
          <ThemeProvider defaultTheme="light">
            <Header {...mergedProps} />
          </ThemeProvider>
        </TemplateProvider>
      </AuthProvider>
    </MemoryRouter>,
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

  it("should render the generate button", () => {
    expect(screen.getByText(GENERATE_BUTTON_TEXT)).toBeInTheDocument();
  });

  it("should render the download button", () => {
    expect(screen.getByLabelText(DOWNLOAD_BUTTON_TEXT)).toBeInTheDocument();
  });

  it("should render the theme toggle", () => {
    expect(
      screen.getByLabelText(/switch to (dark|light) mode/i),
    ).toBeInTheDocument();
  });
});

describe("Generate button", () => {
  it("should call onGenerate when clicked", async () => {
    const user = userEvent.setup();
    const onGenerateMock = jest.fn();
    renderHeader({ onGenerate: onGenerateMock });
    await user.click(screen.getByText(GENERATE_BUTTON_TEXT));
    expect(onGenerateMock).toHaveBeenCalled();
  });

  it("should show generating text when isGenerating is true", () => {
    renderHeader({ isGenerating: true });
    expect(screen.getByText(GENERATING_BUTTON_TEXT)).toBeInTheDocument();
  });

  it("should be disabled when isGenerating is true", () => {
    renderHeader({ isGenerating: true });
    expect(screen.getByText(GENERATING_BUTTON_TEXT)).toBeDisabled();
  });
});

describe("Download button", () => {
  it("should call onDownload when clicked", async () => {
    const user = userEvent.setup();
    const onDownloadMock = jest.fn();
    renderHeader({ onGenerate: jest.fn(), onDownload: onDownloadMock });
    await user.click(screen.getByLabelText(DOWNLOAD_BUTTON_TEXT));
    expect(onDownloadMock).toHaveBeenCalled();
  });

  it("should be disabled when canDownload is false", () => {
    renderHeader({ canDownload: false });
    expect(screen.getByLabelText(DOWNLOAD_BUTTON_TEXT)).toBeDisabled();
  });

  it("should be disabled when isGenerating is true", () => {
    renderHeader({ isGenerating: true });
    expect(screen.getByLabelText(DOWNLOAD_BUTTON_TEXT)).toBeDisabled();
  });

  it("should rate-limit rapid clicks", async () => {
    const user = userEvent.setup();
    const onDownloadMock = jest.fn();
    renderHeader({ onGenerate: jest.fn(), onDownload: onDownloadMock });
    const btn = screen.getByLabelText(DOWNLOAD_BUTTON_TEXT);
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);
    expect(onDownloadMock).toHaveBeenCalledTimes(1);
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
