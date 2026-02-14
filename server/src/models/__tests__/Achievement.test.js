const Achievement = require("../Achievement");

describe("Achievement", () => {
  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const a = new Achievement();
      expect(a.id).toBe("");
      expect(a.bullet).toBe("");
    });

    it("assigns provided data", () => {
      const a = new Achievement({ id: "a1", bullet: "Won hackathon" });
      expect(a.id).toBe("a1");
      expect(a.bullet).toBe("Won hackathon");
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for a proper bullet", () => {
      const a = new Achievement({ bullet: "Led team of 5 engineers" });
      const result = a.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns error when bullet is empty", () => {
      const a = new Achievement({ bullet: "" });
      const result = a.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Achievement bullet point is required");
    });

    it("returns error when bullet is only whitespace", () => {
      const a = new Achievement({ bullet: "   " });
      const result = a.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Achievement bullet point is required");
    });

    it("returns error when bullet exceeds 100 chars without spaces", () => {
      // 101 non-space characters with some spaces mixed in
      const longBullet = "a".repeat(101);
      const a = new Achievement({ bullet: longBullet });
      const result = a.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/max 100 characters without spaces/);
    });

    it("allows bullet with exactly 100 non-space characters", () => {
      const bullet = "a ".repeat(50).trim(); // 50 'a' + 49 spaces + last 'a' = 50 non-space chars
      const exactBullet = "a".repeat(100);
      const a = new Achievement({ bullet: exactBullet });
      const result = a.validate();
      expect(result.isValid).toBe(true);
    });

    it("counts only non-space characters for the 100-char limit", () => {
      // 80 non-space chars + lots of spaces = under limit
      const bullet = "a ".repeat(80).trim();
      const a = new Achievement({ bullet });
      const result = a.validate();
      expect(result.isValid).toBe(true);
    });
  });

  // ── getCharCountWithoutSpaces() ──────────────────────────────────────
  describe("getCharCountWithoutSpaces()", () => {
    it("returns 0 for empty bullet", () => {
      const a = new Achievement({ bullet: "" });
      expect(a.getCharCountWithoutSpaces()).toBe(0);
    });

    it("counts only non-space characters", () => {
      const a = new Achievement({ bullet: "hello world" });
      expect(a.getCharCountWithoutSpaces()).toBe(10);
    });

    it("handles bullet with only spaces", () => {
      const a = new Achievement({ bullet: "   " });
      expect(a.getCharCountWithoutSpaces()).toBe(0);
    });

    it("handles tabs and newlines as whitespace", () => {
      const a = new Achievement({ bullet: "a\tb\nc" });
      expect(a.getCharCountWithoutSpaces()).toBe(3);
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("returns a plain object with id and bullet", () => {
      const a = new Achievement({ id: "x", bullet: "Did something great" });
      expect(a.toJSON()).toEqual({
        id: "x",
        bullet: "Did something great",
      });
    });
  });

  // ── escapeHtml() (static) ────────────────────────────────────────────
  describe("escapeHtml()", () => {
    it("escapes & < > \" '", () => {
      expect(Achievement.escapeHtml("&<>\"'")).toBe(
        "&amp;&lt;&gt;&quot;&#039;",
      );
    });

    it("returns empty string for null/undefined", () => {
      expect(Achievement.escapeHtml(null)).toBe("");
      expect(Achievement.escapeHtml(undefined)).toBe("");
    });

    it("returns empty string for empty input", () => {
      expect(Achievement.escapeHtml("")).toBe("");
    });

    it("returns the same string when no special chars", () => {
      expect(Achievement.escapeHtml("hello world")).toBe("hello world");
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates an Achievement instance from raw data", () => {
      const a = Achievement.fromRequest({ id: "1", bullet: "test" });
      expect(a).toBeInstanceOf(Achievement);
      expect(a.bullet).toBe("test");
    });

    it("handles empty object", () => {
      const a = Achievement.fromRequest({});
      expect(a).toBeInstanceOf(Achievement);
      expect(a.bullet).toBe("");
    });
  });
});
