const PersonalInfo = require("../PersonalInfo");

describe("PersonalInfo", () => {
  const validData = {
    name: "John Doe",
    location: "New York, NY",
    phone: "555-123-4567",
    email: "john@example.com",
    linkedin: {
      url: "https://linkedin.com/in/johndoe",
      displayText: "johndoe",
    },
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const p = new PersonalInfo();
      expect(p.name).toBe("");
      expect(p.location).toBe("");
      expect(p.phone).toBe("");
      expect(p.email).toBe("");
      expect(p.linkedin).toBeNull();
    });

    it("assigns provided data", () => {
      const p = new PersonalInfo(validData);
      expect(p.name).toBe("John Doe");
      expect(p.email).toBe("john@example.com");
      expect(p.linkedin).toEqual({
        url: "https://linkedin.com/in/johndoe",
        displayText: "johndoe",
      });
    });

    it("sets linkedin to null when not provided", () => {
      const p = new PersonalInfo({ name: "Jane" });
      expect(p.linkedin).toBeNull();
    });

    it("handles linkedin with missing sub-fields", () => {
      const p = new PersonalInfo({ linkedin: {} });
      expect(p.linkedin).toEqual({ url: "", displayText: "" });
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for complete data", () => {
      const p = new PersonalInfo(validData);
      const result = p.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns error when name is missing", () => {
      const p = new PersonalInfo({ ...validData, name: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("returns error when location is missing", () => {
      const p = new PersonalInfo({ ...validData, location: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Location is required");
    });

    it("returns error when phone is missing", () => {
      const p = new PersonalInfo({ ...validData, phone: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Phone is required");
    });

    it("returns error when email is missing", () => {
      const p = new PersonalInfo({ ...validData, email: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Email is required");
    });

    it("returns error for invalid email format", () => {
      const p = new PersonalInfo({ ...validData, email: "not-an-email" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid email format");
    });

    it("returns error for invalid LinkedIn URL", () => {
      const p = new PersonalInfo({
        ...validData,
        linkedin: { url: "not-a-url", displayText: "test" },
      });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid LinkedIn URL format");
    });

    it("allows missing LinkedIn (optional)", () => {
      const { linkedin, ...dataWithoutLinkedin } = validData;
      const p = new PersonalInfo(dataWithoutLinkedin);
      const result = p.validate();
      expect(result.isValid).toBe(true);
    });

    it("allows LinkedIn with empty URL", () => {
      const p = new PersonalInfo({
        ...validData,
        linkedin: { url: "", displayText: "" },
      });
      const result = p.validate();
      expect(result.isValid).toBe(true);
    });

    it("collects multiple errors at once", () => {
      const p = new PersonalInfo({});
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ── isComplete() ─────────────────────────────────────────────────────
  describe("isComplete()", () => {
    it("returns true when all required fields are present with valid email", () => {
      const p = new PersonalInfo(validData);
      expect(p.isComplete()).toBe(true);
    });

    it("returns false when a required field is missing", () => {
      const p = new PersonalInfo({ ...validData, phone: "" });
      expect(p.isComplete()).toBe(false);
    });

    it("returns false when email is invalid", () => {
      const p = new PersonalInfo({ ...validData, email: "bad" });
      expect(p.isComplete()).toBe(false);
    });

    it("returns false for whitespace-only fields", () => {
      const p = new PersonalInfo({ ...validData, name: "   " });
      expect(p.isComplete()).toBe(false);
    });
  });

  // ── getDisplayName() ─────────────────────────────────────────────────
  describe("getDisplayName()", () => {
    it("returns the name when present", () => {
      const p = new PersonalInfo(validData);
      expect(p.getDisplayName()).toBe("John Doe");
    });

    it('returns "Unknown" when name is empty', () => {
      const p = new PersonalInfo({ name: "" });
      expect(p.getDisplayName()).toBe("Unknown");
    });

    it('returns "Unknown" when name is whitespace', () => {
      const p = new PersonalInfo({ name: "   " });
      expect(p.getDisplayName()).toBe("Unknown");
    });
  });

  // ── getFormattedContact() ────────────────────────────────────────────
  describe("getFormattedContact()", () => {
    it("returns formatted contact with escaped LaTeX chars", () => {
      const p = new PersonalInfo({
        ...validData,
        name: "John & Jane",
        location: "City #1",
      });
      const contact = p.getFormattedContact();
      expect(contact.name).toContain("\\&");
      expect(contact.location).toContain("\\#");
      expect(contact.email).toBe("john@example.com"); // email not escaped
    });

    it("includes linkedin when present", () => {
      const p = new PersonalInfo(validData);
      const contact = p.getFormattedContact();
      expect(contact.linkedin).not.toBeNull();
      expect(contact.linkedin.url).toBe("https://linkedin.com/in/johndoe");
    });

    it("sets linkedin to null when not present", () => {
      const { linkedin, ...dataWithoutLinkedin } = validData;
      const p = new PersonalInfo(dataWithoutLinkedin);
      const contact = p.getFormattedContact();
      expect(contact.linkedin).toBeNull();
    });
  });

  // ── isValidEmail() ───────────────────────────────────────────────────
  describe("isValidEmail()", () => {
    const p = new PersonalInfo();

    it("returns true for valid emails", () => {
      expect(p.isValidEmail("user@example.com")).toBe(true);
      expect(p.isValidEmail("user+tag@domain.co")).toBe(true);
    });

    it("returns false for invalid emails", () => {
      expect(p.isValidEmail("")).toBe(false);
      expect(p.isValidEmail("user")).toBe(false);
      expect(p.isValidEmail("user@")).toBe(false);
      expect(p.isValidEmail("@domain.com")).toBe(false);
      expect(p.isValidEmail("user @domain.com")).toBe(false);
    });
  });

  // ── isValidUrl() ─────────────────────────────────────────────────────
  describe("isValidUrl()", () => {
    const p = new PersonalInfo();

    it("returns true for valid URLs", () => {
      expect(p.isValidUrl("https://example.com")).toBe(true);
      expect(p.isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("returns false for invalid URLs", () => {
      expect(p.isValidUrl("not-a-url")).toBe(false);
      expect(p.isValidUrl("")).toBe(false);
    });
  });

  // ── escapeLatex() ────────────────────────────────────────────────────
  describe("escapeLatex()", () => {
    const p = new PersonalInfo();

    it("escapes special LaTeX characters", () => {
      const result = p.escapeLatex("$100 & 50% #1");
      expect(result).toContain("\\$");
      expect(result).toContain("\\&");
      expect(result).toContain("\\%");
      expect(result).toContain("\\#");
    });

    it("returns empty string for null/undefined/empty", () => {
      expect(p.escapeLatex("")).toBe("");
      expect(p.escapeLatex(null)).toBe("");
      expect(p.escapeLatex(undefined)).toBe("");
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("returns a plain object with all fields", () => {
      const p = new PersonalInfo(validData);
      expect(p.toJSON()).toEqual(validData);
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates a PersonalInfo instance from raw data", () => {
      const p = PersonalInfo.fromRequest(validData);
      expect(p).toBeInstanceOf(PersonalInfo);
      expect(p.name).toBe("John Doe");
    });

    it("throws for null input", () => {
      expect(() => PersonalInfo.fromRequest(null)).toThrow(
        "Invalid personal info data: expected object",
      );
    });

    it("throws for non-object input", () => {
      expect(() => PersonalInfo.fromRequest("string")).toThrow(
        "Invalid personal info data: expected object",
      );
    });
  });
});
