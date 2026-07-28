"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Award, BarChart3, Bell, BookOpen, BrainCircuit, Check,
  CheckCircle2, ChevronDown, ClipboardList, Clock3, Filter, GraduationCap, HeartPulse,
  LayoutDashboard, Menu, MoreHorizontal, Search, Settings, ShieldCheck, Sparkles, Star,
  Stethoscope, Upload, UserRound, X, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line,
  LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { BrowserRouter, Link, MemoryRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { aiPredictions, cases, discrepancyData, learningCases, personalTrend, trend12 } from "./data";
import type { Case, Priority, Verdict } from "./types";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "ECG Cases", icon: HeartPulse },
  { href: "/review", label: "Review Queue", icon: ClipboardList, badge: 18 },
  { href: "/learning", label: "Learning Dashboard", icon: GraduationCap },
  { href: "/analytics", label: "Analytics", icon: BarChart3, section: "REPORTS" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const chartBlue = "#2563EB";
const green = "#16A34A";
const amber = "#D97706";
const red = "#DC2626";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <span className="logo-mark"><Activity size={21} strokeWidth={2.4} /></span>
      {!compact && <span><strong>WRHN</strong><small>ECG Quality Improvement</small></span>}
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="side-brand"><Logo /><span className="product-chip">ECG-QI</span><button className="mobile-close" onClick={() => setMobile(false)} aria-label="Close navigation"><X size={18}/></button></div>
        <nav aria-label="Main navigation">
          <p className="nav-kicker">NAVIGATION</p>
          {nav.map((item, i) => (
            <div key={item.href}>
              {item.section && <p className="nav-kicker reports">{item.section}</p>}
              <Link onClick={() => setMobile(false)} className={`nav-item ${location.pathname === item.href || (item.href === "/cases" && location.pathname.startsWith("/cases")) ? "active" : ""}`} to={item.href}>
                <item.icon size={18}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}
              </Link>
            </div>
          ))}
        </nav>
        <div className="side-note"><ShieldCheck size={16}/><span><strong>QI workspace</strong><small>De-identified data only</small></span></div>
        <button onClick={() => setUploadOpen(true)} className="button primary upload-side"><Upload size={16}/>Upload ECG</button>
      </aside>
      {mobile && <button aria-label="Close navigation overlay" className="overlay" onClick={() => setMobile(false)} />}
      <div className="main-area">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMobile(true)} aria-label="Open navigation"><Menu size={20}/></button>
          <Logo compact />
          <div className="top-divider"/>
          <span className="top-product">ECG-QI</span>
          <label className="global-search"><Search size={17}/><input aria-label="Search by patient ID" placeholder="Search patient ID, e.g. 20841"/></label>
          <div className="top-actions">
            <span className="online"><i/>AI Model Online</span>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={19}/><i/></button>
            <button className="user-menu"><span className="avatar">AN</span><span><strong>Dr. A. Nkemdirim</strong><small>Emergency Med. · WRHN</small></span><ChevronDown size={15}/></button>
          </div>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard openUpload={() => setUploadOpen(true)}/>}/>
            <Route path="/cases" element={<CasesPage openUpload={() => setUploadOpen(true)}/>}/>
            <Route path="/cases/:id" element={<CaseDetail/>}/>
            <Route path="/review" element={<ReviewPage/>}/>
            <Route path="/learning" element={<LearningPage/>}/>
            <Route path="/analytics" element={<AnalyticsPage/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </main>
      </div>
      {uploadOpen && <UploadWorkflow onClose={() => setUploadOpen(false)}/>}
    </div>
  );
}

function UploadWorkflow({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [confidence, setConfidence] = useState(72);
  const [diagnosis, setDiagnosis] = useState("Sinus Tachycardia");
  const [processIndex, setProcessIndex] = useState(0);
  const [outcome, setOutcome] = useState<"accepted" | "maintained" | "expert">("expert");
  const stages = [
    ["Image Quality Validation", "Checking lead placement, noise, and signal clarity"],
    ["Waveform Segmentation", "Identifying P, QRS, and T boundaries across all 12 leads"],
    ["Feature Extraction", "Computing intervals, axes, amplitudes, and morphology"],
    ["AI Interpretation", "Running simulated ensemble model - ECG-AI v2.4"],
    ["Clinician Comparison", "Comparing AI output against clinician interpretation"],
  ];
  useEffect(() => {
    if (step !== 3) return;
    setProcessIndex(0);
    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setProcessIndex(current);
      if (current >= stages.length) {
        window.clearInterval(timer);
        window.setTimeout(() => setStep(4), 450);
      }
    }, 540);
    return () => window.clearInterval(timer);
  }, [step]);
  const finish = (choice: "accepted" | "maintained" | "expert") => {
    setOutcome(choice);
    setStep(5);
  };
  return <div className="workflow-backdrop" role="presentation">
    <section className="upload-workflow" role="dialog" aria-modal="true" aria-labelledby="upload-workflow-title">
      <header className="workflow-header"><span className="workflow-icon"><Upload size={20}/></span><div><h2 id="upload-workflow-title">Upload ECG — New Case Workflow</h2><p>WRHN Cardiac Services · Dr. A. Nkemdirim</p></div><button onClick={onClose} aria-label="Close upload workflow"><X size={20}/></button></header>
      <div className="stepper" aria-label={`Step ${step} of 5`}>
        {["Upload ECG","Clinician Review","AI Processing","Comparison","Expert Review"].map((label, index) => {
          const number = index + 1;
          const completed = number < step;
          return <div className={`step ${number === step ? "active" : ""} ${completed ? "complete" : ""}`} key={label}><span>{completed ? <Check size={16}/> : number}</span><b>{label}</b>{index < 4 && <i/>}</div>;
        })}
      </div>
      <div className="workflow-body">
        {step === 1 && <div className="upload-step">
          <div className="privacy-warning"><AlertTriangle size={18}/><div><strong>Privacy Requirement</strong><p>Do not enter patient names, dates of birth, MRN, or identifying information. Use anonymized patient IDs only. All uploads are audit-logged.</p></div></div>
          <div className="upload-columns">
            <div className="workflow-form"><h3>Anonymized Patient Information</h3><label>Anonymized Patient ID *<input defaultValue="WRHN-00482" className="mono"/></label><div className="form-pair"><label>Age Range<select defaultValue="65-74"><option>18-34</option><option>35-49</option><option>50-64</option><option>65-74</option><option>75+</option></select></label><label>Sex<select defaultValue="Male"><option>Female</option><option>Male</option><option>Other / not specified</option></select></label></div><label>Department<select defaultValue="Emergency"><option>Emergency</option><option>Cardiology</option><option>ICU</option><option>Internal Medicine</option></select></label><label>Reason for ECG<textarea defaultValue="Palpitations and lightheadedness, new onset"/></label></div>
            <div><h3>ECG File Upload</h3><label className={`dropzone ${fileName ? "has-file" : ""}`}><input type="file" accept=".jpg,.jpeg,.png,.pdf,.dcm,.dicom,.xml" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}/>{fileName ? <><CheckCircle2 size={34}/><strong>{fileName}</strong><span>Ready for clinician review</span></> : <><Upload size={34}/><strong>Drag & drop or click to upload</strong><span>Supports JPG, PNG, PDF, DICOM, XML</span></>}</label><div className="file-types"><span>.jpg</span><span>.png</span><span>.pdf</span><span>.dicom</span><span>.xml</span></div><button className="demo-file" onClick={() => setFileName("WRHN-00482-demo.dicom")}>Use anonymized demo ECG</button></div>
          </div>
        </div>}
        {step === 2 && <div className="clinician-step">
          <div className="workflow-section-title"><span className="soft-icon"><Stethoscope size={20}/></span><div><h3>Clinician Interpretation</h3><p>Dr. A. Nkemdirim · Emergency Medicine · Dec 18, 2024 10:02</p></div><span className="anonymized mono">WRHN-00482</span></div>
          <WorkflowEcg compact/>
          <div className="clinician-form-grid"><div><label>Primary Diagnosis *<select value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}><option>Sinus Tachycardia</option><option>Atrial Fibrillation</option><option>Atrial Flutter</option><option>Normal Sinus Rhythm</option><option>STEMI</option></select></label><div className="form-pair"><label>Rhythm<select defaultValue="Regular"><option>Regular</option><option>Irregular</option><option>Irregularly irregular</option></select></label><label>Ventricular Rate<div className="suffix-input"><input defaultValue="148"/><span>bpm</span></div></label></div><label>Clinical Confidence: <b>{confidence}%</b><input type="range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))}/><div className="range-labels"><span>Uncertain</span><span>Confident</span></div></label></div><div><label>Key Findings<textarea defaultValue="Rapid ventricular rate. No obvious P wave abnormalities. QRS complexes appear narrow and regular. No ST segment changes noted."/></label><label>Clinical Notes<textarea defaultValue="Patient presented with acute palpitations. Vitals stable. ECG ordered on arrival to ED."/></label></div></div>
          <div className="independence-note"><ShieldCheck size={16}/>Your interpretation is recorded before the AI second read is revealed.</div>
        </div>}
        {step === 3 && <div className="processing-step"><span className="processing-ring"><BrainCircuit size={32}/></span><h3>AI Processing ECG...</h3><p>ECG-AI v2.4 · WRHN-00482 · Simulated prototype analysis</p><div className="processing-list">{stages.map(([title, text], index) => <div className={`${index < processIndex ? "done" : ""} ${index === processIndex ? "running" : ""}`} key={title}><span>{index < processIndex ? <Check size={17}/> : index + 1}</span><div><strong>{title}</strong><small>{text}</small></div><b>{index < processIndex ? "Done" : index === processIndex ? "Running" : ""}</b></div>)}</div><p className="decision-note centered"><ShieldCheck size={14}/>This simulated AI output is decision support, not a diagnosis.</p></div>}
        {step === 4 && <div className="comparison-step">
          <div className="discrepancy-alert"><AlertTriangle size={22}/><div><strong>Major Discrepancy — High Priority</strong><p>Clinician: <b>{diagnosis}</b> · AI: <b>Atrial Flutter with 2:1 Conduction</b> · AI Confidence: <b>91%</b></p></div><PriorityBadge priority="high"/></div>
          <div className="case-summary">{[["Patient ID","WRHN-00482"],["Age Range","65-74"],["Sex","Male"],["Department","Emergency"],["ECG Acquired","Dec 18, 2024 · 09:42"],["Reason","Palpitations, lightheadedness"]].map(([label,value]) => <div key={label}><span>{label}</span><b className={label==="Patient ID"?"mono id-link":""}>{value}</b></div>)}</div>
          <p className="waveform-caption"><Activity size={16}/>ECG Waveform — simulated flutter pattern highlighted</p><WorkflowEcg/>
          <div className="comparison-grid"><div className="comparison-card"><header><Stethoscope size={18}/><strong>Clinician Interpretation</strong><span>Dr. A. Nkemdirim</span></header><div><span>DIAGNOSIS</span><h3>{diagnosis}</h3><div className="comparison-confidence"><span>CONFIDENCE</span><i><b style={{width:`${confidence}%`}}/></i><strong>{confidence}%</strong></div><span>FINDINGS</span><ul><li>Rapid ventricular rate ~148 bpm</li><li>Regular rhythm</li><li>No visible P-wave abnormalities</li><li>No ST changes noted</li></ul><p className="quote-note">“Rapid rate consistent with sinus tachycardia in the context of acute presentation.”</p></div></div>
            <div className="comparison-card ai"><header><Zap size={18}/><strong>AI Interpretation</strong><span>ECG-AI v2.4 · 99ms</span></header><div><div className="ai-title"><div><span>DIAGNOSIS</span><h3>Atrial Flutter with 2:1 Conduction</h3></div><strong>91%</strong></div><span>DETECTED FEATURES</span><ul><li>Sawtooth flutter waves at ~300 bpm</li><li>Regular RR intervals (~400ms)</li><li>2:1 AV conduction pattern confirmed</li><li>No delta waves — excludes WPW</li></ul><p className="explainer">Regular sawtooth flutter waves at ~300 bpm with 2:1 block produce a ventricular rate near 150 bpm that can mimic sinus tachycardia. RR regularity and inferior-lead morphology support clinical reassessment.</p><p className="decision-note"><AlertTriangle size={14}/><b>Note:</b> AI is a quality-improvement second reader. Final clinical decisions rest with the treating physician.</p></div></div>
          </div>
        </div>}
        {step === 5 && <div className="completion-step"><span className="completion-icon">{outcome === "expert" ? <Sparkles size={35}/> : <CheckCircle2 size={35}/>}</span><h3>{outcome === "expert" ? "Sent to Expert Review" : "Comparison Decision Recorded"}</h3><p>{outcome === "expert" ? "WRHN-00482 has been added to the high-priority cardiology review queue. The clinician interpretation remains unchanged until adjudication." : outcome === "accepted" ? "The AI suggestion was accepted as the working comparison result. The treating clinician remains responsible for final care decisions." : "The clinician interpretation was maintained and the disagreement was documented for quality-improvement follow-up."}</p><div className="completion-summary"><span><b>Case</b><strong className="mono">WRHN-00482</strong></span><span><b>Status</b><strong>{outcome === "expert" ? "Waiting for expert review" : "Decision recorded"}</strong></span><span><b>Privacy</b><strong>Anonymized</strong></span></div><div className="guardrail"><ShieldCheck size={18}/><span><strong>Audit trail updated</strong>All workflow actions are simulated locally for this prototype.</span></div></div>}
      </div>
      <footer className="workflow-footer">
        {step === 1 && <><span/><button className="button primary" disabled={!fileName} onClick={() => setStep(2)}>Continue to Clinician Interpretation <ChevronDown className="chevron-right" size={16}/></button></>}
        {step === 2 && <><button className="button ghost" onClick={() => setStep(1)}>‹ Back</button><div><button className="button secondary">Save Draft</button><button className="button primary" onClick={() => setStep(3)}><Zap size={16}/>Submit for AI Analysis</button></div></>}
        {step === 3 && <><span/><button className="button secondary" onClick={() => setStep(2)}>Cancel processing</button></>}
        {step === 4 && <><button className="button ghost" onClick={() => setStep(2)}>‹ Back</button><div><button className="button secondary decision" onClick={() => finish("accepted")}><Check size={16}/>Accept AI Suggestion</button><button className="button secondary decision" onClick={() => finish("maintained")}><Stethoscope size={16}/>Maintain Clinician Interpretation</button><button className="button primary decision" onClick={() => finish("expert")}><Sparkles size={16}/>Send to Expert Review</button></div></>}
        {step === 5 && <><button className="button ghost" onClick={onClose}>Close</button><button className="button primary" onClick={() => { onClose(); navigate(outcome === "expert" ? "/review" : "/cases/PT-20839"); }}>{outcome === "expert" ? "Open Review Queue" : "View Case"} →</button></>}
      </footer>
    </section>
  </div>;
}

function WorkflowEcg({ compact = false }: { compact?: boolean }) {
  const leads = compact ? ["I","II","V1","V5"] : ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
  return <div className={`workflow-ecg ${compact ? "compact" : ""}`}><div className="ecg-meta"><b>12-LEAD ECG{compact ? "" : " — FLUTTER PATTERN DETECTED"}</b><span>ANONYMIZED · 25mm/s · 10mm/mV</span></div><div>{leads.map((lead,index) => <EcgStrip key={lead} lead={lead} phase={index%3*4}/>)}</div></div>;
}

function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return <div className="page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="header-actions">{actions}</div>}</div>;
}

function KpiCard({ icon: Icon, tone, value, label, delta, note }: { icon: typeof Activity; tone: string; value: string; label: string; delta: string; note: string }) {
  return <article className="card kpi"><div className="kpi-top"><span className={`icon-chip ${tone}`}><Icon size={20}/></span><span className={`delta ${delta.includes("↓") ? "down" : ""}`}>{delta}</span></div><strong className="metric">{value}</strong><span className="metric-label">{label}</span><div className="kpi-note">{note}</div></article>;
}

function Panel({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`card panel ${className}`}><div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>;
}

function StatusPill({ verdict }: { verdict: Verdict }) {
  return <span className={`status ${verdict}`}>{verdict === "concordant" ? "Concordant" : verdict === "minor" ? "Minor Diff." : "Major Diff."}</span>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`priority ${priority}`}>{priority.toUpperCase()}</span>;
}

const tickStyle = { fontSize: 11, fill: "#71839d" };
const gridStyle = "#E6ECF3";

function Dashboard({ openUpload }: { openUpload: () => void }) {
  return <>
    <PageHeader title="Dashboard" subtitle="Wednesday, December 18, 2024 · WRHN Cardiac Services" actions={<><span className="updated"><Clock3 size={14}/>Updated 2 min ago</span><button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button></>}/>
    <div className="kpi-grid">
      <KpiCard icon={Activity} tone="blue" value="143" label="ECGs Today" delta="↗ 9%" note="↑ 12 from yesterday"/>
      <KpiCard icon={Zap} tone="green" value="88.1%" label="AI Agreement Rate" delta="↗ 2.3%" note="3-month rolling average"/>
      <KpiCard icon={ClipboardList} tone="amber" value="18" label="Awaiting Review" delta="↓ 5%" note="4 high priority"/>
      <KpiCard icon={Clock3} tone="purple" value="23 min" label="Avg. Review Time" delta="↗ 12%" note="Target: ≤30 min"/>
    </div>
    <div className="dashboard-charts">
      <Panel title="Concordance Rate — 12 Month Trend" subtitle="AI vs. Clinician agreement, rolling monthly" action={<span className="success-badge">+8.9 pts YTD</span>}>
        <div className="chart tall"><ResponsiveContainer><AreaChart data={trend12} margin={{ top: 8, right: 12, bottom: 0, left: -15 }}><defs><linearGradient id="blueFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chartBlue} stopOpacity=".2"/><stop offset="1" stopColor={chartBlue} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} tickLine={false} axisLine={false}/><YAxis domain={[78,92]} ticks={[78,82,86,92]} tick={tickStyle} tickLine={false} axisLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={chartBlue} strokeWidth={2.5} fill="url(#blueFade)" dot={{ r: 3.5, fill: "#fff", strokeWidth: 2 }}/></AreaChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Discrepancy Breakdown" subtitle="By ECG category this month">
        <div className="chart tall"><ResponsiveContainer><BarChart data={discrepancyData} layout="vertical" margin={{ top: 8, right: 18, left: 16, bottom: 0 }}><CartesianGrid stroke={gridStyle} strokeDasharray="4 4" horizontal={false}/><XAxis type="number" domain={[0,20]} tick={tickStyle} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={92} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="#EF4444" radius={[0,4,4,0]} barSize={10}/></BarChart></ResponsiveContainer></div>
      </Panel>
    </div>
    <RecentTable rows={cases.slice(0,6)}/>
  </>;
}

function RecentTable({ rows, showDepartment = false }: { rows: Case[]; showDepartment?: boolean }) {
  return <Panel title={showDepartment ? "All ECG Cases" : "Recent Cases"} action={!showDepartment && <Link className="text-link" to="/cases">View all →</Link>} className="table-panel">
    <div className="table-wrap"><table><thead><tr><th>Patient ID</th><th>Clinician Diagnosis</th><th>AI Diagnosis</th>{showDepartment && <th>Department</th>}<th>Status</th><th>Priority</th><th>Time</th></tr></thead>
      <tbody>{rows.map((c) => <tr key={c.id}><td><Link className="id-link" to={`/cases/${c.patientId}`}>{c.patientId}</Link></td><td>{c.clinicianDx}</td><td>{c.aiDx}</td>{showDepartment && <td>{c.department}</td>}<td><StatusPill verdict={c.verdict}/></td><td><PriorityBadge priority={c.priority}/></td><td>{c.elapsed}</td></tr>)}</tbody></table></div>
  </Panel>;
}

function CasesPage({ openUpload }: { openUpload: () => void }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");
  const filtered = useMemo(() => cases.filter((c) => (!search || `${c.patientId} ${c.clinicianDx} ${c.aiDx}`.toLowerCase().includes(search.toLowerCase())) && (department === "All Departments" || c.department === department) && (status === "All Statuses" || c.verdict === status)), [search, department, status]);
  return <>
    <PageHeader title="ECG Cases" subtitle="Anonymized cases across WRHN Cardiac Services" actions={<><button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button><button className="button secondary"><Filter size={15}/>Filter</button></>}/>
    <div className="filter-bar card"><label><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient ID or diagnosis" aria-label="Search cases"/></label><select value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Filter by department"><option>All Departments</option>{["Emergency","Cardiology","ICU","Internal Medicine","Surgery"].map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option>All Statuses</option><option value="concordant">Concordant</option><option value="minor">Minor discrepancy</option><option value="major">Major discrepancy</option></select><span>{filtered.length} cases</span></div>
    <RecentTable rows={filtered} showDepartment/>
  </>;
}

function EcgStrip({ lead, phase }: { lead: string; phase: number }) {
  const segments = Array.from({ length: 4 }, (_, i) => {
    const x = i * 82 + phase;
    return `${x},36 ${x+12},36 ${x+17},34 ${x+21},25 ${x+25},37 ${x+29},42 ${x+34},36 ${x+40},36 ${x+43},4 ${x+48},48 ${x+54},34 ${x+65},20 ${x+75},36 ${x+82},36`;
  }).join(" ");
  return <div className="ecg-strip"><span>{lead}</span><svg viewBox="0 0 330 55" preserveAspectRatio="none" aria-label={`ECG lead ${lead}`}><polyline points={segments} fill="none" stroke="#35E06B" strokeWidth="1.8" vectorEffect="non-scaling-stroke"/></svg></div>;
}

function EcgViewer() {
  return <Panel title="12-Lead ECG Viewer" action={<span className="mono muted">Dec 18, 2024 · 09:42 · 25mm/s</span>} className="ecg-card">
    <div className="ecg-viewer"><div className="ecg-meta"><b>12-LEAD ECG</b><span>ANONYMIZED · 25mm/s · 10mm/mV</span></div><div className="lead-grid">{["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"].map((lead,i)=><EcgStrip key={lead} lead={lead} phase={i%3*4}/>)}</div></div>
  </Panel>;
}

function CaseDetail() {
  const location = useLocation();
  const patientId = decodeURIComponent(location.pathname.split("/").pop() || "PT-20839");
  const selected = cases.find((c) => c.patientId === patientId) ?? cases[0];
  const seededReviewed = patientId === "PT-20839";
  const [revealed, setRevealed] = useState(seededReviewed);
  const [confidence, setConfidence] = useState(70);
  const [dx, setDx] = useState("Atrial Fibrillation");
  const [note, setNote] = useState("");
  const ai = aiPredictions["PT-20839"];
  return <>
    <div className="detail-title"><div className="breadcrumbs"><Link to="/cases">ECG Cases</Link><span>›</span><b>{selected.patientId}</b><PriorityBadge priority={selected.priority}/><span className="major-alert"><AlertTriangle size={16}/>Major Discrepancy — Review Required</span></div><div><button className="button primary"><Sparkles size={15}/>Send to Expert Review</button><button className="button secondary"><MoreHorizontal size={16}/>More</button></div></div>
    <div className="detail-grid">
      <div><EcgViewer/><Panel title="Patient Information" action={<span className="anonymized"><ShieldCheck size={14}/>Anonymized</span>}><div className="patient-grid">{[["Patient ID",selected.patientId],["Age",`${selected.age} years`],["Sex",selected.sex],["Department",selected.department],["Ordering Physician",selected.orderingPhysician],["HR at Acquisition",`${selected.hrAtAcquisition} bpm`],["Chief Complaint",selected.chiefComplaint],["BP",selected.bp],["Encounter",selected.encounter]].map(([k,v])=><div key={k}><span>{k}</span><strong className={k==="Patient ID"||k==="Encounter"?"mono":""}>{v}</strong></div>)}</div></Panel></div>
      <aside className="interpretations">
        <Panel title="Clinician Interpretation" action={<span className="muted">Dr. A. Nkemdirim</span>}>
          {!revealed ? <form className="read-form" onSubmit={(e)=>{e.preventDefault();setRevealed(true)}}><div className="guardrail"><ShieldCheck size={17}/><span><strong>Your read comes first.</strong> AI remains hidden until submission to protect independent clinical judgment.</span></div><label>Primary diagnosis<select value={dx} onChange={e=>setDx(e.target.value)}><option>Atrial Fibrillation</option><option>Atrial Flutter</option><option>Sinus Tachycardia</option><option>Normal Sinus Rhythm</option><option>STEMI</option></select></label><label>Confidence <b>{confidence}%</b><input type="range" min="0" max="100" value={confidence} onChange={e=>setConfidence(Number(e.target.value))}/></label><label>Clinical rationale<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Document findings and reasoning"/></label><button className="button primary full" type="submit">Submit independent interpretation</button></form> : <InterpretationContent title={dx} findings={["Irregularly irregular rhythm","Absent P waves","Ventricular rate ~148 bpm","No delta waves identified"]} note={note || "\"Rapid ventricular response with AF, likely new onset.\""} />}
        </Panel>
        <Panel title="AI Interpretation" action={<span className="model-chip">Model v2.4 · 99ms</span>} className={!revealed ? "ai-locked" : ""}>
          {!revealed ? <div className="locked-content"><BrainCircuit size={28}/><strong>AI second read is sealed</strong><p>Submit your interpretation to reveal the simulated decision-support result.</p></div> : <><div className="simulated"><BrainCircuit size={13}/>Simulated prototype output</div><div className="ai-dx-row"><div><span className="eyebrow">PRIMARY DIAGNOSIS</span><h3>{ai.primaryDx}</h3></div><div className="confidence"><span>CONFIDENCE</span><div><i style={{width:`${ai.confidence}%`}}/><b>{ai.confidence}%</b></div></div></div><ul className="findings">{ai.findings.map(x=><li key={x}>{x}</li>)}</ul><p className="explainer">{ai.explanation}</p><p className="decision-note"><ShieldCheck size={14}/>AI is a second reader. Clinicians can override every output.</p></>}
        </Panel>
      </aside>
    </div>
  </>;
}

function InterpretationContent({ title, findings, note }: { title: string; findings: string[]; note: string }) {
  return <><span className="eyebrow">PRIMARY DIAGNOSIS</span><h3>{title}</h3><ul className="findings">{findings.map(x=><li key={x}>{x}</li>)}</ul><p className="quote-note">{note}</p></>;
}

function ReviewPage() {
  const navigate = useNavigate();
  const columns = [
    { key: "waiting", title: "WAITING", tone: "amber", items: cases.slice(0,4) },
    { key: "review", title: "UNDER REVIEW", tone: "blue", items: cases.slice(4,7) },
    { key: "complete", title: "COMPLETED", tone: "green", items: cases.slice(7,11) },
  ];
  return <>
    <PageHeader title="Review Queue" subtitle="Expert cardiology review board" actions={<select aria-label="Department filter"><option>All Departments</option><option>Emergency</option><option>Cardiology</option></select>}/>
    <div className="kanban">{columns.map(col=><section key={col.key} className="kanban-col"><header className={col.tone}><span>{col.title}</span><b>{col.items.length}</b></header>{col.items.map((c,i)=><button key={c.id} className="case-card" onClick={()=>navigate(`/cases/${c.patientId}`)}><div><span className="id-link">{c.patientId}</span><PriorityBadge priority={c.priority}/></div><p>Clinician: <strong>{c.clinicianDx}</strong></p><p>AI: <strong className="blue-text">{c.aiDx}</strong></p>{col.key==="complete"&&<p className="final">Final: {i%2?c.aiDx:c.clinicianDx}<CheckCircle2 size={15}/></p>}<footer><span><Clock3 size={14}/>{c.elapsed}</span>{col.key==="review"&&<b>{i%2?"Dr. Patel":"Dr. Chen"}</b>}</footer></button>)}</section>)}</div>
  </>;
}

function LearningPage() {
  const radar = [{name:"Arrhythmia",you:88,dept:84},{name:"Ischemia",you:78,dept:79},{name:"Conduction",you:94,dept:86},{name:"ST Changes",you:82,dept:80},{name:"Normal",you:96,dept:91},{name:"Axis Dev.",you:85,dept:82}];
  return <>
    <PageHeader title="Learning Dashboard" subtitle="Dr. Adaeze Nkemdirim · Private · Updated daily" actions={<span className="success-badge">↗ Concordance improved 12% this quarter</span>}/>
    <div className="celebration"><Award size={35}/><div><strong>Outstanding Progress, Dr. Nkemdirim!</strong><p>You have reviewed 47 cases this month and achieved your highest-ever concordance rate of 88%. You are in the top 20% of your department.</p></div></div>
    <div className="kpi-grid"><KpiCard icon={CheckCircle2} tone="green" value="88%" label="Concordance Rate" delta="↗ 12%" note="↑ 12% from last quarter"/><KpiCard icon={Sparkles} tone="blue" value="+4.2 pts" label="Monthly Improvement" delta="↗ 14%" note="Strongest in Conduction"/><KpiCard icon={ClipboardList} tone="purple" value="47" label="Cases Reviewed" delta="↗ 8%" note="This month · 312 lifetime"/><KpiCard icon={Star} tone="amber" value="18 days" label="Learning Streak" delta="↗ 0%" note="Keep going!"/></div>
    <div className="learning-charts">
      <Panel title="Performance by ECG Type" subtitle="Your accuracy vs. department average"><div className="chart radar"><ResponsiveContainer><RadarChart data={radar} outerRadius="72%"><PolarGrid stroke={gridStyle}/><PolarAngleAxis dataKey="name" tick={tickStyle}/><Radar name="You" dataKey="you" stroke={chartBlue} fill={chartBlue} fillOpacity={.25}/><Radar name="Dept. Avg." dataKey="dept" stroke="#94A3B8" fill="#CBD5E1" fillOpacity={.15} strokeDasharray="4 3"/><Legend/></RadarChart></ResponsiveContainer></div></Panel>
      <Panel title="Personal Concordance Trend" subtitle="Your improvement over the last 6 months"><div className="chart radar"><ResponsiveContainer><AreaChart data={personalTrend} margin={{top:10,right:12,left:-12,bottom:0}}><defs><linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={green} stopOpacity=".2"/><stop offset="1" stopColor={green} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false}/><YAxis domain={[70,95]} ticks={[70,77,84,95]} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={green} strokeWidth={2.5} fill="url(#greenFade)" dot={{r:4,fill:"#fff",stroke:green,strokeWidth:2}}/></AreaChart></ResponsiveContainer></div></Panel>
    </div>
    <Panel title="Recent Learning Cases" subtitle="Cases with expert feedback to help you grow" className="learning-list">{learningCases.map(c=><article className="learning-row" key={c.caseId}><div className="learning-meta"><b className="id-link">{c.caseId}</b><span className="category">{c.category}</span><span>Reviewed {c.reviewedAt}</span></div><div className="dx-compare"><span>Your Dx: <b>{c.yourDx}</b></span><span>Expert Final Dx: <b>{c.expertFinalDx}</b></span></div><p className="takeaway"><BookOpen size={16}/><strong>Key Takeaway:</strong>{c.keyTakeaway}</p></article>)}</Panel>
  </>;
}

function AnalyticsPage() {
  const dept = [{name:"Cardiology",a:94,m:4,x:2},{name:"Emergency",a:82,m:11,x:7},{name:"ICU",a:88,m:8,x:4},{name:"Internal Med.",a:78,m:14,x:8},{name:"Surgery",a:85,m:10,x:5}];
  const dist = [{name:"Normal Sinus",value:31,color:"#2563EB"},{name:"Arrhythmia",value:22,color:"#16A34A"},{name:"Conduction Block",value:17,color:"#D97706"},{name:"Ischemia/MI",value:14,color:"#DC2626"},{name:"Other",value:16,color:"#7C3AED"}];
  const volume = personalTrend.map((x,i)=>({month:x.month,volume:245+i*18,discrepancies:17-i}));
  return <>
    <PageHeader title="Analytics" subtitle="Hospital-wide aggregate metrics · No individual physician data" actions={<><select><option>Last 6 Months</option><option>Last 12 Months</option></select><button className="button secondary"><Filter size={15}/>Export</button></>}/>
    <div className="privacy-banner"><ShieldCheck size={16}/>Aggregate quality-improvement reporting only. No individual clinician performance is shown.</div>
    <div className="kpi-grid"><KpiCard icon={CheckCircle2} tone="green" value="88.1%" label="Overall Agreement Rate" delta="↗ 3.4%" note="All departments combined"/><KpiCard icon={AlertTriangle} tone="amber" value="4.8%" label="Significant Discrepancies" delta="↓ 1.2%" note="↓ 1.2 pts from last period"/><KpiCard icon={Clock3} tone="blue" value="23 min" label="Avg. Review Turnaround" delta="↗ 18%" note="Target: ≤30 min"/><KpiCard icon={Activity} tone="purple" value="1,847" label="Total ECGs Reviewed" delta="↗ 6%" note="This reporting period"/></div>
    <div className="analytics-grid">
      <Panel title="Department Performance Heatmap" subtitle="Agreement, minor, and major discrepancy rates"><div className="chart heatmap"><ResponsiveContainer><BarChart data={dept} layout="vertical" margin={{top:8,right:18,left:12,bottom:0}}><XAxis hide type="number" domain={[0,100]}/><YAxis type="category" dataKey="name" width={94} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Legend/><Bar name="Agreement" dataKey="a" stackId="x" fill="#00C853" radius={[6,0,0,6]}/><Bar name="Minor Diff." dataKey="m" stackId="x" fill="#FFB800"/><Bar name="Major Diff." dataKey="x" stackId="x" fill="#FF3547" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="Diagnosis Distribution" subtitle="All ECGs this period"><div className="donut-wrap"><div className="chart donut"><ResponsiveContainer><PieChart><Pie data={dist} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={2}>{dist.map(d=><Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="donut-legend">{dist.map(d=><div key={d.name}><span><i style={{background:d.color}}/>{d.name}</span><b>{d.value}%</b></div>)}</div></div></Panel>
      <Panel title="Monthly Volume & Discrepancy Trends" subtitle="ECG case volume and discrepancy count over time" className="analytics-wide"><div className="chart tall"><ResponsiveContainer><ComposedChart data={volume} margin={{top:10,right:20,left:-4,bottom:0}}><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} axisLine={false}/><YAxis yAxisId="left" tick={tickStyle} axisLine={false}/><YAxis yAxisId="right" orientation="right" tick={tickStyle} axisLine={false}/><Tooltip/><Legend/><Bar yAxisId="left" dataKey="volume" name="ECG Volume" fill="#CFE0FF" radius={[5,5,0,0]}/><Line yAxisId="right" type="monotone" dataKey="discrepancies" name="Discrepancies" stroke={red} strokeWidth={2.5}/></ComposedChart></ResponsiveContainer></div></Panel>
    </div>
  </>;
}

function SettingsPage() {
  const [daily, setDaily] = useState(true);
  const [critical, setCritical] = useState(true);
  return <>
    <PageHeader title="Settings" subtitle="Profile, notifications, model information, and privacy"/>
    <div className="settings-grid">
      <Panel title="Profile"><div className="profile-row"><span className="avatar large">AN</span><div><h3>Dr. Adaeze Nkemdirim</h3><p>Emergency Medicine · WRHN</p><span className="anonymized"><ShieldCheck size={14}/>Clinician account</span></div></div><div className="settings-fields"><label>Department<select><option>Emergency Medicine</option><option>Cardiology</option></select></label><label>Display name<input defaultValue="Dr. A. Nkemdirim"/></label></div><button className="button primary">Save profile</button></Panel>
      <Panel title="Notifications" subtitle="Choose which quality-improvement updates you receive"><label className="switch-row"><span><strong>Critical review alerts</strong><small>Notify me when a high-priority disagreement is assigned.</small></span><input type="checkbox" checked={critical} onChange={e=>setCritical(e.target.checked)}/></label><label className="switch-row"><span><strong>Daily learning summary</strong><small>Private recap of feedback and learning cases.</small></span><input type="checkbox" checked={daily} onChange={e=>setDaily(e.target.checked)}/></label></Panel>
      <Panel title="AI Model Information"><div className="model-status"><span className="online"><i/>AI Model Online</span><b className="mono">ECG-QI Ensemble v2.4</b></div><div className="info-list"><div><span>Mode</span><b>Simulated prototype</b></div><div><span>Role</span><b>Decision-support second reader</b></div><div><span>Clinician override</span><b>Always enabled</b></div><div><span>Typical latency</span><b className="mono">99 ms</b></div></div></Panel>
      <Panel title="Data & Privacy"><div className="privacy-card"><ShieldCheck size={28}/><div><strong>Quality improvement and education only</strong><p>All prototype patient data is anonymized or synthetic. AI outputs are not autonomous diagnoses. Personal learning results remain private, while analytics use hospital-wide aggregates with no individual physician data.</p></div></div></Panel>
    </div>
  </>;
}

export default function EcgQiApp({ initialPath = "/" }: { initialPath?: string }) {
  if (typeof window === "undefined") {
    return <MemoryRouter initialEntries={[initialPath]}><Shell/></MemoryRouter>;
  }
  return <BrowserRouter><Shell/></BrowserRouter>;
}
