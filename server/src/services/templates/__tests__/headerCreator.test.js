const { generateHeaderHtml } = require("../headerCreator");

describe("generateHeaderHtml", () => {
  // ── Basic rendering ─────────────────────────────────────────────────
  it("renders the header container", () => {
    const html = generateHeaderHtml({});
    expect(html).toContain('<div class="header">');
  });

  it("renders the name with initials emphasized", () => {
    const html = generateHeaderHtml({ name: "John Doe" });
    expect(html).toContain('<span class="name-initial">J</span>OHN');
    expect(html).toContain('<span class="name-initial">D</span>OE');
  });

  it("emphasizes first and last name parts only", () => {
    const html = generateHeaderHtml({ name: "John Michael Doe" });
    // First and last get emphasis, middle does not
    expect(html).toContain('<span class="name-initial">J</span>OHN');
    expect(html).toContain("MICHAEL");
    expect(html).not.toContain('<span class="name-initial">M</span>ICHAEL');
    expect(html).toContain('<span class="name-initial">D</span>OE');
  });

  it("handles single-word name (first = last)", () => {
    const html = generateHeaderHtml({ name: "Madonna" });
    expect(html).toContain('<span class="name-initial">M</span>ADONNA');
  });

  it("renders empty name gracefully", () => {
    const html = generateHeaderHtml({ name: "" });
    expect(html).toContain('<h3 class="name">');
  });

  // ── Contact fields ─────────────────────────────────────────────────
  it("renders location when provided", () => {
    const html = generateHeaderHtml({ location: "New York, NY" });
    expect(html).toContain("New York, NY");
    expect(html).toContain('alt="location"');
  });

  it("omits location when not provided", () => {
    const html = generateHeaderHtml({});
    expect(html).not.toContain('alt="location"');
  });

  it("renders phone when provided", () => {
    const html = generateHeaderHtml({ phone: "555-1234" });
    expect(html).toContain("555-1234");
    expect(html).toContain('alt="phone"');
  });

  it("renders email with mailto link", () => {
    const html = generateHeaderHtml({ email: "test@example.com" });
    expect(html).toContain('href="mailto:test@example.com"');
    expect(html).toContain("test@example.com");
  });

  it("renders linkedin link when provided", () => {
    const html = generateHeaderHtml({
      linkedin: {
        url: "https://linkedin.com/in/johndoe",
        displayText: "johndoe",
      },
    });
    expect(html).toContain('href="https://linkedin.com/in/johndoe"');
    expect(html).toContain("johndoe");
  });

  it("uses url as display text when displayText is missing", () => {
    const html = generateHeaderHtml({
      linkedin: { url: "https://linkedin.com/in/johndoe" },
    });
    expect(html).toContain("https://linkedin.com/in/johndoe");
  });

  it("omits linkedin when url is not provided", () => {
    const html = generateHeaderHtml({ linkedin: {} });
    expect(html).not.toContain('alt="linkedin"');
  });

  // ── Dividers ───────────────────────────────────────────────────────
  it("renders divider between location and phone", () => {
    const html = generateHeaderHtml({
      location: "NYC",
      phone: "555-1234",
    });
    expect(html).toContain('class="vr-divider"');
  });

  it("renders divider between phone and email", () => {
    const html = generateHeaderHtml({
      phone: "555-1234",
      email: "a@b.com",
    });
    expect(html).toContain('class="vr-divider"');
  });

  // ── HTML escaping ──────────────────────────────────────────────────
  it("escapes HTML special characters in fields", () => {
    const html = generateHeaderHtml({
      name: "O'Brien & Co",
      location: "<script>alert(1)</script>",
    });
    expect(html).toContain("&amp;");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  // ── Default behavior ──────────────────────────────────────────────
  it("handles being called with no arguments", () => {
    const html = generateHeaderHtml();
    expect(html).toContain('<div class="header">');
  });
});
