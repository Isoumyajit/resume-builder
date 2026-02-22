import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResumeFormPanel } from "../ResumeFormPanel";
import type { ResumeFormPanelProps } from "@/interfaces/components/layout";

jest.mock("@/components/form", () =>
  jest.requireActual("@/components/form/__mocks__"),
);

jest.mock("../SortableSectionList", () => ({
  SortableSectionList: () => (
    <div data-testid="sortable-section-list">
      <div data-testid="experience-form" />
      <div data-testid="education-form" />
      <div data-testid="projects-form" />
      <div data-testid="achievements-form" />
      <div data-testid="profile-links-form" />
      <div data-testid="skills-form" />
    </div>
  ),
}));

function createDefaultProps(
  overrides: Partial<ResumeFormPanelProps> = {},
): ResumeFormPanelProps {
  return {
    form: {} as never,
    experienceArray: {} as never,
    educationArray: {} as never,
    projectsArray: {} as never,
    achievementsArray: {} as never,
    addExperience: jest.fn(),
    addEducation: jest.fn(),
    addProject: jest.fn(),
    addAchievement: jest.fn(),
    addBullet: jest.fn(),
    removeBullet: jest.fn(),
    toggleCurrentlyWorking: jest.fn(),
    onGenerate: jest.fn(),
    isGenerating: false,
    sectionOrder: [
      "experience",
      "education",
      "projects",
      "achievements",
      "profileLinks",
      "skills",
    ],
    onReorderSections: jest.fn(),
    ...overrides,
  };
}

function renderFormPanel(overrides: Partial<ResumeFormPanelProps> = {}) {
  return render(<ResumeFormPanel {...createDefaultProps(overrides)} />);
}

describe("ResumeFormPanel rendering", () => {
  beforeEach(() => {
    renderFormPanel();
  });

  it("should render PersonalInfoForm", () => {
    expect(screen.getByTestId("personal-info-form")).toBeInTheDocument();
  });

  it("should render the SortableSectionList", () => {
    expect(screen.getByTestId("sortable-section-list")).toBeInTheDocument();
  });

  it("should render all form sections via SortableSectionList", () => {
    expect(screen.getByTestId("experience-form")).toBeInTheDocument();
    expect(screen.getByTestId("education-form")).toBeInTheDocument();
    expect(screen.getByTestId("projects-form")).toBeInTheDocument();
    expect(screen.getByTestId("achievements-form")).toBeInTheDocument();
    expect(screen.getByTestId("profile-links-form")).toBeInTheDocument();
    expect(screen.getByTestId("skills-form")).toBeInTheDocument();
  });

  it("should render the mobile generate button", () => {
    expect(screen.getByTestId("generate-pdf-button")).toBeInTheDocument();
  });

  it("should render the mobile actions container", () => {
    expect(screen.getByTestId("mobile-actions")).toBeInTheDocument();
  });
});

describe("ResumeFormPanel generate button", () => {
  it("should be enabled when isGenerating is false", () => {
    renderFormPanel({ isGenerating: false });

    expect(screen.getByTestId("generate-pdf-button")).toBeEnabled();
  });

  it("should be disabled when isGenerating is true", () => {
    renderFormPanel({ isGenerating: true });

    expect(screen.getByTestId("generate-pdf-button")).toBeDisabled();
  });

  it("should call onGenerate when clicked", async () => {
    const user = userEvent.setup();
    const onGenerate = jest.fn();
    renderFormPanel({ onGenerate });

    await user.click(screen.getByTestId("generate-pdf-button"));

    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  it("should not call onGenerate when disabled", async () => {
    const user = userEvent.setup();
    const onGenerate = jest.fn();
    renderFormPanel({ onGenerate, isGenerating: true });

    await user.click(screen.getByTestId("generate-pdf-button"));

    expect(onGenerate).not.toHaveBeenCalled();
  });
});
