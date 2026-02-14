const { createSection } = require("../sectionSeparator");

describe("createSection", () => {
  it("wraps content with section markup and title", () => {
    const html = createSection("Work Experience", "<p>content</p>");
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Work Experience");
    expect(html).toContain("<p>content</p>");
  });

  it("includes the icon when provided", () => {
    const icon = '<img src="icon.png" />';
    const html = createSection("Skills", "<p>stuff</p>", icon);
    expect(html).toContain(icon);
    expect(html).toContain("Skills");
  });

  it("omits the icon when not provided", () => {
    const html = createSection("Education", "<p>edu</p>");
    expect(html).toContain('<div class="section-title">');
    expect(html).toContain("Education");
  });

  it("returns empty string when content is empty", () => {
    expect(createSection("Title", "")).toBe("");
  });

  it("returns empty string when content is null/undefined", () => {
    expect(createSection("Title", null)).toBe("");
    expect(createSection("Title", undefined)).toBe("");
  });
});
