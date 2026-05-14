"use client";

const testimonials = [
  {
    initials: "JM",
    name: "James Mitchell",
    role: "Small Business Owner · Austin, TX",
    quote: "Daily Logistics shipped my product samples from Austin to London in 4 days flat. The live tracking gave me full peace of mind the entire way — I knew exactly where my package was at every step.",
  },
  {
    initials: "SR",
    name: "Sarah Reynolds",
    role: "E-commerce Seller · Atlanta, GA",
    quote: "I run an online store and Daily Logistics handles all my international orders. The rates are unbeatable and my customers in Europe and Canada always receive their packages on time.",
  },
  {
    initials: "DW",
    name: "Derek Washington",
    role: "Import Trader · Chicago, IL",
    quote: "I've used three other shipping companies before switching to Daily Logistics. None of them came close — packages arrive on time, the pricing is transparent, and the support team actually responds.",
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "120px 60px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--orange)", marginBottom: 20 }}>
        <span style={{ width: 16, height: 2, background: "var(--orange)", display: "inline-block" }} />
        Reviews
      </span>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: 2, lineHeight: 0.95, marginBottom: 60 }}>
        Trusted By<br />Thousands
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {testimonials.map((t) => (
          <div
            key={t.name}
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: 36 }}
          >
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(245,242,236,0.8)", marginBottom: 28, fontStyle: "italic" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40, height: 40,
                  background: "var(--orange)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 18, color: "#fff", flexShrink: 0,
                }}
              >
                {t.initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{t.role}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "var(--orange)", fontSize: 12 }}>★★★★★</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}