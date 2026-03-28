const ACCENT = "#2563EB";

interface ModernAccentPreviewProps {
  scale?: number;
}

export function ModernAccentPreview({ scale = 1 }: ModernAccentPreviewProps) {
  const s = (v: number) => v * scale;
  const pt = (v: number) => `${v * scale}pt`;
  const px = (v: number) => `${v * scale}px`;

  return (
    <div
      className="origin-top-left bg-white text-[#333]"
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: pt(5.5),
        lineHeight: 1.4,
        padding: `${s(14)}px ${s(16)}px ${s(12)}px`,
        width: `${s(306)}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: px(2),
        }}
      >
        <div>
          <div style={{ fontSize: pt(11), fontWeight: 700, color: ACCENT }}>
            Sarah Chen
          </div>
          <div style={{ fontSize: pt(5), color: "#333", marginTop: px(1) }}>
            sarah.chen@email.com
          </div>
          <div style={{ fontSize: pt(5), color: "#333" }}>(555) 987-6543</div>
        </div>
        <div
          style={{
            width: px(28),
            height: px(28),
            borderRadius: "50%",
            background: "#e0e7ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: pt(9),
            fontWeight: 700,
            color: ACCENT,
            flexShrink: 0,
          }}
        >
          SC
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: `${s(1)}px solid #E5E7EB`,
          margin: `${s(3)}px 0`,
        }}
      />

      <Section title="Work Experience" scale={scale}>
        <ExpItem
          company="TechFlow Inc."
          location="New York, NY"
          dates="Mar 2021 — Present"
          role="Lead Frontend Engineer"
          bullets={[
            "Architected component library used across 12 product teams",
            "Reduced bundle size by 35% through code splitting and lazy loading",
          ]}
          scale={scale}
        />
        <ExpItem
          company="DataViz Co."
          location="Boston, MA"
          dates="Aug 2018 — Feb 2021"
          role="Frontend Developer"
          bullets={[
            "Built interactive data visualizations with D3.js and React",
          ]}
          scale={scale}
        />
      </Section>

      <Section title="Education" scale={scale}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: pt(5.5), color: ACCENT }}>
            MIT
          </span>
          <span style={{ fontStyle: "italic", fontSize: pt(5), color: "#666" }}>
            2014 — 2018
          </span>
        </div>
        <div style={{ fontSize: pt(5.5) }}>B.S. Computer Science</div>
      </Section>

      <Section title="Skills" scale={scale}>
        <p>
          <strong>Frontend:</strong> React, Vue, TypeScript &nbsp;
          <strong>Tools:</strong> Webpack, Vite, Docker
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
  scale = 1,
}: {
  title: string;
  children: React.ReactNode;
  scale?: number;
}) {
  const px = (v: number) => `${v * scale}px`;
  const pt = (v: number) => `${v * scale}pt`;

  return (
    <div style={{ marginBottom: px(3) }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: px(4),
          marginBottom: px(2),
        }}
      >
        <div
          style={{
            width: px(1.5),
            height: px(9),
            background: ACCENT,
            borderRadius: px(1),
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: pt(7),
            fontWeight: 700,
            color: "#000",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          marginLeft: px(6),
          paddingLeft: px(6),
          borderLeft: `${scale}px solid #f3f4f6`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ExpItem({
  company,
  location,
  dates,
  role,
  bullets,
  scale = 1,
}: {
  company: string;
  location: string;
  dates: string;
  role: string;
  bullets: string[];
  scale?: number;
}) {
  const pt = (v: number) => `${v * scale}pt`;
  const px = (v: number) => `${v * scale}px`;

  return (
    <div style={{ marginBottom: px(2) }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: pt(5.5), color: ACCENT }}>
          {company}
        </span>
        <span style={{ fontStyle: "italic", fontSize: pt(5), color: "#666" }}>
          {location} | {dates}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: pt(5.5), marginTop: px(0.5) }}>
        {role}
      </div>
      <ul
        style={{
          marginLeft: px(10),
          paddingLeft: "0",
          listStyle: "disc",
          marginTop: px(1),
        }}
      >
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: px(0.5) }}>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
