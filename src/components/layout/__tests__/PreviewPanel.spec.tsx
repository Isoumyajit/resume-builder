import { render, screen } from "@testing-library/react";
import { PreviewPanel } from "../PreviewPanel";
import type { PreviewPanelProps } from "@/interfaces/components/layout";

jest.mock("@/components/preview", () =>
  jest.requireActual("@/components/preview/__mocks__"),
);

const defaultProps: PreviewPanelProps = {
  pdfUrl: null,
  isLoading: false,
  error: null,
};

function renderPreviewPanel(overrides: Partial<PreviewPanelProps> = {}) {
  return render(<PreviewPanel {...defaultProps} {...overrides} />);
}

describe("PreviewPanel rendering", () => {
  it("should render the PdfPreview component", () => {
    renderPreviewPanel();
    expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
  });

  it("should render the keyboard shortcut hint", () => {
    renderPreviewPanel();
    expect(screen.getByTestId("keyboard-shortcut-hint")).toBeInTheDocument();
  });
});

describe("PreviewPanel passes props to PdfPreview", () => {
  it("should pass pdfUrl to PdfPreview", () => {
    renderPreviewPanel({ pdfUrl: "blob:mock-pdf-url" });
    expect(screen.getByTestId("pdf-preview-url")).toBeInTheDocument();
  });

  it("should pass isLoading to PdfPreview", () => {
    renderPreviewPanel({ isLoading: true });
    expect(screen.getByTestId("pdf-preview-loading")).toBeInTheDocument();
  });

  it("should pass error to PdfPreview", () => {
    renderPreviewPanel({ error: "LaTeX compilation failed" });
    expect(screen.getByTestId("pdf-preview-error")).toBeInTheDocument();
  });
});
