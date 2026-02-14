const { generateProjectsHtml } = require("../projectsCreator");

describe("generateProjectsHtml", () => {
  const makeProject = (overrides = {}) => ({
    name: "Resume Builder",
    techStack: "React, Node.js",
    url: "https://github.com/user/resume-builder",
    description: "A tool to build resumes",
    ...overrides,
  });

  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty array", () => {
    expect(generateProjectsHtml([])).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateProjectsHtml()).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Projects' title", () => {
    const html = generateProjectsHtml([makeProject()]);
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Projects");
  });

  // ── Project item rendering ──────────────────────────────────────────
  it("renders project name", () => {
    const html = generateProjectsHtml([makeProject()]);
    expect(html).toContain("Resume Builder");
  });

  it("renders project URL as external link", () => {
    const html = generateProjectsHtml([makeProject()]);
    expect(html).toContain('href="https://github.com/user/resume-builder"');
    expect(html).toContain('alt="external-link"');
  });

  it("omits link when url is not provided", () => {
    const html = generateProjectsHtml([makeProject({ url: "" })]);
    expect(html).not.toContain('alt="external-link"');
  });

  it("renders tech stack when provided", () => {
    const html = generateProjectsHtml([makeProject()]);
    expect(html).toContain("Tech Stack:");
    expect(html).toContain("React, Node.js");
  });

  it("omits tech stack when not provided", () => {
    const html = generateProjectsHtml([makeProject({ techStack: "" })]);
    expect(html).not.toContain("Tech Stack:");
  });

  it("renders description when provided", () => {
    const html = generateProjectsHtml([makeProject()]);
    expect(html).toContain("A tool to build resumes");
    expect(html).toContain('class="project-description"');
  });

  it("omits description when not provided", () => {
    const html = generateProjectsHtml([makeProject({ description: "" })]);
    expect(html).not.toContain("project-description");
  });

  // ── Multiple projects ──────────────────────────────────────────────
  it("renders multiple project items", () => {
    const html = generateProjectsHtml([
      makeProject({ name: "Project A" }),
      makeProject({ name: "Project B" }),
    ]);
    expect(html).toContain("Project A");
    expect(html).toContain("Project B");
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in project name and description", () => {
    const html = generateProjectsHtml([
      makeProject({
        name: "My <App>",
        description: "Uses & and < symbols",
      }),
    ]);
    expect(html).toContain("My &lt;App&gt;");
    expect(html).toContain("Uses &amp; and &lt; symbols");
  });
});
