const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-size: 10pt;
    font-weight: 400;
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
`;

module.exports = { baseStyles };
