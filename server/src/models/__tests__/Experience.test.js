const Experience = require("../Experience");

describe("Experience", () => {
  const validData = {
    id: "exp1",
    company: "Google",
    title: "Software Engineer",
    location: "Mountain View, CA",
    startDate: "Jan 2020",
    endDate: "Dec 2023",
    techStack: "React, Node.js, GCP",
    currentlyWorking: false,
    bullets: ["Built microservices", "Led team of 4"],
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const e = new Experience();
      expect(e.id).toBe("");
      expect(e.company).toBe("");
      expect(e.title).toBe("");
      expect(e.location).toBe("");
      expect(e.startDate).toBe("");
      expect(e.endDate).toBe("");
      expect(e.techStack).toBe("");
      expect(e.currentlyWorking).toBe(false);
      expect(e.bullets).toEqual([""]);
    });

    it("assigns provided data", () => {
      const e = new Experience(validData);
      expect(e.company).toBe("Google");
      expect(e.title).toBe("Software Engineer");
      expect(e.location).toBe("Mountain View, CA");
      expect(e.startDate).toBe("Jan 2020");
      expect(e.endDate).toBe("Dec 2023");
      expect(e.techStack).toBe("React, Node.js, GCP");
      expect(e.currentlyWorking).toBe(false);
      expect(e.bullets).toEqual(["Built microservices", "Led team of 4"]);
    });

    it("defaults bullets to [''] when not an array", () => {
      const e = new Experience({ ...validData, bullets: "not-an-array" });
      expect(e.bullets).toEqual([""]);
    });

    it("preserves bullets array as-is", () => {
      const e = new Experience({ ...validData, bullets: ["a", "b", "c"] });
      expect(e.bullets).toEqual(["a", "b", "c"]);
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for complete data", () => {
      const e = new Experience(validData);
      const result = e.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns error when company is missing", () => {
      const e = new Experience({ ...validData, company: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Company name is required");
    });

    it("returns error when title is missing", () => {
      const e = new Experience({ ...validData, title: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Job title is required");
    });

    it("returns error when location is missing", () => {
      const e = new Experience({ ...validData, location: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Location is required");
    });

    it("returns error when startDate is missing", () => {
      const e = new Experience({ ...validData, startDate: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start date is required");
    });

    it("returns error when endDate is missing", () => {
      const e = new Experience({ ...validData, endDate: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("End date is required");
    });

    it("collects multiple errors at once", () => {
      const e = new Experience({});
      const result = e.validate();
      expect(result.isValid).toBe(false);
      // company, title, location, startDate, endDate, bullets = 6 required
      expect(result.errors.length).toBeGreaterThanOrEqual(6);
    });

    it("returns error when startDate is in the future", () => {
      const futureDate = "Jan 2099";
      const e = new Experience({ ...validData, startDate: futureDate });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start date cannot be in the future");
    });

    it("returns error when endDate is in the future (non-Present)", () => {
      const futureDate = "Dec 2099";
      const e = new Experience({
        ...validData,
        endDate: futureDate,
        currentlyWorking: false,
      });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("End date cannot be in the future");
    });

    it("requires endDate to be 'Present' when currentlyWorking is true", () => {
      const e = new Experience({
        ...validData,
        currentlyWorking: true,
        endDate: "Dec 2023",
      });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'If currently working, end date should be "Present"',
      );
    });

    it("passes when currentlyWorking is true and endDate is 'Present'", () => {
      const e = new Experience({
        ...validData,
        currentlyWorking: true,
        endDate: "Present",
      });
      const result = e.validate();
      expect(result.isValid).toBe(true);
    });

    it("returns error when not currentlyWorking but endDate is 'Present'", () => {
      const e = new Experience({
        ...validData,
        currentlyWorking: false,
        endDate: "Present",
      });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'If not currently working, end date should not be "Present"',
      );
    });

    it("returns error when startDate is after endDate", () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2023",
        endDate: "Jan 2020",
      });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Start date must be before or equal to end date",
      );
    });

    it("allows startDate equal to endDate", () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2022",
        endDate: "Jan 2022",
      });
      const result = e.validate();
      expect(result.isValid).toBe(true);
    });

    it("returns error when bullets are all empty", () => {
      const e = new Experience({ ...validData, bullets: ["", "  ", ""] });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "At least one achievement/responsibility bullet point is required",
      );
    });

    it("passes when at least one bullet has content", () => {
      const e = new Experience({ ...validData, bullets: ["", "Did work", ""] });
      const result = e.validate();
      expect(result.isValid).toBe(true);
    });
  });

  // ── parseDate() ──────────────────────────────────────────────────────
  describe("parseDate()", () => {
    it('parses "Present" as today\'s date', () => {
      const e = new Experience();
      const date = e.parseDate("Present");
      expect(date).toBeInstanceOf(Date);
      // Should be roughly "now"
      expect(Math.abs(date.getTime() - Date.now())).toBeLessThan(1000);
    });

    it('parses "present" (lowercase) as today\'s date', () => {
      const e = new Experience();
      const date = e.parseDate("present");
      expect(date).toBeInstanceOf(Date);
    });

    it('parses "Jan 2022" format', () => {
      const e = new Experience();
      const date = e.parseDate("Jan 2022");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2022);
      expect(date.getMonth()).toBe(0); // January
    });

    it('parses "Dec 2020" format', () => {
      const e = new Experience();
      const date = e.parseDate("Dec 2020");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2020);
      expect(date.getMonth()).toBe(11); // December
    });

    it("parses a 4-digit year string", () => {
      const e = new Experience();
      const date = e.parseDate("2022");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2022);
      expect(date.getMonth()).toBe(0); // January 1st
    });

    it("returns null for empty string", () => {
      const e = new Experience();
      expect(e.parseDate("")).toBeNull();
    });

    it("returns null for null/undefined", () => {
      const e = new Experience();
      expect(e.parseDate(null)).toBeNull();
      expect(e.parseDate(undefined)).toBeNull();
    });

    it("returns null for whitespace-only string", () => {
      const e = new Experience();
      expect(e.parseDate("   ")).toBeNull();
    });

    it("returns null for completely invalid date string", () => {
      const e = new Experience();
      expect(e.parseDate("not-a-date")).toBeNull();
    });

    it("attempts to parse other date formats", () => {
      const e = new Experience();
      // "2022-06-15" is a valid Date string
      const date = e.parseDate("2022-06-15");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2022);
    });
  });

  // ── isDateInFuture() ─────────────────────────────────────────────────
  describe("isDateInFuture()", () => {
    it('returns false for "Present"', () => {
      const e = new Experience();
      expect(e.isDateInFuture("Present")).toBe(false);
    });

    it('returns false for "present" (lowercase)', () => {
      const e = new Experience();
      expect(e.isDateInFuture("present")).toBe(false);
    });

    it("returns true for a date far in the future", () => {
      const e = new Experience();
      expect(e.isDateInFuture("Jan 2099")).toBe(true);
    });

    it("returns false for a date in the past", () => {
      const e = new Experience();
      expect(e.isDateInFuture("Jan 2000")).toBe(false);
    });

    it("returns false for an invalid date string", () => {
      const e = new Experience();
      expect(e.isDateInFuture("not-a-date")).toBe(false);
    });

    it("returns false for null/undefined", () => {
      const e = new Experience();
      expect(e.isDateInFuture(null)).toBe(false);
      expect(e.isDateInFuture(undefined)).toBe(false);
    });
  });

  // ── getDuration() ────────────────────────────────────────────────────
  describe("getDuration()", () => {
    it("calculates years and months between two dates", () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2020",
        endDate: "Jan 2023",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(3);
      expect(duration.months).toBe(0);
      expect(duration.text).toBe("3 years");
    });

    it('returns "1 year" for a single year span', () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2022",
        endDate: "Jan 2023",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(1);
      expect(duration.text).toBe("1 year");
    });

    it("calculates months for sub-year durations", () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2022",
        endDate: "Jun 2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(0);
      expect(duration.months).toBeGreaterThan(0);
      expect(duration.text).toMatch(/month/);
    });

    it("includes both years and months when applicable", () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2020",
        endDate: "Jun 2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBeGreaterThanOrEqual(2);
      expect(duration.text).toMatch(/year/);
    });

    it('returns "Less than 1 month" for same-day dates', () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2022",
        endDate: "Jan 2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(0);
      expect(duration.months).toBe(0);
      expect(duration.text).toBe("Less than 1 month");
    });

    it('returns "Unknown duration" when startDate is invalid', () => {
      const e = new Experience({
        ...validData,
        startDate: "invalid",
        endDate: "Jan 2023",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(0);
      expect(duration.months).toBe(0);
      expect(duration.text).toBe("Unknown duration");
    });

    it('returns "Unknown duration" when endDate is invalid', () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2020",
        endDate: "invalid",
      });
      const duration = e.getDuration();
      expect(duration.text).toBe("Unknown duration");
    });

    it('handles "Present" as endDate (duration up to now)', () => {
      const e = new Experience({
        ...validData,
        startDate: "Jan 2020",
        endDate: "Present",
        currentlyWorking: true,
      });
      const duration = e.getDuration();
      // Should be at least a few years from Jan 2020 to now
      expect(duration.years).toBeGreaterThanOrEqual(5);
      expect(duration.text).toMatch(/year/);
    });

    it("pluralizes months correctly", () => {
      // ~2 months
      const e = new Experience({
        ...validData,
        startDate: "Jan 2022",
        endDate: "Mar 2022",
      });
      const duration = e.getDuration();
      expect(duration.months).toBeGreaterThanOrEqual(1);
      if (duration.months > 1) {
        expect(duration.text).toMatch(/months/);
      }
    });
  });

  // ── isComplete() ─────────────────────────────────────────────────────
  describe("isComplete()", () => {
    it("returns true when all required fields are present", () => {
      const e = new Experience(validData);
      expect(e.isComplete()).toBe(true);
    });

    it("returns false when company is missing", () => {
      const e = new Experience({ ...validData, company: "" });
      expect(e.isComplete()).toBe(false);
    });

    it("returns false when title is missing", () => {
      const e = new Experience({ ...validData, title: "" });
      expect(e.isComplete()).toBe(false);
    });

    it("returns false when all bullets are empty", () => {
      const e = new Experience({ ...validData, bullets: ["", "  "] });
      expect(e.isComplete()).toBe(false);
    });

    it("returns false for whitespace-only fields", () => {
      const e = new Experience({ ...validData, location: "   " });
      expect(e.isComplete()).toBe(false);
    });
  });

  // ── getFormattedForLatex() ───────────────────────────────────────────
  describe("getFormattedForLatex()", () => {
    it("escapes LaTeX special characters in all fields", () => {
      const e = new Experience({
        ...validData,
        company: "Google & Meta",
        title: "Engineer #1",
        techStack: "C++ & Python",
        bullets: ["Improved perf by $50%", ""],
      });
      const formatted = e.getFormattedForLatex();
      expect(formatted.company).toContain("\\&");
      expect(formatted.title).toContain("\\#");
      expect(formatted.techStack).toContain("\\&");
      expect(formatted.bullets).toHaveLength(1); // empty bullet filtered
      expect(formatted.bullets[0]).toContain("\\$");
      expect(formatted.bullets[0]).toContain("\\%");
    });

    it("filters out empty bullets", () => {
      const e = new Experience({
        ...validData,
        bullets: ["Real bullet", "", "  ", "Another bullet"],
      });
      const formatted = e.getFormattedForLatex();
      expect(formatted.bullets).toHaveLength(2);
    });
  });

  // ── escapeLatex() ────────────────────────────────────────────────────
  describe("escapeLatex()", () => {
    it("escapes $ & % # ^ _ ~ \\ { }", () => {
      const e = new Experience();
      const result = e.escapeLatex("$100 & 50% off #1 ^top _under ~wave");
      expect(result).toContain("\\$");
      expect(result).toContain("\\&");
      expect(result).toContain("\\%");
      expect(result).toContain("\\#");
      expect(result).toContain("\\^");
      expect(result).toContain("\\_");
      expect(result).toContain("\\~");
    });

    it("returns empty string for null/undefined/empty", () => {
      const e = new Experience();
      expect(e.escapeLatex("")).toBe("");
      expect(e.escapeLatex(null)).toBe("");
      expect(e.escapeLatex(undefined)).toBe("");
    });

    it("replaces \" with ''", () => {
      const e = new Experience();
      expect(e.escapeLatex('"hello"')).toBe("''hello''");
    });

    it("escapes backslash to \\textbackslash{}", () => {
      const e = new Experience();
      const result = e.escapeLatex("path\\to");
      expect(result).toContain("textbackslash");
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("returns a plain object with all fields", () => {
      const e = new Experience(validData);
      const json = e.toJSON();
      expect(json.id).toBe("exp1");
      expect(json.company).toBe("Google");
      expect(json.title).toBe("Software Engineer");
      expect(json.currentlyWorking).toBe(false);
    });

    it("filters out empty bullets", () => {
      const e = new Experience({
        ...validData,
        bullets: ["Real", "", "  ", "Another"],
      });
      const json = e.toJSON();
      expect(json.bullets).toEqual(["Real", "Another"]);
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates an Experience instance from raw data", () => {
      const e = Experience.fromRequest(validData);
      expect(e).toBeInstanceOf(Experience);
      expect(e.company).toBe("Google");
    });

    it("handles empty object", () => {
      const e = Experience.fromRequest({});
      expect(e).toBeInstanceOf(Experience);
      expect(e.company).toBe("");
    });
  });
});
