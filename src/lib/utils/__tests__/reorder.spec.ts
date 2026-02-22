import { reorderByEdge } from "../reorder";

const DEFAULT_ORDER = [
  "experience",
  "education",
  "projects",
  "achievements",
  "profileLinks",
  "skills",
];

describe("reorderByEdge", () => {
  it("should move an item before the target when edge is 'top'", () => {
    const result = reorderByEdge(DEFAULT_ORDER, "skills", "experience", "top");
    expect(result).toEqual([
      "skills",
      "experience",
      "education",
      "projects",
      "achievements",
      "profileLinks",
    ]);
  });

  it("should move an item after the target when edge is 'bottom'", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "skills",
      "experience",
      "bottom",
    );
    expect(result).toEqual([
      "experience",
      "skills",
      "education",
      "projects",
      "achievements",
      "profileLinks",
    ]);
  });

  it("should move an item to the very end via bottom of last item", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "experience",
      "skills",
      "bottom",
    );
    expect(result).toEqual([
      "education",
      "projects",
      "achievements",
      "profileLinks",
      "skills",
      "experience",
    ]);
  });

  it("should move an item to the very start via top of first item", () => {
    const result = reorderByEdge(DEFAULT_ORDER, "skills", "experience", "top");
    expect(result[0]).toBe("skills");
  });

  it("should handle moving adjacent items (swap down)", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "experience",
      "education",
      "bottom",
    );
    expect(result).toEqual([
      "education",
      "experience",
      "projects",
      "achievements",
      "profileLinks",
      "skills",
    ]);
  });

  it("should handle moving adjacent items (swap up)", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "education",
      "experience",
      "top",
    );
    expect(result).toEqual([
      "education",
      "experience",
      "projects",
      "achievements",
      "profileLinks",
      "skills",
    ]);
  });

  it("should not mutate the original array", () => {
    const original = [...DEFAULT_ORDER];
    reorderByEdge(original, "skills", "experience", "top");
    expect(original).toEqual(DEFAULT_ORDER);
  });

  it("should preserve all items (no duplicates, no losses)", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "projects",
      "profileLinks",
      "bottom",
    );
    expect(result).toHaveLength(DEFAULT_ORDER.length);
    expect(new Set(result).size).toBe(DEFAULT_ORDER.length);
    for (const item of DEFAULT_ORDER) {
      expect(result).toContain(item);
    }
  });

  it("should handle a two-item array", () => {
    const result = reorderByEdge(["a", "b"], "b", "a", "top");
    expect(result).toEqual(["b", "a"]);
  });

  it("should move middle item to top", () => {
    const result = reorderByEdge(
      DEFAULT_ORDER,
      "projects",
      "experience",
      "top",
    );
    expect(result[0]).toBe("projects");
    expect(result[1]).toBe("experience");
  });
});
