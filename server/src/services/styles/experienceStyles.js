const experienceStyles = `
  .experience-item {
    margin-bottom: 2px;
  }

  .experience-header-content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .experience-company {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .experience-title {
    font-size: 11pt;
    font-weight: 600;
    color: #333333;
  }

  .experience-subtitle {
    font-size: 10pt;
    font-style: italic;
    color: #666666;
  }

  .experience-role {
    margin-top: 1px;
  }

  .experience-tech-stack {
    font-size: 10pt;
    font-weight: bold;
    margin-top: 1px;
    color: #404040;
    border-bottom: 1px dotted #696969;
    width: fit-content;
  }

  .experience-tech-stack span {
    font-weight: normal;
  }

  .experience-bullets {
    margin-left: 16px;
    margin-top: 2px;
    padding: 0;
    list-style: none;
  }

  .experience-bullet-item-container {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .experience-bullet-item-index {
    flex-shrink: 0;
  }

  .experience-bullet-item {
    display: flex;
    flex-wrap: wrap;
    word-break: break-word;
    line-height: 1.4;
  }
`;

module.exports = { experienceStyles };
