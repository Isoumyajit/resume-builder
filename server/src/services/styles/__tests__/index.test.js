const {
  getAllStyles,
  getStylesBySections,
  baseStyles,
  headerStyles,
  sectionStyles,
  itemStyles,
  experienceStyles,
  projectStyles,
  profileLinksStyles,
  skillsStyles,
  achievementsStyles,
} = require("../index");

describe("styles/index", () => {
  // ── getAllStyles() ──────────────────────────────────────────────────
  describe("getAllStyles()", () => {
    it("returns a non-empty string", () => {
      const styles = getAllStyles();
      expect(typeof styles).toBe("string");
      expect(styles.length).toBeGreaterThan(0);
    });

    it("includes base styles", () => {
      const styles = getAllStyles();
      expect(styles).toContain(baseStyles);
    });

    it("includes header styles", () => {
      const styles = getAllStyles();
      expect(styles).toContain(headerStyles);
    });

    it("includes all style blocks", () => {
      const styles = getAllStyles();
      expect(styles).toContain(sectionStyles);
      expect(styles).toContain(itemStyles);
      expect(styles).toContain(experienceStyles);
      expect(styles).toContain(projectStyles);
      expect(styles).toContain(profileLinksStyles);
      expect(styles).toContain(skillsStyles);
      expect(styles).toContain(achievementsStyles);
    });
  });

  // ── getStylesBySections() ──────────────────────────────────────────
  describe("getStylesBySections()", () => {
    it("returns styles for requested sections", () => {
      const styles = getStylesBySections(["base", "header"]);
      expect(styles).toContain(baseStyles);
      expect(styles).toContain(headerStyles);
    });

    it("returns empty string for empty array", () => {
      expect(getStylesBySections([])).toBe("");
    });

    it("returns empty string for no arguments", () => {
      expect(getStylesBySections()).toBe("");
    });

    it("ignores unknown section names", () => {
      const styles = getStylesBySections(["nonexistent"]);
      expect(styles).toBe("");
    });

    it("includes only requested sections", () => {
      const styles = getStylesBySections(["experience"]);
      expect(styles).toContain(experienceStyles);
      expect(styles).not.toContain(headerStyles);
    });
  });

  // ── Exported style constants ───────────────────────────────────────
  describe("exported style constants", () => {
    it("exports all style constants as non-empty strings", () => {
      const allExports = [
        baseStyles,
        headerStyles,
        sectionStyles,
        itemStyles,
        experienceStyles,
        projectStyles,
        profileLinksStyles,
        skillsStyles,
        achievementsStyles,
      ];
      allExports.forEach((style) => {
        expect(typeof style).toBe("string");
        expect(style.length).toBeGreaterThan(0);
      });
    });
  });
});
