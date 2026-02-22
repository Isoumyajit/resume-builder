import { render, screen } from "@testing-library/react";
import { SortableSectionItem } from "../SortableSectionItem";

const mockUseSortable = jest.fn();

jest.mock("@/hooks/useSortable", () => ({
  useSortable: (...args: unknown[]) => mockUseSortable(...args),
}));

jest.mock("@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box", () => ({
  DropIndicator: ({ edge }: { edge: string }) => (
    <div data-testid="drop-indicator" data-edge={edge} />
  ),
}));

function createMockSortableReturn(overrides = {}) {
  return {
    dropTargetRef: { current: null },
    dragHandleRef: { current: null },
    dragState: "idle" as const,
    closestEdge: null,
    ...overrides,
  };
}

describe("SortableSectionItem", () => {
  beforeEach(() => {
    mockUseSortable.mockReturnValue(createMockSortableReturn());
  });

  it("should call useSortable with sectionKey and index", () => {
    render(
      <SortableSectionItem sectionKey="experience" index={0}>
        {() => <div>child</div>}
      </SortableSectionItem>,
    );

    expect(mockUseSortable).toHaveBeenCalledWith({
      sectionKey: "experience",
      index: 0,
    });
  });

  it("should render children via render prop", () => {
    render(
      <SortableSectionItem sectionKey="education" index={1}>
        {() => <div data-testid="section-child">Education Content</div>}
      </SortableSectionItem>,
    );

    expect(screen.getByTestId("section-child")).toBeInTheDocument();
    expect(screen.getByText("Education Content")).toBeInTheDocument();
  });

  it("should pass dragHandleRef to the render prop", () => {
    const mockRef = { current: null };
    mockUseSortable.mockReturnValue(
      createMockSortableReturn({ dragHandleRef: mockRef }),
    );

    const renderChild = jest.fn(() => <div>child</div>);

    render(
      <SortableSectionItem sectionKey="skills" index={5}>
        {renderChild}
      </SortableSectionItem>,
    );

    expect(renderChild).toHaveBeenCalledWith(mockRef);
  });

  it("should not show DropIndicator when closestEdge is null", () => {
    render(
      <SortableSectionItem sectionKey="projects" index={2}>
        {() => <div>child</div>}
      </SortableSectionItem>,
    );

    expect(screen.queryByTestId("drop-indicator")).not.toBeInTheDocument();
  });

  it("should show DropIndicator when closestEdge is set", () => {
    mockUseSortable.mockReturnValue(
      createMockSortableReturn({ closestEdge: "top" }),
    );

    render(
      <SortableSectionItem sectionKey="projects" index={2}>
        {() => <div>child</div>}
      </SortableSectionItem>,
    );

    const indicator = screen.getByTestId("drop-indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-edge", "top");
  });

  it("should apply opacity class when dragging", () => {
    mockUseSortable.mockReturnValue(
      createMockSortableReturn({ dragState: "dragging" }),
    );

    const { container } = render(
      <SortableSectionItem sectionKey="experience" index={0}>
        {() => <div>child</div>}
      </SortableSectionItem>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("opacity-40");
  });

  it("should not apply opacity class when idle", () => {
    const { container } = render(
      <SortableSectionItem sectionKey="experience" index={0}>
        {() => <div>child</div>}
      </SortableSectionItem>,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).not.toContain("opacity-40");
  });
});
