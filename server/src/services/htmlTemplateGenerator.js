/**
 * HTML Template Generator for Resume PDF
 * Composes section creators and styles into a single HTML template.
 */

const { getAllStyles } = require("./styles");
const { getHeadLinks, getFontImports } = require("./assets/headLinks");
const { escapeHtml } = require("./utils/escapeHtml");
const { generateHeaderHtml } = require("./templates/headerCreator");
const { generateFooterHtml } = require("./templates/footerCreator");
const { generateExperienceHtml } = require("./templates/experienceCreator");
const { generateEducationHtml } = require("./templates/educationCreator");
const { generateProjectsHtml } = require("./templates/projectsCreator");
const { generateSkillsHtml } = require("./templates/skillsCreator");
const { generateProfileLinksHtml } = require("./templates/profileLinksCreator");
const { generateSummaryHtml } = require("./templates/summaryCreator");
const { generateAchievementsHtml } = require("./templates/achievementsCreator");

const sectionRenderers = {
  summary: (data) => generateSummaryHtml(data.summary),
  experience: (data) => generateExperienceHtml(data.experience),
  education: (data) => generateEducationHtml(data.education),
  projects: (data) => generateProjectsHtml(data.projects),
  profileLinks: (data) => generateProfileLinksHtml(data.profileLinks),
  skills: (data) => generateSkillsHtml(data.skills),
  achievements: (data) => generateAchievementsHtml(data.achievements),
};

const DEFAULT_SECTION_RENDERER = [
  "summary",
  "experience",
  "education",
  "projects",
  "profileLinks",
  "skills",
  "achievements",
];

/**
 * Generate complete HTML template from resume data.
 */
function generateHtmlTemplate(data) {
  const {
    personalInfo = {},
    summary = {},
    experience = [],
    education = [],
    projects = [],
    profileLinks = {},
    skills = {},
    achievements = [],
    templateType = "classic",
  } = data;
  const orders = Array.isArray(data.sectionOrder)
    ? data.sectionOrder
    : DEFAULT_SECTION_RENDERER;

  const sections = orders
    .filter((key) => sectionRenderers[key])
    .map((key) => sectionRenderers[key](data))
    .join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(personalInfo.name || "Resume")}</title>
  ${getHeadLinks()}
  <style>
    ${getFontImports(templateType)}
    ${getAllStyles(templateType)}
  </style>
</head>
<body data-template="${escapeHtml(templateType)}">
  <div class="container">
    ${generateHeaderHtml(personalInfo)}
    ${sections}
    ${generateFooterHtml()}
  </div>
</body>
</html>
  `;
}

module.exports = {
  generateHtmlTemplate,
};
