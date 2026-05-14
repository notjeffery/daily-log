"use client";

const destinations = [
  { flag: "🇬🇧", country: "United Kingdom", cities: "London · Manchester · Birmingham", time: "3–5 days" },
  { flag: "🇺🇸", country: "United States",  cities: "New York · Houston · Atlanta",    time: "4–7 days" },
  { flag: "🇩🇪", country: "Germany",        cities: "Berlin · Frankfurt · Munich",     time: "4–6 days" },
  { flag: "🇨🇦", country: "Canada",         cities: "Toronto · Vancouver · Montreal",  time: "5–7 days" },
  { flag: "🇦🇪", country: "UAE",            cities: "Dubai · Abu Dhabi · Sharjah",     time: "2–4 days" },
  { flag: "🇿🇦", country: "South Africa",   cities: "Johannesburg · Cape Town · Durban", time: "3–5 days" },
  { flag: "🇨🇳", country: "China",          cities: "Shanghai · Beijing · Shenzhen",   time: "5–8 days" },
  { flag: "🌍",  country: "+ 173 More",     cities: "Every continent covered",          time: "View all →" },
];

export default function Destinations() {
  return (
    <section id="destinations" style={{ padding: "120px 60px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--orange)", marginBottom: 20 }}>
        <span style={{ width: 16, height: 2, background: "var(--orange)", display: "inline-block" }} />
        Global Network
      </span>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: 2, lineHeight: 0.95, marginBottom: 20 }}>
        We Ship<br />Worldwide
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 520, marginBottom: 60 }}>
        Our network spans every major continent with dedicated routes, local agents, and fast customs processing.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {destinations.map((d) => (
          <div
            key={d.country}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              padding: 28,
              transition: "border-color 0.3s, transform 0.3s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(244,82,30,0.4)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: 32, marginBottom: 14, display: "block" }}>{d.flag}</span>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, marginBottom: 6 }}>{d.country}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{d.cities}</div>
            <div style={{ marginTop: 16, fontSize: 11, color: "var(--orange)", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>
              ✈ Avg. {d.time}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}