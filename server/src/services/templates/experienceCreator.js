const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate experience section HTML.
 */
function generateExperienceHtml(experience = []) {
  if (experience.length === 0) return "";

  const experienceItems = experience
    .map(
      (exp) => `
    <div class="item">
      <div class="item-header-content">
      <div class="item-company">
        <span class="item-title">${escapeHtml(exp.company || "")}</span>
      </div>
      <div class="item-subtitle">
        ${escapeHtml(exp.location || "")} ${ICON_URLS.verticalLine} ${escapeHtml(exp.startDate || "")} ${ICON_URLS.line} ${escapeHtml(exp.endDate || "")}
      </div>
      </div>
      <div class="item-role">
        <span class="item-title">${escapeHtml(exp.title || "")}</span>
      </div>
      
      ${exp.techStack ? `<div class="tech-stack">Tech Stack: <span>${escapeHtml(exp.techStack)}</span></div>` : ""}
      ${
        exp.bullets && exp.bullets.length > 0
          ? `
        <ul class="bullets">
          ${exp.bullets
            .filter((b) => b && b.trim())
            .map(
              (bullet) => `
              <div class="bullet-item-container">
              <span class="bullet-item-index">
                ${ICON_URLS.bullet}
              </span>
              <li class="bullet-item">${escapeHtml(bullet)}</li></div>`,
            )
            .join("")}
        </ul>
      `
          : ""
      }
    </div>
  `,
    )
    .join("");

  return createSection("Work Experience", experienceItems, ICON_URLS.briefcase);
}

module.exports = { generateExperienceHtml };
