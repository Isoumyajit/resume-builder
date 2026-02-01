/**
 * HTML Template Generator for Resume PDF
 * Generates HTML content from resume data for Puppeteer PDF generation
 */

const {
  fontUrl,
  getAllStyles,
  baseStyles,
  headerStyles,
  sectionStyles,
  itemStyles,
  projectStyles,
  skillsStyles,
} = require("./resumeStyles");

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generate header HTML
 */
function generateHeaderHtml(personalInfo = {}) {
  return `
    <div class="header">
      <h1>${escapeHtml(personalInfo.name || "")}</h1>
      <div class="contact">
        ${personalInfo.location ? `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/marker--v1.png" alt="marker--v1"/><span>${escapeHtml(personalInfo.location)}</span>` : ""}
        ${personalInfo.location ? `<span class="vr-divider"></span>` : ""}
        ${personalInfo.phone ? `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/phone--v1.png" alt="phone--v1"/><span>${escapeHtml(personalInfo.phone)}</span>` : ""}
        ${personalInfo.phone && personalInfo.email ? `<span class="vr-divider"></span>` : ""}
        ${
          personalInfo.email
            ? `<img width="16" height="16" src="https://img.icons8.com/plumpy/24/mail.png" alt="mail"/> <a href="mailto:${personalInfo.email}">${escapeHtml(personalInfo.email)}</a>`
            : ""
        }
        ${personalInfo.linkedin?.url ? `<span class="vr-divider"></span>` : ""}
        ${personalInfo.linkedin?.url ? `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/linkedin.png" alt="linkedin"/> <a class="link" href="${personalInfo.linkedin.url}">${escapeHtml(personalInfo.linkedin.displayText || personalInfo.linkedin.url)}</a>` : ""}
      </div>
    </div>
  `;
}

/**
 * Generate experience section HTML
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
        ${escapeHtml(exp.location || "")} - ${escapeHtml(exp.startDate || "")} – ${escapeHtml(exp.endDate || "")}
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
              <span class="bullet-item-index"></span>
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

  return `
    <div class="section">
      <div class="section-title">Professional Experience</div>
      ${experienceItems}
    </div>
  `;
}

/**
 * Generate education section HTML
 */
function generateEducationHtml(education = []) {
  if (education.length === 0) return "";

  const educationItems = education
    .map(
      (edu) => `
    <div class="item">
      <div class="item-title">${escapeHtml(edu.institution || "")}</div>
      <div class="item-subtitle">
        ${escapeHtml(edu.degree || "")} &bull; ${escapeHtml(edu.location || "")} &bull; ${escapeHtml(edu.startYear || "")} – ${escapeHtml(edu.endYear || "")}
      </div>
    </div>
  `,
    )
    .join("");

  return `
    <div class="section">
      <div class="section-title">Education</div>
      ${educationItems}
    </div>
  `;
}

/**
 * Generate projects section HTML
 */
function generateProjectsHtml(projects = []) {
  if (projects.length === 0) return "";

  const projectItems = projects
    .map(
      (proj) => `
    <div class="item">
      <div class="project-title">
        ${escapeHtml(proj.name || "")}
        ${proj.url ? `<a href="${proj.url}">↗</a>` : ""}
      </div>
      ${proj.techStack ? `<div class="tech-stack"><strong>Tech Stack:</strong> ${escapeHtml(proj.techStack)}</div>` : ""}
      ${proj.description ? `<div class="project-description">${escapeHtml(proj.description)}</div>` : ""}
    </div>
  `,
    )
    .join("");

  return `
    <div class="section">
      <div class="section-title">Projects</div>
      ${projectItems}
    </div>
  `;
}

/**
 * Generate skills section HTML
 */
function generateSkillsHtml(skills = {}) {
  if (!Object.values(skills).some((v) => v)) return "";

  return `
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-list">
        ${skills.languages ? `<p><strong>Programming Languages:</strong> ${escapeHtml(skills.languages)}</p>` : ""}
        ${skills.technologies ? `<p><strong>Technologies & Frameworks:</strong> ${escapeHtml(skills.technologies)}</p>` : ""}
        ${skills.other ? `<p><strong>Other Skills:</strong> ${escapeHtml(skills.other)}</p>` : ""}
      </div>
    </div>
  `;
}

/**
 * Generate complete HTML template from resume data
 */
function generateHtmlTemplate(data) {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    projects = [],
    skills = {},
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(personalInfo.name || "Resume")}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=phone_enabled" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=mail" />
  <style>
     @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    ${getAllStyles()}
  </style>
</head>
<body>
  <div class="container">
    ${generateHeaderHtml(personalInfo)}
    ${generateExperienceHtml(experience)}
    ${generateEducationHtml(education)}
    ${generateProjectsHtml(projects)}
    ${generateSkillsHtml(skills)}
  </div>
</body>
</html>
  `;
}

module.exports = {
  generateHtmlTemplate,
  escapeHtml,
  // Export individual section generators for flexibility
  generateHeaderHtml,
  generateExperienceHtml,
  generateEducationHtml,
  generateProjectsHtml,
  generateSkillsHtml,
  // Re-export styles from resumeStyles module
  fontUrl,
  getAllStyles,
  baseStyles,
  headerStyles,
  sectionStyles,
  itemStyles,
  projectStyles,
  skillsStyles,
};
