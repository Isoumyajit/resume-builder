/**
 * Wraps a section with a title.
 */
function createSection(title, content, icon = "") {
  if (!content) return "";
  return `
    <div class="section">
      <div class="section-title"> ${icon && icon} ${title}</div>
      ${content}
    </div>
  `;
}

module.exports = { createSection };
