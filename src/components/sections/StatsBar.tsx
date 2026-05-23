"use client";

const stats = [
  { number: "180", suffix: "+", label: "Countries Covered" },
  { number: "2.4", suffix: "M", label: "Packages Delivered" },
  { number: "99",  suffix: "%", label: "On-Time Delivery Rate" },
  { number: "24",  suffix: "/7", label: "Live Support" },
];

export default function StatsBar() {
  return (
    <>
      <style>{`
        .stats-bar {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          padding: 48px 40px;
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        .stat-item:last-child { border-right: none; }
        .stat-bg {
          position: absolute; inset: 0;
          background: rgba(244,82,30,0.04);
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .stat-number {
          font-family: var(--font-display);
          font-size: 56px;
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label { font-size: 13px; color: var(--muted); }
        @media (max-width: 768px) {
          .stats-bar { grid-template-columns: 1fr 1fr !important; }
          .stat-item { padding: 28px 20px !important; border-right: 1px solid var(--border) !important; }
          .stat-item:nth-child(2) { border-right: none !important; }
          .stat-item:nth-child(3) { border-top: 1px solid var(--border); }
          .stat-item:nth-child(4) { border-top: 1px solid var(--border); border-right: none !important; }
          .stat-number { font-size: 36px !important; }
          .stat-label { font-size: 11px !important; }
        }
      `}</style>
      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={s.label} className="stat-item"
            onMouseEnter={e => (e.currentTarget.querySelector(".stat-bg") as HTMLElement).style.opacity = "1"}
            onMouseLeave={e => (e.currentTarget.querySelector(".stat-bg") as HTMLElement).style.opacity = "0"}
          >
            <div className="stat-bg" />
            <div className="stat-number">
              {s.number}<span style={{ color: "var(--orange)" }}>{s.suffix}</span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
