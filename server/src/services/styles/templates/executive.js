const ACCENT = "#0E7490";
const T = `body[data-template="executive"]`;

const executiveOverrides = `
  ${T} {
    font-family: "Montserrat", sans-serif;
  }

  /* ── Header ─────────────────────────────────────────────────────── */
  ${T} .header .name .name-initial {
    font-size: inherit;
    line-height: inherit;
  }

  ${T} .header .contact a,
  ${T} .header .links .link {
    color: ${ACCENT};
  }

  /* ── Sections ───────────────────────────────────────────────────── */
  ${T} .section-title {
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    color: ${ACCENT};
    border-bottom: 2px solid ${ACCENT};
    font-size: 12pt;
    font-weight: 700;
    letter-spacing: 1px;
  }

  ${T} .section-title .material-symbols-outlined,
  ${T} .section-title img {
    display: none !important;
  }

  ${T} .header .contact img {
    display: none !important;
  }

  /* ── Experience ─────────────────────────────────────────────────── */
  ${T} .experience-title {
    color: ${ACCENT};
  }

  ${T} .experience-company .experience-title {
    color: ${ACCENT};
    font-weight: 700;
  }

  ${T} .experience-tech-stack {
    border-bottom-color: ${ACCENT};
  }

  /* ── Projects ───────────────────────────────────────────────────── */
  ${T} .project-title {
    color: ${ACCENT};
  }

  ${T} .project-tech-stack {
    border-bottom-color: ${ACCENT};
  }
`;

module.exports = { executiveOverrides };
