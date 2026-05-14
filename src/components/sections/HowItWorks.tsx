"use client";

const steps = [
  { num: "01", title: "Book Your Shipment",   desc: "Enter pickup and destination details online. Get an instant rate and delivery estimate." },
  { num: "02", title: "We Pick It Up",        desc: "Our rider arrives at your location within the selected window. No need to visit a drop-off point." },
  { num: "03", title: "We Handle Logistics",  desc: "Your package moves through our network — customs, transit, and last-mile — all tracked live." },
  { num: "04", title: "Delivered & Confirmed",desc: "Recipient gets a delivery confirmation with photo proof. You get notified instantly." },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        background: "#0d0c0c",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "120px 60px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>

        {/* Left */}
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--orange)", marginBottom: 20 }}>
            <span style={{ width: 16, height: 2, background: "var(--orange)", display: "inline-block" }} />
            Process
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: 2, lineHeight: 0.95, marginBottom: 48 }}>
            Ship In<br />4 Simple<br />Steps
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map((step, i) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  gap: 28,
                  padding: "32px 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : undefined,
                  borderBottom: "1px solid var(--border)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const num = e.currentTarget.querySelector(".step-num") as HTMLElement;
                  if (num) num.style.color = "var(--orange)";
                }}
                onMouseLeave={(e) => {
                  const num = e.currentTarget.querySelector(".step-num") as HTMLElement;
                  if (num) num.style.color = "rgba(244,82,30,0.2)";
                }}
              >
                <div
                  className="step-num"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 48,
                    color: "rgba(244,82,30,0.2)",
                    lineHeight: 1,
                    minWidth: 56,
                    transition: "color 0.3s",
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{step.title}</div>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — animated globe */}
        <div style={{ position: "relative", height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[440, 320, 200].map((size, i) => (
            <div
              key={size}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1px ${i === 1 ? "dashed" : "solid"} var(--border)`,
                animation: `spin${i} ${[30, 20, 12][i]}s linear infinite ${i === 1 ? "reverse" : ""}`,
              }}
            />
          ))}
          <div
            style={{
              width: 100,
              height: 100,
              background: "var(--orange)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              position: "relative",
              zIndex: 2,
              boxShadow: "0 0 60px rgba(244,82,30,0.4)",
            }}
          >
            🌐
          </div>
          <style>{`
            @keyframes spin0 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes spin1 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            @keyframes spin2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </section>
  );
}