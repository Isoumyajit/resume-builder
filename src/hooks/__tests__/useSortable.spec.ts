import { renderHook } from "@testing-library/react";
import { useSortable } from "../useSortable";

const mockDraggableCleanup = jest.fn();
const mockDropTargetCleanup = jest.fn();

jest.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: jest.fn(() => mockDraggableCleanup),
  dropTargetForElements: jest.fn(() => mockDropTargetCleanup),
}));

jest.mock("@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge", () => ({
  attachClosestEdge: jest.fn((data) => data),
  extractClosestEdge: jest.fn(() => null),
}));

describe("useSortable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return refs and initial idle state", () => {
    const { result } = renderHook(() =>
      useSortable({ sectionKey: "experience", index: 0 }),
    );

    expect(result.current.dropTargetRef).toBeDefined();
    expect(result.current.dragHandleRef).toBeDefined();
    expect(result.current.dragState).toBe("idle");
    expect(result.current.closestEdge).toBeNull();
  });

  it("should return different refs for different section keys", () => {
    const { result: r1 } = renderHook(() =>
      useSortable({ sectionKey: "experience", index: 0 }),
    );
    const { result: r2 } = renderHook(() =>
      useSortable({ sectionKey: "education", index: 1 }),
    );

    expect(r1.current.dropTargetRef).not.toBe(r2.current.dropTargetRef);
    expect(r1.current.dragHandleRef).not.toBe(r2.current.dragHandleRef);
  });

  it("should start with null closestEdge", () => {
    const { result } = renderHook(() =>
      useSortable({ sectionKey: "projects", index: 2 }),
    );

    expect(result.current.closestEdge).toBeNull();
  });
});
