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
  status: string;
  sender_name: string; sender_email: string; sender_phone: string; sender_address: string;
  receiver_name: string; receiver_email: string; receiver_phone: string; receiver_address: string;
  receiver_country: string; receiver_flag: string;
  weight: string; dimensions: string; package_type: string; service: string;
  insurance: boolean; description: string;
  origin_code: string; origin_city: string; origin_country: string;
  dest_code: string; dest_city: string; dest_country: string;
  eta: string; steps: Step[];
  notes?: string;
  created_at: string;
}

const ADMIN_PASSWORD = "DL@Admin2024";

const STATUS_OPTIONS = [
  { val: "processing",  label: "Processing",          color: "#6b6660" },
  { val: "in-transit",  label: "In Transit",           color: "#f4521e" },
  { val: "withheld",    label: "Withheld — Customs",   color: "#f5a623" },
  { val: "delayed",     label: "Delayed",              color: "#f5a623" },
  { val: "arrived",     label: "Arrived at Hub",       color: "#4CAF50" },
  { val: "delivered",   label: "Delivered",            color: "#4CAF50" },
];

const STEP_STATES = ["done", "active", "pending"] as const;

const INP: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
  color: "var(--white)", padding: "11px 14px", fontSize: 13, outline: "none",
  width: "100%", fontFamily: "var(--font-body)", transition: "border-color 0.2s",
};
const LBL: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
  textTransform: "uppercase", color: "var(--muted)", marginBottom: 6, display: "block",
};
const CARD: React.CSSProperties = {
  background: "var(--card-bg)", border: "1px solid var(--border)",
  padding: 24, position: "relative",
};

const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(244,82,30,0.5)");
const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--border)");

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState(false);
  const [show, setShow]   = useState(false);

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: "48px 40px", width: "100%", maxWidth: 400, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--orange),transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "#fff" }}>DL</div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2 }}>Admin Panel</span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 2, marginBottom: 8 }}>Team Access</div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28, lineHeight: 1.6 }}>Enter the shared team password to access the Daily Logistics admin dashboard.</p>
        <label style={LBL}>Password</label>
        <div style={{ display: "flex", marginBottom: 8 }}>
          <input type={show ? "text" : "password"} value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter admin password"
            style={{ ...INP, flex: 1, borderRight: "none", borderColor: error ? "rgba(244,82,30,0.6)" : "var(--border)" }}
            autoFocus />
          <button onClick={() => setShow(s => !s)}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderLeft: "none", color: "var(--muted)", padding: "0 14px", cursor: "pointer", fontSize: 14 }}>
            {show ? "🙈" : "👁"}
          </button>
        </div>
        {error && <p style={{ fontSize: 12, color: "var(--orange)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>✗ Incorrect password. Try again.</p>}
        <button onClick={attempt}
          style={{ width: "100%", background: "var(--orange)", color: "#fff", border: "none", padding: 14, fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, cursor: "pointer", marginTop: 8, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--orange-dark)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--orange)"}
        >Enter Dashboard →</button>
        <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 20, textAlign: "center" }}>Hint: DL@Admin2024</p>
      </div>
    </div>
  );
}

function PkgRow({ pkg, onSelect, selected }: { pkg: Pkg; onSelect: () => void; selected: boolean }) {
  const cfg = STATUS_OPTIONS.find(s => s.val === pkg.status);
  return (
    <div onClick={onSelect}
      style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 140px 110px", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer", background: selected ? "rgba(244,82,30,0.06)" : "transparent", borderLeft: selected ? "3px solid var(--orange)" : "3px solid transparent", transition: "all 0.2s", alignItems: "center" }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 1, color: "var(--orange)" }}>{pkg.id}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{pkg.sender_name}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{pkg.sender_address?.split(",")[0]}</div>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{pkg.receiver_name}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{pkg.receiver_country}</div>
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        {new Date(pkg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: `1px solid ${cfg?.color}55`, background: `${cfg?.color}15` }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg?.color, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: 1, color: cfg?.color, textTransform: "uppercase", whiteSpace: "nowrap" }}>{cfg?.label.split("—")[0].trim()}</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [selected, setSelected] = useState<Pkg | null>(null);
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editStatus, setEditStatus]         = useState("");
  const [editEta, setEditEta]               = useState("");
  const [editNotes, setEditNotes]           = useState("");
  const [editSteps, setEditSteps]           = useState<Step[]>([]);
  const [editSenderName, setEditSenderName] = useState("");
  const [editSenderEmail, setEditSenderEmail] = useState("");
  const [editSenderPhone, setEditSenderPhone] = useState("");
  const [editReceiverName, setEditReceiverName] = useState("");
  const [editReceiverEmail, setEditReceiverEmail] = useState("");
  const [editReceiverPhone, setEditReceiverPhone] = useState("");
  const [editWeight, setEditWeight]         = useState("");
  const [editService, setEditService]       = useState("");

  const fetchPackages = async () => {
    setLoading(true);
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    if (data) setPackages(data as Pkg[]);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchPackages(); }, [authed]);

  const selectPkg = (pkg: Pkg) => {
    setSelected(pkg);
    setEditStatus(pkg.status);
    setEditEta(pkg.eta);
    setEditNotes(pkg.notes || "");
    setEditSteps(pkg.steps ? pkg.steps.map(s => ({ ...s })) : []);
    setEditSenderName(pkg.sender_name || "");
    setEditSenderEmail(pkg.sender_email || "");
    setEditSenderPhone(pkg.sender_phone || "");
    setEditReceiverName(pkg.receiver_name || "");
    setEditReceiverEmail(pkg.receiver_email || "");
    setEditReceiverPhone(pkg.receiver_phone || "");
    setEditWeight(pkg.weight || "");
    setEditService(pkg.service || "");
  };

  const saveChanges = async () => {
    if (!selected) return;
    setSaving(true);
    await supabase.from("packages").update({
      status: editStatus, eta: editEta, notes: editNotes, steps: editSteps,
      sender_name: editSenderName, sender_email: editSenderEmail, sender_phone: editSenderPhone,
      receiver_name: editReceiverName, receiver_email: editReceiverEmail, receiver_phone: editReceiverPhone,
      weight: editWeight, service: editService,
    }).eq("id", selected.id);
    await fetchPackages();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateStep = (i: number, field: keyof Step, val: string) =>
    setEditSteps(steps => steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const addStep = () =>
    setEditSteps(steps => [...steps, { status: "", location: "", time: "Pending", state: "pending" }]);

  const removeStep = (i: number) =>
    setEditSteps(steps => steps.filter((_, idx) => idx !== i));

  const filteredPkgs = packages.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.id.toLowerCase().includes(q) || p.sender_name?.toLowerCase().includes(q) || p.receiver_name?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s.val]: packages.filter(p => p.status === s.val).length }), {} as Record<string, number>);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes spin{to{transform:rotate(360deg);}}
        select option{background:#1a1918;color:var(--white);}
        @media(max-width:900px){.ag{grid-template-columns:1fr!important;}.ah{display:none!important;}}
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--white)", display: "flex", flexDirection: "column" }}>

        {/* NAV */}
        <nav style={{ background: "#0d0c0c", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 17, color: "#fff" }}>DL</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2 }}>Admin Dashboard</span>
            <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 8px" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>Daily Logistics</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={fetchPackages}
              style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "8px 16px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.color = "var(--orange)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >↻ Refresh</button>
            <Link href="/" style={{ color: "var(--muted)", fontSize: 12, textDecoration: "none", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>← Back to Site</Link>
            <button onClick={() => setAuthed(false)}
              style={{ background: "transparent", border: "1px solid rgba(244,82,30,0.3)", color: "var(--orange)", padding: "8px 16px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </nav>

        {/* STATS */}
        <div style={{ background: "#0d0c0c", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", gap: 32, overflowX: "auto" }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Total Packages</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 1 }}>{packages.length}</div>
          </div>
          <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />
          {STATUS_OPTIONS.map(s => (
            <div key={s.val} style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => setFilterStatus(filterStatus === s.val ? "all" : s.val)}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: filterStatus === s.val ? s.color : "var(--muted)", marginBottom: 4, transition: "color 0.2s" }}>{s.label.split("—")[0].trim()}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 1, color: filterStatus === s.val ? s.color : "var(--white)" }}>{statusCounts[s.val] || 0}</div>
            </div>
          ))}
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 480px", overflow: "hidden" }} className="ag">

          {/* LIST */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid var(--border)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12 }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID, sender, or receiver..."
                style={{ ...INP, flex: 1 }} onFocus={onF} onBlur={onB} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ ...INP, width: 160, appearance: "none", background: "#1a1918", cursor: "pointer" }}
                onFocus={onF} onBlur={onB}>
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 140px 110px", gap: 16, padding: "10px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }} className="ah">
              {["Tracking ID", "Sender", "Receiver", "Booked", "Status"].map(h => (
                <div key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>{h}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTop: "3px solid var(--orange)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}
              {!loading && filteredPkgs.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2 }}>No packages found</div>
                </div>
              )}
              {!loading && filteredPkgs.map(pkg => (
                <PkgRow key={pkg.id} pkg={pkg} selected={selected?.id === pkg.id} onSelect={() => selectPkg(pkg)} />
              ))}
            </div>
          </div>

          {/* EDIT PANEL */}
          <div style={{ overflowY: "auto", background: "#0d0c0c" }}>
            {!selected ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 40, textAlign: "center", color: "var(--muted)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, marginBottom: 8 }}>Select a Package</div>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>Click any package from the list to view and edit its details.</p>
              </div>
            ) : (
              <div style={{ padding: 24 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, color: "var(--orange)", marginBottom: 4 }}>{selected.id}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2 }}>Edit Package</div>
                  </div>
                  <button onClick={saveChanges} disabled={saving}
                    style={{ background: saved ? "#4CAF50" : "var(--orange)", color: "#fff", border: "none", padding: "12px 24px", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 2, cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
                    {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>

                {/* Status */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--orange),transparent)" }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Package Status</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {STATUS_OPTIONS.map(s => (
                      <div key={s.val} onClick={() => setEditStatus(s.val)}
                        style={{ padding: "10px 14px", border: `1px solid ${editStatus === s.val ? s.color : "var(--border)"}`, background: editStatus === s.val ? `${s.color}15` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: editStatus === s.val ? s.color : "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>{s.label}</span>
                        {editStatus === s.val && <span style={{ marginLeft: "auto", color: s.color, fontSize: 12 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ETA */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Estimated Delivery</div>
                  <input value={editEta} onChange={e => setEditEta(e.target.value)} placeholder="e.g. May 20, 2024" style={INP} onFocus={onF} onBlur={onB} />
                </div>

                {/* Timeline */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--orange),transparent)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>Timeline Steps</div>
                    <button onClick={addStep}
                      style={{ background: "rgba(244,82,30,0.1)", border: "1px solid rgba(244,82,30,0.3)", color: "var(--orange)", padding: "6px 14px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>
                      + Add Step
                    </button>
                  </div>
                  {editSteps.map((step, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: 14, marginBottom: 10, position: "relative" }}>
                      <div style={{ position: "absolute", top: 10, right: 10, cursor: "pointer", color: "var(--muted)", fontSize: 18, lineHeight: 1 }} onClick={() => removeStep(i)}>×</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                        <div>
                          <label style={{ ...LBL, fontSize: 9 }}>Status Label</label>
                          <input value={step.status} onChange={e => updateStep(i, "status", e.target.value)} style={{ ...INP, fontSize: 12 }} onFocus={onF} onBlur={onB} />
                        </div>
                        <div>
                          <label style={{ ...LBL, fontSize: 9 }}>State</label>
                          <select value={step.state} onChange={e => updateStep(i, "state", e.target.value)}
                            style={{ ...INP, fontSize: 12, appearance: "none", background: "#1a1918", cursor: "pointer" }} onFocus={onF} onBlur={onB}>
                            {STEP_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div>
                          <label style={{ ...LBL, fontSize: 9 }}>Location</label>
                          <input value={step.location} onChange={e => updateStep(i, "location", e.target.value)} style={{ ...INP, fontSize: 12 }} onFocus={onF} onBlur={onB} />
                        </div>
                        <div>
                          <label style={{ ...LBL, fontSize: 9 }}>Time</label>
                          <input value={step.time} onChange={e => updateStep(i, "time", e.target.value)} placeholder="e.g. May 14 · 08:00 AM" style={{ ...INP, fontSize: 12 }} onFocus={onF} onBlur={onB} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sender */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Sender Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div><label style={LBL}>Name</label><input value={editSenderName} onChange={e => setEditSenderName(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                    <div><label style={LBL}>Email</label><input value={editSenderEmail} onChange={e => setEditSenderEmail(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                  </div>
                  <div><label style={LBL}>Phone</label><input value={editSenderPhone} onChange={e => setEditSenderPhone(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                </div>

                {/* Receiver */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Receiver Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div><label style={LBL}>Name</label><input value={editReceiverName} onChange={e => setEditReceiverName(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                    <div><label style={LBL}>Email</label><input value={editReceiverEmail} onChange={e => setEditReceiverEmail(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                  </div>
                  <div><label style={LBL}>Phone</label><input value={editReceiverPhone} onChange={e => setEditReceiverPhone(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                </div>

                {/* Package */}
                <div style={{ ...CARD, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Package Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={LBL}>Weight</label><input value={editWeight} onChange={e => setEditWeight(e.target.value)} placeholder="e.g. 2.4 kg" style={INP} onFocus={onF} onBlur={onB} /></div>
                    <div><label style={LBL}>Service</label><input value={editService} onChange={e => setEditService(e.target.value)} style={INP} onFocus={onF} onBlur={onB} /></div>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ ...CARD, marginBottom: 24 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Internal Notes</div>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
                    placeholder="Add internal notes visible only to the team — customs issues, customer complaints, special handling instructions..."
                    rows={4} style={{ ...INP, resize: "none" }} onFocus={onF} onBlur={onB} />
                  <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 8 }}>Notes are internal only — not visible to customers.</p>
                </div>

                {/* Save bottom */}
                <button onClick={saveChanges} disabled={saving}
                  style={{ width: "100%", background: saved ? "#4CAF50" : "var(--orange)", color: "#fff", border: "none", padding: 16, fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, cursor: saving ? "not-allowed" : "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.background = saved ? "#4CAF50" : "var(--orange-dark)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = saved ? "#4CAF50" : "var(--orange)"; }}
                >{saving ? "Saving..." : saved ? "✓ Changes Saved!" : "Save All Changes →"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}