const Skills = require("../Skills");

describe("Skills", () => {
  const validData = {
    languages: "JavaScript, Python, Go",
    technologies: "React, Node.js, Docker",
    other: "Git, Agile, CI/CD",
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const s = new Skills();
      expect(s.languages).toBe("");
      expect(s.technologies).toBe("");
      expect(s.other).toBe("");
    });

    it("assigns provided data", () => {
      const s = new Skills(validData);
      expect(s.languages).toBe("JavaScript, Python, Go");
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for proper skills data", () => {
      const s = new Skills(validData);
      const result = s.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns valid when all fields are empty (skills are optional)", () => {
      const s = new Skills({});
      const result = s.validate();
      expect(result.isValid).toBe(true);
    });

    it("returns error when languages is too short (1 char)", () => {
      const s = new Skills({ languages: "J" });
      const result = s.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Programming languages should be at least 2 characters",
      );
    });

    it("returns error when technologies is too short", () => {
      const s = new Skills({ technologies: "R" });
      const result = s.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Technologies should be at least 2 characters",
      );
    });

    it("returns error when other is too short", () => {
      const s = new Skills({ other: "G" });
      const result = s.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Other skills should be at least 2 characters",
      );
    });

    it("allows exactly 2 characters", () => {
      const s = new Skills({ languages: "Go" });
      const result = s.validate();
      expect(result.isValid).toBe(true);
    });

    it("collects multiple errors", () => {
      const s = new Skills({ languages: "J", technologies: "R", other: "G" });
      const result = s.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  // ── hasAnySkills() ───────────────────────────────────────────────────
  describe("hasAnySkills()", () => {
    it("returns true when at least one category has content", () => {
      const s = new Skills({ languages: "JavaScript" });
      expect(s.hasAnySkills()).toBe(true);
    });

    it("returns false when all categories are empty", () => {
      const s = new Skills({});
      expect(s.hasAnySkills()).toBe(false);
    });

    it("returns false when categories are whitespace only", () => {
      const s = new Skills({ languages: "   " });
      expect(s.hasAnySkills()).toBe(false);
    });
  });

  // ── getPopulatedCategories() ─────────────────────────────────────────
  describe("getPopulatedCategories()", () => {
    it("returns only categories with content", () => {
      const s = new Skills({ languages: "JavaScript", technologies: "" });
      const categories = s.getPopulatedCategories();
      expect(categories).toHaveLength(1);
      expect(categories[0].category).toBe("Programming Languages");
      expect(categories[0].skills).toBe("JavaScript");
    });

    it("returns all three categories when all populated", () => {
      const s = new Skills(validData);
      const categories = s.getPopulatedCategories();
      expect(categories).toHaveLength(3);
    });

    it("returns empty array when no skills", () => {
      const s = new Skills({});
      expect(s.getPopulatedCategories()).toHaveLength(0);
    });

    it("includes parsed skills array", () => {
      const s = new Skills({ languages: "JavaScript, Python, Go" });
      const categories = s.getPopulatedCategories();
      expect(categories[0].skillsArray).toEqual(["JavaScript", "Python", "Go"]);
    });
  });

  // ── parseSkillsString() ──────────────────────────────────────────────
  describe("parseSkillsString()", () => {
    const s = new Skills();

    it("splits by comma", () => {
      expect(s.parseSkillsString("JavaScript, Python, Go")).toEqual([
        "JavaScript",
        "Python",
        "Go",
      ]);
    });

    it("splits by semicolon", () => {
      expect(s.parseSkillsString("JavaScript; Python; Go")).toEqual([
        "JavaScript",
        "Python",
        "Go",
      ]);
    });

    it("trims whitespace from each skill", () => {
      expect(s.parseSkillsString("  JS ,  Python  ")).toEqual(["JS", "Python"]);
    });

    it("filters out empty entries", () => {
      expect(s.parseSkillsString("JS,,Python,")).toEqual(["JS", "Python"]);
    });

    it("returns empty array for empty/null input", () => {
      expect(s.parseSkillsString("")).toEqual([]);
      expect(s.parseSkillsString(null)).toEqual([]);
      expect(s.parseSkillsString(undefined)).toEqual([]);
    });
  });

  // ── getTotalSkillsCount() ────────────────────────────────────────────
  describe("getTotalSkillsCount()", () => {
    it("counts all skills across categories", () => {
      const s = new Skills(validData);
      // 3 + 3 + 3 = 9
      expect(s.getTotalSkillsCount()).toBe(9);
    });

    it("returns 0 when no skills", () => {
      const s = new Skills({});
      expect(s.getTotalSkillsCount()).toBe(0);
    });
  });

  // ── getSummary() ─────────────────────────────────────────────────────
  describe("getSummary()", () => {
    it("returns correct summary for populated skills", () => {
      const s = new Skills(validData);
      const summary = s.getSummary();
      expect(summary.totalCategories).toBe(3);
      expect(summary.totalSkills).toBe(9);
      expect(summary.hasLanguages).toBe(true);
      expect(summary.hasTechnologies).toBe(true);
      expect(summary.hasOtherSkills).toBe(true);
      expect(summary.isEmpty).toBe(false);
    });

    it("returns empty summary when no skills", () => {
      const s = new Skills({});
      const summary = s.getSummary();
      expect(summary.totalCategories).toBe(0);
      expect(summary.totalSkills).toBe(0);
      expect(summary.isEmpty).toBe(true);
    });
  });

  // ── getFormattedForLatex() ────────────────────────────────────────────
  describe("getFormattedForLatex()", () => {
    it("escapes LaTeX special characters in skills", () => {
      const s = new Skills({ languages: "C#, C++" });
      const formatted = s.getFormattedForLatex();
      expect(formatted.languages).toContain("\\#");
    });

    it("includes categories with escaped skills arrays", () => {
      const s = new Skills({ languages: "C#" });
      const formatted = s.getFormattedForLatex();
      expect(formatted.categories).toHaveLength(1);
      expect(formatted.categories[0].skillsArray[0]).toContain("\\#");
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("only includes non-empty fields", () => {
      const s = new Skills({ languages: "JavaScript" });
      const json = s.toJSON();
      expect(json).toEqual({ languages: "JavaScript" });
      expect(json.technologies).toBeUndefined();
      expect(json.other).toBeUndefined();
    });

    it("returns empty object when no skills", () => {
      const s = new Skills({});
      expect(s.toJSON()).toEqual({});
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates a Skills instance from raw data", () => {
      const s = Skills.fromRequest(validData);
      expect(s).toBeInstanceOf(Skills);
      expect(s.languages).toBe("JavaScript, Python, Go");
    });
  });
});
