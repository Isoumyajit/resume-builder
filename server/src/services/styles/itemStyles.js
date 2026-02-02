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
    display: flex;
    justify-content: space-between;
    gap: 4px;
    font-size: 12pt;
    font-weight: 500;
    color:rgb(40, 40, 40);
  }

  .item-details {
    font-size: 10pt;
    font-style: italic;
    color: #666;
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
    align-items: align-baseline;
    gap: 8px;
    .bullet-item {
    display: flex;
    flex-wrap: wrap;
    word-break: break-word;
    line-height: 1.4;
    margin-bottom: 2px;
}
  }
`;

module.exports = { itemStyles };
