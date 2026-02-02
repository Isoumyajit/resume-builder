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

  .montserrat-400 {
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }
`;

module.exports = { baseStyles };
