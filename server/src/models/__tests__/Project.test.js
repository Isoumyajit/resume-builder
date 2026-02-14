const Project = require("../Project");

describe("Project", () => {
  const validData = {
    id: "p1",
    name: "Resume Builder",
    url: "https://github.com/user/resume-builder",
    techStack: "React, Node.js, Express",
    description: "A web app to build professional resumes",
  };

  // ── Constructor ──────────────────────────────────────────────────────
  describe("constructor", () => {
    it("sets defaults when no data is provided", () => {
      const p = new Project();
      expect(p.id).toBe("");
      expect(p.name).toBe("");
      expect(p.url).toBe("");
      expect(p.techStack).toBe("");
      expect(p.description).toBe("");
    });

    it("assigns provided data", () => {
      const p = new Project(validData);
      expect(p.name).toBe("Resume Builder");
      expect(p.techStack).toBe("React, Node.js, Express");
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for complete data", () => {
      const p = new Project(validData);
      const result = p.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("returns error when name is missing", () => {
      const p = new Project({ ...validData, name: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Project name is required");
    });

    it("returns error when techStack is missing", () => {
      const p = new Project({ ...validData, techStack: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Tech stack is required");
    });

    it("returns error when description is missing", () => {
      const p = new Project({ ...validData, description: "" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Project description is required");
    });

    it("returns error for invalid URL", () => {
      const p = new Project({ ...validData, url: "not-a-url" });
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid project URL format");
    });

    it("allows empty URL (optional)", () => {
      const p = new Project({ ...validData, url: "" });
      const result = p.validate();
      expect(result.isValid).toBe(true);
    });

    it("allows whitespace-only URL (treated as empty)", () => {
      const p = new Project({ ...validData, url: "   " });
      const result = p.validate();
      expect(result.isValid).toBe(true);
    });

    it("collects multiple errors at once", () => {
      const p = new Project({});
      const result = p.validate();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── isComplete() ─────────────────────────────────────────────────────
  describe("isComplete()", () => {
    it("returns true when required fields are present", () => {
      const p = new Project(validData);
      expect(p.isComplete()).toBe(true);
    });

    it("returns true even without URL (not required)", () => {
      const p = new Project({ ...validData, url: "" });
      expect(p.isComplete()).toBe(true);
    });

    it("returns false when a required field is missing", () => {
      const p = new Project({ ...validData, name: "" });
      expect(p.isComplete()).toBe(false);
    });

    it("returns false for whitespace-only required fields", () => {
      const p = new Project({ ...validData, techStack: "   " });
      expect(p.isComplete()).toBe(false);
    });
  });

  // ── getFormattedForLatex() ────────────────────────────────────────────
  describe("getFormattedForLatex()", () => {
    it("escapes LaTeX special characters", () => {
      const p = new Project({
        ...validData,
        name: "Project #1",
        techStack: "C++ & Rust",
      });
      const formatted = p.getFormattedForLatex();
      expect(formatted.name).toContain("\\#");
      expect(formatted.techStack).toContain("\\&");
    });

    it("keeps URL unescaped", () => {
      const p = new Project(validData);
      const formatted = p.getFormattedForLatex();
      expect(formatted.url).toBe("https://github.com/user/resume-builder");
    });

    it("returns null for empty URL", () => {
      const p = new Project({ ...validData, url: "" });
      const formatted = p.getFormattedForLatex();
      expect(formatted.url).toBeNull();
    });
  });

  // ── getTechStackArray() ──────────────────────────────────────────────
  describe("getTechStackArray()", () => {
    it("splits comma-separated tech stack", () => {
      const p = new Project(validData);
      expect(p.getTechStackArray()).toEqual(["React", "Node.js", "Express"]);
    });

    it("splits semicolon-separated tech stack", () => {
      const p = new Project({
        ...validData,
        techStack: "React; Node.js; Express",
      });
      expect(p.getTechStackArray()).toEqual(["React", "Node.js", "Express"]);
    });

    it("trims whitespace from each tech", () => {
      const p = new Project({
        ...validData,
        techStack: "  React ,  Node.js  ",
      });
      expect(p.getTechStackArray()).toEqual(["React", "Node.js"]);
    });

    it("filters out empty entries", () => {
      const p = new Project({ ...validData, techStack: "React,,Node.js," });
      expect(p.getTechStackArray()).toEqual(["React", "Node.js"]);
    });
  });

  // ── hasLiveUrl() ─────────────────────────────────────────────────────
  describe("hasLiveUrl()", () => {
    it("returns true for valid URL", () => {
      const p = new Project(validData);
      expect(p.hasLiveUrl()).toBe(true);
    });

    it("returns false for empty URL", () => {
      const p = new Project({ ...validData, url: "" });
      expect(p.hasLiveUrl()).toBe(false);
    });

    it("returns false for invalid URL", () => {
      const p = new Project({ ...validData, url: "not-valid" });
      expect(p.hasLiveUrl()).toBe(false);
    });
  });

  // ── escapeLatex() ────────────────────────────────────────────────────
  describe("escapeLatex()", () => {
    const p = new Project();

    it("escapes $ & % # ^ _ ~", () => {
      const result = p.escapeLatex("$100 & 50% #1 ^top _under ~wave");
      expect(result).toContain("\\$");
      expect(result).toContain("\\&");
      expect(result).toContain("\\%");
      expect(result).toContain("\\#");
      expect(result).toContain("\\^");
      expect(result).toContain("\\_");
      expect(result).toContain("\\~");
    });

    it("escapes backslash to \\textbackslash", () => {
      const result = p.escapeLatex("path\\to\\file");
      // Backslash becomes \textbackslash{}, then {} gets escaped to \{\}
      expect(result).toContain("\\textbackslash");
    });

    it("escapes curly braces", () => {
      const result = p.escapeLatex("{hello}");
      expect(result).toContain("\\{");
      expect(result).toContain("\\}");
    });

    it("replaces \" with ''", () => {
      expect(p.escapeLatex('"quoted"')).toBe("''quoted''");
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
      const p = new Project(validData);
      const json = p.toJSON();
      expect(json.id).toBe("p1");
      expect(json.name).toBe("Resume Builder");
      expect(json.techStack).toBe("React, Node.js, Express");
    });

    it("returns undefined for empty URL", () => {
      const p = new Project({ ...validData, url: "" });
      const json = p.toJSON();
      expect(json.url).toBeUndefined();
    });
  });

  // ── isValidUrl() ─────────────────────────────────────────────────────
  describe("isValidUrl()", () => {
    const p = new Project();

    it("returns true for valid URLs", () => {
      expect(p.isValidUrl("https://example.com")).toBe(true);
      expect(p.isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("returns false for invalid URLs", () => {
      expect(p.isValidUrl("not-a-url")).toBe(false);
      expect(p.isValidUrl("")).toBe(false);
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates a Project instance from raw data", () => {
      const p = Project.fromRequest(validData);
      expect(p).toBeInstanceOf(Project);
      expect(p.name).toBe("Resume Builder");
    });
  });
});
