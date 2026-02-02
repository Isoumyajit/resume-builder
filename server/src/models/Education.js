/**
 * Education Model
 * Handles education data and validation
 */

class Education {
  constructor(data = {}) {
    this.id = data.id || "";
    this.institution = data.institution || "";
    this.degree = data.degree || "";
    this.location = data.location || "";
    this.startYear = data.startYear || "";
    this.endYear = data.endYear || "";
  }

  /**
   * Validate education entry
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Required fields validation
    if (!this.institution?.trim()) {
      errors.push("Institution name is required");
    }

    if (!this.degree?.trim()) {
      errors.push("Degree is required");
    }

    if (!this.location?.trim()) {
      errors.push("Location is required");
    }

    if (!this.startYear?.trim()) {
      errors.push("Start year is required");
    }

    if (!this.endYear?.trim()) {
      errors.push("End year is required");
    }

    // Year validation
    if (this.startYear && this.isYearInFuture(this.startYear)) {
      errors.push("Start year cannot be in the future");
    }

    if (this.endYear && this.isYearInFuture(this.endYear)) {
      errors.push("End year cannot be in the future");
    }

    // Year range validation
    if (this.startYear && this.endYear) {
      const startDate = this.parseDate(this.startYear);
      const endDate = this.parseDate(this.endYear);

      if (startDate && endDate && startDate > endDate) {
        errors.push("Start year must be before or equal to end year");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if education entry is complete
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.institution?.trim() &&
      this.degree?.trim() &&
      this.location?.trim() &&
      this.startYear?.trim() &&
      this.endYear?.trim()
    );
  }

  /**
   * Get formatted data for LaTeX template
   * @returns {Object}
   */
  getFormattedForLatex() {
    return {
      institution: this.escapeLatex(this.institution),
      degree: this.escapeLatex(this.degree),
      location: this.escapeLatex(this.location),
      startYear: this.escapeLatex(this.startYear),
      endYear: this.escapeLatex(this.endYear),
    };
  }

  /**
   * Get education duration
   * @returns {Object} { years: number, text: string }
   */
  getDuration() {
    const startDate = this.parseDate(this.startYear);
    const endDate = this.parseDate(this.endYear);

    if (!startDate || !endDate) {
      return { years: 0, text: "Unknown duration" };
    }

    const years = endDate.getFullYear() - startDate.getFullYear();
    return {
      years: Math.max(0, years),
      text:
        years <= 0
          ? "Less than 1 year"
          : `${years} year${years > 1 ? "s" : ""}`,
    };
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      institution: this.institution,
      degree: this.degree,
      location: this.location,
      startYear: this.startYear,
      endYear: this.endYear,
    };
  }

  // Private helper methods

  parseDate(dateStr) {
    if (!dateStr?.trim()) return null;

    // Handle "2022" year format
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(parseInt(dateStr), 0, 1);
    }

    // Handle "Jan 2022" format
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  isYearInFuture(dateStr) {
    const date = this.parseDate(dateStr);
    if (!date) return false;

    const currentYear = new Date().getFullYear();
    return date.getFullYear() > currentYear;
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
   * Create Education from raw data
   * @param {Object} rawData
   * @returns {Education}
   */
  static fromRequest(rawData) {
    return new Education(rawData);
  }
}

module.exports = Education;
