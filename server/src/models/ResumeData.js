/**
 * ResumeData Model
 * Core data model that mirrors the frontend ResumeFormData structure
 */

const PersonalInfo = require("./PersonalInfo");
const Experience = require("./Experience");
const Education = require("./Education");
const Project = require("./Project");
const ProfileLinks = require("./ProfileLinks");
const Skills = require("./Skills");
const Achievement = require("./Achievement");
const { randomUUID } = require("node:crypto");

class ResumeData {
  constructor(data = {}) {
    this.personalInfo = new PersonalInfo(data.personalInfo || {});
    this.experience = (data.experience || []).map((exp) => new Experience(exp));
    this.education = (data.education || []).map((edu) => new Education(edu));
    this.projects = (data.projects || []).map((proj) => new Project(proj));
    this.profileLinks = new ProfileLinks(data.profileLinks || {});
    this.skills = new Skills(data.skills || {});
    this.achievements = data.achievements || [];
    this.transformedAchievements();

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  transformedAchievements() {
    const transformedAchievements = [];
    this.achievements.forEach((ach) => {
      if (ach.bullet?.includes(",")) {
        transformedAchievements.push(
          ...ach.bullet.split(",").map((b) => {
            return new Achievement({ id: randomUUID(), bullet: b.trim() });
          }),
        );
      } else {
        transformedAchievements.push(new Achievement(ach));
      }
    });
    this.achievements = transformedAchievements;
  }

  /**
   * Validate the complete resume data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    const personalInfoValidation = this.personalInfo.validate();
    if (!personalInfoValidation.isValid) {
      errors.push(
        ...personalInfoValidation.errors.map((err) => `Personal Info: ${err}`),
      );
    }

    this.experience.forEach((exp, index) => {
      const expValidation = exp.validate();
      if (!expValidation.isValid) {
        errors.push(
          ...expValidation.errors.map(
            (err) => `Experience ${index + 1}: ${err}`,
          ),
        );
      }
    });

    this.education.forEach((edu, index) => {
      const eduValidation = edu.validate();
      if (!eduValidation.isValid) {
        errors.push(
          ...eduValidation.errors.map(
            (err) => `Education ${index + 1}: ${err}`,
          ),
        );
      }
    });

    this.projects.forEach((proj, index) => {
      const projValidation = proj.validate();
      if (!projValidation.isValid) {
        errors.push(
          ...projValidation.errors.map((err) => `Project ${index + 1}: ${err}`),
        );
      }
    });

    this.achievements.forEach((ach, index) => {
      const achValidation = ach.validate();
      if (!achValidation.isValid) {
        errors.push(
          ...achValidation.errors.map(
            (err) => `Achievement ${index + 1}: ${err}`,
          ),
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert to plain object for API responses
   * @returns {Object} Plain JavaScript object
   */
  toJSON() {
    return {
      personalInfo: this.personalInfo.toJSON(),
      experience: this.experience.map((exp) => exp.toJSON()),
      education: this.education.map((edu) => edu.toJSON()),
      projects: this.projects.map((proj) => proj.toJSON()),
      profileLinks: this.profileLinks.toJSON(),
      skills: this.skills.toJSON(),
      achievements: this.achievements.map((ach) => ach.toJSON()),
      metadata: {
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
    };
  }

  /**
   * Get formatted name for PDF filename
   * @returns {string} Sanitized filename
   */
  getFileName() {
    const name = this.personalInfo.name || "resume";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special chars
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .substring(0, 50); // Limit length
  }

  /**
   * Check if resume has minimum required content for PDF generation
   * @returns {boolean}
   */
  hasMinimumContent() {
    return (
      this.personalInfo.isComplete() &&
      (this.experience.length > 0 ||
        this.education.length > 0 ||
        this.projects.length > 0)
    );
  }

  /**
   * Get summary statistics
   * @returns {Object} Stats about the resume content
   */
  getStats() {
    return {
      experienceCount: this.experience.length,
      educationCount: this.education.length,
      projectsCount: this.projects.length,
      achievementsCount: this.achievements.length,
      totalBullets: this.experience.reduce(
        (total, exp) => total + exp.bullets.length,
        0,
      ),
      hasProfileLinks: this.profileLinks.hasAnyLinks(),
      hasSkills: this.skills.hasAnySkills(),
      hasAchievements: this.achievements.length > 0,
      isComplete: this.hasMinimumContent(),
    };
  }

  /**
   * Create ResumeData from raw request data
   * @param {Object} rawData Raw data from API request
   * @returns {ResumeData} Validated ResumeData instance
   */
  static fromRequest(rawData) {
    if (!rawData || typeof rawData !== "object") {
      throw new Error("Invalid resume data: expected object");
    }

    return new ResumeData(rawData);
  }

  /**
   * Validate raw request data before creating instance
   * @param {Object} rawData Raw data from API request
   * @returns {Object} { isValid: boolean, errors: string[], data?: ResumeData }
   */
  static validateRequest(rawData) {
    try {
      const resume = ResumeData.fromRequest(rawData);
      const validation = resume.validate();

      return {
        isValid: validation.isValid,
        errors: validation.errors,
        data: validation.isValid ? resume : null,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error.message],
        data: null,
      };
    }
  }
}

module.exports = ResumeData;
