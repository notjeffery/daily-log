"use client";

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-wrap { border-top: 1px solid var(--border); padding: 80px 60px 40px; }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-social { display: flex; gap: 12px; }
        .social-btn {
          width: 36px; height: 36px;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; cursor: pointer; text-decoration: none;
          color: var(--muted); transition: border-color 0.2s, color 0.2s;
        }
        .social-btn:hover { border-color: var(--orange); color: var(--orange); }
        .footer-link {
          color: rgba(245,242,236,0.6); text-decoration: none;
          font-size: 14px; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--white); }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .blink { animation: blink 1.5s ease-in-out infinite; }
        @media (max-width: 768px) {
          .footer-wrap { padding: 48px 20px 32px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .footer-wrap { padding: 60px 30px 40px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
      `}</style>
      <footer className="footer-wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:36, height:36, background:"var(--orange)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:20, color:"#fff" }}>DL</div>
              <span style={{ fontFamily:"var(--font-display)", fontSize:22, letterSpacing:2 }}>Daily Logistics</span>
            </div>
            <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, maxWidth:260, marginBottom:28 }}>
              Moving packages across the world, reliably and affordably. Your shipment is our priority — every single day.
            </p>
            <div className="footer-social">
              {["𝕏","in","ig","fb"].map(s => (
                <a key={s} href="#" className="social-btn">{s}</a>
              ))}
            </div>
          </div>
          {[
            { heading:"Services", links:["Express Delivery","Standard Worldwide","Freight & Cargo","Secure Shipping","Business Accounts"] },
            { heading:"Company",  links:["About Us","Careers","Press","Partners","Contact"] },
            { heading:"Support",  links:["Track a Package","Get a Quote","FAQs","Prohibited Items","Claims & Insurance"] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", fontFamily:"var(--font-mono)", color:"var(--muted)", marginBottom:20 }}>{col.heading}</h4>
              <ul style={{ listStyle:"none" }}>
                {col.links.map(link => (
                  <li key={link} style={{ marginBottom:12 }}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p style={{ fontSize:12, color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            © 2024 Daily Logistics Ltd. All rights reserved.
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"var(--font-mono)", fontSize:11, color:"var(--orange)" }}>
            <span className="blink">●</span> Systems operational · 99.9% uptime
          </div>
        </div>
      </footer>
    </>
  );
}
