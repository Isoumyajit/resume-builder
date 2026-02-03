const projectStyles = `
  .project-title {
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-weight: semibold;
    color: #404040;
  }

  .project-tech-stack {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: bold;
  }

  .project-tech-stack-name {
    font-size: 10pt;
    font-weight: normal;
    color: #404040;
  }
  
  .project-title a {
    text-decoration: none;
    font-size: 10pt;
    margin-left: 8px;
  }
  
  .project-description {
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-word;
  }
`;

module.exports = { projectStyles };
