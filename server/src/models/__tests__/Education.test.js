const Education = require("../Education");

describe("Education", () => {
  const validData = {
    id: "e1",
    institution: "MIT",
    degree: "B.S. Computer Science",
    location: "Cambridge, MA",
    startYear: "2018",
    endYear: "2022",
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const e = new Education();
      expect(e.id).toBe("");
      expect(e.institution).toBe("");
      expect(e.degree).toBe("");
      expect(e.location).toBe("");
      expect(e.startYear).toBe("");
      expect(e.endYear).toBe("");
    });

    it("assigns provided data", () => {
      const e = new Education(validData);
      expect(e.institution).toBe("MIT");
      expect(e.degree).toBe("B.S. Computer Science");
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for complete data", () => {
      const e = new Education(validData);
      const result = e.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns error when institution is missing", () => {
      const e = new Education({ ...validData, institution: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Institution name is required");
    });

    it("returns error when degree is missing", () => {
      const e = new Education({ ...validData, degree: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Degree is required");
    });

    it("returns error when location is missing", () => {
      const e = new Education({ ...validData, location: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Location is required");
    });

    it("returns error when startYear is missing", () => {
      const e = new Education({ ...validData, startYear: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start year is required");
    });

    it("returns error when endYear is missing", () => {
      const e = new Education({ ...validData, endYear: "" });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("End year is required");
    });

    it("collects multiple errors at once", () => {
      const e = new Education({});
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });

    it("returns error when startYear is in the future", () => {
      const futureYear = String(new Date().getFullYear() + 5);
      const e = new Education({ ...validData, startYear: futureYear });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start year cannot be in the future");
    });

    it("returns error when endYear is in the future", () => {
      const futureYear = String(new Date().getFullYear() + 5);
      const e = new Education({ ...validData, endYear: futureYear });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("End year cannot be in the future");
    });

    it("returns error when startYear is after endYear", () => {
      const e = new Education({
        ...validData,
        startYear: "2023",
        endYear: "2020",
      });
      const result = e.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Start year must be before or equal to end year",
      );
    });

    it("allows startYear equal to endYear", () => {
      const e = new Education({
        ...validData,
        startYear: "2022",
        endYear: "2022",
      });
      const result = e.validate();
      expect(result.isValid).toBe(true);
    });
  });

  // ── isComplete() ─────────────────────────────────────────────────────
  describe("isComplete()", () => {
    it("returns true when all fields are present", () => {
      const e = new Education(validData);
      expect(e.isComplete()).toBe(true);
    });

    it("returns false when any field is missing", () => {
      const e = new Education({ ...validData, degree: "" });
      expect(e.isComplete()).toBe(false);
    });

    it("returns false for whitespace-only fields", () => {
      const e = new Education({ ...validData, institution: "   " });
      expect(e.isComplete()).toBe(false);
    });
  });

  // ── getDuration() ────────────────────────────────────────────────────
  describe("getDuration()", () => {
    it("calculates years between start and end", () => {
      const e = new Education({
        ...validData,
        startYear: "2018",
        endYear: "2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(4);
      expect(duration.text).toBe("4 years");
    });

    it('returns "1 year" for a single year', () => {
      const e = new Education({
        ...validData,
        startYear: "2021",
        endYear: "2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(1);
      expect(duration.text).toBe("1 year");
    });

    it('returns "Less than 1 year" when start equals end', () => {
      const e = new Education({
        ...validData,
        startYear: "2022",
        endYear: "2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(0);
      expect(duration.text).toBe("Less than 1 year");
    });

    it('returns "Unknown duration" for invalid dates', () => {
      const e = new Education({
        ...validData,
        startYear: "invalid",
        endYear: "2022",
      });
      const duration = e.getDuration();
      expect(duration.years).toBe(0);
      expect(duration.text).toBe("Unknown duration");
    });
  });

  // ── parseDate() ──────────────────────────────────────────────────────
  describe("parseDate()", () => {
    it("parses a 4-digit year string", () => {
      const e = new Education();
      const date = e.parseDate("2022");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2022);
    });

    it('parses "Jan 2022" format', () => {
      const e = new Education();
      const date = e.parseDate("Jan 2022");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2022);
    });

    it("returns null for empty string", () => {
      const e = new Education();
      expect(e.parseDate("")).toBeNull();
    });

    it("returns null for null/undefined", () => {
      const e = new Education();
      expect(e.parseDate(null)).toBeNull();
      expect(e.parseDate(undefined)).toBeNull();
    });

    it("returns null for invalid date string", () => {
      const e = new Education();
      expect(e.parseDate("not-a-date")).toBeNull();
    });
  });

  // ── isYearInFuture() ─────────────────────────────────────────────────
  describe("isYearInFuture()", () => {
    it("returns true for a year in the future", () => {
      const e = new Education();
      const futureYear = String(new Date().getFullYear() + 5);
      expect(e.isYearInFuture(futureYear)).toBe(true);
    });

    it("returns false for the current year", () => {
      const e = new Education();
      const currentYear = String(new Date().getFullYear());
      expect(e.isYearInFuture(currentYear)).toBe(false);
    });

    it("returns false for a past year", () => {
      const e = new Education();
      expect(e.isYearInFuture("2000")).toBe(false);
    });

    it("returns false for invalid date", () => {
      const e = new Education();
      expect(e.isYearInFuture("invalid")).toBe(false);
    });
  });

  // ── getFormattedForLatex() ────────────────────────────────────────────
  describe("getFormattedForLatex()", () => {
    it("escapes LaTeX special characters", () => {
      const e = new Education({
        ...validData,
        institution: "MIT & Stanford",
        degree: "B.S. in C#",
      });
      const formatted = e.getFormattedForLatex();
      expect(formatted.institution).toContain("\\&");
      expect(formatted.degree).toContain("\\#");
    });
  });

  // ── escapeLatex() ────────────────────────────────────────────────────
  describe("escapeLatex()", () => {
    it("escapes $ & % # ^ _ ~ \\ { }", () => {
      const e = new Education();
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
      const e = new Education();
      expect(e.escapeLatex("")).toBe("");
      expect(e.escapeLatex(null)).toBe("");
      expect(e.escapeLatex(undefined)).toBe("");
    });

    it("replaces \" with ''", () => {
      const e = new Education();
      expect(e.escapeLatex('"hello"')).toBe("''hello''");
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("returns a plain object with all fields", () => {
      const e = new Education(validData);
      const json = e.toJSON();
      expect(json).toEqual(validData);
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates an Education instance from raw data", () => {
      const e = Education.fromRequest(validData);
      expect(e).toBeInstanceOf(Education);
      expect(e.institution).toBe("MIT");
    });
  });
});
