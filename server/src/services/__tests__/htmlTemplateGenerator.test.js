const { generateHtmlTemplate } = require("../htmlTemplateGenerator");

describe("generateHtmlTemplate", () => {
  const makeFullData = () => ({
    personalInfo: {
      name: "John Doe",
      location: "New York, NY",
      phone: "555-1234",
      email: "john@example.com",
      linkedin: {
        url: "https://linkedin.com/in/johndoe",
        displayText: "johndoe",
      },
    },
    experience: [
      {
        company: "Acme Corp",
        title: "Engineer",
        location: "Remote",
        startDate: "Jan 2022",
        endDate: "Present",
        techStack: "Node.js",
        bullets: ["Built APIs"],
      },
    ],
    education: [
      {
        institution: "MIT",
        degree: "B.S. CS",
        location: "Cambridge",
        startYear: "2018",
        endYear: "2022",
      },
    ],
    projects: [
      {
        name: "My Project",
        techStack: "React",
        url: "https://example.com",
        description: "A project",
      },
    ],
    profileLinks: {
      github: "https://github.com/user",
    },
    skills: {
      languages: "JavaScript",
    },
    achievements: [{ bullet: "Won hackathon" }],
  });

  // ── HTML document structure ─────────────────────────────────────────
  it("generates a complete HTML document", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("</html>");
  });

  it("includes head with charset and viewport", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain('<meta charset="UTF-8">');
    expect(html).toContain("viewport");
  });

  it("sets the title from personalInfo name", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("<title>John Doe</title>");
  });

  it("uses 'Resume' as default title when name is missing", () => {
    const html = generateHtmlTemplate({ personalInfo: {} });
    expect(html).toContain("<title>Resume</title>");
  });

  it("escapes HTML in the title", () => {
    const html = generateHtmlTemplate({
      personalInfo: { name: "O'Brien & Co" },
    });
    expect(html).toContain("<title>O&#39;Brien &amp; Co</title>");
  });

  // ── Styles and fonts ───────────────────────────────────────────────
  it("includes styles in the head", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("<style>");
    expect(html).toContain("</style>");
  });

  it("includes font imports", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("@import url");
    expect(html).toContain("Montserrat");
  });

  it("includes head links", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain('rel="stylesheet"');
  });

  // ── Section rendering ──────────────────────────────────────────────
  it("includes header section with name", () => {
    const html = generateHtmlTemplate(makeFullData());
    // Name is uppercased and split into initial spans: <span class="name-initial">J</span>OHN
    expect(html).toContain("name-initial");
    expect(html).toContain("OHN");
    expect(html).toContain("OE");
  });

  it("includes experience section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Work Experience");
    expect(html).toContain("Acme Corp");
  });

  it("includes education section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Education");
    expect(html).toContain("MIT");
  });

  it("includes projects section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Projects");
    expect(html).toContain("My Project");
  });

  it("includes achievements section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Achievements");
    expect(html).toContain("Won hackathon");
  });

  it("includes profile links section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Profile Links");
    expect(html).toContain("GitHub");
  });

  it("includes skills section", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain("Technical Skills");
    expect(html).toContain("JavaScript");
  });

  // ── Empty / missing sections ───────────────────────────────────────
  it("handles empty data gracefully", () => {
    const html = generateHtmlTemplate({});
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Resume</title>");
    // Should not contain section-specific content
    expect(html).not.toContain("Work Experience");
    expect(html).not.toContain("Education");
    expect(html).not.toContain("Projects");
    expect(html).not.toContain("Achievements");
    expect(html).not.toContain("Profile Links");
    expect(html).not.toContain("Technical Skills");
  });

  it("renders only sections that have data", () => {
    const html = generateHtmlTemplate({
      personalInfo: { name: "Jane" },
      experience: [],
      education: [],
      projects: [],
      skills: {},
      achievements: [],
      profileLinks: {},
    });
    // Name is uppercased: <span class="name-initial">J</span>ANE
    expect(html).toContain("ANE");
    expect(html).not.toContain("Work Experience");
    expect(html).not.toContain("Education");
  });

  // ── Container ──────────────────────────────────────────────────────
  it("wraps content in a container div", () => {
    const html = generateHtmlTemplate(makeFullData());
    expect(html).toContain('<div class="container">');
  });

  // ── Template type support ───────────────────────────────────────────
  describe("template type support", () => {
    it("defaults to classic template with Montserrat font", () => {
      const html = generateHtmlTemplate(makeFullData());
      expect(html).toContain('data-template="classic"');
      expect(html).toContain("Montserrat");
      expect(html).not.toContain("Inter");
    });

    it("applies classic template explicitly", () => {
      const data = { ...makeFullData(), templateType: "classic" };
      const html = generateHtmlTemplate(data);
      expect(html).toContain('data-template="classic"');
      expect(html).toContain("Montserrat");
    });

    it("applies modern-accent template with Inter font import", () => {
      const data = { ...makeFullData(), templateType: "modern-accent" };
      const html = generateHtmlTemplate(data);
      expect(html).toContain('data-template="modern-accent"');
      expect(html).toContain(
        "@import url('https://fonts.googleapis.com/css2?family=Inter",
      );
      expect(html).toContain('font-family: "Inter", sans-serif');
    });

    it("includes modern-accent style overrides", () => {
      const data = { ...makeFullData(), templateType: "modern-accent" };
      const html = generateHtmlTemplate(data);
      expect(html).toContain("border-left: 3px solid #2563EB");
      expect(html).toContain("text-transform: uppercase");
    });

    it("does not include modern-accent overrides for classic", () => {
      const html = generateHtmlTemplate(makeFullData());
      expect(html).not.toContain("border-left: 3px solid #2563EB");
    });

    it("escapes HTML in templateType", () => {
      const data = {
        ...makeFullData(),
        templateType: '<script>alert("xss")</script>',
      };
      const html = generateHtmlTemplate(data);
      expect(html).not.toContain("<script>");
    });
  });
});
