const headerStyles = `
  .header {
    text-align: center;
    margin-bottom: 8px;
  }
  
  .header .name {
    font-size: 22pt;
    font-weight: 400;
    color: #000;
    margin-bottom: 2px;
  }
  
  .header .name .name-initial {
    font-size: 28pt;
    line-height: 1;
    display: inline-block;
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
  .header .contact-item {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: wrap;
  }
  
  .header .contact a {
    color: #000;
    text-decoration: underline;
  }
  
  .header .links .link {
    text-decoration: underline;
    color: #000;
  }

  .header .header-divider {
    display: none;
  }
`;

module.exports = { headerStyles };
