const ACCENT = "#2563EB";
const BORDER_COLOR = "#E5E7EB";
const T = `body[data-template="modern-accent"]`;

const modernAccentOverrides = `
  ${T} {
    font-family: "Outfit", sans-serif;
  }

  /* ── Header ─────────────────────────────────────────────────────── */
  ${T} .header {
    text-align: left;
    margin-bottom: 12px;
  }

  ${T} .header .name {
    color: ${ACCENT};
    font-weight: 700;
    font-size: 18pt;
  }

  ${T} .header .name .name-initial {
    font-size: inherit;
    line-height: inherit;
  }

  ${T} .header .contact {
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
  }

  ${T} .header .contact .vr-divider {
    display: none;
  }

  ${T} .header .contact a,
  ${T} .header .links .link {
    color: ${ACCENT};
  }

  /* ── Header divider ─────────────────────────────────────────────── */
  ${T} .header .header-divider {
    width: 100%;
    display: block;
    border: none;
    border-top: 2px solid ${BORDER_COLOR};
    margin-top: 8px;
    margin-bottom: 0;
  }

  /* ── Sections ───────────────────────────────────────────────────── */
  ${T} .section {
    margin-bottom: 10px;
  }

  ${T} .section-title {
    border-bottom: none;
    border-left: 2px solid ${ACCENT};
    padding-left: 8px;
    text-transform: uppercase;
    font-size: 12pt;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  ${T} .section-title .material-symbols-outlined {
    display: none;
  }

  ${T} .section > :not(.section-title) {
    margin-left: 10px;
    padding-left: 12px;
  }

  /* ── Experience ─────────────────────────────────────────────────── */
  ${T} .experience-title {
    color: ${ACCENT};
  }

  ${T} .experience-company .experience-title {
    color: ${ACCENT};
    font-weight: 700;
  }

  ${T} .experience-bullets {
    margin-left: 20px;
    padding-left: 4px;
  }

  ${T} .experience-item {
    margin-bottom: 6px;
  }

  /* ── Projects ───────────────────────────────────────────────────── */
  ${T} .project-title {
    color: ${ACCENT};
  }
`;

module.exports = { modernAccentOverrides };
