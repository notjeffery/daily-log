"use client";

const steps = [
  { num:"01", title:"Book Your Shipment",    desc:"Enter pickup and destination details online. Get an instant rate and delivery estimate." },
  { num:"02", title:"We Pick It Up",         desc:"Our rider arrives at your location within the selected window. No need to visit a drop-off point." },
  { num:"03", title:"We Handle Logistics",   desc:"Your package moves through our network — customs, transit, and last-mile — all tracked live." },
  { num:"04", title:"Delivered & Confirmed", desc:"Recipient gets a delivery confirmation with photo proof. You get notified instantly." },
];

export default function HowItWorks() {
  return (
    <>
      <style>{`
        .how-section {
          background: #0d0c0c;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 120px 60px;
        }
        .how-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }
        .how-step {
          display: flex; gap: 28px;
          padding: 32px 0;
          border-bottom: 1px solid var(--border);
          cursor: default;
        }
        .how-step:first-of-type { border-top: 1px solid var(--border); }
        .how-step-num {
          font-family: var(--font-display);
          font-size: 48px;
          color: rgba(244,82,30,0.2);
          line-height: 1; min-width: 56px;
          transition: color 0.3s;
        }
        .how-step:hover .how-step-num { color: var(--orange); }
        .how-visual {
          position: relative; height: 500px;
          display: flex; align-items: center; justify-content: center;
        }
        .globe-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid var(--border);
        }
        .globe-center {
          width: 100px; height: 100px;
          background: var(--orange); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; position: relative; z-index: 2;
          box-shadow: 0 0 60px rgba(244,82,30,0.4);
        }
        @keyframes spin0 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes spin1 { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
        @keyframes spin2 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @media (max-width: 768px) {
          .how-section { padding: 60px 20px !important; }
          .how-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .how-visual { display: none !important; }
          .how-step { padding: 24px 0 !important; }
          .how-step-num { font-size: 36px !important; min-width: 44px !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .how-section { padding: 80px 30px !important; }
          .how-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .how-visual { display: none !important; }
        }
      `}</style>
      <section id="how" className="how-section">
        <div className="how-grid">
          <div>
            <span style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"var(--orange)", marginBottom:20 }}>
              <span style={{ width:16, height:2, background:"var(--orange)", display:"inline-block" }} /> Process
            </span>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(48px,6vw,80px)", letterSpacing:2, lineHeight:0.95, marginBottom:48 }}>
              Ship In<br />4 Simple<br />Steps
            </h2>
            <div>
              {steps.map((step, i) => (
                <div key={step.num} className="how-step"
                  onMouseEnter={e => { const n = e.currentTarget.querySelector(".how-step-num") as HTMLElement; if(n) n.style.color="var(--orange)"; }}
                  onMouseLeave={e => { const n = e.currentTarget.querySelector(".how-step-num") as HTMLElement; if(n) n.style.color="rgba(244,82,30,0.2)"; }}
                >
                  <div className="how-step-num">{step.num}</div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>{step.title}</div>
                    <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-visual">
            {[{size:440,anim:"spin0",dur:30},{size:320,anim:"spin1",dur:20,dashed:true},{size:200,anim:"spin2",dur:12}].map((r,i) => (
              <div key={i} className="globe-ring" style={{ width:r.size, height:r.size, borderStyle:r.dashed?"dashed":"solid", animation:`${r.anim} ${r.dur}s linear infinite` }} />
            ))}
            <div className="globe-center">🌐</div>
          </div>
        </div>
      </section>
    </>
  );
}
