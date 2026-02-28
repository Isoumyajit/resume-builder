const { classicOverrides } = require("./classic");
const { modernAccentOverrides } = require("./modern-accent");

const templateRegistry = {
  classic: classicOverrides,
  "modern-accent": modernAccentOverrides,
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
