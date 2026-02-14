const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate experience section HTML.
 */
function generateExperienceHtml(experience = []) {
  if (experience.length === 0) return "";

  experience = experience.map((exp) => ({
    ...exp,
    bullets: exp.bullets.reverse(),
  }));

  const experienceItems = experience
    .map(
      (exp) => `
    <div class="experience-item">
      <div class="experience-header-content">
      <div class="experience-company">
        <span class="experience-title">${escapeHtml(exp.company || "")}</span>
      </div>
      <div class="experience-subtitle">
        ${escapeHtml(exp.location || "")} ${ICON_URLS.verticalLine} ${escapeHtml(exp.startDate || "")} ${ICON_URLS.line} ${escapeHtml(exp.endDate || "")}
      </div>
      </div>
      <div class="experience-role">
        <span class="experience-title">${escapeHtml(exp.title || "")}</span>
      </div>
      
      ${exp.techStack ? `<div class="experience-tech-stack">Tech Stack: <span>${escapeHtml(exp.techStack)}</span></div>` : ""}
      ${
        exp.bullets && exp.bullets.length > 0
          ? `
        <ul class="experience-bullets">
          ${exp.bullets
            .filter((b) => b && b.trim())
            .map(
              (bullet) => `
              <div class="experience-bullet-item-container">
              <span class="experience-bullet-item-index">
                ${ICON_URLS.bullet}
              </span>
              <li class="experience-bullet-item">${escapeHtml(bullet)}</li></div>`,
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
