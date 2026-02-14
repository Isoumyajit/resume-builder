const ProfileLinks = require("../ProfileLinks");

describe("ProfileLinks", () => {
  const validData = {
    leetcode: "https://leetcode.com/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const pl = new ProfileLinks();
      expect(pl.leetcode).toBe("");
      expect(pl.github).toBe("");
      expect(pl.portfolio).toBe("");
    });

    it("assigns provided data", () => {
      const pl = new ProfileLinks(validData);
      expect(pl.github).toBe("https://github.com/johndoe");
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid when all URLs are valid", () => {
      const pl = new ProfileLinks(validData);
      const result = pl.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns valid when all fields are empty (all optional)", () => {
      const pl = new ProfileLinks({});
      const result = pl.validate();
      expect(result.isValid).toBe(true);
    });

    it("returns error for invalid GitHub URL", () => {
      const pl = new ProfileLinks({ github: "not-a-url" });
      const result = pl.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid GitHub URL format");
    });

    it("returns error for invalid LeetCode URL", () => {
      const pl = new ProfileLinks({ leetcode: "bad-url" });
      const result = pl.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid LeetCode URL format");
    });

    it("returns error for invalid Portfolio URL", () => {
      const pl = new ProfileLinks({ portfolio: "bad-url" });
      const result = pl.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid Portfolio URL format");
    });

    it("collects multiple URL errors", () => {
      const pl = new ProfileLinks({
        github: "bad",
        leetcode: "bad",
        portfolio: "bad",
      });
      const result = pl.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });

    it("ignores whitespace-only URLs", () => {
      const pl = new ProfileLinks({ github: "   " });
      const result = pl.validate();
      expect(result.isValid).toBe(true);
    });
  });

  // ── hasAnyLinks() ────────────────────────────────────────────────────
  describe("hasAnyLinks()", () => {
    it("returns true when at least one link is present", () => {
      const pl = new ProfileLinks({ github: "https://github.com/user" });
      expect(pl.hasAnyLinks()).toBe(true);
    });

    it("returns false when all links are empty", () => {
      const pl = new ProfileLinks({});
      expect(pl.hasAnyLinks()).toBe(false);
    });

    it("returns false when links are whitespace only", () => {
      const pl = new ProfileLinks({ github: "   ", leetcode: "  " });
      expect(pl.hasAnyLinks()).toBe(false);
    });
  });

  // ── getValidLinks() ──────────────────────────────────────────────────
  describe("getValidLinks()", () => {
    it("returns array of valid links with display text", () => {
      const pl = new ProfileLinks(validData);
      const links = pl.getValidLinks();
      expect(links).toHaveLength(3);
      expect(links[0].name).toBe("GitHub");
      expect(links[0].url).toBe("https://github.com/johndoe");
    });

    it("returns empty array when no links are provided", () => {
      const pl = new ProfileLinks({});
      expect(pl.getValidLinks()).toHaveLength(0);
    });

    it("excludes invalid URLs", () => {
      const pl = new ProfileLinks({
        github: "not-valid",
        leetcode: "https://leetcode.com/user",
      });
      const links = pl.getValidLinks();
      expect(links).toHaveLength(1);
      expect(links[0].name).toBe("LeetCode");
    });

    it("extracts display text from GitHub URL", () => {
      const pl = new ProfileLinks({ github: "https://github.com/johndoe" });
      const links = pl.getValidLinks();
      expect(links[0].displayText).toBe("johndoe");
    });

    it("extracts domain from portfolio URL", () => {
      const pl = new ProfileLinks({
        portfolio: "https://www.johndoe.dev/projects",
      });
      const links = pl.getValidLinks();
      expect(links[0].displayText).toBe("johndoe.dev");
    });
  });

  // ── getCount() ───────────────────────────────────────────────────────
  describe("getCount()", () => {
    it("returns the number of valid links", () => {
      const pl = new ProfileLinks(validData);
      expect(pl.getCount()).toBe(3);
    });

    it("returns 0 when no links are provided", () => {
      const pl = new ProfileLinks({});
      expect(pl.getCount()).toBe(0);
    });
  });

  // ── getFormattedForLatex() ────────────────────────────────────────────
  describe("getFormattedForLatex()", () => {
    it("returns formatted links with escaped display text", () => {
      const pl = new ProfileLinks(validData);
      const formatted = pl.getFormattedForLatex();
      expect(formatted.github).toBe("https://github.com/johndoe");
      expect(formatted.validLinks).toHaveLength(3);
    });

    it("returns null for empty links", () => {
      const pl = new ProfileLinks({});
      const formatted = pl.getFormattedForLatex();
      expect(formatted.github).toBeNull();
      expect(formatted.leetcode).toBeNull();
      expect(formatted.portfolio).toBeNull();
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("only includes non-empty links", () => {
      const pl = new ProfileLinks({ github: "https://github.com/user" });
      const json = pl.toJSON();
      expect(json).toEqual({ github: "https://github.com/user" });
      expect(json.leetcode).toBeUndefined();
      expect(json.portfolio).toBeUndefined();
    });

    it("returns empty object when no links", () => {
      const pl = new ProfileLinks({});
      expect(pl.toJSON()).toEqual({});
    });
  });

  // ── extractDisplayText() ─────────────────────────────────────────────
  describe("extractDisplayText()", () => {
    const pl = new ProfileLinks();

    it("extracts username from GitHub URL", () => {
      const result = pl.extractDisplayText(
        "https://github.com/johndoe",
        "github.com/",
      );
      expect(result).toBe("johndoe");
    });

    it("returns hostname for invalid URL", () => {
      const result = pl.extractDisplayText("not-a-url", "github.com/");
      expect(result).toBe("not-a-url");
    });
  });

  // ── extractDomain() ──────────────────────────────────────────────────
  describe("extractDomain()", () => {
    const pl = new ProfileLinks();

    it("extracts domain without www", () => {
      expect(pl.extractDomain("https://www.example.com")).toBe("example.com");
    });

    it("returns domain as-is when no www", () => {
      expect(pl.extractDomain("https://example.com")).toBe("example.com");
    });

    it("returns original string for invalid URL", () => {
      expect(pl.extractDomain("not-a-url")).toBe("not-a-url");
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates a ProfileLinks instance from raw data", () => {
      const pl = ProfileLinks.fromRequest(validData);
      expect(pl).toBeInstanceOf(ProfileLinks);
      expect(pl.github).toBe("https://github.com/johndoe");
    });
  });
});
