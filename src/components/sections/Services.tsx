"use client";

const services = [
  { icon: "⚡", title: "Express Delivery",    desc: "Time-sensitive shipments handled with priority routing and guaranteed delivery windows. 1–3 business days internationally." },
  { icon: "🌍", title: "Standard Worldwide",  desc: "Reliable global shipping at competitive rates. Full tracking, insurance-ready, and available to over 180 countries." },
  { icon: "📦", title: "Freight & Cargo",     desc: "Large-volume shipments managed with custom logistics planning, consolidation, and white-glove handling." },
  { icon: "🔒", title: "Secure Shipping",     desc: "High-value items shipped with tamper-proof packaging, end-to-end encryption tracking, and full insurance coverage." },
  { icon: "♻️", title: "Eco Shipping",        desc: "Carbon-offset delivery routes using optimised logistics. The sustainable choice without compromising speed." },
  { icon: "🏢", title: "Business Accounts",   desc: "Volume discounts, dedicated account managers, and API integrations for e-commerce stores and enterprises." },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: "120px 60px" }}>
      {/* Header */}
      <div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--orange)", marginBottom: 20 }}>
          <span style={{ width: 16, height: 2, background: "var(--orange)", display: "inline-block" }} />
          What We Offer
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: 2, lineHeight: 0.95, marginBottom: 20 }}>
          Built For<br />Every Shipment
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 520 }}>
          From lightweight documents to heavy cargo, we have a plan that fits your needs and budget.
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--border)",
          marginTop: 70,
          border: "1px solid var(--border)",
        }}
      >
        {services.map((s) => (
          <div
            key={s.title}
            style={{ background: "var(--black)", padding: "48px 40px", position: "relative", overflow: "hidden", cursor: "default", transition: "background 0.3s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0f0e0e";
              const line = e.currentTarget.querySelector(".service-line") as HTMLElement;
              if (line) line.style.transform = "scaleX(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--black)";
              const line = e.currentTarget.querySelector(".service-line") as HTMLElement;
              if (line) line.style.transform = "scaleX(0)";
            }}
          >
            {/* Bottom hover line */}
            <div
              className="service-line"
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: "var(--orange)", transform: "scaleX(0)", transformOrigin: "left",
                transition: "transform 0.35s ease",
              }}
            />
            <div style={{ width: 52, height: 52, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, fontSize: 22 }}>
              {s.icon}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 1, marginBottom: 14 }}>{s.title}</div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>{s.desc}</p>
            <a
              href="#track"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--orange)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "gap 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = "14px")}
              onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
            >
              Get Started →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}