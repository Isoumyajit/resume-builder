const { generateEducationHtml } = require("../educationCreator");

describe("generateEducationHtml", () => {
  const makeEdu = (overrides = {}) => ({
    institution: "MIT",
    degree: "B.S. Computer Science",
    location: "Cambridge, MA",
    startYear: "2018",
    endYear: "2022",
    ...overrides,
  });

  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty array", () => {
    expect(generateEducationHtml([])).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateEducationHtml()).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Education' title", () => {
    const html = generateEducationHtml([makeEdu()]);
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Education");
  });

  // ── Education item rendering ────────────────────────────────────────
  it("renders institution name", () => {
    const html = generateEducationHtml([makeEdu()]);
    expect(html).toContain("MIT");
  });

  it("renders degree", () => {
    const html = generateEducationHtml([makeEdu()]);
    expect(html).toContain("B.S. Computer Science");
  });

  it("renders location and year range", () => {
    const html = generateEducationHtml([makeEdu()]);
    expect(html).toContain("Cambridge, MA");
    expect(html).toContain("2018");
    expect(html).toContain("2022");
  });

  // ── Multiple entries ────────────────────────────────────────────────
  it("renders multiple education entries", () => {
    const html = generateEducationHtml([
      makeEdu({ institution: "MIT" }),
      makeEdu({ institution: "Stanford" }),
    ]);
    expect(html).toContain("MIT");
    expect(html).toContain("Stanford");
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in institution name", () => {
    const html = generateEducationHtml([
      makeEdu({ institution: "O'Brien & Associates" }),
    ]);
    expect(html).toContain("O&#39;Brien &amp; Associates");
  });

  // ── Missing optional fields ────────────────────────────────────────
  it("handles missing fields gracefully", () => {
    const html = generateEducationHtml([
      makeEdu({ institution: "", degree: "", location: "" }),
    ]);
    expect(html).toContain('<div class="item">');
  });
});
