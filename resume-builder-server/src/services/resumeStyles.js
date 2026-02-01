/**
 * Resume Styles Module
 * CSS styles for HTML resume template
 */

/**
 * Base/reset styles
 */
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-size: 10pt;
    line-height: 1.4;
    color: #333;
  }
  
  .container {
    max-width: 100%;
    padding: 0;
  }

  .vr-divider {
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: #666;
    margin: 0 10px;
    vertical-align: middle;
  }

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 20
}


.montserrat-<uniquifier> {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
}
`;

/**
 * Header section styles
 */
const headerStyles = `
  .header {
    margin-top: 4px;
    text-align: center;
    margin-bottom: 8px;
  }
  
  .header h1 {
    font-size: 28pt;
    font-weight: 400;
    color: #000;
    margin-bottom: 2px;
  }
  
  .header .location {
    font-size: 10pt;
  }
  
  .header .contact {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    font-size: 10pt;
  }
  
  .header .contact a {
    color: #000;
    text-decoration: underline;
  }
  
  .header .links .link {
    text-decoration: underline;
    color: #000;
  }
`;

/**
 * Section title styles
 */
const sectionStyles = `
  .section {
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 14pt;
    font-weight: semibold;
    color: rgb(0, 0, 0);
    border-bottom: 1px solid rgb(1, 7, 14);
    padding-bottom: 4px;
  }
`;

/**
 * Item styles (experience, education entries)
 */
const itemStyles = `
  .item {
    margin-bottom: 12px;
  }

  .item-header-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
  }
  
  .item-title {
    font-size: 12pt;
    font-weight: semibold;
    color:rgb(40, 40, 40);
  }
  
  .item-subtitle {
    font-style: italic;
    color: #666;
    margin-bottom: 4px;
  }
  
  .tech-stack {
    font-weight: bold;
    margin-bottom: 4px;

    span {
      font-weight: normal;
    }
  }
  
  .bullets {
    margin-left: 20px;
    margin-top: 4px;
  }
  
  .bullets .bullet-item-container {
    display: flex;
    align-items: center;
    gap: 8px;
    .bullet-item {
    display: flex;
    flex-wrap: wrap;
    word-break: break-word;
    line-height: 1.4;
    margin-bottom: 2px;
}
    .bullet-item-index {
    border-radius: 50%;
    width: 7px;
    height: 5px;
    background-color: #666;
}
  }
`;

/**
 * Project section styles
 */
const projectStyles = `
  .project-title {
    font-size: 12pt;
    font-weight: bold;
    color: #404040;
  }
  
  .project-title a {
    text-decoration: none;
    font-size: 10pt;
    margin-left: 8px;
  }
  
  .project-description {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-word;
  }
`;

/**
 * Skills section styles
 */
const skillsStyles = `
  .skills-list {
    line-height: 1.6;
  }
  
  .skills-list p {
    margin-bottom: 4px;
  }
  
  .skills-list strong {
    font-weight: bold;
  }
`;

/**
 * Get all styles combined
 * @returns {string} Complete CSS stylesheet
 */
function getAllStyles() {
  return [
    baseStyles,
    headerStyles,
    sectionStyles,
    itemStyles,
    projectStyles,
    skillsStyles,
  ].join("\n");
}

/**
 * Get styles by section names
 * @param {string[]} sections - Array of section names to include
 * @returns {string} Combined CSS for specified sections
 */
function getStylesBySections(sections = []) {
  const styleMap = {
    base: baseStyles,
    header: headerStyles,
    section: sectionStyles,
    item: itemStyles,
    project: projectStyles,
    skills: skillsStyles,
  };

  return sections
    .map((section) => styleMap[section] || "")
    .filter(Boolean)
    .join("\n");
}

module.exports = {
  // Individual style blocks
  baseStyles,
  headerStyles,
  sectionStyles,
  itemStyles,
  projectStyles,
  skillsStyles,
  // Utility functions
  getAllStyles,
  getStylesBySections,
};
