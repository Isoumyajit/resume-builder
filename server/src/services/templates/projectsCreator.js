const { escapeHtml } = require("../utils/escapeHtml");
const { createSection } = require("./sectionSeparator");
const { ICON_URLS } = require("../assets/iconUrls");

/**
 * Generate projects section HTML.
 */
function generateProjectsHtml(projects = []) {
  if (projects.length === 0) return "";

  const projectItems = projects
    .map(
      (proj) => `
    <div class="project-item">
      <div class="project-title">
        ${escapeHtml(proj.name || "")}
        ${proj.url ? `<a href="${proj.url}">${ICON_URLS.externalLink}</a>` : ""}
      </div>
      <div class="project-tech-stack">
        ${
          proj.techStack
            ? `
            <div class="project-tech-stack-title">
              Tech Stack:
            </div> 
            <div class="project-tech-stack-name">
                  ${escapeHtml(proj.techStack)}
            </div>
          `
            : ""
        }
          </div>
      </div>
      ${proj.description ? `<div class="project-description">${escapeHtml(proj.description)}</div>` : ""}
    </div>
  `,
    )
    .join("");

  return createSection("Projects", projectItems, ICON_URLS.project);
}

module.exports = { generateProjectsHtml };
