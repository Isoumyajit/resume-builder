const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate skills section HTML.
 */
function generateSkillsHtml(skills = {}) {
  if (!Object.values(skills).some((v) => v)) return "";

  const content = `
      <div class="skills-list">
        ${skills.languages ? `<p><strong>Programming Languages:</strong> ${escapeHtml(skills.languages)}</p>` : ""}
        ${skills.technologies ? `<p><strong>Technologies & Frameworks:</strong> ${escapeHtml(skills.technologies)}</p>` : ""}
        ${skills.other ? `<p><strong>Other Skills:</strong> ${escapeHtml(skills.other)}</p>` : ""}
      </div>
  `;

  return createSection("Technical Skills", content, ICON_URLS.code);
}

module.exports = { generateSkillsHtml };
