"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface FormData {
  senderName: string; senderEmail: string; senderPhone: string;
  senderAddress: string; senderCity: string; senderState: string; senderZip: string;
  weight: string; dimensions: string; packageType: string; service: string;
  insurance: boolean; description: string;
  receiverName: string; receiverEmail: string; receiverPhone: string;
  receiverAddress: string; receiverCity: string; receiverCountry: string; receiverZip: string;
  paymentMethod: "card" | "paypal" | "applepay" | "coupon" | "";
  cardName: string; cardNumber: string; cardExpiry: string; cardCvv: string;
  couponCode: string;
}

const VALID_COUPONS: Record<string, string> = {
  "DLFREESHIP": "100% company-sponsored shipment",
  "CORPSHIP24": "100% company-sponsored shipment",
  "DLSTAFF100": "100% company-sponsored shipment",
};

const RATES: Record<string, { base: number; days: string }> = {
  uk:{base:18,days:"3–5"}, us:{base:22,days:"4–7"}, de:{base:20,days:"4–6"},
  ca:{base:24,days:"5–7"}, ae:{base:14,days:"2–4"}, za:{base:12,days:"3–5"},
  cn:{base:21,days:"5–8"}, au:{base:26,days:"6–9"}, fr:{base:19,days:"4–6"}, jp:{base:28,days:"5–8"},
};

const SERVICE_MULT: Record<string,number> = { standard:1, express:1.8, freight:2.5 };

const COUNTRIES = [
  {val:"us",label:"United States"},{val:"uk",label:"United Kingdom"},
  {val:"de",label:"Germany"},{val:"ca",label:"Canada"},
  {val:"ae",label:"UAE"},{val:"za",label:"South Africa"},
  {val:"cn",label:"China"},{val:"au",label:"Australia"},
  {val:"fr",label:"France"},{val:"jp",label:"Japan"},
];

const STEPS = ["Sender","Package","Receiver","Review","Payment"];

const EMPTY: FormData = {
  senderName:"",senderEmail:"",senderPhone:"",senderAddress:"",senderCity:"",senderState:"",senderZip:"",
  weight:"",dimensions:"",packageType:"general",service:"standard",insurance:false,description:"",
  receiverName:"",receiverEmail:"",receiverPhone:"",receiverAddress:"",receiverCity:"",receiverCountry:"",receiverZip:"",
  paymentMethod:"",cardName:"",cardNumber:"",cardExpiry:"",cardCvv:"",couponCode:"",
};

// ── Shared input styles ── defined OUTSIDE all components so they never change reference
const INP: React.CSSProperties = {
  background:"rgba(255,255,255,0.04)", border:"1px solid var(--border)",
  color:"var(--white)", padding:"13px 16px", fontSize:14, outline:"none",
  width:"100%", fontFamily:"var(--font-body)", transition:"border-color 0.2s",
};
const LBL: React.CSSProperties = {
  fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:2,
  textTransform:"uppercase", color:"var(--muted)", marginBottom:7, display:"block",
};
const R2: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 };
const R3: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 };
const CARD: React.CSSProperties = { background:"var(--card-bg)", border:"1px solid var(--border)", padding:28, position:"relative" };

const onFocus = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(244,82,30,0.5)");
const onBlur = (e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--border)");

// ── Step 0 — Sender ── defined outside SendPage
function StepSender({ form, set }: { form: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <SectionHeader icon="📤" title="Sender Details" desc="Who is sending this package?" />
      <div style={R2}>
        <div><label style={LBL}>Full Name</label>
          <input style={INP} placeholder="Your full name" value={form.senderName}
            onChange={e => set("senderName", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>Email Address</label>
          <input style={INP} type="email" placeholder="you@email.com" value={form.senderEmail}
            onChange={e => set("senderEmail", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
      <div style={R2}>
        <div><label style={LBL}>Phone Number</label>
          <input style={INP} type="tel" placeholder="+1 000 000 0000" value={form.senderPhone}
            onChange={e => set("senderPhone", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>Street Address</label>
          <input style={INP} placeholder="123 Main Street" value={form.senderAddress}
            onChange={e => set("senderAddress", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
      <div style={R3}>
        <div><label style={LBL}>City</label>
          <input style={INP} placeholder="City" value={form.senderCity}
            onChange={e => set("senderCity", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>State / Province</label>
          <input style={INP} placeholder="State" value={form.senderState}
            onChange={e => set("senderState", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>ZIP / Postcode</label>
          <input style={INP} placeholder="ZIP" value={form.senderZip}
            onChange={e => set("senderZip", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
    </div>
  );
}

// ── Step 1 — Package ──
function StepPackage({ form, set, price }: { form: FormData; set: (k: keyof FormData, v: string | boolean) => void; price: ReturnType<typeof calcPrice> }) {
  return (
    <div>
      <SectionHeader icon="📦" title="Package Details" desc="Tell us about what you're shipping." />
      <div style={R2}>
        <div><label style={LBL}>Weight (kg)</label>
          <input style={INP} type="number" placeholder="e.g. 2.5" value={form.weight}
            onChange={e => set("weight", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>Dimensions (L×W×H cm)</label>
          <input style={INP} placeholder="e.g. 30×20×15" value={form.dimensions}
            onChange={e => set("dimensions", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
      <div style={R2}>
        <div><label style={LBL}>Package Type</label>
          <select style={{...INP, appearance:"none", background:"#1a1918", color:"var(--white)", cursor:"pointer"}} value={form.packageType}
            onChange={e => set("packageType", e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="general"     style={{background:"#1a1918"}}>General Goods</option>
            <option value="documents"   style={{background:"#1a1918"}}>Documents</option>
            <option value="electronics" style={{background:"#1a1918"}}>Electronics</option>
            <option value="clothing"    style={{background:"#1a1918"}}>Clothing &amp; Textiles</option>
            <option value="fragile"     style={{background:"#1a1918"}}>Fragile Items</option>
            <option value="perishable"  style={{background:"#1a1918"}}>Perishable Goods</option>
          </select></div>
        <div><label style={LBL}>Service Type</label>
          <select style={{...INP, appearance:"none", background:"#1a1918", color:"var(--white)", cursor:"pointer"}} value={form.service}
            onChange={e => set("service", e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="standard" style={{background:"#1a1918"}}>Standard (5–7 days)</option>
            <option value="express"  style={{background:"#1a1918"}}>Express (1–3 days)</option>
            <option value="freight"  style={{background:"#1a1918"}}>Freight / Cargo</option>
          </select></div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={LBL}>Package Description (for customs)</label>
        <textarea rows={3} style={{...INP,resize:"none"}} placeholder="Brief description e.g. 'Clothing items, non-commercial'"
          value={form.description} onChange={e => set("description", e.target.value)}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div onClick={() => set("insurance", !form.insurance)}
        style={{display:"flex",alignItems:"center",gap:14,padding:"16px 20px",border:`1px solid ${form.insurance?"var(--orange)":"var(--border)"}`,background:form.insurance?"rgba(244,82,30,0.06)":"transparent",cursor:"pointer",transition:"all 0.2s",userSelect:"none"}}>
        <div style={{width:22,height:22,border:`2px solid ${form.insurance?"var(--orange)":"var(--muted)"}`,background:form.insurance?"var(--orange)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
          {form.insurance && <span style={{color:"#fff",fontSize:13,fontWeight:700}}>✓</span>}
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>Add Shipment Insurance</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>5% of shipment value — covers loss, theft, and damage end-to-end.</div>
        </div>
        <div style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--orange)"}}>
          {price ? `+ $${((price.base + price.wCharge + price.sFee) * 0.05).toFixed(2)}` : "+ 5%"}
        </div>
      </div>
    </div>
  );
}

// ── Step 2 — Receiver ──
function StepReceiver({ form, set }: { form: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <SectionHeader icon="📥" title="Receiver Details" desc="Who is receiving this package?" />
      <div style={R2}>
        <div><label style={LBL}>Receiver Full Name</label>
          <input style={INP} placeholder="Recipient's full name" value={form.receiverName}
            onChange={e => set("receiverName", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>Receiver Email</label>
          <input style={INP} type="email" placeholder="recipient@email.com" value={form.receiverEmail}
            onChange={e => set("receiverEmail", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
      <div style={R2}>
        <div><label style={LBL}>Receiver Phone</label>
          <input style={INP} type="tel" placeholder="+1 000 000 0000" value={form.receiverPhone}
            onChange={e => set("receiverPhone", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>Destination Country</label>
          <select style={{...INP, appearance:"none", background:"#1a1918", color:"var(--white)", cursor:"pointer"}} value={form.receiverCountry}
            onChange={e => set("receiverCountry", e.target.value)} onFocus={onFocus} onBlur={onBlur}>
            <option value="" style={{background:"#1a1918",color:"var(--muted)"}}>Select country...</option>
            {COUNTRIES.map(c => <option key={c.val} value={c.val} style={{background:"#1a1918",color:"var(--white)"}}>{c.label}</option>)}
          </select></div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={LBL}>Street Address</label>
        <input style={INP} placeholder="Full delivery address" value={form.receiverAddress}
          onChange={e => set("receiverAddress", e.target.value)} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div style={R2}>
        <div><label style={LBL}>City</label>
          <input style={INP} placeholder="City" value={form.receiverCity}
            onChange={e => set("receiverCity", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div><label style={LBL}>ZIP / Postcode</label>
          <input style={INP} placeholder="ZIP / Postcode" value={form.receiverZip}
            onChange={e => set("receiverZip", e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>
    </div>
  );
}

// ── Step 3 — Review ──
function StepReview({ form, goTo }: { form: FormData; goTo: (s: number) => void }) {
  const countryLabel = COUNTRIES.find(c => c.val === form.receiverCountry)?.label || "—";
  return (
    <div>
      <SectionHeader icon="🔍" title="Review Your Shipment" desc="Check everything before you pay." />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <ReviewCard title="Sender" onEdit={() => goTo(0)} rows={[
          {l:"Name",v:form.senderName},{l:"Email",v:form.senderEmail},
          {l:"Phone",v:form.senderPhone},{l:"Address",v:`${form.senderAddress}, ${form.senderCity}${form.senderState?", "+form.senderState:""} ${form.senderZip}`},
        ]} />
        <ReviewCard title="Receiver" onEdit={() => goTo(2)} rows={[
          {l:"Name",v:form.receiverName},{l:"Email",v:form.receiverEmail},
          {l:"Phone",v:form.receiverPhone},{l:"Address",v:`${form.receiverAddress}, ${form.receiverCity} ${form.receiverZip}`},
          {l:"Country",v:countryLabel},
        ]} />
      </div>
      <div style={{...CARD,marginBottom:16}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Package</div>
          <span style={{fontSize:11,color:"var(--orange)",cursor:"pointer",fontFamily:"var(--font-mono)"}} onClick={() => goTo(1)}>Edit →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {[
            {l:"Weight",v:form.weight?`${form.weight} kg`:"—"},
            {l:"Dimensions",v:form.dimensions||"—"},
            {l:"Type",v:form.packageType||"—"},
            {l:"Service",v:form.service==="standard"?"Standard (5–7d)":form.service==="express"?"Express (1–3d)":"Freight"},
          ].map(r => (
            <div key={r.l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>{r.l}</div>
              <div style={{fontSize:14,fontWeight:600}}>{r.v}</div>
            </div>
          ))}
        </div>
        {form.insurance && (
          <div style={{marginTop:14,padding:"10px 14px",background:"rgba(244,82,30,0.07)",border:"1px solid rgba(244,82,30,0.2)",fontSize:13,color:"var(--orange)"}}>
            ✓ Shipment Insurance included
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 4 — Payment ──
function StepPayment({
  form, set, couponStatus, couponMsg, checkCoupon, isFree,
}: {
  form: FormData;
  set: (k: keyof FormData, v: string | boolean) => void;
  couponStatus: "idle"|"valid"|"invalid";
  couponMsg: string;
  checkCoupon: () => void;
  isFree: boolean;
}) {
  return (
    <div>
      <SectionHeader icon="💳" title="Payment" desc="Choose how you'd like to pay." />
      {isFree && (
        <div style={{background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.4)",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <span style={{fontSize:24}}>🎉</span>
          <div>
            <div style={{fontFamily:"var(--font-display)",fontSize:20,letterSpacing:1.5,color:"#4CAF50"}}>Coupon Applied — Shipment is Free!</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:3}}>{couponMsg}</div>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        {([
          {id:"card",     icon:"💳", label:"Credit / Debit Card",  sub:"Visa, Mastercard, Amex"},
          {id:"paypal",   icon:"🅿️", label:"PayPal",               sub:"Pay via your PayPal account"},
          {id:"applepay", icon:"🍎", label:"Apple Pay",            sub:"Pay with Touch / Face ID"},
          {id:"coupon",   icon:"🎟️", label:"Company Coupon",       sub:"100% covered — enter code below"},
        ] as const).map(m => (
          <div key={m.id} onClick={() => set("paymentMethod", m.id)}
            style={{padding:"18px 20px",border:`1px solid ${form.paymentMethod===m.id?"var(--orange)":"var(--border)"}`,background:form.paymentMethod===m.id?"rgba(244,82,30,0.07)":"var(--card-bg)",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
            <div style={{width:36,height:36,border:`1px solid ${form.paymentMethod===m.id?"var(--orange)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:form.paymentMethod===m.id?"var(--orange)":"transparent",transition:"all 0.2s"}}>
              {m.icon}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{m.sub}</div>
            </div>
            {form.paymentMethod===m.id && <div style={{marginLeft:"auto",width:20,height:20,borderRadius:"50%",background:"var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700,flexShrink:0}}>✓</div>}
          </div>
        ))}
      </div>

      {/* Card form */}
      {form.paymentMethod==="card" && !isFree && (
        <div style={{...CARD,marginBottom:16}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>Card Details</div>
          <div style={{marginBottom:14}}><label style={LBL}>Name on Card</label>
            <input style={INP} placeholder="As it appears on card" value={form.cardName}
              onChange={e => set("cardName",e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div style={{marginBottom:14}}><label style={LBL}>Card Number</label>
            <input style={INP} placeholder="0000 0000 0000 0000" value={form.cardNumber}
              onChange={e => set("cardNumber",e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div style={R2}>
            <div><label style={LBL}>Expiry Date</label>
              <input style={INP} placeholder="MM / YY" value={form.cardExpiry}
                onChange={e => set("cardExpiry",e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
            <div><label style={LBL}>CVV</label>
              <input style={INP} placeholder="•••" value={form.cardCvv}
                onChange={e => set("cardCvv",e.target.value)} onFocus={onFocus} onBlur={onBlur} /></div>
          </div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--muted)"}}>
            🔒 Secured by Stripe. We never store your card details.
          </div>
        </div>
      )}

      {/* PayPal */}
      {form.paymentMethod==="paypal" && !isFree && (
        <div style={{...CARD,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:40,marginBottom:12}}>🅿️</div>
          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.7}}>You&apos;ll be redirected to PayPal to complete your payment securely after clicking &quot;Confirm &amp; Pay&quot;.</p>
        </div>
      )}

      {/* Apple Pay */}
      {form.paymentMethod==="applepay" && !isFree && (
        <div style={{...CARD,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:40,marginBottom:12}}>🍎</div>
          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.7}}>Apple Pay will prompt Touch ID or Face ID to confirm. Works on Safari and iOS devices.</p>
        </div>
      )}

      {/* Coupon */}
      {form.paymentMethod==="coupon" && (
        <div style={{...CARD,marginBottom:16}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>Company Coupon Code</div>
          <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:16}}>
            Enter your company-issued coupon. Valid codes cover 100% of shipment cost — the sender pays nothing.
          </p>
          <div style={{display:"flex",marginBottom:12}}>
            <input style={{...INP,flex:1,borderRight:"none",fontFamily:"var(--font-mono)",letterSpacing:2,fontSize:13}}
              placeholder="e.g. DLFREESHIP" value={form.couponCode}
              onChange={e => set("couponCode", e.target.value.toUpperCase())}
              onKeyDown={e => e.key==="Enter" && checkCoupon()}
              onFocus={onFocus} onBlur={onBlur} />
            <button onClick={checkCoupon}
              style={{background:"var(--orange)",color:"#fff",border:"none",padding:"0 24px",fontFamily:"var(--font-display)",fontSize:16,letterSpacing:2,cursor:"pointer",whiteSpace:"nowrap"}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--orange-dark)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--orange)"}
            >Apply →</button>
          </div>
          {couponStatus==="valid" && (
            <div style={{background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.4)",padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13}}>
              <span style={{color:"#4CAF50",fontWeight:700}}>✓</span>
              <span style={{color:"#4CAF50"}}>{couponMsg} — Shipment fully covered.</span>
            </div>
          )}
          {couponStatus==="invalid" && (
            <div style={{background:"rgba(244,82,30,0.08)",border:"1px solid rgba(244,82,30,0.3)",padding:"12px 16px",display:"flex",alignItems:"center",gap:10,fontSize:13}}>
              <span style={{color:"var(--orange)",fontWeight:700}}>✗</span>
              <span style={{color:"var(--orange)"}}>Invalid coupon code. Please check and try again.</span>
            </div>
          )}
          <p style={{fontSize:11,color:"var(--muted)",marginTop:12,fontFamily:"var(--font-mono)"}}>
            Test codes: DLFREESHIP · CORPSHIP24 · DLSTAFF100
          </p>
        </div>
      )}
    </div>
  );
}

// ── Utility sub-components (outside main) ──
function SectionHeader({ icon, title, desc }: { icon:string; title:string; desc:string }) {
  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <span style={{fontSize:24}}>{icon}</span>
        <div style={{fontFamily:"var(--font-display)",fontSize:28,letterSpacing:2}}>{title}</div>
      </div>
      <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.6}}>{desc}</p>
    </div>
  );
}

function ReviewCard({ title, rows, onEdit }: { title:string; rows:{l:string;v:string}[]; onEdit:()=>void }) {
  return (
    <div style={CARD}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>{title}</div>
        <span style={{fontSize:11,color:"var(--orange)",cursor:"pointer",fontFamily:"var(--font-mono)"}} onClick={onEdit}>Edit →</span>
      </div>
      {rows.map(r=>(
        <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:13,gap:12}}>
          <span style={{color:"var(--muted)",flexShrink:0}}>{r.l}</span>
          <span style={{fontWeight:500,textAlign:"right",wordBreak:"break-word"}}>{r.v||"—"}</span>
        </div>
      ))}
    </div>
  );
}

// ── Price calculator (pure function, outside component) ──
function calcPrice(form: FormData) {
  const r = RATES[form.receiverCountry];
  if (!r || !form.weight || parseFloat(form.weight) <= 0) return null;
  const base    = r.base;
  const wCharge = Math.round(parseFloat(form.weight) * 3 * 100) / 100;
  const mult    = SERVICE_MULT[form.service] ?? 1;
  const sFee    = Math.round((base + wCharge) * (mult - 1) * 100) / 100;
  const insur   = form.insurance ? Math.round((base + wCharge + sFee) * 0.05 * 100) / 100 : 0;
  const total   = Math.round((base + wCharge + sFee + insur) * 100) / 100;
  return { base, wCharge, sFee, insur, total, days: r.days };
}

// ── MAIN PAGE ──
export default function SendPage() {
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState<FormData>(EMPTY);
  const [couponStatus, setCouponStatus] = useState<"idle"|"valid"|"invalid">("idle");
  const [couponMsg, setCouponMsg]       = useState("");
  const [submitted, setSubmitted]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [bookingId]                     = useState(() => `DL-${new Date().getFullYear()}-${Math.floor(10000+Math.random()*90000)}`);

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const price = calcPrice(form);
  const isFree = couponStatus === "valid";

  // Country flag map
  const FLAGS: Record<string,string> = {
    us:"🇺🇸",uk:"🇬🇧",de:"🇩🇪",ca:"🇨🇦",ae:"🇦🇪",za:"🇿🇦",cn:"🇨🇳",au:"🇦🇺",fr:"🇫🇷",jp:"🇯🇵",
  };

  // Origin city map (sender is always US-based for now)
  const SERVICE_LABELS: Record<string,string> = {
    standard:"Standard Worldwide", express:"Express Delivery", freight:"Freight & Cargo",
  };

  const handleSubmit = async () => {
    if (!canNext()) return;
    setSubmitting(true);

    const steps = [
      { status:"Package Received",         location:`${form.senderCity}, ${form.senderState} — DL Drop Hub`, time: new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}), state:"done" },
      { status:"Departed Origin Facility", location:`${form.senderCity} Airport`,   time:"Pending", state:"pending" },
      { status:"Customs Cleared",          location:"Origin Customs Facility",       time:"Pending", state:"pending" },
      { status:"In Transit — Air Freight", location:"International Route",           time:"Pending", state:"pending" },
      { status:"Arrived at Destination Hub",location:`${form.receiverCity} Cargo Hub`, time:"Pending", state:"pending" },
      { status:"Out for Delivery",         location:`${form.receiverCity} Local Courier`, time:"Pending", state:"pending" },
      { status:"Delivered",                location:form.receiverAddress,            time:"Pending", state:"pending" },
    ];

    const r = RATES[form.receiverCountry];
    const eta = r ? `Est. ${new Date(Date.now()+(parseInt(r.days)*24*60*60*1000)).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}` : "To be confirmed";

    await supabase.from("packages").insert({
      id:               bookingId,
      status:           "processing",
      sender_name:      form.senderName,
      sender_email:     form.senderEmail,
      sender_phone:     form.senderPhone,
      sender_address:   `${form.senderAddress}, ${form.senderCity}${form.senderState?", "+form.senderState:""} ${form.senderZip}`,
      sender_city:      form.senderCity,
      sender_state:     form.senderState,
      sender_zip:       form.senderZip,
      sender_flag:      "🇺🇸",
      receiver_name:    form.receiverName,
      receiver_email:   form.receiverEmail,
      receiver_phone:   form.receiverPhone,
      receiver_address: `${form.receiverAddress}, ${form.receiverCity} ${form.receiverZip}`,
      receiver_city:    form.receiverCity,
      receiver_zip:     form.receiverZip,
      receiver_country: COUNTRIES.find(c=>c.val===form.receiverCountry)?.label || form.receiverCountry,
      receiver_flag:    FLAGS[form.receiverCountry] || "🌍",
      weight:           `${form.weight} kg`,
      dimensions:       form.dimensions,
      package_type:     form.packageType,
      service:          SERVICE_LABELS[form.service] || form.service,
      insurance:        form.insurance,
      description:      form.description,
      origin_code:      "USA",
      origin_city:      form.senderCity,
      origin_country:   "United States",
      dest_code:        form.receiverCountry.toUpperCase(),
      dest_city:        form.receiverCity,
      dest_country:     COUNTRIES.find(c=>c.val===form.receiverCountry)?.label || form.receiverCountry,
      eta,
      steps,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  const checkCoupon = () => {
    const code = form.couponCode.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCouponStatus("valid");
      setCouponMsg(VALID_COUPONS[code]);
    } else {
      setCouponStatus("invalid");
      setCouponMsg("Invalid coupon code.");
    }
  };

  const canNext = () => {
    if (step===0) return !!(form.senderName && form.senderEmail && form.senderPhone && form.senderAddress && form.senderCity);
    if (step===1) return !!(form.weight && form.packageType && form.service);
    if (step===2) return !!(form.receiverName && form.receiverPhone && form.receiverAddress && form.receiverCity && form.receiverCountry);
    if (step===3) return true;
    if (step===4) {
      if (isFree) return true;
      if (form.paymentMethod==="card") return !!(form.cardName && form.cardNumber && form.cardExpiry && form.cardCvv);
      if (form.paymentMethod==="paypal" || form.paymentMethod==="applepay") return true;
      if (form.paymentMethod==="coupon") return couponStatus==="valid";
      return false;
    }
    return false;
  };

  if (submitted) return (
    <div style={{minHeight:"100vh",background:"var(--black)",color:"var(--white)",display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
      <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:"60px 48px",maxWidth:540,width:"100%",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
        <div style={{fontSize:64,marginBottom:24}}>🎉</div>
        <div style={{fontFamily:"var(--font-display)",fontSize:40,letterSpacing:2,marginBottom:8}}>Booking Confirmed!</div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:14,color:"var(--orange)",letterSpacing:2,marginBottom:20}}>{bookingId}</div>
        <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.8,marginBottom:32}}>
          Your shipment has been booked. A confirmation email has been sent to <strong style={{color:"var(--white)"}}>{form.senderEmail}</strong>. Our team will arrange pickup within your selected window.
          {isFree && <><br/><br/><span style={{color:"#4CAF50"}}>✓ Fully covered by your company coupon — no charge to you.</span></>}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Link href="/track" style={{display:"block",background:"var(--orange)",color:"#fff",padding:14,fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,textDecoration:"none"}}>
            Track Your Shipment →
          </Link>
          <Link href="/" style={{display:"block",border:"1px solid var(--border)",color:"var(--white)",padding:14,fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,textDecoration:"none"}}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        @media(max-width:768px){
          .sg{grid-template-columns:1fr!important;}
          .sp{padding:24px!important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 60px",backdropFilter:"blur(18px)",background:"rgba(10,10,10,0.8)",borderBottom:"1px solid var(--border)"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <div style={{width:36,height:36,background:"var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:20,color:"#fff"}}>DL</div>
          <span style={{fontFamily:"var(--font-display)",fontSize:22,letterSpacing:2,color:"var(--white)"}}>Daily Logistics</span>
        </Link>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Link href="/track" style={{color:"var(--muted)",fontSize:13,textDecoration:"none",fontWeight:500,letterSpacing:"0.8px",textTransform:"uppercase"}}>Track</Link>
          <Link href="/#support" style={{color:"var(--muted)",fontSize:13,textDecoration:"none",fontWeight:500,letterSpacing:"0.8px",textTransform:"uppercase"}}>Support</Link>
        </div>
      </nav>

      <div style={{minHeight:"100vh",background:"var(--black)",color:"var(--white)",paddingTop:80}}>

        {/* HERO */}
        <div style={{background:"#0d0c0c",borderBottom:"1px solid var(--border)",padding:"60px 60px 48px",position:"relative",overflow:"hidden"}} className="sp">
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(244,82,30,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(244,82,30,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}} />
          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--orange)",marginBottom:16}}>
              <span style={{width:16,height:2,background:"var(--orange)",display:"inline-block"}} /> Book a Shipment
            </div>
            <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(44px,6vw,80px)",lineHeight:0.92,letterSpacing:2,marginBottom:16}}>
              Ship It.<br/><span style={{color:"var(--orange)"}}>We Handle The Rest.</span>
            </h1>
            <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.7,maxWidth:480}}>
              Fill in the steps below and we&apos;ll pick up your package from your door. Fast, tracked, and delivered worldwide.
            </p>
          </div>
        </div>

        {/* BODY */}
        <div style={{padding:"48px 60px"}} className="sp">
          <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:32,alignItems:"start"}} className="sg">

            {/* LEFT — wizard */}
            <div>
              {/* Step indicator */}
              <div style={{display:"flex",alignItems:"center",marginBottom:40}}>
                {STEPS.map((s,i) => (
                  <div key={s} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:"unset"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:i<step?"pointer":"default"}} onClick={()=>{if(i<step)setStep(i);}}>
                      <div style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${i<step?"#4CAF50":i===step?"var(--orange)":"var(--border)"}`,background:i<step?"rgba(76,175,80,0.15)":i===step?"rgba(244,82,30,0.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:i<step?"#4CAF50":i===step?"var(--orange)":"var(--muted)",fontWeight:700,transition:"all 0.3s"}}>
                        {i<step?"✓":i+1}
                      </div>
                      <span style={{fontSize:11,fontFamily:"var(--font-mono)",letterSpacing:1,textTransform:"uppercase",color:i===step?"var(--orange)":i<step?"#4CAF50":"var(--muted)",whiteSpace:"nowrap"}}>{s}</span>
                    </div>
                    {i<STEPS.length-1 && <div style={{flex:1,height:1,background:i<step?"#4CAF5055":"var(--border)",margin:"0 8px",marginBottom:22,transition:"background 0.3s"}} />}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:32,position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
                {step===0 && <StepSender form={form} set={set} />}
                {step===1 && <StepPackage form={form} set={set} price={price} />}
                {step===2 && <StepReceiver form={form} set={set} />}
                {step===3 && <StepReview form={form} goTo={setStep} />}
                {step===4 && <StepPayment form={form} set={set} couponStatus={couponStatus} couponMsg={couponMsg} checkCoupon={checkCoupon} isFree={isFree} />}
              </div>

              {/* Nav buttons */}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:20,gap:12}}>
                <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
                  style={{background:"transparent",border:"1px solid var(--border)",color:step===0?"var(--muted)":"var(--white)",padding:"14px 28px",fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,cursor:step===0?"not-allowed":"pointer",opacity:step===0?0.4:1,transition:"all 0.2s"}}>
                  ← Back
                </button>
                {step<STEPS.length-1 ? (
                  <button onClick={()=>canNext()&&setStep(s=>s+1)}
                    style={{background:canNext()?"var(--orange)":"rgba(244,82,30,0.3)",color:"#fff",border:"none",padding:"14px 36px",fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,cursor:canNext()?"pointer":"not-allowed",transition:"background 0.2s",flex:1,maxWidth:240}}
                    onMouseEnter={e=>{if(canNext())e.currentTarget.style.background="var(--orange-dark)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=canNext()?"var(--orange)":"rgba(244,82,30,0.3)";}}>
                    Continue →
                  </button>
                ) : (
                  <button onClick={()=>canNext()&&handleSubmit()}
                    style={{background:canNext()?"var(--orange)":"rgba(244,82,30,0.3)",color:"#fff",border:"none",padding:"14px 36px",fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,cursor:canNext()?"pointer":"not-allowed",transition:"background 0.2s",flex:1,maxWidth:300}}
                    onMouseEnter={e=>{if(canNext())e.currentTarget.style.background="var(--orange-dark)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=canNext()?"var(--orange)":"rgba(244,82,30,0.3)";}}>
                    {submitting?"Processing...":isFree?"Confirm — Free Shipment 🎉":"Confirm & Pay →"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT — price summary */}
            <div style={{position:"sticky",top:100}}>
              <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24,position:"relative",marginBottom:16}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,var(--orange),transparent)"}} />
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>Price Estimate</div>
                <div style={{fontFamily:"var(--font-display)",fontSize:48,letterSpacing:2,color:isFree?"#4CAF50":"var(--orange)",lineHeight:1,marginBottom:4}}>
                  {isFree?"FREE":price?`$${price.total.toFixed(2)}`:"$ —"}
                </div>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:20}}>
                  {isFree?"100% covered by coupon":price?"Estimated total":"Fill in details for a quote"}
                </div>
                {[
                  {l:"Base rate",    v:price?`$${price.base.toFixed(2)}`:"—"},
                  {l:"Weight charge",v:price?`$${price.wCharge.toFixed(2)}`:"—"},
                  {l:"Service fee",  v:price?(form.service==="standard"?"$0.00":`$${price.sFee.toFixed(2)}`):"—"},
                  {l:"Insurance",    v:price&&form.insurance?`$${price.insur.toFixed(2)}`:"—"},
                  {l:"Est. delivery",v:price?`${price.days} days`:"—"},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                    <span style={{color:"var(--muted)"}}>{r.l}</span>
                    <span style={{fontWeight:500,color:isFree&&r.l!=="Est. delivery"?"#4CAF50":"var(--white)"}}>
                      {isFree&&r.l!=="Est. delivery"?"FREE":r.v}
                    </span>
                  </div>
                ))}
                {isFree && (
                  <div style={{marginTop:14,padding:"10px 14px",background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.3)",fontSize:12,color:"#4CAF50",display:"flex",alignItems:"center",gap:8}}>
                    🎟️ Coupon: {form.couponCode}
                  </div>
                )}
              </div>

              <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",padding:24}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:16}}>What Happens Next</div>
                {[
                  {n:"1",t:"Booking confirmed",d:"You receive a tracking ID by email immediately."},
                  {n:"2",t:"Pickup arranged",  d:"Our rider picks up from your address within your window."},
                  {n:"3",t:"Live tracking",    d:"Track every step at dailylogistics.com/track."},
                  {n:"4",t:"Delivered",        d:"Recipient signs digitally. You're notified instantly."},
                ].map(s=>(
                  <div key={s.n} style={{display:"flex",gap:12,marginBottom:16}}>
                    <div style={{width:24,height:24,border:"1px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:14,color:"var(--orange)",flexShrink:0}}>{s.n}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{s.t}</div>
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}