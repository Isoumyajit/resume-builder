import { renderHook, act } from "@testing-library/react";

jest.mock("nanoid", () => ({
  nanoid: () => "mock-id",
}));

import { useResumeForm } from "../useResumeForm";

const DEFAULT_ORDER = [
  "summary",
  "experience",
  "education",
  "projects",
  "profileLinks",
  "skills",
  "achievements",
];

describe("useResumeForm — sectionOrder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the default section order when nothing is in localStorage", () => {
    const { result } = renderHook(() => useResumeForm());

    expect(result.current.sectionOrder).toEqual(DEFAULT_ORDER);
  });

  it("should reflect reordered sections after calling reorderSections", () => {
    const { result } = renderHook(() => useResumeForm());

    const customOrder = [
      "skills",
      "experience",
      "education",
      "projects",
      "profileLinks",
      "achievements",
    ];

    act(() => {
      result.current.reorderSections(customOrder);
    });

    expect(result.current.sectionOrder).toEqual(customOrder);
    expect(JSON.parse(localStorage.getItem("rb-section-order")!)).toEqual(
      customOrder,
    );
  });

  it("should update section order and persist to localStorage via reorderSections", () => {
    const { result } = renderHook(() => useResumeForm());

    const newOrder = [
      "skills",
      "projects",
      "experience",
      "education",
      "profileLinks",
      "achievements",
    ];

    act(() => {
      result.current.reorderSections(newOrder);
    });

    expect(result.current.sectionOrder).toEqual(newOrder);
    expect(JSON.parse(localStorage.getItem("rb-section-order")!)).toEqual(
      newOrder,
    );
  });

  it("should expose reorderSections as a stable callback", () => {
    const { result, rerender } = renderHook(() => useResumeForm());

    const first = result.current.reorderSections;
    rerender();
    const second = result.current.reorderSections;

    expect(first).toBe(second);
  });
});

describe("useResumeForm — form handlers", () => {
  it("should return all expected form handler functions", () => {
    const { result } = renderHook(() => useResumeForm());

    expect(typeof result.current.addExperience).toBe("function");
    expect(typeof result.current.addEducation).toBe("function");
    expect(typeof result.current.addProject).toBe("function");
    expect(typeof result.current.addAchievement).toBe("function");
    expect(typeof result.current.addBullet).toBe("function");
    expect(typeof result.current.removeBullet).toBe("function");
    expect(typeof result.current.toggleCurrentlyWorking).toBe("function");
    expect(typeof result.current.reorderSections).toBe("function");
  });

  it("should return field arrays for all dynamic sections", () => {
    const { result } = renderHook(() => useResumeForm());

    expect(result.current.experienceArray).toBeDefined();
    expect(result.current.educationArray).toBeDefined();
    expect(result.current.projectsArray).toBeDefined();
    expect(result.current.achievementsArray).toBeDefined();
  });
});
