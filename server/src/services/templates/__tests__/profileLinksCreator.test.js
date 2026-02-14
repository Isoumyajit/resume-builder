const { generateProfileLinksHtml } = require("../profileLinksCreator");

describe("generateProfileLinksHtml", () => {
  // ── Empty / missing ─────────────────────────────────────────────────
  it("returns empty string for empty object", () => {
    expect(generateProfileLinksHtml({})).toBe("");
  });

  it("returns empty string when called with no arguments", () => {
    expect(generateProfileLinksHtml()).toBe("");
  });

  it("returns empty string when all links are empty strings", () => {
    expect(
      generateProfileLinksHtml({ github: "", leetcode: "", portfolio: "" }),
    ).toBe("");
  });

  it("returns empty string when all links are whitespace only", () => {
    expect(
      generateProfileLinksHtml({
        github: "   ",
        leetcode: "  ",
        portfolio: " ",
      }),
    ).toBe("");
  });

  // ── Section wrapper ─────────────────────────────────────────────────
  it("wraps output in a section with 'Profile Links' title", () => {
    const html = generateProfileLinksHtml({
      github: "https://github.com/user",
    });
    expect(html).toContain('<section class="section">');
    expect(html).toContain("Profile Links");
  });

  // ── Individual links ───────────────────────────────────────────────
  it("renders GitHub link when provided", () => {
    const html = generateProfileLinksHtml({
      github: "https://github.com/user",
    });
    expect(html).toContain('href="https://github.com/user"');
    expect(html).toContain("GitHub");
    expect(html).toContain('alt="github"');
  });

  it("renders LeetCode link when provided", () => {
    const html = generateProfileLinksHtml({
      leetcode: "https://leetcode.com/user",
    });
    expect(html).toContain('href="https://leetcode.com/user"');
    expect(html).toContain("LeetCode");
    expect(html).toContain('alt="leetcode"');
  });

  it("renders Portfolio link when provided", () => {
    const html = generateProfileLinksHtml({
      portfolio: "https://mysite.com",
    });
    expect(html).toContain('href="https://mysite.com"');
    expect(html).toContain("Portfolio");
  });

  it("renders only the links that are provided", () => {
    const html = generateProfileLinksHtml({
      github: "https://github.com/user",
    });
    expect(html).toContain("GitHub");
    expect(html).not.toContain("LeetCode");
    expect(html).not.toContain("Portfolio");
  });

  // ── All links ──────────────────────────────────────────────────────
  it("renders all links when all provided", () => {
    const html = generateProfileLinksHtml({
      github: "https://github.com/user",
      leetcode: "https://leetcode.com/user",
      portfolio: "https://mysite.com",
    });
    expect(html).toContain("GitHub");
    expect(html).toContain("LeetCode");
    expect(html).toContain("Portfolio");
    const items = html.match(/profile-links__item/g);
    expect(items).toHaveLength(3);
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML in URLs", () => {
    const html = generateProfileLinksHtml({
      github: "https://github.com/user?a=1&b=2",
    });
    expect(html).toContain('href="https://github.com/user?a=1&amp;b=2"');
  });
});
