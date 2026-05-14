"use client";

const stats = [
  { number: "180", suffix: "+", label: "Countries Covered" },
  { number: "2.4", suffix: "M", label: "Packages Delivered" },
  { number: "99",  suffix: "%", label: "On-Time Delivery Rate" },
  { number: "24",  suffix: "/7", label: "Live Support" },
];

export default function StatsBar() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: "48px 40px",
            borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
            position: "relative",
            overflow: "hidden",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.querySelector(".stat-bg") as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.querySelector(".stat-bg") as HTMLElement).style.opacity = "0";
          }}
        >
          <div
            className="stat-bg"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(244,82,30,0.04)",
              opacity: 0,
              transition: "opacity 0.3s",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              letterSpacing: 1,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {s.number}
            <span style={{ color: "var(--orange)" }}>{s.suffix}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}