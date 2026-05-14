"use client";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(244,82,30,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(244,82,30,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(244,82,30,0.15) 0%, transparent 70%)",
          top: -100,
          right: -100,
          pointerEvents: "none",
        }}
      />

      {/* Left content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Tag */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--orange)",
            marginBottom: 28,
          }}
        >
          <span style={{ width: 24, height: 2, background: "var(--orange)", display: "inline-block" }} />
          Global Shipping · Est. 2024
        </span>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(72px, 9vw, 120px)",
            lineHeight: 0.92,
            letterSpacing: 2,
            marginBottom: 32,
          }}
        >
          Move
          <br />
          Any<span style={{ color: "var(--orange)" }}>thing.</span>
          <br />
          Every<span style={{ color: "var(--orange)" }}>where.</span>
        </h1>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: 400,
            marginBottom: 48,
          }}
        >
          Daily Logistics delivers packages from your doorstep to any
          destination worldwide — fast, tracked, and reliably handled every
          step of the way.
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a
            href="#track"
            style={{
              background: "var(--orange)",
              color: "#fff",
              border: "none",
              padding: "16px 36px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--orange-dark)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--orange)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Ship a Package
          </a>
          <a
            href="#how"
            style={{
              color: "var(--white)",
              border: "1px solid var(--border)",
              padding: "16px 36px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-block",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(244,82,30,0.5)";
              e.currentTarget.style.background = "rgba(244,82,30,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            How It Works
          </a>
        </div>
      </div>

      {/* Right — tracker card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: 420,
            padding: 36,
            position: "relative",
            animation: "float 5s ease-in-out infinite",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, var(--orange), transparent)",
            }}
          />

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>
            Live Shipment
          </div>

          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 3, color: "var(--orange)", marginBottom: 28 }}>
            DL-2024-08847
          </div>

          {/* Route */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 2 }}>JFK</div>
              <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>New York, US</div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <div style={{ width: 8, height: 8, background: "var(--orange)", borderRadius: "50%", position: "relative" }}>
                <div style={{ position: "absolute", inset: -4, border: "1px solid var(--orange)", borderRadius: "50%", opacity: 0.4, animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 2 }}>LHR</div>
              <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>London, UK</div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "✓", label: "Package Received", time: "May 11 · 08:14 AM", status: "Done", state: "done" },
              { icon: "✓", label: "Cleared Customs",  time: "May 11 · 01:30 PM", status: "Done", state: "done" },
              { icon: "✈", label: "In Transit",       time: "May 11 · 04:00 PM", status: "Live", state: "active" },
              { icon: "📦", label: "Out for Delivery", time: "Est. May 13",       status: "Soon", state: "pending" },
            ].map((step) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      step.state === "done"   ? "rgba(244,82,30,0.15)"  :
                      step.state === "active" ? "var(--orange)"          :
                      "rgba(255,255,255,0.04)",
                    color:
                      step.state === "done"   ? "var(--orange)" :
                      step.state === "active" ? "#fff"           :
                      "var(--muted)",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: step.state === "pending" ? "var(--muted)" : "var(--white)" }}>
                    {step.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{step.time}</div>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  color: step.state === "done" ? "#4CAF50" : step.state === "active" ? "var(--orange)" : "var(--muted)",
                }}>
                  {step.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}