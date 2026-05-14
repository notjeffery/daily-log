"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
}

const SYSTEM_PROMPT = `You are the friendly, professional customer support assistant for Daily Logistics — a global package shipping company. You help customers with tracking, payments, shipping quotes, delivery times, booking, customs, and general enquiries. Keep replies concise (2–4 sentences max). Be warm, clear, and reassuring. If someone asks to speak to a human, say the team will be with them shortly and ask for their email. You represent a premium, reliable brand.

PAYMENT FAQ:
- Accepted payments: Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and bank transfer for business accounts.
- All prices are in USD ($). Payments processed securely via Stripe — we never store card details.
- Payment is collected upfront at booking. No hidden fees — the quote you see is the price you pay.
- Business accounts with monthly volume above $500 get net-30 invoicing. Contact sales@dailylogistics.com.
- Refunds: cancelled before pickup = full refund in 3–5 business days. After pickup = partial refund depending on transit stage.
- Failed payments: ask customer to check card details or try another method. International transactions are sometimes flagged by banks.
- No cryptocurrency or cash payments accepted.
- Receipts are emailed automatically after every successful payment.
- Disputed charges: email billing@dailylogistics.com with booking ID.

TRACKING FAQ:
- Tracking ID format: DL-YYYY-XXXXX (e.g. DL-2024-08847). Customers receive this by email after booking.
- To track: enter ID in the Track tab on the homepage.
- Tracking stages: Package Received → Customs Cleared → In Transit → Out for Delivery → Delivered.
- No update in 48 hours: email support@dailylogistics.com with tracking ID.
- Customs delays of 1–3 days with no update are normal — package is not lost.
- Delivery confirmation includes photo and digital signature.
- Shows "Delivered" but not received: check neighbours or building reception, then contact support within 48 hours.
- Lost package claims must be filed within 14 days of estimated delivery. Email claims@dailylogistics.com.
- SMS and email notifications sent at every major status change if contact info was provided at booking.

Never make up tracking data for a specific ID — always say you're checking and direct them to the Track tab or support email.`;

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi there! 👋 I'm the Daily Logistics assistant. I can help you track packages, get shipping quotes, or answer any questions. What do you need?" },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [quickShown, setQuickShown] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setQuickShown(false);
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text ?? "I'm having a moment — please try again or email support@dailylogistics.com.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't connect right now. Please email support@dailylogistics.com and we'll get back to you shortly." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    { label: "📍 Track package",    text: "Track my package" },
    { label: "💰 Get a quote",      text: "Get a shipping quote" },
    { label: "⏱ Delivery times",   text: "How long does shipping take?" },
    { label: "👤 Human agent",      text: "Speak to a human agent" },
  ];

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 58, height: 58,
          background: "var(--orange)", border: "none", borderRadius: "50%",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 4px 24px rgba(244,82,30,0.45)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(244,82,30,0.6)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(244,82,30,0.45)"; }}
        title="Chat with support"
      >
        {open ? "×" : "💬"}
        {/* Green live dot */}
        <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#4CAF50", borderRadius: "50%", border: "2px solid var(--black)" }} />
      </button>

      {/* Chat window */}
      <div
        id="chatWindow"
        style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 998,
          width: 360,
          background: "#111010",
          border: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          maxHeight: 540,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--orange), transparent)" }} />

        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "var(--orange)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🚚</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Daily Support</div>
            <div style={{ fontSize: 11, color: "#4CAF50", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 5 }}>
              <span>●</span> Online — AI + Human team
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 280, maxHeight: 340 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, background: msg.role === "bot" ? "var(--orange)" : "rgba(255,255,255,0.1)" }}>
                {msg.role === "bot" ? "🚚" : "👤"}
              </div>
              <div style={{ maxWidth: 230, padding: "10px 14px", fontSize: 13, lineHeight: 1.6, background: msg.role === "bot" ? "rgba(255,255,255,0.06)" : "var(--orange)", border: msg.role === "bot" ? "1px solid var(--border)" : "none", color: "#fff" }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🚚</div>
              <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, background: "var(--muted)", borderRadius: "50%", display: "inline-block", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {quickShown && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 20px 14px" }}>
            {quickReplies.map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                style={{ background: "transparent", border: "1px solid var(--border)", color: "rgba(245,242,236,0.7)", padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer", transition: "border-color 0.2s, color 0.2s, background 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.color = "var(--orange)"; e.currentTarget.style.background = "rgba(244,82,30,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "rgba(245,242,236,0.7)"; e.currentTarget.style.background = "transparent"; }}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message..."
            style={{ flex: 1, background: "transparent", border: "none", color: "var(--white)", padding: "14px 16px", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            style={{ background: "var(--orange)", border: "none", color: "#fff", width: 48, cursor: "pointer", fontSize: 16, transition: "background 0.2s", flexShrink: 0, opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--orange-dark)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--orange)"; }}
          >
            ➤
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}