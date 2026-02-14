const projectStyles = `
  .project-item { 
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 8px;
  }
  .project-title {
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 2px;
    font-weight: 600;
    color: #404040;
  }

  .project-tech-stack {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: bold;
    width: fit-content;
    border-bottom: 1px dotted #696969;
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
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-word;
    margin-left: 24px;
  }
`;

module.exports = { projectStyles };
