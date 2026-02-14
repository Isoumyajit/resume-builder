const { generateExperienceHtml } = require("../experienceCreator");

describe("generateExperienceHtml", () => {
  const makeExp = (overrides = {}) => ({
    company: "Acme Corp",
    title: "Software Engineer",
    location: "Remote",
    startDate: "Jan 2022",
    endDate: "Present",
    techStack: "Node.js, React",
    bullets: ["Built APIs", "Improved performance by 30%"],
    ...overrides,
  });

  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty array", () => {
    expect(generateExperienceHtml([])).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateExperienceHtml()).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Work Experience' title", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Work Experience");
  });

  // ── Experience item rendering ───────────────────────────────────────
  it("renders company name", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain("Acme Corp");
  });

  it("renders job title", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain("Software Engineer");
  });

  it("renders location and date range", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain("Remote");
    expect(html).toContain("Jan 2022");
    expect(html).toContain("Present");
  });

  it("renders tech stack when provided", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain("Tech Stack:");
    expect(html).toContain("Node.js, React");
  });

  it("omits tech stack when not provided", () => {
    const html = generateExperienceHtml([makeExp({ techStack: "" })]);
    expect(html).not.toContain("Tech Stack:");
  });

  // ── Bullets ─────────────────────────────────────────────────────────
  it("renders bullet points", () => {
    const html = generateExperienceHtml([makeExp()]);
    expect(html).toContain("Built APIs");
    expect(html).toContain("Improved performance by 30%");
    expect(html).toContain('class="experience-bullets"');
  });

  it("reverses bullet order", () => {
    const html = generateExperienceHtml([
      makeExp({ bullets: ["First", "Second", "Third"] }),
    ]);
    const firstIdx = html.indexOf("First");
    const thirdIdx = html.indexOf("Third");
    // After reverse, "Third" should appear before "First"
    expect(thirdIdx).toBeLessThan(firstIdx);
  });

  it("filters out empty and whitespace-only bullets", () => {
    const html = generateExperienceHtml([
      makeExp({ bullets: ["Valid bullet", "", "  ", "Another valid"] }),
    ]);
    expect(html).toContain("Valid bullet");
    expect(html).toContain("Another valid");
    // Should have exactly 2 bullet items
    const bulletMatches = html.match(/experience-bullet-item-container/g);
    expect(bulletMatches).toHaveLength(2);
  });

  it("omits bullet list when bullets array is empty", () => {
    const html = generateExperienceHtml([makeExp({ bullets: [] })]);
    expect(html).not.toContain("experience-bullets");
  });

  // ── Multiple experiences ────────────────────────────────────────────
  it("renders multiple experience items", () => {
    const html = generateExperienceHtml([
      makeExp({ company: "Company A" }),
      makeExp({ company: "Company B" }),
    ]);
    expect(html).toContain("Company A");
    expect(html).toContain("Company B");
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in company name", () => {
    const html = generateExperienceHtml([
      makeExp({ company: "<script>alert(1)</script>" }),
    ]);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  // ── Missing optional fields ────────────────────────────────────────
  it("handles missing company, title, location gracefully", () => {
    const html = generateExperienceHtml([
      makeExp({ company: "", title: "", location: "" }),
    ]);
    expect(html).toContain('<div class="experience-item">');
  });
});
