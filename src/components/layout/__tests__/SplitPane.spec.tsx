import { render, screen } from "@testing-library/react";
import { SplitPane } from "../SplitPane";
import type { SplitPaneProps } from "@/interfaces/components/layout";

const defaultProps: SplitPaneProps = {
  leftPanel: <div data-testid="left-content">Left</div>,
  rightPanel: <div data-testid="right-content">Right</div>,
};

function renderSplitPane(overrides: Partial<SplitPaneProps> = {}) {
  return render(<SplitPane {...defaultProps} {...overrides} />);
}

describe("SplitPane rendering", () => {
  beforeEach(() => {
    renderSplitPane();
  });

  it("should render the split pane group container", () => {
    const group = document.querySelector("[data-group]");
    expect(group).toBeInTheDocument();
  });

  it("should render the left panel with its content", () => {
    const leftPane = screen.getByTestId("split-pane-left");
    expect(leftPane).toBeInTheDocument();
    expect(leftPane).toContainElement(screen.getByTestId("left-content"));
  });

  it("should render the right panel with its content", () => {
    const rightPane = screen.getByTestId("split-pane-right");
    expect(rightPane).toBeInTheDocument();
    expect(rightPane).toContainElement(screen.getByTestId("right-content"));
  });

  it("should render the separator between panels", () => {
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("SplitPane with custom children", () => {
  it("should render arbitrary left panel content", () => {
    renderSplitPane({
      leftPanel: <form data-testid="custom-form">Form</form>,
    });

    const leftPane = screen.getByTestId("split-pane-left");
    expect(leftPane).toContainElement(screen.getByTestId("custom-form"));
  });

  it("should render arbitrary right panel content", () => {
    renderSplitPane({
      rightPanel: <section data-testid="custom-preview">Preview</section>,
    });

    const rightPane = screen.getByTestId("split-pane-right");
    expect(rightPane).toContainElement(screen.getByTestId("custom-preview"));
  });
});
