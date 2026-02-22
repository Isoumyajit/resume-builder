import { render, screen } from "@testing-library/react";
import { SortableSectionList } from "../SortableSectionList";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";

jest.mock("@/components/form", () =>
  jest.requireActual("@/components/form/__mocks__"),
);

jest.mock("../SortableSectionItem", () => ({
  SortableSectionItem: ({
    children,
    sectionKey,
  }: {
    children: (ref: { current: null }) => React.ReactNode;
    sectionKey: string;
  }) => (
    <div data-testid={`sortable-item-${sectionKey}`}>
      {children({ current: null })}
    </div>
  ),
}));

jest.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  monitorForElements: jest.fn(() => jest.fn()),
}));

jest.mock("@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge", () => ({
  extractClosestEdge: jest.fn(() => null),
}));

function createDefaultProps() {
  return {
    sectionOrder: [
      "experience",
      "education",
      "projects",
      "achievements",
      "profileLinks",
      "skills",
    ],
    onReorder: jest.fn(),
    form: {} as UseFormReturn<ResumeFormData>,
    experienceArray: {} as UseFieldArrayReturn<ResumeFormData, "experience">,
    educationArray: {} as UseFieldArrayReturn<ResumeFormData, "education">,
    projectsArray: {} as UseFieldArrayReturn<ResumeFormData, "projects">,
    achievementsArray: {} as UseFieldArrayReturn<
      ResumeFormData,
      "achievements"
    >,
    addExperience: jest.fn(),
    addEducation: jest.fn(),
    addProject: jest.fn(),
    addAchievement: jest.fn(),
    addBullet: jest.fn(),
    removeBullet: jest.fn(),
    toggleCurrentlyWorking: jest.fn(),
  };
}

describe("SortableSectionList", () => {
  it("should render all sections in default order", () => {
    render(<SortableSectionList {...createDefaultProps()} />);

    expect(screen.getByTestId("sortable-item-experience")).toBeInTheDocument();
    expect(screen.getByTestId("sortable-item-education")).toBeInTheDocument();
    expect(screen.getByTestId("sortable-item-projects")).toBeInTheDocument();
    expect(
      screen.getByTestId("sortable-item-achievements"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("sortable-item-profileLinks"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("sortable-item-skills")).toBeInTheDocument();
  });

  it("should render sections in the given order", () => {
    const props = createDefaultProps();
    props.sectionOrder = ["skills", "projects", "experience"];

    render(<SortableSectionList {...props} />);

    const items = screen.getAllByTestId(/^sortable-item-/);
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute("data-testid", "sortable-item-skills");
    expect(items[1]).toHaveAttribute("data-testid", "sortable-item-projects");
    expect(items[2]).toHaveAttribute("data-testid", "sortable-item-experience");
  });

  it("should skip unknown section keys", () => {
    const props = createDefaultProps();
    props.sectionOrder = ["experience", "unknown-key", "education"];

    render(<SortableSectionList {...props} />);

    const items = screen.getAllByTestId(/^sortable-item-/);
    expect(items).toHaveLength(2);
    expect(
      screen.queryByTestId("sortable-item-unknown-key"),
    ).not.toBeInTheDocument();
  });

  it("should render the correct form component inside each sortable item", () => {
    render(<SortableSectionList {...createDefaultProps()} />);

    expect(screen.getByTestId("experience-form")).toBeInTheDocument();
    expect(screen.getByTestId("education-form")).toBeInTheDocument();
    expect(screen.getByTestId("projects-form")).toBeInTheDocument();
    expect(screen.getByTestId("achievements-form")).toBeInTheDocument();
    expect(screen.getByTestId("profile-links-form")).toBeInTheDocument();
    expect(screen.getByTestId("skills-form")).toBeInTheDocument();
  });

  it("should render nothing when sectionOrder is empty", () => {
    const props = createDefaultProps();
    props.sectionOrder = [];

    const { container } = render(<SortableSectionList {...props} />);

    expect(
      container.querySelector("[data-testid^='sortable-item-']"),
    ).toBeNull();
  });

  it("should register a monitor via monitorForElements", () => {
    const { monitorForElements } = jest.requireMock(
      "@atlaskit/pragmatic-drag-and-drop/element/adapter",
    );

    render(<SortableSectionList {...createDefaultProps()} />);

    expect(monitorForElements).toHaveBeenCalled();
  });
});
