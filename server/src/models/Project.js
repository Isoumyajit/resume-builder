/**
 * Project Model
 * Handles project data and validation
 */

class Project {
  constructor(data = {}) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.url = data.url || "";
    this.techStack = data.techStack || "";
    this.description = data.description || "";
  }

  /**
   * Validate project entry
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Required fields validation
    if (!this.name?.trim()) {
      errors.push("Project name is required");
    }

    if (!this.techStack?.trim()) {
      errors.push("Tech stack is required");
    }

    if (!this.description?.trim()) {
      errors.push("Project description is required");
    }

    // URL validation (optional but if provided, must be valid)
    if (this.url?.trim() && !this.isValidUrl(this.url)) {
      errors.push("Invalid project URL format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if project entry is complete
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.name?.trim() &&
      this.techStack?.trim() &&
      this.description?.trim()
    );
  }

  /**
   * Get formatted data for LaTeX template
   * @returns {Object}
   */
  getFormattedForLatex() {
    return {
      name: this.escapeLatex(this.name),
      url: this.url?.trim() || null, // URLs don't need escaping for LaTeX href
      techStack: this.escapeLatex(this.techStack),
      description: this.escapeLatex(this.description),
    };
  }

  /**
   * Get tech stack as array
   * @returns {string[]}
   */
  getTechStackArray() {
    return this.techStack
      .split(/[,;]/)
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);
  }

  /**
   * Check if project has a live URL
   * @returns {boolean}
   */
  hasLiveUrl() {
    return !!(this.url?.trim() && this.isValidUrl(this.url));
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      url: this.url || undefined,
      techStack: this.techStack,
      description: this.description,
    };
  }

  // Private helper methods

  /**
   * Validate URL format
   * @param {string} url
   * @returns {boolean}
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
   * Create Project from raw data
   * @param {Object} rawData
   * @returns {Project}
   */
  static fromRequest(rawData) {
    return new Project(rawData);
  }
}

module.exports = Project;
