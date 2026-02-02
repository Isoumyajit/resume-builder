const { baseStyles } = require("./baseStyles");
const { headerStyles } = require("./headerStyles");
const { sectionStyles } = require("./sectionStyles");
const { itemStyles } = require("./itemStyles");
const { projectStyles } = require("./projectStyles");
const { skillsStyles } = require("./skillsStyles");
const { profileLinksStyles } = require("./profileLinksStyles");

/**
 * Get all styles combined.
 */
function getAllStyles() {
  return [
    baseStyles,
    headerStyles,
    sectionStyles,
    itemStyles,
    projectStyles,
    profileLinksStyles,
    skillsStyles,
  ].join("\n");
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
    project: projectStyles,
    profileLinks: profileLinksStyles,
    skills: skillsStyles,
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
  projectStyles,
  profileLinksStyles,
  skillsStyles,
  getAllStyles,
  getStylesBySections,
};
