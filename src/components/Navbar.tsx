"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 60px",
        backdropFilter: "blur(18px)",
        background: "rgba(10,10,10,0.75)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "var(--orange)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "#fff",
            letterSpacing: "0.5px",
          }}
        >
          DL
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            letterSpacing: 2,
            color: "var(--white)",
          }}
        >
          Daily Logistics
        </span>
      </Link>

      {/* Nav links */}
      <ul style={{ display: "flex", gap: 40, listStyle: "none", alignItems: "center" }}>
        {[
          { label: "Track",        href: "/track" },
          { label: "Send",         href: "/send" },
          { label: "Services",     href: "#services" },
          { label: "How It Works", href: "#how" },
          { label: "Destinations", href: "#destinations" },
          { label: "Support",      href: "#support" },
        ].map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              style={{
                textDecoration: "none",
                color: "var(--muted)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="/send"
            style={{
              background: "var(--orange)",
              color: "#fff",
              padding: "10px 22px",
              fontSize: 12,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 600,
              transition: "background 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--orange-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--orange)")}
          >
            Ship Now
          </a>
        </li>
      </ul>
    </nav>
  );
}