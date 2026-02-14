const { escapeHtml } = require("../escapeHtml");

describe("escapeHtml", () => {
  // ── Basic escaping ──────────────────────────────────────────────────
  it("escapes ampersand", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes less-than sign", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes greater-than sign", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("escapes all special characters together", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  // ── Edge cases ──────────────────────────────────────────────────────
  it("returns empty string for null", () => {
    expect(escapeHtml(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(escapeHtml(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("returns empty string for 0 (falsy number)", () => {
    expect(escapeHtml(0)).toBe("");
  });

  it("returns the same string when no special characters", () => {
    expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
  });

  it("converts non-string truthy input to string before escaping", () => {
    expect(escapeHtml(42)).toBe("42");
  });

  it("handles strings with multiple consecutive special chars", () => {
    expect(escapeHtml("<<>>&&")).toBe("&lt;&lt;&gt;&gt;&amp;&amp;");
  });
});
