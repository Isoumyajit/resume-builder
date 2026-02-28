const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate summary section HTML.
 */
function generateSummaryHtml(summary = {}) {
  const text = summary.text?.trim();
  if (!text) return "";

  const content = `
      <div class="summary-content">
        <p>${escapeHtml(text)}</p>
      </div>
  `;

  return createSection("Professional Summary", content, ICON_URLS.profile);
}

module.exports = { generateSummaryHtml };
