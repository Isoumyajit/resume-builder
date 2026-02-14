import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

function renderFooter() {
  return render(<Footer />);
}

describe("Footer Component should be rendered correctly", () => {
  beforeEach(() => {
    renderFooter();
  });
  it("should render the footer", () => {
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
  it("should render the copyright text", () => {
    expect(screen.getByTestId("footer-content").textContent).toContain(
      `${new Date().getFullYear()} Resume Builder. All rights reserved.`,
    );
  });
  it("should render the github logo", () => {
    expect(screen.getByTestId("github-link")).toBeInTheDocument();
  });
});
