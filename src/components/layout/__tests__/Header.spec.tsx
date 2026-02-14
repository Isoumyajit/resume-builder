import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DOWNLOAD_BUTTON_TEXT, Header, SUBTITLE, TITLE } from "../Header";
import type { HeaderProps } from "@/interfaces/components/layout";
import { ThemeProvider } from "@/contexts/ThemeContext";

function renderHeader(props = {}) {
  const defaultProps = {
    onDownload: jest.fn(),
    canDownload: true,
    isGenerating: false,
  } as HeaderProps;

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <ThemeProvider defaultTheme="light">
      <Header {...mergedProps} />
    </ThemeProvider>,
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
