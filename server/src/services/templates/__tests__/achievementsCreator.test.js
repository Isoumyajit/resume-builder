const { generateAchievementsHtml } = require("../achievementsCreator");

describe("generateAchievementsHtml", () => {
  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty array", () => {
    expect(generateAchievementsHtml([])).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateAchievementsHtml()).toBe("");
  });

  it("returns empty string for null", () => {
    expect(generateAchievementsHtml(null)).toBe("");
  });

  it("returns empty string when all bullets are empty", () => {
    const html = generateAchievementsHtml([{ bullet: "" }, { bullet: "   " }]);
    expect(html).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Achievements' title", () => {
    const html = generateAchievementsHtml([{ bullet: "Won hackathon" }]);
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Achievements");
  });

  // ── Achievement rendering ──────────────────────────────────────────
  it("renders achievement bullets", () => {
    const html = generateAchievementsHtml([
      { bullet: "Won hackathon" },
      { bullet: "Published paper" },
    ]);
    expect(html).toContain("Won hackathon");
    expect(html).toContain("Published paper");
    expect(html).toContain('class="achievements-list"');
  });

  it("renders bullet icon for each achievement", () => {
    const html = generateAchievementsHtml([{ bullet: "Achievement 1" }]);
    expect(html).toContain('alt="circled"');
  });

  it("filters out achievements with empty bullets", () => {
    const html = generateAchievementsHtml([
      { bullet: "Valid" },
      { bullet: "" },
      { bullet: "Also valid" },
    ]);
    expect(html).toContain("Valid");
    expect(html).toContain("Also valid");
    const items = html.match(/achievement-item/g);
    expect(items).toHaveLength(2);
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in bullet text", () => {
    const html = generateAchievementsHtml([
      { bullet: "Improved <metric> by 50%" },
    ]);
    expect(html).toContain("Improved &lt;metric&gt; by 50%");
  });
});
