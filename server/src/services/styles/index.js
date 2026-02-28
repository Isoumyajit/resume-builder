const { baseStyles } = require("./baseStyles");
const { headerStyles } = require("./headerStyles");
const { sectionStyles } = require("./sectionStyles");
const { itemStyles } = require("./itemStyles");
const { experienceStyles } = require("./experienceStyles");
const { projectStyles } = require("./projectStyles");
const { skillsStyles } = require("./skillsStyles");
const { profileLinksStyles } = require("./profileLinksStyles");
const { summaryStyles } = require("./summaryStyles");
const { achievementsStyles } = require("./achievementsStyles");
const { getTemplateStyles } = require("./templates");

/**
 * Get all styles combined, with template-specific overrides appended.
 */
function getAllStyles(templateType = "classic") {
  const base = [
    baseStyles,
    headerStyles,
    sectionStyles,
    itemStyles,
    experienceStyles,
    projectStyles,
    summaryStyles,
    profileLinksStyles,
    skillsStyles,
    achievementsStyles,
  ].join("\n");

  const overrides = getTemplateStyles(templateType);
  return overrides ? `${base}\n${overrides}` : base;
}

/**
 * Get styles by section names.
 */
function getStylesBySections(sections = []) {
  const styleMap = {
    base: baseStyles,
    header: headerStyles,
    section: sectionStyles,
    item: itemStyles,
    summary: summaryStyles,
    experience: experienceStyles,
    project: projectStyles,
    profileLinks: profileLinksStyles,
    skills: skillsStyles,
    achievements: achievementsStyles,
  };

  return sections
    .map((section) => styleMap[section] || "")
    .filter(Boolean)
    .join("\n");
}

module.exports = {
  baseStyles,
  headerStyles,
  sectionStyles,
  itemStyles,
  experienceStyles,
  projectStyles,
  summaryStyles,
  profileLinksStyles,
  skillsStyles,
  achievementsStyles,
  getAllStyles,
  getStylesBySections,
};
