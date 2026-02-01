/**
 * Experience Model
 * Handles work experience data and validation
 */

class Experience {
  constructor(data = {}) {
    this.id = data.id || "";
    this.company = data.company || "";
    this.title = data.title || "";
    this.location = data.location || "";
    this.startDate = data.startDate || "";
    this.endDate = data.endDate || "";
    this.techStack = data.techStack || "";
    this.currentlyWorking = data.currentlyWorking || false;
    this.bullets = Array.isArray(data.bullets) ? data.bullets : [""];
  }

  /**
   * Validate experience entry
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Required fields validation
    if (!this.company?.trim()) {
      errors.push("Company name is required");
    }

    if (!this.title?.trim()) {
      errors.push("Job title is required");
    }

    if (!this.location?.trim()) {
      errors.push("Location is required");
    }

    if (!this.startDate?.trim()) {
      errors.push("Start date is required");
    }

    if (!this.endDate?.trim()) {
      errors.push("End date is required");
    }

    // Date validation
    if (this.startDate && this.isDateInFuture(this.startDate)) {
      errors.push("Start date cannot be in the future");
    }

    if (this.endDate && this.isDateInFuture(this.endDate)) {
      errors.push("End date cannot be in the future");
    }

    // Currently working validation
    if (this.currentlyWorking && this.endDate?.toLowerCase() !== "present") {
      errors.push('If currently working, end date should be "Present"');
    }

    if (!this.currentlyWorking && this.endDate?.toLowerCase() === "present") {
      errors.push('If not currently working, end date should not be "Present"');
    }

    // Date range validation
    if (this.startDate && this.endDate) {
      const startDate = this.parseDate(this.startDate);
      const endDate = this.parseDate(this.endDate);

      if (startDate && endDate && startDate > endDate) {
        errors.push("Start date must be before or equal to end date");
      }
    }

    // Bullets validation
    const validBullets = this.bullets.filter((bullet) => bullet?.trim());
    if (validBullets.length === 0) {
      errors.push(
        "At least one achievement/responsibility bullet point is required",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if experience entry is complete
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.company?.trim() &&
      this.title?.trim() &&
      this.location?.trim() &&
      this.startDate?.trim() &&
      this.endDate?.trim() &&
      this.bullets.some((bullet) => bullet?.trim())
    );
  }

  /**
   * Get formatted data for LaTeX template
   * @returns {Object}
   */
  getFormattedForLatex() {
    return {
      company: this.escapeLatex(this.company),
      title: this.escapeLatex(this.title),
      location: this.escapeLatex(this.location),
      startDate: this.escapeLatex(this.startDate),
      endDate: this.escapeLatex(this.endDate),
      techStack: this.escapeLatex(this.techStack),
      bullets: this.bullets
        .filter((bullet) => bullet?.trim())
        .map((bullet) => this.escapeLatex(bullet)),
    };
  }

  /**
   * Get duration of work experience
   * @returns {Object} { years: number, months: number, text: string }
   */
  getDuration() {
    const startDate = this.parseDate(this.startDate);
    const endDate = this.parseDate(this.endDate);

    if (!startDate || !endDate) {
      return { years: 0, months: 0, text: "Unknown duration" };
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    let text = "";
    if (years > 0) text += `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0) {
      if (text) text += " ";
      text += `${months} month${months > 1 ? "s" : ""}`;
    }
    if (!text) text = "Less than 1 month";

    return { years, months, text };
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      company: this.company,
      title: this.title,
      location: this.location,
      startDate: this.startDate,
      endDate: this.endDate,
      techStack: this.techStack,
      currentlyWorking: this.currentlyWorking,
      bullets: this.bullets.filter((bullet) => bullet?.trim()),
    };
  }

  // Private helper methods (shared with frontend validation logic)

  parseDate(dateStr) {
    if (!dateStr?.trim()) return null;

    // Handle "Present" - treat as today's date
    if (dateStr.toLowerCase() === "present") {
      return new Date();
    }

    // Handle "Jan 2022" format
    if (dateStr.includes(" ")) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle "2022" year-only format
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(parseInt(dateStr), 0, 1);
    }

    // Try parsing as-is
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  isDateInFuture(dateStr) {
    if (dateStr?.toLowerCase() === "present") return false;

    const date = this.parseDate(dateStr);
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date > today;
  }

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
   * Create Experience from raw data
   * @param {Object} rawData
   * @returns {Experience}
   */
  static fromRequest(rawData) {
    return new Experience(rawData);
  }
}

module.exports = Experience;
