"use client";

const services = [
  { icon: "⚡", title: "Express Delivery",   desc: "Time-sensitive shipments handled with priority routing and guaranteed delivery windows. 1–3 business days internationally." },
  { icon: "🌍", title: "Standard Worldwide", desc: "Reliable global shipping at competitive rates. Full tracking, insurance-ready, and available to over 180 countries." },
  { icon: "📦", title: "Freight & Cargo",    desc: "Large-volume shipments managed with custom logistics planning, consolidation, and white-glove handling." },
  { icon: "🔒", title: "Secure Shipping",    desc: "High-value items shipped with tamper-proof packaging, end-to-end encryption tracking, and full insurance coverage." },
  { icon: "♻️", title: "Eco Shipping",       desc: "Carbon-offset delivery routes using optimised logistics. The sustainable choice without compromising speed." },
  { icon: "🏢", title: "Business Accounts",  desc: "Volume discounts, dedicated account managers, and API integrations for e-commerce stores and enterprises." },
];

export default function Services() {
  return (
    <>
      <style>{`
        .services-section { padding: 120px 60px; }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          margin-top: 70px;
          border: 1px solid var(--border);
        }
        .service-card {
          background: var(--black);
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
          cursor: default;
        }
        .service-card:hover { background: #0f0e0e; }
        .service-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: var(--orange); transform: scaleX(0);
          transform-origin: left; transition: transform 0.35s ease;
        }
        .service-card:hover .service-line { transform: scaleX(1); }
        .service-icon {
          width: 52px; height: 52px;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px; font-size: 22px;
        }
        .service-title {
          font-family: var(--font-display);
          font-size: 28px; letter-spacing: 1px; margin-bottom: 14px;
        }
        .service-desc { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; }
        .service-link {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--orange); text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px; transition: gap 0.2s;
        }
        .service-link:hover { gap: 14px; }
        @media (max-width: 768px) {
          .services-section { padding: 60px 20px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .service-card { padding: 32px 24px !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .services-section { padding: 80px 30px !important; }
          .services-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <section id="services" className="services-section">
        <div>
          <span style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"var(--orange)", marginBottom:20 }}>
            <span style={{ width:16, height:2, background:"var(--orange)", display:"inline-block" }} /> What We Offer
          </span>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(48px,6vw,80px)", letterSpacing:2, lineHeight:0.95, marginBottom:20 }}>
            Built For<br />Every Shipment
          </h2>
          <p style={{ color:"var(--muted)", fontSize:16, lineHeight:1.7, maxWidth:520 }}>
            From lightweight documents to heavy cargo, we have a plan that fits your needs and budget.
          </p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <div key={s.title} className="service-card">
              <div className="service-line" />
              <div className="service-icon">{s.icon}</div>
              <div className="service-title">{s.title}</div>
              <p className="service-desc">{s.desc}</p>
              <a href="#track" className="service-link">Get Started →</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
