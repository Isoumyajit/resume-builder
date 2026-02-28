import { render, screen } from "@testing-library/react";
import { ResumeBuilderLayout } from "../ResumeBuilderLayout";
import type { ResumeBuilderLayoutProps } from "@/interfaces/components/layout";

// Mock all child components — uses __mocks__/ files adjacent to each module.
jest.mock("../Header");
jest.mock("../SplitPane");
jest.mock("../ResumeFormPanel");
jest.mock("../PreviewPanel");

function createMockState(
  overrides: {
    pdfUrl?: string | null;
    isLoading?: boolean;
    error?: string | null;
  } = {},
): ResumeBuilderLayoutProps["state"] {
  return {
    form: {
      instance: {} as never,
      experienceArray: {} as never,
      educationArray: {} as never,
      projectsArray: {} as never,
      achievementsArray: {} as never,
      sectionOrder: [
        "experience",
        "education",
        "projects",
        "profileLinks",
        "skills",
        "achievements",
      ],
      handlers: {
        addExperience: jest.fn(),
        addEducation: jest.fn(),
        addProject: jest.fn(),
        addAchievement: jest.fn(),
        addBullet: jest.fn(),
        removeBullet: jest.fn(),
        toggleCurrentlyWorking: jest.fn(),
        reorderSections: jest.fn(),
      },
    },
    pdf: {
      url: overrides.pdfUrl ?? null,
      isLoading: overrides.isLoading ?? false,
      error: overrides.error ?? null,
    },
    actions: {
      generatePdf: jest.fn(),
      downloadPdf: jest.fn(),
    },
  };
}
describe("ResumeBuilderLayout rendering", () => {
  beforeEach(() => {
    render(<ResumeBuilderLayout state={createMockState()} />);
  });

  it("should render all layout sections", () => {
    expect(screen.getByTestId("resume-builder-layout")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("split-pane")).toBeInTheDocument();
    expect(screen.getByTestId("resume-form-panel")).toBeInTheDocument();
    expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
  });

  it("should render ResumeFormPanel inside the left split pane", () => {
    const leftPane = screen.getByTestId("split-pane-left");
    expect(leftPane).toContainElement(screen.getByTestId("resume-form-panel"));
  });

  it("should render PreviewPanel inside the right split pane", () => {
    const rightPane = screen.getByTestId("split-pane-right");
    expect(rightPane).toContainElement(screen.getByTestId("preview-panel"));
  });

  it("should pass canDownload=false to Header when pdf url is null", () => {
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-can-download",
      "false",
    );
  });
});

describe("ResumeBuilderLayout props wiring", () => {
  it("should pass canDownload=true to Header when pdf url exists", () => {
    render(
      <ResumeBuilderLayout
        state={createMockState({ pdfUrl: "blob:some-url" })}
      />,
    );

    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-can-download",
      "true",
    );
  });

  it("should pass pdf state to PreviewPanel", () => {
    render(
      <ResumeBuilderLayout
        state={createMockState({
          pdfUrl: "blob:mock-url",
          isLoading: false,
          error: null,
        })}
      />,
    );

    const preview = screen.getByTestId("preview-panel");
    expect(preview).toHaveAttribute("data-pdf-url", "blob:mock-url");
    expect(preview).toHaveAttribute("data-is-loading", "false");
    expect(preview).toHaveAttribute("data-error", "null");
  });

  describe("when isLoading is true", () => {
    beforeEach(() => {
      render(
        <ResumeBuilderLayout state={createMockState({ isLoading: true })} />,
      );
    });

    it("should pass isGenerating to Header", () => {
      expect(screen.getByTestId("header")).toHaveAttribute(
        "data-is-generating",
        "true",
      );
    });

    it("should pass isGenerating to ResumeFormPanel", () => {
      expect(screen.getByTestId("resume-form-panel")).toHaveAttribute(
        "data-is-generating",
        "true",
      );
    });
  });
});
