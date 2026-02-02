const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate profile links section HTML.
 */
function generateProfileLinksHtml(profileLinks = {}) {
  const links = [];

  if (profileLinks.github?.trim()) {
    links.push({
      name: "GitHub",
      icon: ICON_URLS.github,
      url: profileLinks.github,
    });
  }
  if (profileLinks.leetcode?.trim()) {
    links.push({
      name: "LeetCode",
      icon: ICON_URLS.leetcode,
      url: profileLinks.leetcode,
    });
  }
  if (profileLinks.portfolio?.trim()) {
    links.push({
      name: "Portfolio",
      icon: ICON_URLS.link,
      url: profileLinks.portfolio,
    });
  }

  if (links.length === 0) return "";

  const items = links
    .map(
      (link) => `
      <li class="profile-links__item">
        ${link.icon && link.icon}
        <a class="profile-links__link" href="${escapeHtml(link.url)}">${escapeHtml(link.name)}</a>
      </li>
    `,
    )
    .join("");

  const content = `
    <ul class="profile-links">
      ${items}
    </ul>
  `;

  return createSection("Profile Links", content, ICON_URLS.profile);
}

module.exports = { generateProfileLinksHtml };
