const { baseStyles } = require("./baseStyles");
const { headerStyles } = require("./headerStyles");
const { sectionStyles } = require("./sectionStyles");
const { itemStyles } = require("./itemStyles");
const { experienceStyles } = require("./experienceStyles");
const { projectStyles } = require("./projectStyles");
const { skillsStyles } = require("./skillsStyles");
const { profileLinksStyles } = require("./profileLinksStyles");
const { achievementsStyles } = require("./achievementsStyles");

/**
 * Get all styles combined.
 */
function getAllStyles() {
  return [
    baseStyles,
    headerStyles,
    sectionStyles,
    itemStyles,
    experienceStyles,
    projectStyles,
    profileLinksStyles,
    skillsStyles,
    achievementsStyles,
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
  profileLinksStyles,
  skillsStyles,
  achievementsStyles,
  getAllStyles,
  getStylesBySections,
};
