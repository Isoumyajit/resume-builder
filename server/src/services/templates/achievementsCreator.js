const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate achievements section HTML.
 */
function generateAchievementsHtml(achievements = []) {
  if (!achievements || achievements.length === 0) return "";

  const bulletItems = achievements
    .filter((achievement) => achievement.bullet?.trim())
    .map(
      (achievement) => `
      <li class="achievement-item">
        ${ICON_URLS.bullet}
        <span>${escapeHtml(achievement.bullet)}</span>
      </li>
    `,
    )
    .join("");

  if (!bulletItems) return "";

  const content = `
    <ul class="achievements-list">
      ${bulletItems}
    </ul>
  `;

  return createSection("Achievements", content, ICON_URLS.trophy);
}

module.exports = { generateAchievementsHtml };
