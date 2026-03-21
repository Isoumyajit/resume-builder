const ACCENT = "#0E7490";

interface ExecutivePreviewProps {
  scale?: number;
}

export function ExecutivePreview({ scale = 1 }: ExecutivePreviewProps) {
  const s = (v: number) => v * scale;
  const pt = (v: number) => `${v * scale}pt`;
  const px = (v: number) => `${v * scale}px`;

  return (
    <div
      className="origin-top-left bg-white text-[#333]"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: pt(5.5),
        lineHeight: 1.4,
        padding: `${s(14)}px ${s(16)}px ${s(12)}px`,
        width: `${s(306)}px`,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: px(4) }}>
        <div style={{ fontSize: pt(11), fontWeight: 400, color: "#000" }}>
          <span style={{ fontSize: pt(13) }}>M</span>ichael{" "}
          <span style={{ fontSize: pt(13) }}>R</span>eynolds
        </div>
        <div style={{ fontSize: pt(5), color: ACCENT, marginTop: px(1) }}>
          Chicago, IL &nbsp;|&nbsp; m.reynolds@email.com &nbsp;|&nbsp; (555)
          321-9876
        </div>
      </div>

      <Section title="Work Experience" scale={scale}>
        <ExpItem
          company="Global Finance Corp"
          location="Chicago, IL"
          dates="Sep 2020 — Present"
          role="Engineering Manager"
          bullets={[
            "Managed team of 8 engineers delivering trading platform features",
            "Implemented CI/CD pipeline reducing release cycles from 2 weeks to 2 days",
          ]}
          scale={scale}
        />
        <ExpItem
          company="MegaSoft Ltd."
          location="Seattle, WA"
          dates="Jan 2017 — Aug 2020"
          role="Senior Developer"
          bullets={[
            "Designed event-driven architecture processing 500K events/hour",
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
          <span style={{ fontWeight: 600, fontSize: pt(5.5), color: ACCENT }}>
            University of Illinois
          </span>
          <span style={{ fontStyle: "italic", fontSize: pt(5), color: "#666" }}>
            2013 — 2017
          </span>
        </div>
        <div style={{ fontSize: pt(5.5) }}>B.S. Computer Science</div>
      </Section>

      <Section title="Skills" scale={scale}>
        <p>
          <strong>Backend:</strong> Java, Kotlin, Go &nbsp;
          <strong>Cloud:</strong> AWS, Kubernetes, Terraform
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
          textAlign: "center",
          textTransform: "uppercase",
          color: ACCENT,
          fontSize: pt(7),
          fontWeight: 700,
          letterSpacing: "0.5px",
          borderBottom: `${scale}px solid ${ACCENT}`,
          paddingBottom: px(1),
          marginBottom: px(2),
        }}
      >
        {title}
      </div>
      {children}
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
        <span style={{ fontWeight: 600, fontSize: pt(5.5), color: ACCENT }}>
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
