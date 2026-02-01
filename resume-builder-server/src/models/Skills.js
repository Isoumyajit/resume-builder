/**
 * Skills Model
 * Handles technical skills data and organization
 */

class Skills {
  constructor(data = {}) {
    this.languages = data.languages || "";
    this.technologies = data.technologies || "";
    this.other = data.other || "";
  }

  /**
   * Validate skills data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Skills are optional, but if provided should be meaningful
    if (this.languages?.trim() && this.languages.trim().length < 2) {
      errors.push("Programming languages should be at least 2 characters");
    }

    if (this.technologies?.trim() && this.technologies.trim().length < 2) {
      errors.push("Technologies should be at least 2 characters");
    }

    if (this.other?.trim() && this.other.trim().length < 2) {
      errors.push("Other skills should be at least 2 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if any skills are provided
   * @returns {boolean}
   */
  hasAnySkills() {
    return !!(
      this.languages?.trim() ||
      this.technologies?.trim() ||
      this.other?.trim()
    );
  }

  /**
   * Get skills categories that have content
   * @returns {Array} Array of {category, skills} objects
   */
  getPopulatedCategories() {
    const categories = [];

    if (this.languages?.trim()) {
      categories.push({
        category: "Programming Languages",
        skills: this.languages,
        skillsArray: this.parseSkillsString(this.languages),
      });
    }

    if (this.technologies?.trim()) {
      categories.push({
        category: "Technologies & Frameworks",
        skills: this.technologies,
        skillsArray: this.parseSkillsString(this.technologies),
      });
    }

    if (this.other?.trim()) {
      categories.push({
        category: "Other Skills",
        skills: this.other,
        skillsArray: this.parseSkillsString(this.other),
      });
    }

    return categories;
  }

  /**
   * Get formatted data for LaTeX template
   * @returns {Object}
   */
  getFormattedForLatex() {
    return {
      languages: this.escapeLatex(this.languages),
      technologies: this.escapeLatex(this.technologies),
      other: this.escapeLatex(this.other),
      categories: this.getPopulatedCategories().map((cat) => ({
        category: cat.category,
        skills: this.escapeLatex(cat.skills),
        skillsArray: cat.skillsArray.map((skill) => this.escapeLatex(skill)),
      })),
    };
  }

  /**
   * Get total skills count across all categories
   * @returns {number}
   */
  getTotalSkillsCount() {
    return this.getPopulatedCategories().reduce(
      (total, category) => total + category.skillsArray.length,
      0,
    );
  }

  /**
   * Get skills summary for analytics/display
   * @returns {Object}
   */
  getSummary() {
    const categories = this.getPopulatedCategories();

    return {
      totalCategories: categories.length,
      totalSkills: this.getTotalSkillsCount(),
      hasLanguages: !!this.languages?.trim(),
      hasTechnologies: !!this.technologies?.trim(),
      hasOtherSkills: !!this.other?.trim(),
      isEmpty: !this.hasAnySkills(),
    };
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    const result = {};

    if (this.languages?.trim()) result.languages = this.languages;
    if (this.technologies?.trim()) result.technologies = this.technologies;
    if (this.other?.trim()) result.other = this.other;

    return result;
  }

  // Private helper methods

  /**
   * Parse comma-separated skills string into array
   * @param {string} skillsString
   * @returns {string[]}
   */
  parseSkillsString(skillsString) {
    if (!skillsString?.trim()) return [];

    return skillsString
      .split(/[,;]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }

  /**
   * Escape LaTeX special characters
   * @param {string} text
   * @returns {string}
   */
  escapeLatex(text) {
    if (!text) return "";

    return text
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[{}]/g, (match) => `\\${match}`)
      .replace(/[$&%#^_~]/g, (match) => `\\${match}`)
      .replace(/"/g, "''")
      .trim();
  }

  /**
   * Create Skills from raw data
   * @param {Object} rawData
   * @returns {Skills}
   */
  static fromRequest(rawData) {
    return new Skills(rawData);
  }
}

module.exports = Skills;
