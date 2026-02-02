const { escapeHtml } = require("../utils/escapeHtml");
const { ICON_URLS } = require("../assets/iconUrls");

function getNameHtml(name = "") {
  const normalized = String(name || "")
    .trim()
    .toUpperCase();
  if (!normalized) return "";

  const parts = normalized.split(/\s+/);
  const lastIndex = parts.length - 1;

  return parts
    .map((part, index) => {
      if (!part) return "";
      const firstChar = part[0];
      const rest = part.slice(1);
      const shouldEmphasize = index === 0 || index === lastIndex;
      if (!shouldEmphasize) return escapeHtml(part);
      return `<span class="name-initial">${escapeHtml(firstChar)}</span>${escapeHtml(rest)}`;
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Generate header HTML.
 */
function generateHeaderHtml(personalInfo = {}) {
  return `
    <div class="header">
      <h3 class="name">${getNameHtml(personalInfo.name || "")}</h3>
      <div class="contact">
        ${
          personalInfo.location
            ? `<img width="16" height="16" src="${ICON_URLS.location}" alt="location"/><span>${escapeHtml(personalInfo.location)}</span>`
            : ""
        }
        ${personalInfo.location ? `<span class="vr-divider"></span>` : ""}
        ${
          personalInfo.phone
            ? `<img width="16" height="16" src="${ICON_URLS.phone}" alt="phone"/><span>${escapeHtml(personalInfo.phone)}</span>`
            : ""
        }
        ${personalInfo.phone && personalInfo.email ? `<span class="vr-divider"></span>` : ""}
        ${
          personalInfo.email
            ? `<img width="16" height="16" src="${ICON_URLS.mail}" alt="mail"/> <a href="mailto:${personalInfo.email}">${escapeHtml(personalInfo.email)}</a>`
            : ""
        }
        ${personalInfo.linkedin?.url ? `<span class="vr-divider"></span>` : ""}
        ${
          personalInfo.linkedin?.url
            ? `<img width="16" height="16" src="${ICON_URLS.linkedin}" alt="linkedin"/> <a class="link" href="${personalInfo.linkedin.url}">${escapeHtml(personalInfo.linkedin.displayText || personalInfo.linkedin.url)}</a>`
            : ""
        }
      </div>
    </div>
  `;
}

module.exports = { generateHeaderHtml };
