const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate education section HTML.
 */
function generateEducationHtml(education = []) {
  if (education.length === 0) return "";

  const educationItems = education
    .map(
      (edu) => `
    <div class="item">
      <div class="item-title">
      ${escapeHtml(edu.institution || "")}

      <div class="item-details">${escapeHtml(edu.location || "")} ${ICON_URLS.verticalLine} ${escapeHtml(edu.startYear || "")} ${ICON_URLS.line} ${escapeHtml(edu.endYear || "")}</div>
      </div>
      <div class="item-subtitle">
        ${escapeHtml(edu.degree || "")} 
      </div>
    </div>
  `,
    )
    .join("");

  return createSection("Education", educationItems, ICON_URLS.graduationCap);
}

module.exports = { generateEducationHtml };
