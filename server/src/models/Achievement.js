/**
 * Achievement Model
 * Handles achievement/accomplishment data with bullet points
 */

class Achievement {
  constructor(data = {}) {
    this.id = data.id || "";
    this.bullet = data.bullet || "";
  }

  /**
   * Validate achievement data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.bullet?.trim()) {
      errors.push("Achievement bullet point is required");
    }

    // Max 100 characters without spaces
    const bulletWithoutSpaces = this.bullet?.replace(/\s/g, "") || "";
    if (bulletWithoutSpaces.length > 100) {
      errors.push(
        `Achievement must be max 100 characters without spaces (current: ${bulletWithoutSpaces.length})`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get character count without spaces
   * @returns {number}
   */
  getCharCountWithoutSpaces() {
    return this.bullet?.replace(/\s/g, "").length || 0;
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      bullet: this.bullet,
    };
  }

  /**
   * Escape HTML special characters for safe rendering
   * @param {string} text
   * @returns {string}
   */
  static escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Create Achievement from raw data
   * @param {Object} rawData
   * @returns {Achievement}
   */
  static fromRequest(rawData) {
    return new Achievement(rawData);
  }
}

module.exports = Achievement;
