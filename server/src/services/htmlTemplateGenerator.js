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

/**
 * Generate complete HTML template from resume data.
 */
function generateHtmlTemplate(data) {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    projects = [],
    profileLinks = {},
    skills = {},
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(personalInfo.name || "Resume")}</title>
  ${getHeadLinks()}
  <style>
    ${getFontImports()}
    ${getAllStyles()}
  </style>
</head>
<body>
  <div class="container">
    ${generateHeaderHtml(personalInfo)}
    ${generateExperienceHtml(experience)}
    ${generateEducationHtml(education)}
    ${generateProjectsHtml(projects)}
    ${generateProfileLinksHtml(profileLinks)}
    ${generateSkillsHtml(skills)}
    ${generateFooterHtml()}
  </div>
</body>
</html>
  `;
}

module.exports = {
  generateHtmlTemplate,
};
