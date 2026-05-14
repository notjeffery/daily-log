"use client";

import { useState } from "react";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    color: "var(--white)",
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: "var(--muted)",
    marginBottom: 7,
    display: "block",
  };

  return (
    <section
      id="support"
      style={{
        padding: "120px 60px",
        borderTop: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        alignItems: "start",
      }}
    >
      {/* Left — channels */}
      <div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--orange)", marginBottom: 20 }}>
          <span style={{ width: 16, height: 2, background: "var(--orange)", display: "inline-block" }} />
          Support
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: 2, lineHeight: 0.95, marginBottom: 16 }}>
          We&apos;re Here<br />For You.<br /><span style={{ color: "var(--orange)" }}>Always.</span>
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 420, marginBottom: 48 }}>
          Got a question about your shipment? Need help booking? Our team and AI assistant are available around the clock.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Live Chat */}
          <div
            onClick={() => {
              const w = document.getElementById("chatWindow");
              if (w) w.classList.add("open");
            }}
            style={{ background: "var(--card-bg)", border: "1px solid var(--orange)", padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "background 0.25s", backgroundColor: "rgba(244,82,30,0.06)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(244,82,30,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(244,82,30,0.06)")}
          >
            <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "var(--orange)", border: "1px solid var(--orange)", flexShrink: 0 }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Live Chat — AI + Human</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>Instant answers for tracking, pricing, and quick questions. Human agent escalation available.</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 10px", border: "1px solid rgba(76,175,80,0.4)", color: "#4CAF50", whiteSpace: "nowrap" }}>Live 24/7</div>
          </div>

          {/* Email */}
          <a
            href="mailto:dailylogistics1@outlook.com"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textDecoration: "none", transition: "border-color 0.25s, background 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(244,82,30,0.45)"; e.currentTarget.style.background = "rgba(244,82,30,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card-bg)"; }}
          >
            <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "rgba(244,82,30,0.1)", border: "1px solid rgba(244,82,30,0.2)", flexShrink: 0 }}>✉️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--white)" }}>Email Support</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>Send detailed enquiries, complaints, or documents. We reply within 2–4 hours during business hours.</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 10px", border: "1px solid rgba(244,82,30,0.4)", color: "var(--orange)", whiteSpace: "nowrap" }}>Avg. 2hr reply</div>
          </a>

          {/* Phone */}
          <a
            href="tel:+10000000000"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", textDecoration: "none", transition: "border-color 0.25s, background 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(244,82,30,0.45)"; e.currentTarget.style.background = "rgba(244,82,30,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card-bg)"; }}
          >
            <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "rgba(244,82,30,0.1)", border: "1px solid rgba(244,82,30,0.2)", flexShrink: 0 }}>📞</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--white)" }}>Phone Support</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>Speak directly with our team. Mon–Sat, 7AM–10PM EST.</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 10px", border: "1px solid rgba(244,82,30,0.4)", color: "var(--orange)", whiteSpace: "nowrap" }}>+1 000 000 0000</div>
          </a>
        </div>
      </div>

      {/* Right — contact form */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: 40, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--orange), transparent)" }} />

        {!submitted ? (
          <>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: 2, marginBottom: 6 }}>Send Us a Message</div>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28, lineHeight: 1.6 }}>
              For shipment issues, claims, business enquiries, or anything needing a detailed response — fill the form and we&apos;ll get back to you fast.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>Full Name</label><input type="text" placeholder="Your name" style={inputStyle} /></div>
              <div><label style={labelStyle}>Email Address</label><input type="email" placeholder="you@email.com" style={inputStyle} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>Tracking ID (optional)</label><input type="text" placeholder="DL-2024-XXXXX" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Issue Type</label>
                <select style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Select category</option>
                  <option>Package Tracking</option>
                  <option>Booking / Quote</option>
                  <option>Delay or Lost Package</option>
                  <option>Customs &amp; Duties</option>
                  <option>Billing &amp; Payment</option>
                  <option>Business Account</option>
                  <option>General Enquiry</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Message</label>
              <textarea rows={5} placeholder="Describe your issue or question in detail..." style={{ ...inputStyle, resize: "none" }} />
            </div>
            <button
              onClick={() => setSubmitted(true)}
              style={{ width: "100%", marginTop: 20, background: "var(--orange)", color: "#fff", border: "none", padding: 16, fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--orange-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--orange)")}
            >
              Send Message →
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 10 }}>Message Sent!</div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              Thanks for reaching out. A member of our support team will reply to your email within 2–4 hours. Check your inbox — including spam.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}