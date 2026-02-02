/**
 * ProfileLinks Model
 * Handles social media and portfolio links
 */

class ProfileLinks {
  constructor(data = {}) {
    this.leetcode = data.leetcode || "";
    this.github = data.github || "";
    this.portfolio = data.portfolio || "";
  }

  /**
   * Validate profile links
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validate each URL if provided (all are optional)
    const links = [
      { name: "LeetCode", url: this.leetcode },
      { name: "GitHub", url: this.github },
      { name: "Portfolio", url: this.portfolio },
    ];

    links.forEach((link) => {
      if (link.url?.trim() && !this.isValidUrl(link.url)) {
        errors.push(`Invalid ${link.name} URL format`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if any profile links are provided
   * @returns {boolean}
   */
  hasAnyLinks() {
    return !!(
      this.leetcode?.trim() ||
      this.github?.trim() ||
      this.portfolio?.trim()
    );
  }

  /**
   * Get all valid links as array
   * @returns {Array} Array of {name, url, displayText} objects
   */
  getValidLinks() {
    const links = [];

    if (this.github?.trim() && this.isValidUrl(this.github)) {
      links.push({
        name: "GitHub",
        url: this.github,
        displayText: this.extractDisplayText(this.github, "github.com/"),
      });
    }

    if (this.leetcode?.trim() && this.isValidUrl(this.leetcode)) {
      links.push({
        name: "LeetCode",
        url: this.leetcode,
        displayText: this.extractDisplayText(this.leetcode, "leetcode.com/"),
      });
    }

    if (this.portfolio?.trim() && this.isValidUrl(this.portfolio)) {
      links.push({
        name: "Portfolio",
        url: this.portfolio,
        displayText: this.extractDomain(this.portfolio),
      });
    }

    return links;
  }

  /**
   * Get formatted data for LaTeX template
   * @returns {Object}
   */
  getFormattedForLatex() {
    return {
      github: this.github?.trim() || null,
      leetcode: this.leetcode?.trim() || null,
      portfolio: this.portfolio?.trim() || null,
      validLinks: this.getValidLinks().map((link) => ({
        name: link.name,
        url: link.url,
        displayText: this.escapeLatex(link.displayText),
      })),
    };
  }

  /**
   * Get profile links count
   * @returns {number}
   */
  getCount() {
    return this.getValidLinks().length;
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    const result = {};

    if (this.leetcode?.trim()) result.leetcode = this.leetcode;
    if (this.github?.trim()) result.github = this.github;
    if (this.portfolio?.trim()) result.portfolio = this.portfolio;

    return result;
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
   * Extract display text from URL (e.g., github.com/johndoe → johndoe)
   * @param {string} url
   * @param {string} prefix
   * @returns {string}
   */
  extractDisplayText(url, prefix) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      if (prefix && path.includes(prefix.replace(urlObj.hostname + "/", ""))) {
        return path.split("/").filter(Boolean).pop() || urlObj.hostname;
      }

      return path.split("/").filter(Boolean).pop() || urlObj.hostname;
    } catch {
      return url;
    }
  }

  /**
   * Extract domain from URL
   * @param {string} url
   * @returns {string}
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
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
   * Create ProfileLinks from raw data
   * @param {Object} rawData
   * @returns {ProfileLinks}
   */
  static fromRequest(rawData) {
    return new ProfileLinks(rawData);
  }
}

module.exports = ProfileLinks;
