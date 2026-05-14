"use client";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "80px 60px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>

        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "#fff" }}>DL</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2 }}>Daily Logistics</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, maxWidth: 260, marginBottom: 28 }}>
            Moving packages across the world, reliably and affordably. Your shipment is our priority — every single day.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {["𝕏", "in", "ig", "fb"].map((s) => (
              <a
                key={s}
                href="#"
                style={{ width: 36, height: 36, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", textDecoration: "none", color: "var(--muted)", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.color = "var(--orange)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          { heading: "Services", links: ["Express Delivery", "Standard Worldwide", "Freight & Cargo", "Secure Shipping", "Business Accounts"] },
          { heading: "Company",  links: ["About Us", "Careers", "Press", "Partners", "Contact"] },
          { heading: "Support",  links: ["Track a Package", "Get a Quote", "FAQs", "Prohibited Items", "Claims & Insurance"] },
        ].map((col) => (
          <div key={col.heading}>
            <h4 style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: 20 }}>
              {col.heading}
            </h4>
            <ul style={{ listStyle: "none" }}>
              {col.links.map((link) => (
                <li key={link} style={{ marginBottom: 12 }}>
                  <a
                    href="#"
                    style={{ color: "rgba(245,242,236,0.6)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,242,236,0.6)")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          © 2024 Daily Logistics Ltd. All rights reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--orange)" }}>
          <span style={{ animation: "blink 1.5s ease-in-out infinite" }}>●</span>
          Systems operational · 99.9% uptime
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </footer>
  );
}