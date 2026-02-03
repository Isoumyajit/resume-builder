/**
 * Wraps a section with a title.
 */
function createSection(title, content, icon = "") {
  if (!content) return "";
  return `
    <section class="section">
      <div class="section-title"> ${icon && icon} ${title}</div>
      ${content}
    </section>
  `;
}

module.exports = { createSection };
