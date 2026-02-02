/**
 * External <link> tags to inject into the HTML head.
 */
const headLinks = [
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=phone_enabled",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=mail",
];

function getHeadLinks() {
  return headLinks
    .map((href) => `<link rel="stylesheet" href="${href}" />`)
    .join("\n  ");
}

const fontImports = [
  "@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');",
];

function getFontImports() {
  return fontImports.join("\n    ");
}

module.exports = {
  getHeadLinks,
  getFontImports,
};
