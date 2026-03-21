const { classicOverrides } = require("./classic");
const { modernAccentOverrides } = require("./modern-accent");
const { executiveOverrides } = require("./executive");

const templateRegistry = {
  classic: classicOverrides,
  "modern-accent": modernAccentOverrides,
  executive: executiveOverrides,
};

/**
 * Get template-specific style overrides.
 * @param {string} templateType
 * @returns {string} CSS override string (empty for classic)
 */
function getTemplateStyles(templateType = "classic") {
  return templateRegistry[templateType] || templateRegistry.classic;
}

module.exports = { getTemplateStyles };
