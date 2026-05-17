"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const rates: Record<string, { base: number; days: string }> = {
  uk: { base: 18, days: "3–5" },
  us: { base: 22, days: "4–7" },
  de: { base: 20, days: "4–6" },
  ca: { base: 24, days: "5–7" },
  ae: { base: 14, days: "2–4" },
  za: { base: 12, days: "3–5" },
  cn: { base: 21, days: "5–8" },
};

const serviceMultiplier: Record<string, number> = {
  standard: 1,
  express: 1.8,
  freight: 2.5,
};

export default function ActionPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"track" | "send" | "receive">("track");
  const [trackId, setTrackId]     = useState("");
  const [trackStatus, setTrackStatus] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const [trackResult, setTrackResult] = useState<{status:string; eta:string; steps:{status:string;state:string;time:string}[]} | null>(null);

  const [country, setCountry] = useState("");
  const [weight, setWeight]   = useState("");
  const [service, setService] = useState("standard");

  const calcPrice = () => {
    if (!country || !weight || parseFloat(weight) <= 0) return null;
    const r = rates[country];
    if (!r) return null;
    const base    = r.base;
    const wCharge = Math.round(parseFloat(weight) * 3 * 100) / 100;
    const mult    = serviceMultiplier[service];
    const sFee    = Math.round((base + wCharge) * (mult - 1) * 100) / 100;
    const total   = Math.round((base + wCharge + sFee) * 100) / 100;
    return { base, wCharge, sFee, total, days: r.days };
  };
  const price = calcPrice();

  const handleTrack = async () => {
    const id = trackId.trim().toUpperCase();
    if (!id) return;
    setTrackStatus("loading");
    setTrackResult(null);

    const { data, error } = await supabase
      .from("packages")
      .select("id, status, eta, steps")
      .eq("id", id)
      .single();

    if (error || !data) {
      setTrackStatus("notfound");
      return;
    }

    setTrackResult(data);
    setTrackStatus("found");
  };

  const tabs = [
    { id: "track",   icon: "📍", label: "Track",   sub: "Live package status" },
    { id: "send",    icon: "📤", label: "Send",    sub: "Book a shipment" },
    { id: "receive", icon: "📥", label: "Receive", sub: "Get your package" },
  ] as const;

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
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: 7,
    display: "block",
  };

  return (
    <section id="track" style={{ background: "#0d0c0c", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "0 60px" }}>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              color: activeTab === tab.id ? "var(--white)" : "var(--muted)",
              borderBottom: activeTab === tab.id ? "3px solid var(--orange)" : "3px solid transparent",
              marginBottom: -1,
              transition: "color 0.2s",
              textAlign: "left",
            }}
          >
            <div style={{ width: 34, height: 34, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: activeTab === tab.id ? "var(--orange)" : "transparent", borderColor: activeTab === tab.id ? "var(--orange)" : "var(--border)", transition: "background 0.2s, border-color 0.2s" }}>
              {tab.icon}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: "1.5px" }}>{tab.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>{tab.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: "44px 0" }}>

        {/* ── TRACK ── */}
        {activeTab === "track" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, letterSpacing: 2, lineHeight: 1, marginBottom: 10 }}>
                Track Your <span style={{ color: "var(--orange)" }}>Package</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>
                Enter your Daily Logistics tracking ID to see real-time status, location, and estimated delivery.
              </p>
              <div style={{ display: "flex" }}>
                <input
                  value={trackId}
                  onChange={(e) => { setTrackId(e.target.value); setTrackStatus("idle"); }}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  placeholder="e.g. DL-2024-08847"
                  style={{ ...inputStyle, flex: 1, borderRight: "none", fontFamily: "var(--font-mono)", letterSpacing: 1, fontSize: 13 }}
                />
                <button
                  onClick={handleTrack}
                  style={{ background: "var(--orange)", color: "#fff", border: "none", padding: "0 28px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--orange-dark)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--orange)")}
                >
                  {trackStatus === "loading" ? "Searching..." : "Track →"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, fontFamily: "var(--font-mono)" }}>
                Try:{" "}
                <span style={{ color: "var(--orange)", cursor: "pointer" }} onClick={() => { setTrackId("DL-2024-08847"); setTrackStatus("idle"); }}>
                  DL-2024-08847
                </span>
              </p>
            </div>

            {/* Result */}
            {trackStatus === "found" && trackResult && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: 28, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--orange), transparent)" }} />
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: 2, color: "var(--orange)", marginBottom: 8 }}>{trackResult.id}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)", marginBottom: 20 }}>ETA: {trackResult.eta}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {trackResult.steps?.map((s: {status:string;state:string;time:string}, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: s.state === "done" ? "#4CAF50" : s.state === "active" ? "var(--orange)" : "rgba(255,255,255,0.15)" }} />
                      <span style={{ flex: 1, color: s.state === "pending" ? "var(--muted)" : s.state === "active" ? "var(--orange)" : "var(--white)" }}>{s.status}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{s.time}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push(`/track?id=${trackResult.id}`)}
                  style={{ width: "100%", background: "var(--orange)", color: "#fff", border: "none", padding: "12px", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 2, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--orange-dark)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--orange)"}
                >View Full Details →</button>
              </div>
            )}
            {trackStatus === "notfound" && (
              <div style={{ background: "var(--card-bg)", border: "1px solid rgba(244,82,30,0.3)", padding: 28, display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 32 }}>🔍</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>No package found</div>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>We couldn&apos;t find that tracking ID. Double-check the ID in your confirmation email or contact support.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SEND ── */}
        {activeTab === "send" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, letterSpacing: 2, lineHeight: 1, marginBottom: 10 }}>
                Book a <span style={{ color: "var(--orange)" }}>Shipment</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>
                Fill in the details and we&apos;ll pick it up from your door. See a live price estimate as you go.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {[
                  { label: "Sender Name", placeholder: "Your full name", type: "text" },
                  { label: "Sender Phone", placeholder: "+1 000 000 0000", type: "tel" },
                ].map((f) => (
                  <div key={f.label}><label style={labelStyle}>{f.label}</label><input type={f.type} placeholder={f.placeholder} style={inputStyle} /></div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={labelStyle}>Pickup Address</label><input type="text" placeholder="Street, City, State" style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Destination Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">Select country</option>
                    <option value="uk">United Kingdom</option>
                    <option value="us">United States</option>
                    <option value="de">Germany</option>
                    <option value="ca">Canada</option>
                    <option value="ae">UAE</option>
                    <option value="za">South Africa</option>
                    <option value="cn">China</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Package Weight (kg)</label>
                  <input type="number" placeholder="e.g. 2.5" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Service Type</label>
                  <select value={service} onChange={(e) => setService(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="standard">Standard (5–7 days)</option>
                    <option value="express">Express (1–3 days)</option>
                    <option value="freight">Freight / Cargo</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 0 }}><label style={labelStyle}>Recipient Full Address</label><input type="text" placeholder="Street, City, Postcode, Country" style={inputStyle} /></div>
              <button style={{ marginTop: 20, width: "100%", background: "var(--orange)", color: "#fff", border: "none", padding: 16, fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--orange-dark)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--orange)")}
              >
                Confirm & Book Pickup →
              </button>
            </div>

            {/* Price estimate */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: 28, position: "sticky", top: 100 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Live Estimate</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 52, letterSpacing: 2, color: "var(--orange)", lineHeight: 1, marginBottom: 6 }}>
                {price ? `$ ${price.total.toFixed(2)}` : "$ —"}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
                {price ? "Estimated total — final price on booking" : "Fill in details to see your quote"}
              </div>
              {[
                { label: "Base rate",     val: price ? `$ ${price.base.toFixed(2)}` : "—" },
                { label: "Weight charge", val: price ? `$ ${price.wCharge.toFixed(2)}` : "—" },
                { label: "Service fee",   val: price ? (service === "standard" ? "$ 0.00" : `$ ${price.sFee.toFixed(2)}`) : "—" },
                { label: "Est. delivery", val: price ? `${price.days} days` : "—" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--muted)" }}>{row.label}</span>
                  <span style={{ color: "var(--white)", fontWeight: 500 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RECEIVE ── */}
        {activeTab === "receive" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, letterSpacing: 2, lineHeight: 1, marginBottom: 10 }}>
                Receive a <span style={{ color: "var(--orange)" }}>Package</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>
                Use your Daily Logistics address to receive packages from anywhere in the world. We handle customs, duties, and last-mile delivery to your door.
              </p>
              {[
                { n: "1", title: "Get Your DL Address",  desc: "Create a free account and receive a dedicated Daily Logistics warehouse address in any of our hub countries." },
                { n: "2", title: "Shop & Ship to DL",    desc: "Order from any store online and use your DL address at checkout. We receive it at our hub on your behalf." },
                { n: "3", title: "We Forward to You",    desc: "Once received, we process your package and ship it directly to your door anywhere worldwide." },
                { n: "4", title: "Track & Confirm",      desc: "Get SMS and email updates at every step. Sign digitally on delivery — no paperwork needed." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, border: "1px solid var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--orange)", flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              {/* Address box */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: 32, position: "relative", marginBottom: 16 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--orange), transparent)" }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Your DL Receiving Address (UK Hub)</div>
                <div style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 24 }}>
                  <span style={{ color: "var(--orange)", fontWeight: 600 }}>Daily Logistics HUB-UK</span><br />
                  Attn: [Your Name] — #DL-NG-00142<br />
                  14 Cargo Way, Unit 3B<br />
                  Heathrow Logistics Park<br />
                  London, TW6 2GW<br />
                  United Kingdom
                </div>
                <button
                  style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--white)", padding: "11px 20px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "1.5px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.2s, border-color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,82,30,0.08)"; e.currentTarget.style.borderColor = "rgba(244,82,30,0.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
                  onClick={(e) => { e.currentTarget.textContent = "✓ Copied!"; setTimeout(() => { e.currentTarget.textContent = "Copy Address"; }, 2000); }}
                >
                  Copy Address
                </button>
              </div>

              {/* Other hubs */}
              {[{ flag: "🇺🇸", name: "US Hub", cities: "New York · Houston · Atlanta" }, { flag: "🇦🇪", name: "UAE Hub", cities: "Dubai · Abu Dhabi · Sharjah" }].map((hub) => (
                <div key={hub.name} style={{ marginBottom: 10, background: "var(--card-bg)", border: "1px solid var(--border)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 28 }}>{hub.flag}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Also available: {hub.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{hub.cities}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--orange)", cursor: "pointer" }}>Switch →</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}