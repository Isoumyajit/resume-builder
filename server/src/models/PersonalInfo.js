/**
 * PersonalInfo Model
 * Handles personal information data and validation
 */

class PersonalInfo {
  constructor(data = {}) {
    this.name = data.name || "";
    this.location = data.location || "";
    this.phone = data.phone || "";
    this.email = data.email || "";
    this.linkedin = data.linkedin
      ? {
          url: data.linkedin.url || "",
          displayText: data.linkedin.displayText || "",
        }
      : null;
  }

  /**
   * Validate personal information
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Required fields validation
    if (!this.name?.trim()) {
      errors.push("Name is required");
    }

    if (!this.location?.trim()) {
      errors.push("Location is required");
    }

    if (!this.phone?.trim()) {
      errors.push("Phone is required");
    }

    if (!this.email?.trim()) {
      errors.push("Email is required");
    } else if (!this.isValidEmail(this.email)) {
      errors.push("Invalid email format");
    }

    // LinkedIn validation (optional but if provided, must be valid)
    if (this.linkedin?.url && !this.isValidUrl(this.linkedin.url)) {
      errors.push("Invalid LinkedIn URL format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if personal info has all required fields
   * @returns {boolean}
   */
  isComplete() {
    return !!(
      this.name?.trim() &&
      this.location?.trim() &&
      this.phone?.trim() &&
      this.email?.trim() &&
      this.isValidEmail(this.email)
    );
  }

  /**
   * Get display name for the resume
   * @returns {string}
   */
  getDisplayName() {
    return this.name?.trim() || "Unknown";
  }

  /**
   * Get formatted contact info for LaTeX
   * @returns {Object}
   */
  getFormattedContact() {
    return {
      name: this.escapeLatex(this.name),
      location: this.escapeLatex(this.location),
      phone: this.escapeLatex(this.phone),
      email: this.email, // Email doesn't need escaping for LaTeX href
      linkedin: this.linkedin
        ? {
            url: this.linkedin.url,
            displayText: this.escapeLatex(
              this.linkedin.displayText || this.linkedin.url,
            ),
          }
        : null,
    };
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      location: this.location,
      phone: this.phone,
      email: this.email,
      linkedin: this.linkedin,
    };
  }

  // Private helper methods

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
   * Create PersonalInfo from raw data with validation
   * @param {Object} rawData
   * @returns {PersonalInfo}
   */
  static fromRequest(rawData) {
    if (!rawData || typeof rawData !== "object") {
      throw new Error("Invalid personal info data: expected object");
    }

    return new PersonalInfo(rawData);
  }
}

module.exports = PersonalInfo;
