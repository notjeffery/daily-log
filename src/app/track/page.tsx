"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Step {
  status: string;
  location: string;
  time: string;
  state: "done" | "active" | "pending";
}

interface Pkg {
  id: string;
  status: "in-transit" | "withheld" | "delayed" | "arrived" | "delivered" | "processing";
  sender_name: string; sender_address: string; sender_flag: string;
  receiver_name: string; receiver_address: string; receiver_flag: string;
  weight: string; dimensions: string; package_type: string; service: string;
  origin_code: string; origin_city: string; origin_country: string;
  dest_code: string; dest_city: string; dest_country: string;
  eta: string; steps: Step[];
}

const STATUS_CFG = {
  "in-transit":  { label: "In Transit",         color: "#f4521e", bg: "rgba(244,82,30,0.1)",  icon: "✈️"  },
  "withheld":    { label: "Withheld — Customs",  color: "#f5a623", bg: "rgba(245,166,35,0.1)", icon: "⚠️"  },
  "delayed":     { label: "Delayed",             color: "#f5a623", bg: "rgba(245,166,35,0.1)", icon: "🕐"  },
  "arrived":     { label: "Arrived at Hub",      color: "#4CAF50", bg: "rgba(76,175,80,0.1)",  icon: "📦"  },
  "delivered":   { label: "Delivered",           color: "#4CAF50", bg: "rgba(76,175,80,0.1)",  icon: "✅"  },
  "processing":  { label: "Processing",          color: "#6b6660", bg: "rgba(107,102,96,0.1)", icon: "🔄"  },
};

type SearchState = "idle" | "loading" | "notfound";

export default function TrackPage() {
  const [query, setQuery]     = useState("");
  const [pkg, setPkg]         = useState<Pkg | null>(null);
  const [state, setState]     = useState<SearchState>("idle");
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("dl_recents");
      if (s) setRecents(JSON.parse(s));
    } catch {}
  }, []);

  const saveRecent = (id: string) => {
    const next = [id, ...recents.filter(r => r !== id)].slice(0, 5);
    setRecents(next);
    try { localStorage.setItem("dl_recents", JSON.stringify(next)); } catch {}
  };

  const search = async (rawId: string) => {
    const id = rawId.trim().toUpperCase();
    if (!id) return;
    setQuery(id);
    setPkg(null);
    setState("loading");

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setState("notfound");
      return;
    }

    setPkg(data as Pkg);
    setState("idle");
    saveRecent(id);
  };

  const cfg = pkg ? STATUS_CFG[pkg.status] : null;
  const needsHelp = pkg?.status === "withheld" || pkg?.status === "delayed";

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(244,82,30,0.5);}50%{box-shadow:0 0 0 8px rgba(244,82,30,0);} }
        @keyframes glow-g  { 0%,100%{box-shadow:0 0 0 0 rgba(76,175,80,0.5);}50%{box-shadow:0 0 0 8px rgba(76,175,80,0);} }
        @keyframes glow-y  { 0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,0.5);}50%{box-shadow:0 0 0 8px rgba(245,166,35,0);} }
        @media(max-width:768px){
          .tg{grid-template-columns:1fr!important;}
          .tp{padding:24px!important;}
          .sr{flex-direction:column!important;}
          .sr input{border-right:1px solid var(--border)!important;border-bottom:none!important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 60px",backdropFilter:"blur(18px)",background:"rgba(10,10,10,0.8)",borderBottom:"1px solid var(--border)"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <div style={{width:36,height:36,background:"var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:20,color:"#fff"}}>DL</div>
          <span style={{fontFamily:"var(--font-display)",fontSize:22,letterSpacing:2,color:"var(--white)"}}>Daily Logistics</span>
        </Link>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Link href="/send" style={{color:"var(--muted)",fontSize:13,textDecoration:"none",fontWeight:500,letterSpacing:"0.8px",textTransform:"uppercase"}}>Send</Link>
          <Link href="/#support" style={{color:"var(--muted)",fontSize:13,textDecoration:"none",fontWeight:500,letterSpacing:"0.8px",textTransform:"uppercase"}}>Support</Link>
          <Link href="/send" style={{background:"var(--orange)",color:"#fff",padding:"10px 22px",fontSize:12,letterSpacing:"1.5px",textTransform:"uppercase",textDecoration:"none",fontWeight:600}}>Ship Now</Link>
        </div>
      </nav>

      <div style={{minHeight:"100vh",background:"var(--black)",color:"var(--white)",paddingTop:80}}>

        {/* HERO */}
        <div style={{background:"#0d0c0c",borderBottom:"1px solid var(--border)",padding:"72px 60px 56px",position:"relative",overflow:"hidden"}} className="tp">
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(244,82,30,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,82,30,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}} />
          <div style={{position:"absolute",width:500,height:500,background:"radial-gradient(circle,rgba(244,82,30,0.1) 0%,transparent 70%)",top:-100,right:-50,pointerEvents:"none"}} />
          <div style={{position:"relative",zIndex:2,maxWidth:780}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--orange)",marginBottom:20}}>
              <span style={{width:16,height:2,background:"var(--orange)",display:"inline-block"}} /> Package Tracking
            </div>
            <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(52px,7vw,96px)",lineHeight:0.92,letterSpacing:2,marginBottom:20}}>
              Where Is<br/><span style={{color:"var(--orange)"}}>Your Package?</span>
            </h1>
            <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.7,marginBottom:40,maxWidth:460}}>
              Enter your Daily Logistics tracking ID for real-time status, location, sender &amp; receiver details, and estimated delivery.
            </p>

            {/* Search */}
            <div style={{display:"flex",maxWidth:620}} className="sr">
              <input autoFocus value={query}
                onChange={e => { setQuery(e.target.value.toUpperCase()); setPkg(null); setState("idle"); }}
                onKeyDown={e => e.key==="Enter" && search(query)}
                placeholder="e.g. DL-2024-08847"
                style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid var(--border)",borderRight:"none",color:"var(--white)",padding:"18px 24px",fontFamily:"var(--font-mono)",fontSize:15,letterSpacing:2,outline:"none"}}
                onFocus={e=>e.currentTarget.style.borderColor="rgba(244,82,30,0.5)"}
                onBlur={e=>e.currentTarget.style.borderColor="var(--border)"}
              />
              <button onClick={()=>search(query)}
                style={{background:"var(--orange)",color:"#fff",border:"none",padding:"0 40px",fontFamily:"var(--font-display)",fontSize:20,letterSpacing:2,cursor:"pointer",whiteSpace:"nowrap",transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--orange-dark)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--orange)"}
              >{state==="loading" ? "Searching..." : "Track →"}</button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{padding:"56px 60px"}} className="tp">

          {/* Recent searches */}
          {state!=="loading" && !pkg && recents.length>0 && (
            <div style={{marginBottom:48}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>Recent Searches</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                {recents.map(id=>(
                  <button key={id} onClick={()=>search(id)}
                    style={{background:"var(--card-bg)",border:"1px solid var(--border)",color:"var(--white)",padding:"10px 18px",fontFamily:"var(--font-mono)",fontSize:12,letterSpacing:1,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(244,82,30,0.4)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
                  ><span style={{color:"var(--muted)"}}>🕐</span>{id}</button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {state==="loading" && (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 0",gap:24}}>
              <div style={{width:52,height:52,border:"3px solid var(--border)",borderTop:"3px solid var(--orange)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
              <p style={{fontFamily:"var(--font-mono)",fontSize:12,letterSpacing:2,color:"var(--muted)",textTransform:"uppercase"}}>Locating your package...</p>
            </div>
          )}

          {/* Not found */}
          {state==="notfound" && (
            <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",maxWidth:520,margin:"0 auto",textAlign:"center",padding:"60px 40px"}}>
              <div style={{fontSize:52,marginBottom:20}}>🔍</div>
              <div style={{fontFamily:"var(--font-display)",fontSize:32,letterSpacing:2,marginBottom:12}}>No Package Found</div>
              <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:28}}>
                We couldn&apos;t find a package with ID <strong style={{color:"var(--orange)"}}>{query}</strong>. Double-check your confirmation email or contact support.
              </p>
              <a href="mailto:dailylogistics1@outlook.com" style={{display:"inline-block",background:"var(--orange)",color:"#fff",padding:"14px 32px",fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,textDecoration:"none"}}>Contact Support →</a>
            </div>
          )}

          {/* RESULT */}
          {pkg && cfg && state!=="loading" && (
            <div>
              {/* Status banner */}
              <div style={{background:cfg.bg,border:`1px solid ${cfg.color}55`,padding:"20px 28px",display:"flex",alignItems:"center",gap:16,marginBottom:32,position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,width:4,background:cfg.color}} />
                <span style={{fontSize:28}}>{cfg.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--font-display)",fontSize:26,letterSpacing:2,color:cfg.color}}>{cfg.label}</div>
                  <div style={{fontSize:13,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:3}}>ID: {pkg.id} &nbsp;·&nbsp; {pkg.eta}</div>
                </div>
                {needsHelp && (
                  <a href="mailto:dailylogistics1@outlook.com" style={{background:"#f5a623",color:"#000",padding:"10px 22px",fontFamily:"var(--font-display)",fontSize:16,letterSpacing:1.5,textDecoration:"none",whiteSpace:"nowrap",fontWeight:700}}>Contact Support →</a>
                )}
              </div>

              {/* Grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:24}} className="tg">

                {/* LEFT */}
                <div style={{display:"flex",flexDirection:"column",gap:24}}>

                  {/* Route */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:28,position:"relative"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:20}}>Route</div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"var(--font-display)",fontSize:48,letterSpacing:2,lineHeight:1}}>{pkg.origin_code}</div>
                        <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{pkg.origin_city}, {pkg.origin_country}</div>
                      </div>
                      <div style={{flex:1,textAlign:"center"}}>
                        <div style={{height:1,background:"var(--border)",position:"relative",margin:"0 8px"}}>
                          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:10,height:10,background:cfg.color,borderRadius:"50%",animation:`${pkg.status==="delivered"?"glow-g":pkg.status==="withheld"?"glow-y":"glow"} 2s ease-in-out infinite`}} />
                        </div>
                        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:1,color:cfg.color,textTransform:"uppercase",marginTop:8}}>{pkg.service}</div>
                      </div>
                      <div style={{flex:1,textAlign:"right"}}>
                        <div style={{fontFamily:"var(--font-display)",fontSize:48,letterSpacing:2,lineHeight:1}}>{pkg.dest_code}</div>
                        <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{pkg.dest_city}, {pkg.dest_country}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:28,position:"relative"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:28}}>Shipment Timeline</div>
                    <div style={{position:"relative"}}>
                      <div style={{position:"absolute",left:14,top:8,bottom:8,width:1,background:"var(--border)"}} />
                      {pkg.steps.map((step,i)=>{
                        const dotColor=step.state==="done"?"#4CAF50":step.state==="active"?cfg.color:"rgba(255,255,255,0.15)";
                        const anim=step.state==="active"?(pkg.status==="withheld"?"glow-y":"glow"):"none";
                        return (
                          <div key={i} style={{display:"flex",gap:20,marginBottom:i<pkg.steps.length-1?28:0,position:"relative"}}>
                            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:step.state==="done"?"rgba(76,175,80,0.15)":step.state==="active"?`${cfg.color}22`:"rgba(255,255,255,0.04)",border:`2px solid ${dotColor}`,position:"relative",zIndex:1,animation:`${anim} 2s ease-in-out infinite`}}>
                              {step.state==="done"&&<span style={{color:"#4CAF50",fontSize:12,fontWeight:700}}>✓</span>}
                              {step.state==="active"&&<span style={{width:8,height:8,borderRadius:"50%",background:cfg.color,display:"block"}} />}
                              {step.state==="pending"&&<span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"block"}} />}
                            </div>
                            <div style={{paddingTop:3}}>
                              <div style={{fontSize:14,fontWeight:600,marginBottom:3,color:step.state==="pending"?"var(--muted)":step.state==="active"?cfg.color:"var(--white)",display:"flex",alignItems:"center",gap:8}}>
                                {step.status}
                                {step.state==="active"&&<span style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:1,color:cfg.color,border:`1px solid ${cfg.color}66`,padding:"2px 7px"}}>LIVE</span>}
                              </div>
                              <div style={{fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)",marginBottom:2}}>{step.location}</div>
                              <div style={{fontSize:11,color:step.state==="active"?cfg.color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{step.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Withheld/Delayed alert */}
                  {needsHelp&&(
                    <div style={{background:"rgba(245,166,35,0.07)",border:"1px solid rgba(245,166,35,0.35)",padding:28}}>
                      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                        <span style={{fontSize:30,flexShrink:0}}>⚠️</span>
                        <div>
                          <div style={{fontFamily:"var(--font-display)",fontSize:22,letterSpacing:1.5,color:"#f5a623",marginBottom:8}}>Action May Be Required</div>
                          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:16}}>
                            Your package is currently {pkg.status==="withheld"?"withheld by customs authorities":"delayed in transit"}. This can happen due to additional documentation, duties owed, or random inspection. Our team is monitoring the situation.
                          </p>
                          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                            <a href="mailto:dailylogistics1@outlook.com" style={{background:"#f5a623",color:"#000",padding:"12px 24px",fontFamily:"var(--font-display)",fontSize:16,letterSpacing:1.5,textDecoration:"none",fontWeight:700}}>Email Support →</a>
                            <a href="tel:+10000000000" style={{background:"transparent",color:"var(--white)",padding:"12px 24px",fontFamily:"var(--font-display)",fontSize:16,letterSpacing:1.5,textDecoration:"none",border:"1px solid var(--border)"}}>Call Us</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div style={{display:"flex",flexDirection:"column",gap:20}}>

                  {/* Package info */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24,position:"relative"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>Package Info</div>
                    {[
                      {l:"Type",v:pkg.package_type},{l:"Weight",v:pkg.weight},
                      {l:"Dimensions",v:pkg.dimensions},{l:"Service",v:pkg.service},
                    ].map(r=>(
                      <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)",fontSize:13}}>
                        <span style={{color:"var(--muted)"}}>{r.l}</span>
                        <span style={{fontWeight:500}}>{r.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sender */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:14}}>Sender</div>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:22}}>{pkg.sender_flag}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{pkg.sender_name}</div>
                        <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>{pkg.sender_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Receiver */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:14}}>Receiver</div>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:22}}>{pkg.receiver_flag}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{pkg.receiver_name}</div>
                        <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>{pkg.receiver_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* ETA */}
                  <div style={{background:pkg.status==="delivered"?"rgba(76,175,80,0.08)":"rgba(244,82,30,0.08)",border:`1px solid ${pkg.status==="delivered"?"rgba(76,175,80,0.3)":"rgba(244,82,30,0.3)"}`,padding:24,textAlign:"center"}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>
                      {pkg.status==="delivered"?"Delivery Confirmed":"Estimated Delivery"}
                    </div>
                    <div style={{fontFamily:"var(--font-display)",fontSize:20,letterSpacing:1.5,color:pkg.status==="delivered"?"#4CAF50":"var(--orange)"}}>
                      {pkg.eta}
                    </div>
                  </div>

                  {/* Support CTA */}
                  <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24,textAlign:"center"}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Need Help?</div>
                    <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:18}}>Questions about this shipment? Our support team is available 24/7.</p>
                    <a href="mailto:dailylogistics1@outlook.com"
                      style={{display:"block",border:"1px solid var(--border)",color:"var(--white)",padding:12,fontFamily:"var(--font-display)",fontSize:15,letterSpacing:2,textDecoration:"none",marginBottom:10}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.background="rgba(244,82,30,0.06)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="transparent";}}
                    >Email Support</a>
                    <a href="tel:+10000000000" style={{display:"block",background:"var(--orange)",color:"#fff",padding:12,fontFamily:"var(--font-display)",fontSize:15,letterSpacing:2,textDecoration:"none"}}>Call Us Now</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!pkg&&state==="idle"&&recents.length===0&&(
            <div style={{textAlign:"center",padding:"80px 0"}}>
              <div style={{fontSize:64,marginBottom:24}}>📦</div>
              <div style={{fontFamily:"var(--font-display)",fontSize:36,letterSpacing:2,marginBottom:12}}>Track Any Shipment</div>
              <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.7,maxWidth:400,margin:"0 auto"}}>
                Enter your tracking ID above to get full real-time details on your package — wherever it is in the world.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}