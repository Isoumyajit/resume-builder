const ResumeData = require("../ResumeData");
const PersonalInfo = require("../PersonalInfo");
const Experience = require("../Experience");
const Education = require("../Education");
const Project = require("../Project");
const ProfileLinks = require("../ProfileLinks");
const Skills = require("../Skills");
const Achievement = require("../Achievement");

describe("ResumeData", () => {
  // ── Shared fixtures ──────────────────────────────────────────────────
  const validPersonalInfo = {
    name: "Jane Doe",
    location: "San Francisco, CA",
    phone: "555-123-4567",
    email: "jane@example.com",
  };

  const validExperience = {
    id: "exp1",
    company: "Google",
    title: "Software Engineer",
    location: "Mountain View, CA",
    startDate: "Jan 2020",
    endDate: "Dec 2023",
    techStack: "React, Node.js",
    currentlyWorking: false,
    bullets: ["Built microservices"],
  };

  const validEducation = {
    id: "edu1",
    institution: "MIT",
    degree: "B.S. Computer Science",
    location: "Cambridge, MA",
    startYear: "2016",
    endYear: "2020",
  };

  const validProject = {
    id: "proj1",
    name: "Resume Builder",
    url: "https://example.com",
    techStack: "React, Node.js",
    description: "A tool to build resumes",
  };

  const validAchievement = { id: "ach1", bullet: "Won hackathon" };

  const validSkills = {
    languages: "JavaScript, Python",
    technologies: "React, Docker",
    other: "Agile, Scrum",
  };

  const validProfileLinks = {
    github: "https://github.com/janedoe",
    leetcode: "https://leetcode.com/janedoe",
  };

  /** Helper: builds a full valid resume data object */
  const buildFullData = (overrides = {}) => ({
    personalInfo: validPersonalInfo,
    experience: [validExperience],
    education: [validEducation],
    projects: [validProject],
    skills: validSkills,
    profileLinks: validProfileLinks,
    achievements: [validAchievement],
    ...overrides,
  });

  // ── Constructor / Composition ────────────────────────────────────────
  describe("constructor", () => {
    it("creates sub-model instances from raw data", () => {
      const r = new ResumeData(buildFullData());
      expect(r.personalInfo).toBeInstanceOf(PersonalInfo);
      expect(r.experience[0]).toBeInstanceOf(Experience);
      expect(r.education[0]).toBeInstanceOf(Education);
      expect(r.projects[0]).toBeInstanceOf(Project);
      expect(r.profileLinks).toBeInstanceOf(ProfileLinks);
      expect(r.skills).toBeInstanceOf(Skills);
      expect(r.achievements[0]).toBeInstanceOf(Achievement);
    });

    it("defaults to empty arrays/objects when no data is provided", () => {
      const r = new ResumeData();
      expect(r.personalInfo).toBeInstanceOf(PersonalInfo);
      expect(r.experience).toEqual([]);
      expect(r.education).toEqual([]);
      expect(r.projects).toEqual([]);
      expect(r.profileLinks).toBeInstanceOf(ProfileLinks);
      expect(r.skills).toBeInstanceOf(Skills);
      expect(r.achievements).toEqual([]);
    });

    it("sets createdAt and updatedAt timestamps", () => {
      const r = new ResumeData(buildFullData());
      expect(r.createdAt).toBeInstanceOf(Date);
      expect(r.updatedAt).toBeInstanceOf(Date);
    });

    it("preserves provided createdAt/updatedAt", () => {
      const ts = new Date("2024-01-01");
      const r = new ResumeData(buildFullData({ createdAt: ts, updatedAt: ts }));
      expect(r.createdAt).toBe(ts);
      expect(r.updatedAt).toBe(ts);
    });

    it("handles multiple experience entries", () => {
      const r = new ResumeData(
        buildFullData({
          experience: [validExperience, { ...validExperience, id: "exp2" }],
        }),
      );
      expect(r.experience).toHaveLength(2);
      expect(r.experience[1].id).toBe("exp2");
    });
  });

  // ── transformedAchievements() ────────────────────────────────────────
  describe("transformedAchievements()", () => {
    it("keeps single-bullet achievements as-is", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [{ id: "a1", bullet: "Won hackathon" }],
        }),
      );
      expect(r.achievements).toHaveLength(1);
      expect(r.achievements[0].bullet).toBe("Won hackathon");
    });

    it("splits comma-separated bullets into separate Achievement instances", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [
            { id: "a1", bullet: "Won hackathon, Published paper, Led team" },
          ],
        }),
      );
      expect(r.achievements).toHaveLength(3);
      expect(r.achievements[0].bullet).toBe("Won hackathon");
      expect(r.achievements[1].bullet).toBe("Published paper");
      expect(r.achievements[2].bullet).toBe("Led team");
    });

    it("trims whitespace from split bullets", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [{ id: "a1", bullet: "  First ,  Second  " }],
        }),
      );
      expect(r.achievements[0].bullet).toBe("First");
      expect(r.achievements[1].bullet).toBe("Second");
    });

    it("assigns unique IDs to split achievements", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [{ id: "a1", bullet: "Alpha, Beta" }],
        }),
      );
      const ids = r.achievements.map((a) => a.id);
      // All IDs should be unique (UUID-style)
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("handles mix of single and comma-separated achievements", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [
            { id: "a1", bullet: "Solo achievement" },
            { id: "a2", bullet: "First, Second" },
            { id: "a3", bullet: "Another solo" },
          ],
        }),
      );
      expect(r.achievements).toHaveLength(4);
      expect(r.achievements[0].bullet).toBe("Solo achievement");
      expect(r.achievements[1].bullet).toBe("First");
      expect(r.achievements[2].bullet).toBe("Second");
      expect(r.achievements[3].bullet).toBe("Another solo");
    });

    it("handles empty achievements array", () => {
      const r = new ResumeData(buildFullData({ achievements: [] }));
      expect(r.achievements).toEqual([]);
    });

    it("all transformed achievements are Achievement instances", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [{ id: "a1", bullet: "A, B, C" }],
        }),
      );
      r.achievements.forEach((a) => {
        expect(a).toBeInstanceOf(Achievement);
      });
    });
  });

  // ── validate() ───────────────────────────────────────────────────────
  describe("validate()", () => {
    it("returns valid for complete, correct data", () => {
      const r = new ResumeData(buildFullData());
      const result = r.validate();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("prefixes personal info errors with 'Personal Info:'", () => {
      const r = new ResumeData(
        buildFullData({ personalInfo: { name: "", email: "" } }),
      );
      const result = r.validate();
      expect(result.isValid).toBe(false);
      const piErrors = result.errors.filter((e) =>
        e.startsWith("Personal Info:"),
      );
      expect(piErrors.length).toBeGreaterThan(0);
    });

    it("prefixes experience errors with 'Experience N:'", () => {
      const r = new ResumeData(
        buildFullData({
          experience: [{ ...validExperience, company: "" }],
        }),
      );
      const result = r.validate();
      const expErrors = result.errors.filter((e) =>
        e.startsWith("Experience 1:"),
      );
      expect(expErrors.length).toBeGreaterThan(0);
    });

    it("prefixes education errors with 'Education N:'", () => {
      const r = new ResumeData(
        buildFullData({
          education: [{ ...validEducation, institution: "" }],
        }),
      );
      const result = r.validate();
      const eduErrors = result.errors.filter((e) =>
        e.startsWith("Education 1:"),
      );
      expect(eduErrors.length).toBeGreaterThan(0);
    });

    it("prefixes project errors with 'Project N:'", () => {
      const r = new ResumeData(
        buildFullData({
          projects: [{ ...validProject, name: "" }],
        }),
      );
      const result = r.validate();
      const projErrors = result.errors.filter((e) =>
        e.startsWith("Project 1:"),
      );
      expect(projErrors.length).toBeGreaterThan(0);
    });

    it("prefixes achievement errors with 'Achievement N:'", () => {
      const r = new ResumeData(
        buildFullData({
          achievements: [{ id: "a1", bullet: "" }],
        }),
      );
      const result = r.validate();
      const achErrors = result.errors.filter((e) =>
        e.startsWith("Achievement 1:"),
      );
      expect(achErrors.length).toBeGreaterThan(0);
    });

    it("aggregates errors from multiple sub-models", () => {
      const r = new ResumeData(
        buildFullData({
          personalInfo: { name: "" },
          experience: [{ ...validExperience, company: "" }],
          education: [{ ...validEducation, institution: "" }],
        }),
      );
      const result = r.validate();
      expect(result.isValid).toBe(false);
      // Should have errors from personal info, experience, and education
      expect(result.errors.some((e) => e.startsWith("Personal Info:"))).toBe(
        true,
      );
      expect(result.errors.some((e) => e.startsWith("Experience 1:"))).toBe(
        true,
      );
      expect(result.errors.some((e) => e.startsWith("Education 1:"))).toBe(
        true,
      );
    });

    it("validates multiple experience entries independently", () => {
      const r = new ResumeData(
        buildFullData({
          experience: [
            validExperience,
            { ...validExperience, id: "exp2", title: "" },
          ],
        }),
      );
      const result = r.validate();
      // Only the second experience should have errors
      expect(result.errors.some((e) => e.startsWith("Experience 1:"))).toBe(
        false,
      );
      expect(result.errors.some((e) => e.startsWith("Experience 2:"))).toBe(
        true,
      );
    });

    it("returns valid when there are no experience/education/projects", () => {
      const r = new ResumeData(
        buildFullData({
          experience: [],
          education: [],
          projects: [],
          achievements: [],
        }),
      );
      const result = r.validate();
      expect(result.isValid).toBe(true);
    });
  });

  // ── hasMinimumContent() ──────────────────────────────────────────────
  describe("hasMinimumContent()", () => {
    it("returns true when personalInfo is complete and has experience", () => {
      const r = new ResumeData(buildFullData());
      expect(r.hasMinimumContent()).toBe(true);
    });

    it("returns true with only education (no experience)", () => {
      const r = new ResumeData(buildFullData({ experience: [], projects: [] }));
      expect(r.hasMinimumContent()).toBe(true);
    });

    it("returns true with only projects (no experience/education)", () => {
      const r = new ResumeData(
        buildFullData({ experience: [], education: [] }),
      );
      expect(r.hasMinimumContent()).toBe(true);
    });

    it("returns false when personalInfo is incomplete", () => {
      const r = new ResumeData(
        buildFullData({ personalInfo: { name: "Jane" } }),
      );
      expect(r.hasMinimumContent()).toBe(false);
    });

    it("returns false when no experience, education, or projects", () => {
      const r = new ResumeData(
        buildFullData({ experience: [], education: [], projects: [] }),
      );
      expect(r.hasMinimumContent()).toBe(false);
    });
  });

  // ── getFileName() ────────────────────────────────────────────────────
  describe("getFileName()", () => {
    it("sanitizes name for filename", () => {
      const r = new ResumeData(buildFullData());
      expect(r.getFileName()).toBe("jane_doe");
    });

    it("removes special characters", () => {
      const r = new ResumeData(
        buildFullData({
          personalInfo: { ...validPersonalInfo, name: "Jane O'Brien-Smith!" },
        }),
      );
      expect(r.getFileName()).toMatch(/^[a-z0-9_]+$/);
    });

    it('defaults to "resume" when name is empty', () => {
      const r = new ResumeData(
        buildFullData({ personalInfo: { ...validPersonalInfo, name: "" } }),
      );
      expect(r.getFileName()).toBe("resume");
    });

    it("truncates to 50 characters", () => {
      const longName = "a".repeat(100);
      const r = new ResumeData(
        buildFullData({
          personalInfo: { ...validPersonalInfo, name: longName },
        }),
      );
      expect(r.getFileName().length).toBeLessThanOrEqual(50);
    });

    it("replaces spaces with underscores", () => {
      const r = new ResumeData(
        buildFullData({
          personalInfo: { ...validPersonalInfo, name: "John   Smith" },
        }),
      );
      // Multiple spaces collapse to single underscore
      expect(r.getFileName()).toBe("john_smith");
    });
  });

  // ── getStats() ───────────────────────────────────────────────────────
  describe("getStats()", () => {
    it("returns correct counts for populated resume", () => {
      const r = new ResumeData(buildFullData());
      const stats = r.getStats();
      expect(stats.experienceCount).toBe(1);
      expect(stats.educationCount).toBe(1);
      expect(stats.projectsCount).toBe(1);
      expect(stats.achievementsCount).toBe(1);
      expect(stats.totalBullets).toBe(1); // one bullet in validExperience
      expect(stats.hasProfileLinks).toBe(true);
      expect(stats.hasSkills).toBe(true);
      expect(stats.hasAchievements).toBe(true);
      expect(stats.isComplete).toBe(true);
    });

    it("returns zeros for empty resume", () => {
      const r = new ResumeData();
      const stats = r.getStats();
      expect(stats.experienceCount).toBe(0);
      expect(stats.educationCount).toBe(0);
      expect(stats.projectsCount).toBe(0);
      expect(stats.achievementsCount).toBe(0);
      expect(stats.totalBullets).toBe(0);
      expect(stats.hasProfileLinks).toBe(false);
      expect(stats.hasSkills).toBe(false);
      expect(stats.hasAchievements).toBe(false);
      expect(stats.isComplete).toBe(false);
    });

    it("sums bullets across multiple experiences", () => {
      const r = new ResumeData(
        buildFullData({
          experience: [
            { ...validExperience, bullets: ["a", "b"] },
            { ...validExperience, id: "exp2", bullets: ["c", "d", "e"] },
          ],
        }),
      );
      const stats = r.getStats();
      expect(stats.totalBullets).toBe(5);
    });
  });

  // ── toJSON() ─────────────────────────────────────────────────────────
  describe("toJSON()", () => {
    it("returns a plain object with all sections", () => {
      const r = new ResumeData(buildFullData());
      const json = r.toJSON();
      expect(json).toHaveProperty("personalInfo");
      expect(json).toHaveProperty("experience");
      expect(json).toHaveProperty("education");
      expect(json).toHaveProperty("projects");
      expect(json).toHaveProperty("profileLinks");
      expect(json).toHaveProperty("skills");
      expect(json).toHaveProperty("achievements");
      expect(json).toHaveProperty("metadata");
      expect(json.metadata).toHaveProperty("createdAt");
      expect(json.metadata).toHaveProperty("updatedAt");
    });

    it("serializes experience as array of plain objects", () => {
      const r = new ResumeData(buildFullData());
      const json = r.toJSON();
      expect(Array.isArray(json.experience)).toBe(true);
      expect(json.experience[0]).toHaveProperty("company", "Google");
    });

    it("serializes achievements as array of plain objects", () => {
      const r = new ResumeData(buildFullData());
      const json = r.toJSON();
      expect(Array.isArray(json.achievements)).toBe(true);
      json.achievements.forEach((a) => {
        expect(a).toHaveProperty("id");
        expect(a).toHaveProperty("bullet");
      });
    });
  });

  // ── fromRequest() (static) ──────────────────────────────────────────
  describe("fromRequest()", () => {
    it("creates a ResumeData instance from raw data", () => {
      const r = ResumeData.fromRequest(buildFullData());
      expect(r).toBeInstanceOf(ResumeData);
      expect(r.personalInfo.name).toBe("Jane Doe");
    });

    it("throws for null input", () => {
      expect(() => ResumeData.fromRequest(null)).toThrow(
        "Invalid resume data: expected object",
      );
    });

    it("throws for undefined input", () => {
      expect(() => ResumeData.fromRequest(undefined)).toThrow(
        "Invalid resume data: expected object",
      );
    });

    it("throws for non-object input (string)", () => {
      expect(() => ResumeData.fromRequest("not an object")).toThrow(
        "Invalid resume data: expected object",
      );
    });

    it("throws for non-object input (number)", () => {
      expect(() => ResumeData.fromRequest(42)).toThrow(
        "Invalid resume data: expected object",
      );
    });

    it("accepts empty object (defaults applied)", () => {
      const r = ResumeData.fromRequest({});
      expect(r).toBeInstanceOf(ResumeData);
      expect(r.experience).toEqual([]);
    });
  });

  // ── validateRequest() (static) ──────────────────────────────────────
  describe("validateRequest()", () => {
    it("returns valid with data for correct input", () => {
      const result = ResumeData.validateRequest(buildFullData());
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeInstanceOf(ResumeData);
    });

    it("returns invalid with errors for bad personal info", () => {
      const result = ResumeData.validateRequest(
        buildFullData({ personalInfo: { name: "" } }),
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.data).toBeNull();
    });

    it("returns invalid with error message for null input", () => {
      const result = ResumeData.validateRequest(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid resume data: expected object");
      expect(result.data).toBeNull();
    });

    it("returns invalid with error message for undefined input", () => {
      const result = ResumeData.validateRequest(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid resume data: expected object");
      expect(result.data).toBeNull();
    });

    it("returns invalid with error message for non-object input", () => {
      const result = ResumeData.validateRequest("string");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.data).toBeNull();
    });

    it("catches errors from sub-model validation", () => {
      const result = ResumeData.validateRequest(
        buildFullData({
          experience: [{ ...validExperience, company: "", title: "" }],
        }),
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.startsWith("Experience 1:"))).toBe(
        true,
      );
    });

    it("returns data: null when validation fails", () => {
      const result = ResumeData.validateRequest(
        buildFullData({ personalInfo: {} }),
      );
      expect(result.data).toBeNull();
    });

    it("returns data: ResumeData when validation passes", () => {
      const result = ResumeData.validateRequest(buildFullData());
      expect(result.data).toBeInstanceOf(ResumeData);
    });
  });
});
