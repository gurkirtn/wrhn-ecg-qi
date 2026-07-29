"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, Award, BarChart3, Bell, BookOpen, BrainCircuit, Check,
  CheckCircle2, ChevronDown, ClipboardList, Clock3, Filter, GraduationCap, HeartPulse,
  LayoutDashboard, LogOut, Menu, MoreHorizontal, Search, Settings, ShieldCheck, Sparkles, Star,
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

type WorkspaceRole = "clinician" | "expert";
type MockAccount = {
  id: "clinician" | "expert" | "dual";
  name: string;
  initials: string;
  email: string;
  title: string;
  roles: WorkspaceRole[];
};
type ClinicianReviewSubmission = {
  id: string;
  ownerId: MockAccount["id"];
  caseItem: Case;
  status: "awaiting" | "reviewed";
  submittedAt: string;
  reviewedAt?: string;
  expertName?: string;
  finalDx?: string;
  takeaway?: string;
};

const clinicianNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "ECG Cases", icon: HeartPulse },
  { href: "/my-reviews", label: "My Expert Reviews", icon: ClipboardList },
  { href: "/learning", label: "Learning Dashboard", icon: GraduationCap },
  { href: "/settings", label: "Settings", icon: Settings },
];

const expertNav = [
  { href: "/", label: "Expert Overview", icon: LayoutDashboard },
  { href: "/review", label: "Review Queue", icon: ClipboardList, badge: 19 },
  { href: "/cases", label: "ECG Cases", icon: HeartPulse },
  { href: "/analytics", label: "QI Analytics", icon: BarChart3, section: "REPORTS" },
  { href: "/settings", label: "Settings", icon: Settings },
];

const chartBlue = "#2563EB";
const green = "#16A34A";
const amber = "#D97706";
const red = "#DC2626";
const mockAccounts: MockAccount[] = [
  { id: "clinician", name: "Dr. Elena Rossi", initials: "ER", email: "clinician@wrhn.demo", title: "Emergency Medicine", roles: ["clinician"] },
  { id: "expert", name: "Dr. Maya Chen", initials: "MC", email: "expert@wrhn.demo", title: "Cardiology Expert", roles: ["expert"] },
  { id: "dual", name: "Dr. A. Nkemdirim", initials: "AN", email: "adaeze@wrhn.demo", title: "Emergency Medicine · Expert Reviewer", roles: ["clinician", "expert"] },
];
const mockEscalatedCase: Case = {
  ...cases[19],
  id: "case-wrhn-00482",
  patientId: "WRHN-00482",
  priority: "high",
  status: "waiting",
  clinicianDx: "Sinus Tachycardia",
  aiDx: "Atrial Flutter with 2:1 Conduction",
  verdict: "major",
  elapsed: "Just now",
};
const seededClinicianSubmissions: ClinicianReviewSubmission[] = [
  { id: "submission-wrhn-00482", ownerId: "dual", caseItem: mockEscalatedCase, status: "awaiting", submittedAt: "Today · 10:04" },
  { id: "submission-pt-20710", ownerId: "dual", caseItem: { ...cases[2], id: "case-pt-20710", patientId: "PT-20710", clinicianDx: "Sinus Tachycardia", aiDx: "Atrial Flutter", priority: "high" }, status: "reviewed", submittedAt: "Dec 18 · 09:14", reviewedAt: "Dec 18 · 10:02", expertName: "Dr. Maya Chen", finalDx: "Atrial Flutter", takeaway: "Flutter waves at 300 bpm with 2:1 block can mimic sinus tachycardia — inspect V1 and inferior leads carefully." },
  { id: "submission-pt-20901", ownerId: "clinician", caseItem: { ...cases[4], id: "case-pt-20901", patientId: "PT-20901", clinicianDx: "STEMI", aiDx: "STEMI with LVH", priority: "critical" }, status: "awaiting", submittedAt: "Today · 09:41" },
  { id: "submission-pt-20877", ownerId: "clinician", caseItem: { ...cases[10], id: "case-pt-20877", patientId: "PT-20877", clinicianDx: "Normal Sinus Rhythm", aiDx: "Posterior MI", priority: "high" }, status: "reviewed", submittedAt: "Yesterday · 15:20", reviewedAt: "Yesterday · 15:48", expertName: "Dr. Samir Patel", finalDx: "Posterior MI", takeaway: "Reciprocal ST depression in V1–V3 with tall R waves should prompt posterior-lead assessment." },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup">
      <span className="logo-mark"><Activity size={21} strokeWidth={2.4} /></span>
      {!compact && <span><strong>WRHN</strong><small>ECG Quality Improvement</small></span>}
    </div>
  );
}

function MockLogin({ onLogin }: { onLogin: (account: MockAccount) => void }) {
  return <main className="mock-login">
    <section className="login-card" aria-labelledby="login-title">
      <header><Logo/><span>WRHN Cardiac Services</span></header>
      <div className="login-intro"><span className="login-icon"><ShieldCheck size={24}/></span><div><p>ECG QUALITY IMPROVEMENT</p><h1 id="login-title">Choose a demo account</h1><span>Select a role-based account to enter the prototype workspace.</span></div></div>
      <div className="account-options">
        {mockAccounts.map(account => <button key={account.id} onClick={() => onLogin(account)} className={account.id === "dual" ? "featured" : ""}>
          <span className="avatar">{account.initials}</span>
          <span className="account-copy"><strong>{account.name}</strong><small>{account.email}</small><span className="account-roles">{account.roles.map(role => <i key={role}>{role === "expert" ? "Expert reviewer" : "Clinician"}</i>)}</span></span>
          <span className="account-action">{account.id === "dual" && <b>Current demo</b>}Sign in →</span>
        </button>)}
      </div>
      <footer><ShieldCheck size={15}/><span><strong>Prototype sign-in</strong> · Synthetic accounts only. No credentials or patient data are stored.</span></footer>
    </section>
  </main>;
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [account, setAccount] = useState<MockAccount | null>(null);
  const [role, setRole] = useState<WorkspaceRole>("clinician");
  const [reviewSubmissions, setReviewSubmissions] = useState<ClinicianReviewSubmission[]>(seededClinicianSubmissions);
  if (!account) return <MockLogin onLogin={nextAccount => { setAccount(nextAccount); setRole(nextAccount.roles[0]); navigate("/"); }}/>;
  const myReviewSubmissions = reviewSubmissions.filter(item => item.ownerId === account.id);
  const addExpertSubmission = (caseItem: Case) => setReviewSubmissions(items => items.some(item => item.ownerId === account.id && item.caseItem.id === caseItem.id) ? items : [{ id: `submission-${account.id}-${caseItem.id}`, ownerId: account.id, caseItem, status: "awaiting", submittedAt: "Just now" }, ...items]);
  const completeExpertSubmission = (caseId: string, finalDx: string, takeaway: string) => setReviewSubmissions(items => items.map(item => item.caseItem.id === caseId ? { ...item, status: "reviewed", reviewedAt: "Just now", expertName: account.name, finalDx, takeaway } : item));
  const activeNav = role === "expert" ? expertNav : clinicianNav;
  const switchRole = (nextRole: WorkspaceRole) => {
    setRole(nextRole);
    setUploadOpen(false);
    setMobile(false);
    navigate("/");
  };
  return (
    <div className={`app-shell role-${role}`}>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="side-brand"><Logo /><span className="product-chip">ECG-QI</span><button className="mobile-close" onClick={() => setMobile(false)} aria-label="Close navigation"><X size={18}/></button></div>
        <nav aria-label="Main navigation">
          <p className="nav-kicker">{role === "expert" ? "EXPERT WORKSPACE" : "CLINICIAN WORKSPACE"}</p>
          {activeNav.map((item) => (
            <div key={item.href}>
              {item.section && <p className="nav-kicker reports">{item.section}</p>}
              <Link onClick={() => setMobile(false)} className={`nav-item ${location.pathname === item.href || (item.href === "/cases" && location.pathname.startsWith("/cases")) ? "active" : ""}`} to={item.href}>
                <item.icon size={18}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}
              </Link>
            </div>
          ))}
        </nav>
        <div className="side-note"><ShieldCheck size={16}/><span><strong>{role === "expert" ? "Expert adjudication" : "Clinical QI workspace"}</strong><small>{role === "expert" ? "Cardiology review access" : "De-identified data only"}</small></span></div>
        {role === "clinician" && <button onClick={() => setUploadOpen(true)} className="button primary upload-side"><Upload size={16}/>Upload ECG</button>}
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
            <label className={`role-switcher ${account.roles.length === 1 ? "single-role" : ""}`}><UserRound size={16}/><span className="sr-only">Active workspace</span><select aria-label="Active workspace" value={role} onChange={event=>switchRole(event.target.value as WorkspaceRole)}>{account.roles.includes("clinician") && <option value="clinician">Clinician</option>}{account.roles.includes("expert") && <option value="expert">Expert reviewer</option>}</select></label>
            <span className="online"><i/>AI Model Online</span>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={19}/><i/></button>
            <div className="user-menu"><span className="avatar">{account.initials}</span><span><strong>{account.name}</strong><small>{role === "expert" ? "Expert Reviewer · WRHN" : `${account.title.split(" · ")[0]} · WRHN`}</small></span></div>
            <button className="icon-button logout-button" aria-label="Sign out" title="Sign out" onClick={() => { setAccount(null); setUploadOpen(false); setMobile(false); navigate("/"); }}><LogOut size={18}/></button>
          </div>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={role === "expert" ? <ExpertDashboard/> : <Dashboard submissions={myReviewSubmissions} openUpload={() => setUploadOpen(true)}/>}/>
            <Route path="/cases" element={<CasesPage openUpload={() => setUploadOpen(true)} canUpload={role === "clinician"}/>}/>
            <Route path="/cases/:id" element={<CaseDetail/>}/>
            <Route path="/review" element={role === "expert" ? <ReviewPage submissions={reviewSubmissions} onReviewCompleted={completeExpertSubmission}/> : <Navigate to="/" replace/>}/>
            <Route path="/my-reviews" element={role === "clinician" ? <MyExpertReviews submissions={myReviewSubmissions}/> : <Navigate to="/" replace/>}/>
            <Route path="/learning" element={role === "clinician" ? <LearningPage/> : <Navigate to="/" replace/>}/>
            <Route path="/analytics" element={role === "expert" ? <AnalyticsPage/> : <Navigate to="/" replace/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </main>
      </div>
      {role === "clinician" && uploadOpen && <UploadWorkflow accountName={account.name} onExpertSubmit={addExpertSubmission} onClose={() => setUploadOpen(false)}/>}
    </div>
  );
}

function UploadWorkflow({ onClose, onExpertSubmit, accountName }: { onClose: () => void; onExpertSubmit: (caseItem: Case) => void; accountName: string }) {
  const navigate = useNavigate();
  const [mockSeed, setMockSeed] = useState(0);
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
    if (choice === "expert") onExpertSubmit({ ...mockEscalatedCase, clinicianDx: diagnosis });
    setStep(5);
  };
  const loadRandomMockEcg = () => {
    const nextSeed = Math.floor(Math.random() * 4);
    setMockSeed(nextSeed);
    setFileName(`mock-ecg-placeholder-0${nextSeed + 1}.png`);
  };
  return <div className="workflow-backdrop" role="presentation">
    <section className="upload-workflow" role="dialog" aria-modal="true" aria-labelledby="upload-workflow-title">
      <header className="workflow-header"><span className="workflow-icon"><Upload size={20}/></span><div><h2 id="upload-workflow-title">Upload ECG — New Case Workflow</h2><p>WRHN Cardiac Services · {accountName}</p></div><button onClick={onClose} aria-label="Close upload workflow"><X size={20}/></button></header>
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
            <div><h3>ECG File Upload</h3><button type="button" className={`dropzone mock-dropzone ${fileName ? "has-file" : ""}`} onClick={loadRandomMockEcg}>{fileName ? <><div className="mock-ecg-preview"><EcgStrip lead={`MOCK ${mockSeed + 1}`} phase={mockSeed * 4}/></div><strong>{fileName}</strong><span>Random anonymized placeholder ready for the mock model</span></> : <><Upload size={34}/><strong>Click to upload ECG</strong><span>A random anonymized ECG placeholder will be loaded</span></>}</button><div className="mock-mode-note"><BrainCircuit size={14}/>Prototype mode · no patient file is uploaded</div>{fileName && <button className="demo-file" onClick={loadRandomMockEcg}>↻ Load a different random ECG</button>}</div>
          </div>
        </div>}
        {step === 2 && <div className="clinician-step">
          <div className="workflow-section-title"><span className="soft-icon"><Stethoscope size={20}/></span><div><h3>Clinician Interpretation</h3><p>Dr. A. Nkemdirim · Emergency Medicine · Dec 18, 2024 10:02</p></div><span className="anonymized mono">WRHN-00482</span></div>
          <WorkflowEcg compact seed={mockSeed}/>
          <div className="clinician-form-grid"><div><label>Primary Diagnosis *<select value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}><option>Sinus Tachycardia</option><option>Atrial Fibrillation</option><option>Atrial Flutter</option><option>Normal Sinus Rhythm</option><option>STEMI</option></select></label><div className="form-pair"><label>Rhythm<select defaultValue="Regular"><option>Regular</option><option>Irregular</option><option>Irregularly irregular</option></select></label><label>Ventricular Rate<div className="suffix-input"><input defaultValue="148"/><span>bpm</span></div></label></div><label>Clinical Confidence: <b>{confidence}%</b><input type="range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))}/><div className="range-labels"><span>Uncertain</span><span>Confident</span></div></label></div><div><label>Key Findings<textarea defaultValue="Rapid ventricular rate. No obvious P wave abnormalities. QRS complexes appear narrow and regular. No ST segment changes noted."/></label><label>Clinical Notes<textarea defaultValue="Patient presented with acute palpitations. Vitals stable. ECG ordered on arrival to ED."/></label></div></div>
          <div className="independence-note"><ShieldCheck size={16}/>Your interpretation is recorded before the AI second read is revealed.</div>
        </div>}
        {step === 3 && <div className="processing-step"><span className="processing-ring"><BrainCircuit size={32}/></span><h3>AI Processing ECG...</h3><p>ECG-AI v2.4 · WRHN-00482 · Simulated prototype analysis</p><div className="processing-list">{stages.map(([title, text], index) => <div className={`${index < processIndex ? "done" : ""} ${index === processIndex ? "running" : ""}`} key={title}><span>{index < processIndex ? <Check size={17}/> : index + 1}</span><div><strong>{title}</strong><small>{text}</small></div><b>{index < processIndex ? "Done" : index === processIndex ? "Running" : ""}</b></div>)}</div><p className="decision-note centered"><ShieldCheck size={14}/>This simulated AI output is decision support, not a diagnosis.</p></div>}
        {step === 4 && <div className="comparison-step">
          <div className="discrepancy-alert"><AlertTriangle size={22}/><div><strong>Major Discrepancy — High Priority</strong><p>Clinician: <b>{diagnosis}</b> · AI: <b>Atrial Flutter with 2:1 Conduction</b> · AI Confidence: <b>91%</b></p></div><PriorityBadge priority="high"/></div>
          <div className="case-summary">{[["Patient ID","WRHN-00482"],["Age Range","65-74"],["Sex","Male"],["Department","Emergency"],["ECG Acquired","Dec 18, 2024 · 09:42"],["Reason","Palpitations, lightheadedness"]].map(([label,value]) => <div key={label}><span>{label}</span><b className={label==="Patient ID"?"mono id-link":""}>{value}</b></div>)}</div>
          <p className="waveform-caption"><Activity size={16}/>ECG Waveform — simulated flutter pattern highlighted</p><WorkflowEcg seed={mockSeed}/>
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
        {step === 5 && <><button className="button ghost" onClick={onClose}>Close</button><button className="button primary" onClick={() => { onClose(); navigate(outcome === "expert" ? "/my-reviews" : "/cases/PT-20839"); }}>{outcome === "expert" ? "Track My Review" : "View Case"} →</button></>}
      </footer>
    </section>
  </div>;
}

function WorkflowEcg({ compact = false, seed = 0 }: { compact?: boolean; seed?: number }) {
  const leads = compact ? ["I","II","V1","V5"] : ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
  return <div className={`workflow-ecg ${compact ? "compact" : ""}`}><div className="ecg-meta"><b>12-LEAD ECG{compact ? "" : " — FLUTTER PATTERN DETECTED"}</b><span>ANONYMIZED · MOCK {seed + 1} · 25mm/s · 10mm/mV</span></div><div>{leads.map((lead,index) => <EcgStrip key={lead} lead={lead} phase={seed * 3 + index%3*4}/>)}</div></div>;
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

const tickStyle = { fontSize: 11, fill: "#94A3B8" };
const gridStyle = "#26364D";

function Dashboard({ openUpload, submissions }: { openUpload: () => void; submissions: ClinicianReviewSubmission[] }) {
  const awaitingReviews = submissions.filter(item => item.status === "awaiting");
  const completedReviews = submissions.filter(item => item.status === "reviewed");
  return <>
    <PageHeader title="Dashboard" subtitle="Wednesday, December 18, 2024 · WRHN Cardiac Services" actions={<><span className="updated"><Clock3 size={14}/>Updated 2 min ago</span><button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button></>}/>
    <div className="kpi-grid">
      <KpiCard icon={Activity} tone="blue" value="143" label="ECGs Today" delta="↗ 9%" note="↑ 12 from yesterday"/>
      <KpiCard icon={Zap} tone="green" value="88.1%" label="AI Agreement Rate" delta="↗ 2.3%" note="3-month rolling average"/>
      <KpiCard icon={ClipboardList} tone="amber" value={String(awaitingReviews.length)} label="My Awaiting Reviews" delta="Personal" note="Expert-adjudication submissions"/>
      <KpiCard icon={CheckCircle2} tone="purple" value={String(completedReviews.length)} label="My Reviews Ready" delta="Feedback" note="Expert feedback available"/>
    </div>
    <div className="dashboard-charts">
      <Panel title="Concordance Rate — 12 Month Trend" subtitle="AI vs. Clinician agreement, rolling monthly" action={<span className="success-badge">+8.9 pts YTD</span>}>
        <div className="chart tall"><ResponsiveContainer><AreaChart data={trend12} margin={{ top: 8, right: 12, bottom: 0, left: -15 }}><defs><linearGradient id="blueFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chartBlue} stopOpacity=".28"/><stop offset="1" stopColor={chartBlue} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} tickLine={false} axisLine={false}/><YAxis domain={[78,92]} ticks={[78,82,86,92]} tick={tickStyle} tickLine={false} axisLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={chartBlue} strokeWidth={2.5} fill="url(#blueFade)" dot={{ r: 3.5, fill: "#0F1B2D", strokeWidth: 2 }}/></AreaChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Discrepancy Breakdown" subtitle="By ECG category this month">
        <div className="chart tall"><ResponsiveContainer><BarChart data={discrepancyData} layout="vertical" margin={{ top: 8, right: 18, left: 16, bottom: 0 }}><CartesianGrid stroke={gridStyle} strokeDasharray="4 4" horizontal={false}/><XAxis type="number" domain={[0,20]} tick={tickStyle} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={92} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="#EF4444" radius={[0,4,4,0]} barSize={10}/></BarChart></ResponsiveContainer></div>
      </Panel>
    </div>
    <Panel title="Today’s Expert Review Workload" subtitle="Your personal submissions only" action={<Link className="text-link" to="/my-reviews">View all →</Link>}>
      <div className="clinician-today-workload">
        <Link to="/my-reviews"><span className="icon-chip amber"><Clock3 size={19}/></span><div><small>AWAITING EXPERT REVIEW</small><strong>{awaitingReviews.length}</strong><p>{awaitingReviews[0] ? `${awaitingReviews[0].caseItem.patientId} · ${awaitingReviews[0].caseItem.priority.toUpperCase()} priority` : "No pending submissions"}</p></div><b>Track →</b></Link>
        <Link to="/my-reviews"><span className="icon-chip green"><CheckCircle2 size={19}/></span><div><small>REVIEWED</small><strong>{completedReviews.length}</strong><p>{completedReviews[0] ? `${completedReviews[0].caseItem.patientId} · Feedback ready` : "No completed reviews yet"}</p></div><b>Open →</b></Link>
      </div>
    </Panel>
    <RecentTable rows={cases.slice(0,6)}/>
  </>;
}

function ExpertDashboard() {
  const priorityCases = [
    { ...cases[19], id:"case-wrhn-00482", patientId:"WRHN-00482", clinicianDx:"Sinus Tachycardia", aiDx:"Atrial Flutter with 2:1 Conduction", elapsed:"Just now", priority:"high" as const },
    ...cases.filter(item => item.verdict === "major").slice(0,4),
  ];
  return <>
    <PageHeader title="Expert Review Overview" subtitle="Cardiology adjudication workspace · High-priority discrepancies first" actions={<Link className="button primary" to="/review"><ClipboardList size={16}/>Open Review Queue</Link>}/>
    <div className="role-context-banner"><span><Stethoscope size={18}/></span><div><strong>Expert reviewer view</strong><p>Focused on discrepancy adjudication, clinical feedback, and hospital-wide quality improvement. Upload and private learning tools are hidden.</p></div></div>
    <div className="kpi-grid">
      <KpiCard icon={ClipboardList} tone="amber" value="19" label="Awaiting Expert Review" delta="5 new" note="Across all departments"/>
      <KpiCard icon={AlertTriangle} tone="red" value="6" label="High Priority" delta="2 urgent" note="Target response: ≤15 min"/>
      <KpiCard icon={Clock3} tone="blue" value="18 min" label="Median Turnaround" delta="↓ 12%" note="Within service target"/>
      <KpiCard icon={CheckCircle2} tone="green" value="42" label="Reviewed This Week" delta="↗ 8%" note="94% completed on time"/>
    </div>
    <div className="expert-dashboard-grid">
      <Panel title="Priority Review Queue" subtitle="Cases ordered by clinical risk and elapsed time" action={<Link className="text-link" to="/review">View board →</Link>}>
        <div className="expert-priority-list">{priorityCases.map((item,index)=><Link to="/review" key={item.id}><span className="queue-rank">{index + 1}</span><div><strong className="id-link">{item.patientId}</strong><p>{item.clinicianDx} <span>vs.</span> {item.aiDx}</p></div><PriorityBadge priority={item.priority}/><small><Clock3 size={13}/>{item.elapsed}</small></Link>)}</div>
      </Panel>
      <Panel title="Today’s Workload" subtitle="Expert review capacity by status">
        <div className="workload-summary">
          {[["Waiting",19,64,"amber"],["Under review",7,34,"blue"],["Completed",31,82,"green"]].map(([label,value,width,tone])=><div key={String(label)}><header><span>{label}</span><strong>{value}</strong></header><i><b className={String(tone)} style={{width:`${width}%`}}/></i></div>)}
        </div>
        <div className="expert-guardrail"><ShieldCheck size={18}/><div><strong>Clinical authority preserved</strong><p>Expert adjudications support quality improvement. Treating clinicians retain responsibility for patient care.</p></div></div>
      </Panel>
    </div>
  </>;
}

function RecentTable({ rows, showDepartment = false }: { rows: Case[]; showDepartment?: boolean }) {
  return <Panel title={showDepartment ? "All ECG Cases" : "Recent Cases"} action={!showDepartment && <Link className="text-link" to="/cases">View all →</Link>} className="table-panel">
    <div className="table-wrap"><table><thead><tr><th>Patient ID</th><th>Clinician Diagnosis</th><th>AI Diagnosis</th>{showDepartment && <th>Department</th>}<th>Status</th><th>Priority</th><th>Time</th></tr></thead>
      <tbody>{rows.map((c) => <tr key={c.id}><td><Link className="id-link" to={`/cases/${c.patientId}`}>{c.patientId}</Link></td><td>{c.clinicianDx}</td><td>{c.aiDx}</td>{showDepartment && <td>{c.department}</td>}<td><StatusPill verdict={c.verdict}/></td><td><PriorityBadge priority={c.priority}/></td><td>{c.elapsed}</td></tr>)}</tbody></table></div>
  </Panel>;
}

function CasesPage({ openUpload, canUpload }: { openUpload: () => void; canUpload: boolean }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");
  const filtered = useMemo(() => cases.filter((c) => (!search || `${c.patientId} ${c.clinicianDx} ${c.aiDx}`.toLowerCase().includes(search.toLowerCase())) && (department === "All Departments" || c.department === department) && (status === "All Statuses" || c.verdict === status)), [search, department, status]);
  return <>
    <PageHeader title="ECG Cases" subtitle="Anonymized cases across WRHN Cardiac Services" actions={<>{canUpload && <button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button>}<button className="button secondary"><Filter size={15}/>Filter</button></>}/>
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

function MyExpertReviews({ submissions }: { submissions: ClinicianReviewSubmission[] }) {
  const awaiting = submissions.filter(item => item.status === "awaiting");
  const reviewed = submissions.filter(item => item.status === "reviewed");
  const columns = [
    { key: "awaiting", title: "AWAITING EXPERT REVIEW", tone: "amber", items: awaiting },
    { key: "reviewed", title: "REVIEWED", tone: "green", items: reviewed },
  ];
  return <>
    <PageHeader title="My Expert Reviews" subtitle="Track only the ECG cases you personally submitted for expert adjudication" actions={<button className="button secondary"><Filter size={15}/>Filter</button>}/>
    <div className="clinician-review-summary">
      <article><span className="icon-chip amber"><Clock3 size={18}/></span><div><strong>{awaiting.length}</strong><small>Awaiting expert review</small></div></article>
      <article><span className="icon-chip green"><CheckCircle2 size={18}/></span><div><strong>{reviewed.length}</strong><small>Expert feedback ready</small></div></article>
      <p><ShieldCheck size={16}/>Private view · only your own submissions are shown</p>
    </div>
    <div className="kanban clinician-workload">{columns.map(column => <section className="kanban-col" key={column.key}>
      <header className={column.tone}><span>{column.title}</span><b>{column.items.length}</b></header>
      {column.items.length === 0 && <div className="empty-review-column"><CheckCircle2 size={25}/><strong>No cases here</strong><p>Your submitted cases will appear automatically.</p></div>}
      {column.items.map(submission => <article className="case-card clinician-review-card" key={submission.id}>
        <div><Link className="id-link" to={`/cases/${submission.caseItem.patientId}`}>{submission.caseItem.patientId}</Link><PriorityBadge priority={submission.caseItem.priority}/></div>
        <p>Your diagnosis: <strong>{submission.caseItem.clinicianDx}</strong></p>
        <p>AI comparison: <strong className="blue-text">{submission.caseItem.aiDx}</strong></p>
        {submission.status === "reviewed" ? <>
          <div className="expert-feedback"><span><CheckCircle2 size={14}/>EXPERT FINAL DIAGNOSIS</span><strong>{submission.finalDx}</strong><p>{submission.takeaway}</p></div>
          <footer><span><Clock3 size={14}/>{submission.reviewedAt}</span><b>{submission.expertName}</b></footer>
        </> : <><div className="awaiting-status"><Clock3 size={15}/><span><strong>Waiting for expert assignment</strong>Submitted {submission.submittedAt}</span></div><footer><span>Updates will appear here</span></footer></>}
      </article>)}
    </section>)}</div>
  </>;
}

function ReviewPage({ submissions, onReviewCompleted }: { submissions: ClinicianReviewSubmission[]; onReviewCompleted: (caseId: string, finalDx: string, takeaway: string) => void }) {
  const [selected, setSelected] = useState<{ caseItem: Case; completed: boolean } | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const severityRank: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortBySeverity = (items: Case[]) => [...items].sort((a,b) => severityRank[b.priority] - severityRank[a.priority] || a.patientId.localeCompare(b.patientId));
  const expertReviewedSeed = [
    { ...cases[7], elapsed: "Reviewed 45 min ago" },
    { ...cases[8], elapsed: "Reviewed 2.3 hr ago" },
  ];
  const submittedAwaiting = submissions.filter(item => item.status === "awaiting").map(item => item.caseItem);
  const submittedReviewed = submissions.filter(item => item.status === "reviewed").map(item => ({ ...item.caseItem, aiDx: item.finalDx || item.caseItem.aiDx, elapsed: item.reviewedAt || "Expert reviewed" }));
  const newlyCompleted = completedIds.map(id => cases.find(c => c.id === id)).filter((c): c is Case => Boolean(c));
  const genericAwaiting = cases.slice(0,7).filter(item => !submissions.some(submission => submission.caseItem.id === item.id));
  const columns = [
    { key: "pending", title: "YET TO REVIEW", tone: "amber", items: sortBySeverity([...submittedAwaiting, ...genericAwaiting].filter(c => !completedIds.includes(c.id))) },
    { key: "complete", title: "EXPERT REVIEWED", tone: "green", items: sortBySeverity([...submittedReviewed, ...expertReviewedSeed, ...newlyCompleted].filter((item,index,array) => array.findIndex(other => other.id === item.id) === index)) },
  ];
  return <>
    <PageHeader title="Expert Review Queue" subtitle="Only cases escalated for expert adjudication · Highest severity first" actions={<select aria-label="Department filter"><option>All Departments</option><option>Emergency</option><option>Cardiology</option></select>}/>
    <div className="review-scope-note"><ShieldCheck size={16}/><span>Clinician-only decisions and accepted AI suggestions are excluded. Completed means an expert submitted a final adjudication.</span></div>
    <div className="kanban review-kanban">{columns.map(col=><section key={col.key} className="kanban-col"><header className={col.tone}><span>{col.title}</span><b>{col.items.length}</b></header>{col.items.map((c,i)=><button key={c.id} className={`case-card ${selected?.caseItem.id === c.id ? "selected" : ""}`} onClick={()=>setSelected({caseItem:c, completed:col.key === "complete"})}><div><span className="id-link">{c.patientId}</span><PriorityBadge priority={c.priority}/></div><p>Clinician: <strong>{c.clinicianDx}</strong></p><p>AI: <strong className="blue-text">{c.aiDx}</strong></p>{col.key==="complete"&&<p className="final">Expert final: {c.aiDx}<CheckCircle2 size={15}/></p>}<footer><span><Clock3 size={14}/>{c.elapsed}</span>{col.key==="complete"&&<b>{i%2 ? "Dr. Patel" : "Dr. Chen"}</b>}</footer></button>)}</section>)}</div>
    {selected && <ExpertReviewDrawer key={selected.caseItem.id} completed={selected.completed} caseItem={selected.caseItem} onClose={()=>setSelected(null)} onSubmit={(finalDx,takeaway)=>{ setCompletedIds(ids => ids.includes(selected.caseItem.id) ? ids : [...ids, selected.caseItem.id]); onReviewCompleted(selected.caseItem.id, finalDx, takeaway); }}/>}
  </>;
}

function ExpertReviewDrawer({ caseItem, onClose, onSubmit, completed = false }: { caseItem: Case; onClose: () => void; onSubmit: (finalDx: string, takeaway: string) => void; completed?: boolean }) {
  const [finalDx, setFinalDx] = useState(completed ? caseItem.aiDx : "");
  const [notes, setNotes] = useState(completed ? "Expert adjudication completed after independent waveform review and comparison of the clinician and AI interpretations." : "");
  const [takeaway, setTakeaway] = useState(completed ? "Review rhythm regularity and lead morphology before distinguishing closely related tachyarrhythmias." : "");
  const [submitted, setSubmitted] = useState(completed);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  const suggestions = Array.from(new Set([caseItem.clinicianDx, caseItem.aiDx]));
  const submitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!finalDx || !notes || !takeaway) return;
    onSubmit(finalDx, takeaway);
    setSubmitted(true);
  };
  return <div className="review-drawer-layer">
    <button className="review-drawer-scrim" onClick={onClose} aria-label="Close expert review"/>
    <aside className="expert-review-drawer" role="dialog" aria-modal="true" aria-labelledby="expert-review-title">
      <header><div><h2 id="expert-review-title">Expert Review</h2><span className="mono">{caseItem.patientId}</span></div><button onClick={onClose} aria-label="Close expert review"><X size={20}/></button></header>
      {submitted ? <div className="expert-review-success"><span><CheckCircle2 size={36}/></span><h3>{completed ? "Expert review completed" : "Expert review submitted"}</h3><p>{completed ? "This case was explicitly adjudicated by an expert reviewer. Clinician-only and AI-accepted cases never appear in this completed queue." : "The final diagnosis was recorded, the case moved to Expert Reviewed, and the learning takeaway was sent to the clinician dashboard."}</p><div><b>Final diagnosis</b><strong>{finalDx}</strong></div><button className="button primary" onClick={onClose}>Return to Review Queue</button></div> :
      <form onSubmit={submitReview}>
        <div className="expert-review-body">
          <div className="drawer-alert"><AlertTriangle size={17}/><div><strong>Major Discrepancy</strong><p>Clinical decision authority rests with the treating physician. AI is a second-reader tool only.</p></div></div>
          <div className="drawer-dx-compare"><div><span>CLINICIAN DX</span><strong>{caseItem.clinicianDx}</strong></div><div><span>AI DX</span><strong>{caseItem.aiDx}</strong></div></div>
          <WorkflowEcg compact seed={Number(caseItem.id.replace(/\D/g,"").slice(-1)) % 4}/>
          <label>Final Diagnosis *<input value={finalDx} onChange={event=>setFinalDx(event.target.value)} placeholder="Enter expert final diagnosis..."/></label>
          <div className="diagnosis-suggestions">{suggestions.map(value=><button type="button" className={finalDx === value ? "active" : ""} onClick={()=>setFinalDx(value)} key={value}>{value}</button>)}</div>
          <label>Review Notes<textarea value={notes} onChange={event=>setNotes(event.target.value)} placeholder="Clinical rationale, supporting findings, and management recommendations..."/></label>
          <label className="takeaway-label"><span><BookOpen size={16}/>Learning Takeaway for Clinician</span><textarea value={takeaway} onChange={event=>setTakeaway(event.target.value)} placeholder="Key teaching point to send to the ordering clinician's Learning Dashboard..."/></label>
        </div>
        <footer><button className="button primary full" type="submit" disabled={!finalDx || !notes || !takeaway}><Check size={17}/>Submit Expert Review &amp; Send to Learning</button></footer>
      </form>}
    </aside>
  </div>;
}

function LearningPage() {
  const radar = [{name:"Arrhythmia",you:88,dept:84},{name:"Ischemia",you:78,dept:79},{name:"Conduction",you:94,dept:86},{name:"ST Changes",you:82,dept:80},{name:"Normal",you:96,dept:91},{name:"Axis Dev.",you:85,dept:82}];
  return <>
    <PageHeader title="Learning Dashboard" subtitle="Dr. Adaeze Nkemdirim · Private · Updated daily" actions={<span className="success-badge">↗ Concordance improved 12% this quarter</span>}/>
    <div className="celebration"><Award size={35}/><div><strong>Outstanding Progress, Dr. Nkemdirim!</strong><p>You have reviewed 47 cases this month and achieved your highest-ever concordance rate of 88%. You are in the top 20% of your department.</p></div></div>
    <div className="kpi-grid"><KpiCard icon={CheckCircle2} tone="green" value="88%" label="Concordance Rate" delta="↗ 12%" note="↑ 12% from last quarter"/><KpiCard icon={Sparkles} tone="blue" value="+4.2 pts" label="Monthly Improvement" delta="↗ 14%" note="Strongest in Conduction"/><KpiCard icon={ClipboardList} tone="purple" value="47" label="Cases Reviewed" delta="↗ 8%" note="This month · 312 lifetime"/><KpiCard icon={Star} tone="amber" value="18 days" label="Learning Streak" delta="↗ 0%" note="Keep going!"/></div>
    <div className="learning-charts">
      <Panel title="Performance by ECG Type" subtitle="Your accuracy vs. department average"><div className="chart radar"><ResponsiveContainer><RadarChart data={radar} outerRadius="72%"><PolarGrid stroke={gridStyle}/><PolarAngleAxis dataKey="name" tick={tickStyle}/><Radar name="You" dataKey="you" stroke={chartBlue} fill={chartBlue} fillOpacity={.25}/><Radar name="Dept. Avg." dataKey="dept" stroke="#94A3B8" fill="#CBD5E1" fillOpacity={.15} strokeDasharray="4 3"/><Legend/></RadarChart></ResponsiveContainer></div></Panel>
      <Panel title="Personal Concordance Trend" subtitle="Your improvement over the last 6 months"><div className="chart radar"><ResponsiveContainer><AreaChart data={personalTrend} margin={{top:10,right:12,left:-12,bottom:0}}><defs><linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={green} stopOpacity=".28"/><stop offset="1" stopColor={green} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false}/><YAxis domain={[70,95]} ticks={[70,77,84,95]} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={green} strokeWidth={2.5} fill="url(#greenFade)" dot={{r:4,fill:"#0F1B2D",stroke:green,strokeWidth:2}}/></AreaChart></ResponsiveContainer></div></Panel>
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
