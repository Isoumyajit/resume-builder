const { generateSkillsHtml } = require("../skillsCreator");

describe("generateSkillsHtml", () => {
  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty object", () => {
    expect(generateSkillsHtml({})).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateSkillsHtml()).toBe("");
  });

  it("returns empty string when all fields are empty strings", () => {
    expect(
      generateSkillsHtml({ languages: "", technologies: "", other: "" }),
    ).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Technical Skills' title", () => {
    const html = generateSkillsHtml({ languages: "JavaScript" });
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Technical Skills");
  });

  // ── Individual skill categories ─────────────────────────────────────
  it("renders programming languages when provided", () => {
    const html = generateSkillsHtml({ languages: "JavaScript, Python" });
    expect(html).toContain("<strong>Programming Languages:</strong>");
    expect(html).toContain("JavaScript, Python");
  });

  it("renders technologies when provided", () => {
    const html = generateSkillsHtml({ technologies: "React, Docker" });
    expect(html).toContain("<strong>Technologies & Frameworks:</strong>");
    expect(html).toContain("React, Docker");
  });

  it("renders other skills when provided", () => {
    const html = generateSkillsHtml({ other: "Agile, Scrum" });
    expect(html).toContain("<strong>Other Skills:</strong>");
    expect(html).toContain("Agile, Scrum");
  });

  it("omits categories that are not provided", () => {
    const html = generateSkillsHtml({ languages: "JS" });
    expect(html).not.toContain("Technologies");
    expect(html).not.toContain("Other Skills");
  });

  // ── All categories ─────────────────────────────────────────────────
  it("renders all categories when all provided", () => {
    const html = generateSkillsHtml({
      languages: "JS",
      technologies: "React",
      other: "Git",
    });
    expect(html).toContain("Programming Languages:");
    expect(html).toContain("Technologies");
    expect(html).toContain("Other Skills:");
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in skill values", () => {
    const html = generateSkillsHtml({
      languages: "C++ <templates>",
    });
    expect(html).toContain("C++ &lt;templates&gt;");
  });
});
