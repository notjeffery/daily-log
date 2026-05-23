"use client";

const destinations = [
  { flag:"🇬🇧", country:"United Kingdom", cities:"London · Manchester · Birmingham", time:"3–5 days" },
  { flag:"🇺🇸", country:"United States",  cities:"New York · Houston · Atlanta",    time:"4–7 days" },
  { flag:"🇩🇪", country:"Germany",        cities:"Berlin · Frankfurt · Munich",     time:"4–6 days" },
  { flag:"🇨🇦", country:"Canada",         cities:"Toronto · Vancouver · Montreal",  time:"5–7 days" },
  { flag:"🇦🇪", country:"UAE",            cities:"Dubai · Abu Dhabi · Sharjah",     time:"2–4 days" },
  { flag:"🇿🇦", country:"South Africa",   cities:"Johannesburg · Cape Town · Durban", time:"3–5 days" },
  { flag:"🇨🇳", country:"China",          cities:"Shanghai · Beijing · Shenzhen",   time:"5–8 days" },
  { flag:"🌍",  country:"+ 173 More",     cities:"Every continent covered",          time:"View all →" },
];

export default function Destinations() {
  return (
    <>
      <style>{`
        .dest-section { padding: 120px 60px; }
        .dest-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 60px;
        }
        .dest-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 28px;
          transition: border-color 0.3s, transform 0.3s;
          cursor: default;
        }
        .dest-card:hover {
          border-color: rgba(244,82,30,0.4);
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .dest-section { padding: 60px 20px !important; }
          .dest-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .dest-card { padding: 18px !important; }
          .dest-card span[style] { font-size: 24px !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .dest-section { padding: 80px 30px !important; }
          .dest-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <section id="destinations" className="dest-section">
        <span style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"var(--orange)", marginBottom:20 }}>
          <span style={{ width:16, height:2, background:"var(--orange)", display:"inline-block" }} /> Global Network
        </span>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(48px,6vw,80px)", letterSpacing:2, lineHeight:0.95, marginBottom:20 }}>
          We Ship<br />Worldwide
        </h2>
        <p style={{ color:"var(--muted)", fontSize:16, lineHeight:1.7, maxWidth:520 }}>
          Our network spans every major continent with dedicated routes, local agents, and fast customs processing.
        </p>
        <div className="dest-grid">
          {destinations.map(d => (
            <div key={d.country} className="dest-card">
              <span style={{ fontSize:32, marginBottom:14, display:"block" }}>{d.flag}</span>
              <div style={{ fontFamily:"var(--font-display)", fontSize:22, letterSpacing:1, marginBottom:6 }}>{d.country}</div>
              <div style={{ fontSize:12, color:"var(--muted)", fontFamily:"var(--font-mono)" }}>{d.cities}</div>
              <div style={{ marginTop:16, fontSize:11, color:"var(--orange)", fontFamily:"var(--font-mono)", letterSpacing:1 }}>✈ Avg. {d.time}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
