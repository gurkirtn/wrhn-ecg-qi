"use client";

import { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, Award, BarChart3, Bell, BookOpen, BrainCircuit, Check,
  CheckCircle2, ChevronDown, ClipboardList, Clock3, Filter, GraduationCap, HeartPulse,
  LayoutDashboard, LogOut, Menu, Search, Settings, ShieldCheck, Sparkles, Star,
  Stethoscope, Upload, UserRound, X, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line,
  LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { BrowserRouter, HashRouter, Link, MemoryRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { cases, discrepancyData, learningCases, personalTrend, trend12 } from "./data";
import type { Case, Priority } from "./data";

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
  ownerId: MockAccount["id"] | "system";
  caseItem: Case;
  status: "awaiting" | "reviewed" | "finalized";
  submittedAt: string;
  submittedSort: number;
  reviewedAt?: string;
  reviewedSort?: number;
  finalizedAt?: string;
  finalizedSort?: number;
  finalizedDecision?: "ai-accepted" | "clinician-maintained";
  expertName?: string;
  finalDx?: string;
  expertNotes?: string;
  takeaway?: string;
  ageRange?: string;
  sexLabel?: string;
  reason?: string;
  matchRating?: number;
  aiConfidence?: number;
  aiFeatures?: string[];
};
type UploadSubmissionDraft = {
  caseItem: Case;
  ageRange: string;
  sexLabel: string;
  reason: string;
  matchRating: number;
  aiConfidence: number;
  aiFeatures: string[];
};

const clinicianNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "ECG Cases", icon: HeartPulse },
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
const mockAiProfiles = [
  { diagnosis: "Atrial Flutter with 2:1 Conduction", features: ["Regular atrial activity near 300 bpm", "2:1 AV conduction pattern", "Narrow-complex ventricular response"], explanation: "Regular atrial activity and a fixed ventricular response favor atrial flutter with 2:1 conduction." },
  { diagnosis: "Atrial Fibrillation with RVR", features: ["Irregularly irregular RR intervals", "No consistent P waves", "Rapid ventricular response"], explanation: "Beat-to-beat RR variability without organized atrial activity supports atrial fibrillation with rapid ventricular response." },
  { diagnosis: "1st Degree AV Block", features: ["Sinus rhythm present", "PR interval exceeds 200 ms", "Stable narrow QRS complexes"], explanation: "A consistently prolonged PR interval with preserved 1:1 conduction supports first-degree AV block." },
  { diagnosis: "Left Bundle Branch Block", features: ["QRS duration above 120 ms", "Broad notched lateral R waves", "Discordant ST-T changes"], explanation: "Broad QRS morphology with lateral notching and secondary repolarization changes supports left bundle branch block." },
  { diagnosis: "Posterior Myocardial Infarction", features: ["ST depression in V1–V3", "Tall anterior R waves", "Posterior injury pattern suspected"], explanation: "Reciprocal anterior changes with tall R waves raise concern for posterior myocardial infarction." },
  { diagnosis: "Normal Sinus Rhythm", features: ["Regular sinus P waves", "Normal PR and QRS intervals", "No acute ST-segment deviation"], explanation: "Organized atrial activation with normal intervals and no acute ischemic changes supports normal sinus rhythm." },
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
  { id: "submission-wrhn-00482", ownerId: "dual", caseItem: mockEscalatedCase, status: "awaiting", submittedAt: "Today · 10:04", submittedSort: 400 },
  { id: "submission-pt-20710", ownerId: "dual", caseItem: { ...cases[2], id: "case-pt-20710", patientId: "PT-20710", clinicianDx: "Sinus Tachycardia", aiDx: "Atrial Flutter", priority: "high" }, status: "reviewed", submittedAt: "Dec 18 · 09:14", submittedSort: 300, reviewedAt: "Dec 18 · 10:02", reviewedSort: 350, expertName: "Dr. Maya Chen", finalDx: "Atrial Flutter", expertNotes: "Regular atrial activity with a 2:1 ventricular response supports atrial flutter rather than sinus tachycardia.", takeaway: "Flutter waves at 300 bpm with 2:1 block can mimic sinus tachycardia — inspect V1 and inferior leads carefully." },
  { id: "submission-pt-20698", ownerId: "dual", caseItem: { ...cases[10], id: "case-pt-20698", patientId: "PT-20698", clinicianDx: "Normal Sinus Rhythm", aiDx: "Posterior MI", priority: "high" }, status: "reviewed", submittedAt: "Dec 15 · 08:42", submittedSort: 190, reviewedAt: "Dec 15 · 09:18", reviewedSort: 240, expertName: "Dr. Samir Patel", finalDx: "Posterior MI", expertNotes: "Reciprocal anterior ST depression with tall R waves supports a posterior infarction pattern.", takeaway: "Reciprocal ST depression in V1–V3 with tall R waves is a posterior STEMI equivalent." },
  { id: "submission-pt-20681", ownerId: "dual", caseItem: { ...cases[8], id: "case-pt-20681", patientId: "PT-20681", clinicianDx: "Left Bundle Branch Block", aiDx: "Ventricular Paced Rhythm", priority: "medium" }, status: "reviewed", submittedAt: "Dec 12 · 11:05", submittedSort: 170, reviewedAt: "Dec 12 · 11:41", reviewedSort: 220, expertName: "Dr. Maya Chen", finalDx: "Ventricular Paced Rhythm", expertNotes: "Subtle pacing spikes preceding each broad QRS establish a ventricular paced rhythm.", takeaway: "Look for subtle pacing spikes before each broad QRS complex." },
  { id: "submission-pt-20901", ownerId: "clinician", caseItem: { ...cases[4], id: "case-pt-20901", patientId: "PT-20901", clinicianDx: "STEMI", aiDx: "STEMI with LVH", priority: "critical" }, status: "awaiting", submittedAt: "Today · 09:41", submittedSort: 380 },
  { id: "submission-pt-20877", ownerId: "dual", caseItem: { ...cases[10], id: "case-pt-20877", patientId: "PT-20877", clinicianDx: "Normal Sinus Rhythm", aiDx: "Posterior MI", priority: "high" }, status: "reviewed", submittedAt: "Yesterday · 15:20", submittedSort: 200, reviewedAt: "Yesterday · 15:48", reviewedSort: 250, expertName: "Dr. Samir Patel", finalDx: "Posterior MI", expertNotes: "Reciprocal anterior changes and tall R waves are most consistent with posterior myocardial infarction.", takeaway: "Reciprocal ST depression in V1–V3 with tall R waves should prompt posterior-lead assessment." },
  { id: "submission-system-20846", ownerId: "dual", caseItem: cases[7], status: "reviewed", submittedAt: cases[7].acquiredAt, submittedSort: 140, reviewedAt: "Reviewed 45 min ago", reviewedSort: 160, expertName: "Dr. Maya Chen", finalDx: cases[7].aiDx, expertNotes: "Independent waveform review confirmed concordant left bundle branch block morphology.", takeaway: "Use QRS morphology and repolarization discordance together when confirming bundle branch block." },
  { id: "submission-system-20847", ownerId: "dual", caseItem: cases[8], status: "reviewed", submittedAt: cases[8].acquiredAt, submittedSort: 120, reviewedAt: "Reviewed 2.3 hr ago", reviewedSort: 150, expertName: "Dr. Samir Patel", finalDx: cases[8].aiDx, expertNotes: "Pacing spikes and broad paced QRS complexes confirm ventricular pacing.", takeaway: "Identify pacing spikes before interpreting the morphology of a broad QRS rhythm." },
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
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const targetId = decodeURIComponent(location.hash.slice(1));
    window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, [location.pathname, location.hash]);
  if (!account) return <MockLogin onLogin={nextAccount => { setAccount(nextAccount); setRole(nextAccount.roles[0]); navigate("/"); }}/>;
  const myReviewSubmissions = reviewSubmissions.filter(item => item.ownerId === account.id);
  const addExpertSubmission = (draft: UploadSubmissionDraft) => {
    if (reviewSubmissions.some(item => item.caseItem.patientId.toLowerCase() === draft.caseItem.patientId.toLowerCase())) return false;
    setReviewSubmissions(items => [{ id: `submission-${account.id}-${draft.caseItem.id}`, ownerId: account.id, ...draft, status: "awaiting", submittedAt: "Just now", submittedSort: Date.now() }, ...items]);
    return true;
  };
  const addClinicianFinalizedCase = (draft: UploadSubmissionDraft, decision: "ai-accepted" | "clinician-maintained") => {
    if (reviewSubmissions.some(item => item.caseItem.patientId.toLowerCase() === draft.caseItem.patientId.toLowerCase())) return false;
    const finalizedSort = Date.now();
    setReviewSubmissions(items => [{
      id: `submission-${account.id}-${draft.caseItem.id}`,
      ownerId: account.id,
      ...draft,
      status: "finalized",
      submittedAt: "Just now",
      submittedSort: finalizedSort,
      finalizedAt: "Just now",
      finalizedSort,
      finalizedDecision: decision,
      finalDx: decision === "ai-accepted" ? draft.caseItem.aiDx : draft.caseItem.clinicianDx,
    }, ...items]);
    return true;
  };
  const completeExpertSubmission = (caseId: string, finalDx: string, takeaway: string, expertNotes: string) => setReviewSubmissions(items => {
    const reviewedAt = Date.now();
    if (items.some(item => item.caseItem.id === caseId)) return items.map(item => item.caseItem.id === caseId ? { ...item, status: "reviewed", reviewedAt: "Just now", reviewedSort: reviewedAt, expertName: account.name, finalDx, takeaway, expertNotes } : item);
    const caseItem = cases.find(item => item.id === caseId);
    return caseItem ? [{ id: `submission-system-${caseId}`, ownerId: "system", caseItem, status: "reviewed", submittedAt: caseItem.acquiredAt, submittedSort: reviewedAt - 1, reviewedAt: "Just now", reviewedSort: reviewedAt, expertName: account.name, finalDx, takeaway, expertNotes }, ...items] : items;
  });
  const visibleCaseSubmission = reviewSubmissions.find(item =>
    item.caseItem.patientId === decodeURIComponent(location.pathname.split("/").pop() || "") &&
    (role === "expert" ? item.status === "reviewed" : item.ownerId === account.id && item.status !== "awaiting")
  );
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
            <Route path="/" element={role === "expert" ? <ExpertDashboard submissions={reviewSubmissions}/> : <Dashboard submissions={myReviewSubmissions} openUpload={() => setUploadOpen(true)}/>}/>
            <Route path="/cases" element={<CasesPage role={role} submissions={role === "clinician" ? myReviewSubmissions : reviewSubmissions} openUpload={() => setUploadOpen(true)}/>}/>
            <Route path="/cases/:id" element={visibleCaseSubmission ? <CaseDetail submission={visibleCaseSubmission}/> : <Navigate to="/cases" replace/>}/>
            <Route path="/review" element={role === "expert" ? <ReviewPage submissions={reviewSubmissions} onReviewCompleted={completeExpertSubmission}/> : <Navigate to="/" replace/>}/>
            <Route path="/learning" element={role === "clinician" ? <LearningPage submissions={myReviewSubmissions}/> : <Navigate to="/" replace/>}/>
            <Route path="/analytics" element={role === "expert" ? <AnalyticsPage/> : <Navigate to="/" replace/>}/>
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </main>
      </div>
      {role === "clinician" && uploadOpen && <UploadWorkflow existingPatientIds={reviewSubmissions.map(item => item.caseItem.patientId)} accountName={account.name} onExpertSubmit={addExpertSubmission} onClinicianFinalized={addClinicianFinalizedCase} onClose={() => setUploadOpen(false)}/>}
    </div>
  );
}

function UploadWorkflow({ onClose, onExpertSubmit, onClinicianFinalized, accountName, existingPatientIds }: { onClose: () => void; onExpertSubmit: (draft: UploadSubmissionDraft) => boolean; onClinicianFinalized: (draft: UploadSubmissionDraft, decision: "ai-accepted" | "clinician-maintained") => boolean; accountName: string; existingPatientIds: string[] }) {
  const navigate = useNavigate();
  const [mockSeed, setMockSeed] = useState(0);
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [patientId, setPatientId] = useState("WRHN-00527");
  const [ageRange, setAgeRange] = useState("65-74");
  const [sex, setSex] = useState("Male");
  const [department, setDepartment] = useState("Emergency");
  const [reason, setReason] = useState("Palpitations and lightheadedness, new onset");
  const [confidence, setConfidence] = useState(72);
  const [diagnosis, setDiagnosis] = useState("Sinus Tachycardia");
  const [rhythm, setRhythm] = useState("Regular");
  const [ventricularRate, setVentricularRate] = useState("148");
  const [processIndex, setProcessIndex] = useState(0);
  const [outcome, setOutcome] = useState<"accepted" | "maintained" | "expert">("expert");
  const normalizedPatientId = patientId.trim().toUpperCase();
  const duplicatePatientId = existingPatientIds.some(value => value.toUpperCase() === normalizedPatientId);
  const caseHash = [...`${normalizedPatientId}-${mockSeed}`].reduce((total,character) => total + character.charCodeAt(0), 0);
  const aiProfile = mockAiProfiles[caseHash % mockAiProfiles.length];
  const aiConfidence = 78 + caseHash % 19;
  const matchRating = diagnosis === aiProfile.diagnosis ? 93 + caseHash % 7 : 34 + caseHash % 48;
  const priority: Priority = matchRating < 48 ? "critical" : matchRating < 68 ? "high" : matchRating < 82 ? "medium" : "low";
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
    {
      const safeId = normalizedPatientId.replace(/[^A-Z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase();
      const ageStart = Number(ageRange.match(/\d+/)?.[0] || 65);
      const caseItem: Case = {
        ...mockEscalatedCase,
        id: `case-${safeId}`,
        patientId: normalizedPatientId,
        age: ageStart,
        sex: sex === "Female" ? "Female" : "Male",
        department,
        chiefComplaint: reason,
        hrAtAcquisition: Number(ventricularRate) || 0,
        encounter: `ENC-${100000 + caseHash}`,
        acquiredAt: "Jul 29, 2026 · Just now",
        waveform: `mock-waveform-${mockSeed + 1}`,
        priority,
        clinicianDx: diagnosis,
        aiDx: aiProfile.diagnosis,
        verdict: diagnosis === aiProfile.diagnosis ? "concordant" : matchRating >= 68 ? "minor" : "major",
        elapsed: "Just now",
      };
      const draft = { caseItem, ageRange, sexLabel: sex, reason, matchRating, aiConfidence, aiFeatures: aiProfile.features };
      const added = choice === "expert" ? onExpertSubmit(draft) : onClinicianFinalized(draft, choice === "accepted" ? "ai-accepted" : "clinician-maintained");
      if (!added) {
        setStep(1);
        return;
      }
    }
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
            <div className="workflow-form"><h3>Anonymized Patient Information</h3><label>Anonymized Patient ID *<input value={patientId} onChange={event=>setPatientId(event.target.value)} className={`mono ${duplicatePatientId ? "input-error" : ""}`}/>{duplicatePatientId && <span className="field-error">This patient ID is already in the program. Enter a unique anonymized ID.</span>}</label><div className="form-pair"><label>Age Range<select value={ageRange} onChange={event=>setAgeRange(event.target.value)}><option>18-34</option><option>35-49</option><option>50-64</option><option>65-74</option><option>75+</option></select></label><label>Sex<select value={sex} onChange={event=>setSex(event.target.value)}><option>Female</option><option>Male</option><option>Other / not specified</option></select></label></div><label>Department<select value={department} onChange={event=>setDepartment(event.target.value)}><option>Emergency</option><option>Cardiology</option><option>ICU</option><option>Internal Medicine</option></select></label><label>Reason for ECG<textarea value={reason} onChange={event=>setReason(event.target.value)}/></label></div>
            <div><h3>ECG File Upload</h3><button type="button" className={`dropzone mock-dropzone ${fileName ? "has-file" : ""}`} onClick={loadRandomMockEcg}>{fileName ? <><div className="mock-ecg-preview"><EcgStrip lead={`MOCK ${mockSeed + 1}`} phase={mockSeed * 4}/></div><strong>{fileName}</strong><span>Random anonymized placeholder ready for the mock model</span></> : <><Upload size={34}/><strong>Click to upload ECG</strong><span>A random anonymized ECG placeholder will be loaded</span></>}</button><div className="mock-mode-note"><BrainCircuit size={14}/>Prototype mode · no patient file is uploaded</div>{fileName && <button className="demo-file" onClick={loadRandomMockEcg}>↻ Load a different random ECG</button>}</div>
          </div>
        </div>}
        {step === 2 && <div className="clinician-step">
          <div className="workflow-section-title"><span className="soft-icon"><Stethoscope size={20}/></span><div><h3>Clinician Interpretation</h3><p>{accountName} · {department} · Jul 29, 2026</p></div><span className="anonymized mono">{normalizedPatientId}</span></div>
          <WorkflowEcg compact seed={mockSeed}/>
          <div className="clinician-form-grid"><div><label>Primary Diagnosis *<select value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}><option>Sinus Tachycardia</option><option>Atrial Fibrillation with RVR</option><option>Atrial Flutter with 2:1 Conduction</option><option>1st Degree AV Block</option><option>Left Bundle Branch Block</option><option>Posterior Myocardial Infarction</option><option>Normal Sinus Rhythm</option><option>STEMI</option></select></label><div className="form-pair"><label>Rhythm<select value={rhythm} onChange={event=>setRhythm(event.target.value)}><option>Regular</option><option>Irregular</option><option>Irregularly irregular</option></select></label><label>Ventricular Rate<div className="suffix-input"><input value={ventricularRate} onChange={event=>setVentricularRate(event.target.value)}/><span>bpm</span></div></label></div><label>Clinical Confidence: <b>{confidence}%</b><input type="range" min="0" max="100" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))}/><div className="range-labels"><span>Uncertain</span><span>Confident</span></div></label></div><div><label>Key Findings<textarea defaultValue={`${rhythm} rhythm at ${ventricularRate} bpm. QRS morphology and ST segments reviewed.`}/></label><label>Clinical Notes<textarea defaultValue={`${reason}. ECG acquired in ${department}.`}/></label></div></div>
          <div className="independence-note"><ShieldCheck size={16}/>Your interpretation is recorded before the AI second read is revealed.</div>
        </div>}
        {step === 3 && <div className="processing-step"><span className="processing-ring"><BrainCircuit size={32}/></span><h3>AI Processing ECG...</h3><p>ECG-AI v2.4 · {normalizedPatientId} · Simulated prototype analysis</p><div className="processing-list">{stages.map(([title, text], index) => <div className={`${index < processIndex ? "done" : ""} ${index === processIndex ? "running" : ""}`} key={title}><span>{index < processIndex ? <Check size={17}/> : index + 1}</span><div><strong>{title}</strong><small>{text}</small></div><b>{index < processIndex ? "Done" : index === processIndex ? "Running" : ""}</b></div>)}</div><p className="decision-note centered"><ShieldCheck size={14}/>This simulated AI output is decision support, not a diagnosis.</p></div>}
        {step === 4 && <div className="comparison-step">
          <div className="discrepancy-alert"><AlertTriangle size={22}/><div><strong>AI Comparison — {matchRating}% Match</strong><p>Clinician: <b>{diagnosis}</b> · AI: <b>{aiProfile.diagnosis}</b> · AI Confidence: <b>{aiConfidence}%</b></p></div><PriorityBadge priority={priority}/></div>
          <div className="case-summary">{[["Patient ID",normalizedPatientId],["Age Range",ageRange],["Sex",sex],["Department",department],["AI/Clinician Match",`${matchRating}%`],["Reason",reason]].map(([label,value]) => <div key={label}><span>{label}</span><b className={label==="Patient ID"?"mono id-link":""}>{value}</b></div>)}</div>
          <p className="waveform-caption"><Activity size={16}/>ECG Waveform — mock case-specific analysis</p><WorkflowEcg seed={mockSeed}/>
          <div className="comparison-grid"><div className="comparison-card"><header><Stethoscope size={18}/><strong>Clinician Interpretation</strong><span>Dr. A. Nkemdirim</span></header><div><span>DIAGNOSIS</span><h3>{diagnosis}</h3><div className="comparison-confidence"><span>CONFIDENCE</span><i><b style={{width:`${confidence}%`}}/></i><strong>{confidence}%</strong></div><span>FINDINGS</span><ul><li>Rapid ventricular rate ~148 bpm</li><li>Regular rhythm</li><li>No visible P-wave abnormalities</li><li>No ST changes noted</li></ul><p className="quote-note">“Rapid rate consistent with sinus tachycardia in the context of acute presentation.”</p></div></div>
            <div className="comparison-card ai"><header><Zap size={18}/><strong>AI Interpretation</strong><span>ECG-AI v2.4 · case-specific mock</span></header><div><div className="ai-title"><div><span>DIAGNOSIS</span><h3>{aiProfile.diagnosis}</h3></div><strong>{aiConfidence}%</strong></div><div className="match-rating"><span>CLINICIAN / AI MATCH</span><i><b style={{width:`${matchRating}%`}}/></i><strong>{matchRating}%</strong></div><span>DETECTED FEATURES</span><ul>{aiProfile.features.map(feature=><li key={feature}>{feature}</li>)}</ul><p className="explainer">{aiProfile.explanation}</p><p className="decision-note"><AlertTriangle size={14}/><b>Note:</b> AI is a quality-improvement second reader. Final clinical decisions rest with the treating physician.</p></div></div>
          </div>
        </div>}
        {step === 5 && <div className="completion-step"><span className="completion-icon">{outcome === "expert" ? <Sparkles size={35}/> : <CheckCircle2 size={35}/>}</span><h3>{outcome === "expert" ? "Sent to Expert Review" : outcome === "accepted" ? "AI Interpretation Accepted" : "Clinician Interpretation Maintained"}</h3><p>{outcome === "expert" ? `${normalizedPatientId} has been added to your Under Expert Review cases and the expert queue with a unique ${matchRating}% match rating.` : outcome === "accepted" ? `${normalizedPatientId} is now a read-only case in My ECG Cases and has been added to your Learning Dashboard activity. It remains excluded from the expert-review queue.` : `${normalizedPatientId} is now a read-only clinician-finalized case in My ECG Cases and Learning Dashboard activity. The original clinician interpretation remains final, and the case is excluded from expert review.`}</p><div className="completion-summary"><span><b>Case</b><strong className="mono">{normalizedPatientId}</strong></span><span><b>Status</b><strong>{outcome === "expert" ? "Waiting for expert review" : outcome === "accepted" ? "AI accepted" : "Clinician interpretation maintained"}</strong></span><span><b>Match</b><strong>{matchRating}%</strong></span></div><div className="guardrail"><ShieldCheck size={18}/><span><strong>Audit trail updated</strong>All workflow actions are simulated locally for this prototype.</span></div></div>}
      </div>
      <footer className="workflow-footer">
        {step === 1 && <><span/><button className="button primary" disabled={!fileName || !normalizedPatientId || duplicatePatientId || !reason.trim()} onClick={() => setStep(2)}>Continue to Clinician Interpretation <ChevronDown className="chevron-right" size={16}/></button></>}
        {step === 2 && <><button className="button ghost" onClick={() => setStep(1)}>‹ Back</button><div><button className="button secondary">Save Draft</button><button className="button primary" onClick={() => setStep(3)}><Zap size={16}/>Submit for AI Analysis</button></div></>}
        {step === 3 && <><span/><button className="button secondary" onClick={() => setStep(2)}>Cancel processing</button></>}
        {step === 4 && <><button className="button ghost" onClick={() => setStep(2)}>‹ Back</button><div><button className="button secondary decision" onClick={() => finish("accepted")}><Check size={16}/>Accept AI Suggestion</button><button className="button secondary decision" onClick={() => finish("maintained")}><Stethoscope size={16}/>Maintain Clinician Interpretation</button><button className="button primary decision" onClick={() => finish("expert")}><Sparkles size={16}/>Send to Expert Review</button></div></>}
        {step === 5 && <><button className="button ghost" onClick={onClose}>Close</button><button className="button primary" onClick={() => { onClose(); navigate(outcome === "expert" ? "/cases" : `/cases/${encodeURIComponent(normalizedPatientId)}`); }}>{outcome === "expert" ? "Track in ECG Cases" : "View Saved Case"} →</button></>}
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

function KpiCard({ icon: Icon, tone, value, label, delta, note, to }: { icon: typeof Activity; tone: string; value: string; label: string; delta: string; note: string; to?: string }) {
  const content = <><div className="kpi-top"><span className={`icon-chip ${tone}`}><Icon size={20}/></span><span className={`delta ${delta.includes("↓") ? "down" : ""}`}>{delta}</span></div><strong className="metric">{value}</strong><span className="metric-label">{label}</span><div className="kpi-note">{note}{to && <span className="pane-link-cue">Open →</span>}</div></>;
  return to ? <Link className="card kpi kpi-link" to={to} aria-label={`Open ${label}`}>{content}</Link> : <article className="card kpi">{content}</article>;
}

function Panel({ title, subtitle, action, children, className = "", id, to }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; id?: string; to?: string }) {
  const navigate = useNavigate();
  const openPanel = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    if (!to || (event.target as HTMLElement).closest("a,button,input,select,textarea")) return;
    if ("key" in event && event.key !== "Enter" && event.key !== " ") return;
    if ("key" in event) event.preventDefault();
    navigate(to);
  };
  return <section id={id} className={`card panel ${to ? "panel-link" : ""} ${className}`} onClick={openPanel} onKeyDown={openPanel} tabIndex={to ? 0 : undefined} role={to ? "link" : undefined} aria-label={to ? `Open ${title}` : undefined}><div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action || (to && <span className="pane-link-cue">Open →</span>)}</div>{children}</section>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`priority ${priority}`}>{priority.toUpperCase()}</span>;
}

const tickStyle = { fontSize: 11, fill: "#94A3B8" };
const gridStyle = "#26364D";

function Dashboard({ openUpload, submissions }: { openUpload: () => void; submissions: ClinicianReviewSubmission[] }) {
  const awaitingReviews = submissions.filter(item => item.status === "awaiting");
  const completedReviews = submissions.filter(item => item.status === "reviewed");
  const todaysEcgCount = submissions.filter(
    item => item.submittedAt.startsWith("Today") || item.submittedAt.startsWith("Just now"),
  ).length;
  return <>
    <PageHeader title="Dashboard" subtitle="Wednesday, December 18, 2024 · WRHN Cardiac Services" actions={<><span className="updated"><Clock3 size={14}/>Updated 2 min ago</span><button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button></>}/>
    <div className="kpi-grid">
      <KpiCard icon={Activity} tone="blue" value={String(todaysEcgCount)} label="ECGs Today" delta="Live" note="Your submissions today" to="/cases"/>
      <KpiCard icon={Zap} tone="green" value="88.1%" label="AI Agreement Rate" delta="↗ 2.3%" note="3-month rolling average" to="/learning#performance"/>
      <KpiCard icon={ClipboardList} tone="amber" value={String(awaitingReviews.length)} label="My Awaiting Reviews" delta="Personal" note="Expert-adjudication submissions" to="/cases#under-review"/>
      <KpiCard icon={CheckCircle2} tone="purple" value={String(completedReviews.length)} label="My Reviews Ready" delta="Feedback" note="Expert feedback available" to="/cases#reviewed"/>
    </div>
    <div className="dashboard-charts">
      <Panel title="Concordance Rate — 12 Month Trend" subtitle="AI vs. Clinician agreement, rolling monthly" action={<span className="success-badge">+8.9 pts YTD</span>} to="/learning#performance">
        <div className="chart tall"><ResponsiveContainer><AreaChart data={trend12} margin={{ top: 8, right: 12, bottom: 0, left: -15 }}><defs><linearGradient id="blueFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chartBlue} stopOpacity=".28"/><stop offset="1" stopColor={chartBlue} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} tickLine={false} axisLine={false}/><YAxis domain={[78,92]} ticks={[78,82,86,92]} tick={tickStyle} tickLine={false} axisLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={chartBlue} strokeWidth={2.5} fill="url(#blueFade)" dot={{ r: 3.5, fill: "#0F1B2D", strokeWidth: 2 }}/></AreaChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Discrepancy Breakdown" subtitle="By ECG category this month" to="/learning#recent-learning">
        <div className="chart tall"><ResponsiveContainer><BarChart data={discrepancyData} layout="vertical" margin={{ top: 8, right: 18, left: 16, bottom: 0 }}><CartesianGrid stroke={gridStyle} strokeDasharray="4 4" horizontal={false}/><XAxis type="number" domain={[0,20]} tick={tickStyle} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={92} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill="#EF4444" radius={[0,4,4,0]} barSize={10}/></BarChart></ResponsiveContainer></div>
      </Panel>
    </div>
    <Panel title="Today’s Expert Review Workload" subtitle="Your personal submissions only" action={<Link className="text-link" to="/cases">View all →</Link>}>
      <div className="clinician-today-workload">
        <Link to="/cases#under-review"><span className="icon-chip amber"><Clock3 size={19}/></span><div><small>AWAITING EXPERT REVIEW</small><strong>{awaitingReviews.length}</strong><p>{awaitingReviews[0] ? `${awaitingReviews[0].caseItem.patientId} · ${awaitingReviews[0].caseItem.priority.toUpperCase()} priority` : "No pending submissions"}</p></div><b>Track →</b></Link>
        <Link to="/cases#reviewed"><span className="icon-chip green"><CheckCircle2 size={19}/></span><div><small>REVIEWED</small><strong>{completedReviews.length}</strong><p>{completedReviews[0] ? `${completedReviews[0].caseItem.patientId} · Feedback ready` : "No completed reviews yet"}</p></div><b>Open →</b></Link>
      </div>
    </Panel>
    <ClinicianRecentCases submissions={submissions}/>
  </>;
}

function ExpertDashboard({ submissions }: { submissions: ClinicianReviewSubmission[] }) {
  const severityRank: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const submittedAwaiting = submissions.filter(item => item.status === "awaiting");
  const genericAwaiting = cases.slice(0,7).filter(item => !submissions.some(submission => submission.caseItem.id === item.id));
  const allAwaiting = [...submittedAwaiting.map(item => item.caseItem), ...genericAwaiting];
  const priorityCases = [...allAwaiting].sort((a,b) => severityRank[b.priority] - severityRank[a.priority]).slice(0,5);
  const reviewedCount = submissions.filter(item => item.status === "reviewed").length;
  const highPriorityCount = allAwaiting.filter(item => item.priority === "critical" || item.priority === "high").length;
  return <>
    <PageHeader title="Expert Review Overview" subtitle="Cardiology adjudication workspace · High-priority discrepancies first" actions={<Link className="button primary" to="/review"><ClipboardList size={16}/>Open Review Queue</Link>}/>
    <div className="role-context-banner"><span><Stethoscope size={18}/></span><div><strong>Expert reviewer view</strong><p>Focused on discrepancy adjudication, clinical feedback, and hospital-wide quality improvement. Upload and private learning tools are hidden.</p></div></div>
    <div className="kpi-grid three">
      <KpiCard icon={ClipboardList} tone="amber" value={String(allAwaiting.length)} label="Awaiting Expert Review" delta={`${submittedAwaiting.length} new`} note="Matches the review queue" to="/review#pending"/>
      <KpiCard icon={AlertTriangle} tone="red" value={String(highPriorityCount)} label="High Priority" delta="Risk sorted" note="Target response: ≤15 min" to="/review#pending"/>
      <KpiCard icon={CheckCircle2} tone="green" value={String(reviewedCount)} label="Expert Reviewed" delta="Completed" note="Matches the review queue" to="/review#completed"/>
    </div>
    <div className="expert-dashboard-grid">
      <Panel title="Priority Review Queue" subtitle="Cases ordered by clinical risk and elapsed time" action={<Link className="text-link" to="/review#pending">View board →</Link>} to="/review#pending">
        <div className="expert-priority-list">{priorityCases.map((item,index)=><Link to="/review#pending" key={item.id}><span className="queue-rank">{index + 1}</span><div><strong className="id-link">{item.patientId}</strong><p>{item.clinicianDx} <span>vs.</span> {item.aiDx}</p></div><PriorityBadge priority={item.priority}/><small><Clock3 size={13}/>{item.elapsed}</small></Link>)}</div>
      </Panel>
      <Panel title="Today’s Workload" subtitle="Same two states as the expert review queue">
        <div className="expert-workload-grid">
          <Link to="/review#pending" className="awaiting"><span><Clock3 size={19}/></span><small>YET TO REVIEW</small><strong>{allAwaiting.length}</strong><p>Severity ordered · {highPriorityCount} high priority</p><b>Open queue →</b></Link>
          <Link to="/review#completed" className="reviewed"><span><CheckCircle2 size={19}/></span><small>EXPERT REVIEWED</small><strong>{reviewedCount}</strong><p>Completed adjudications and feedback</p><b>View completed →</b></Link>
        </div>
        <div className="expert-guardrail"><ShieldCheck size={18}/><div><strong>Clinical authority preserved</strong><p>Expert adjudications support quality improvement. Treating clinicians retain responsibility for patient care.</p></div></div>
      </Panel>
    </div>
  </>;
}

function ClinicianRecentCases({ submissions }: { submissions: ClinicianReviewSubmission[] }) {
  const recent = [...submissions].sort((a,b) => Math.max(b.reviewedSort || 0,b.finalizedSort || 0,b.submittedSort) - Math.max(a.reviewedSort || 0,a.finalizedSort || 0,a.submittedSort)).slice(0,5);
  return <Panel title="My Recent Cases" subtitle="Your latest submissions, AI decisions, and expert-review updates" action={<Link className="text-link" to="/cases">View all →</Link>} className="table-panel" to="/cases">
    <div className="table-wrap"><table><thead><tr><th>Patient ID</th><th>Your Diagnosis</th><th>AI Reading</th><th>Expert Status</th><th>Latest Activity</th></tr></thead>
      <tbody>{recent.map(item => <tr key={item.id}><td>{item.status !== "awaiting" ? <Link className="id-link" to={`/cases/${item.caseItem.patientId}`}>{item.caseItem.patientId}</Link> : <span className="mono">{item.caseItem.patientId}</span>}</td><td>{item.caseItem.clinicianDx}</td><td>{item.caseItem.aiDx}</td><td>{item.status === "reviewed" ? <span className="review-state reviewed"><CheckCircle2 size={13}/>Expert reviewed</span> : item.status === "finalized" ? <span className={`review-state ${item.finalizedDecision === "clinician-maintained" ? "maintained" : "accepted"}`}>{item.finalizedDecision === "clinician-maintained" ? <Stethoscope size={13}/> : <BrainCircuit size={13}/>} {item.finalizedDecision === "clinician-maintained" ? "Clinician maintained" : "AI accepted"}</span> : <span className="review-state awaiting"><Clock3 size={13}/>Awaiting expert review</span>}</td><td>{item.status === "reviewed" ? item.reviewedAt : item.status === "finalized" ? item.finalizedAt : item.submittedAt}</td></tr>)}</tbody></table></div>
  </Panel>;
}

function AiAcceptedSubmissionTable({ items }: { items: ClinicianReviewSubmission[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Patient ID</th><th>Clinician Input</th><th>AI Reading</th><th>Match</th><th>Final Decision</th><th>Finalized</th></tr></thead>
    <tbody>{items.map(item => <tr key={item.id}><td><Link className="id-link" to={`/cases/${item.caseItem.patientId}`}>{item.caseItem.patientId}</Link></td><td>{item.caseItem.clinicianDx}</td><td>{item.caseItem.aiDx}</td><td><strong>{item.matchRating ?? "—"}{item.matchRating !== undefined && "%"}</strong></td><td><span className={`review-state ${item.finalizedDecision === "clinician-maintained" ? "maintained" : "accepted"}`}>{item.finalizedDecision === "clinician-maintained" ? <Stethoscope size={13}/> : <BrainCircuit size={13}/>} {item.finalizedDecision === "clinician-maintained" ? "Clinician maintained" : "AI accepted"}</span></td><td>{item.finalizedAt}</td></tr>)}</tbody></table></div>;
}

function ReviewedSubmissionTable({ items, expertView = false }: { items: ClinicianReviewSubmission[]; expertView?: boolean }) {
  return <div className="table-wrap"><table><thead><tr><th>Patient ID</th><th>Clinician Input</th><th>AI Reading</th><th>Match</th><th>Expert Final</th>{expertView && <th>Department</th>}<th>Reviewed</th></tr></thead>
    <tbody>{items.map(item => <tr key={item.id}><td><Link className="id-link" to={`/cases/${item.caseItem.patientId}`}>{item.caseItem.patientId}</Link></td><td>{item.caseItem.clinicianDx}</td><td>{item.caseItem.aiDx}</td><td><strong>{item.matchRating ?? "—"}{item.matchRating !== undefined && "%"}</strong></td><td><span className="review-state reviewed"><CheckCircle2 size={13}/>{item.finalDx}</span></td>{expertView && <td>{item.caseItem.department}</td>}<td>{item.reviewedAt}</td></tr>)}</tbody></table></div>;
}

function CasesPage({ openUpload, role, submissions }: { openUpload: () => void; role: WorkspaceRole; submissions: ClinicianReviewSubmission[] }) {
  const reviewed = submissions.filter(item => item.status === "reviewed").sort((a,b) => (b.reviewedSort || 0) - (a.reviewedSort || 0));
  const awaiting = submissions.filter(item => item.status === "awaiting").sort((a,b) => b.submittedSort - a.submittedSort);
  const finalized = submissions.filter(item => item.status === "finalized").sort((a,b) => (b.finalizedSort || 0) - (a.finalizedSort || 0));
  if (role === "expert") return <>
    <PageHeader title="Reviewed ECG Cases" subtitle="Expert-adjudicated cases across WRHN · Most recently reviewed first"/>
    <div className="review-scope-note"><CheckCircle2 size={16}/><span>This archive contains completed expert reviews only. Cases awaiting adjudication remain in the Review Queue.</span></div>
    <Panel id="reviewed" title="Latest Expert Reviews" subtitle={`${reviewed.length} completed cases`} className="table-panel"><ReviewedSubmissionTable items={reviewed} expertView/></Panel>
  </>;
  return <>
    <PageHeader title="My ECG Cases" subtitle="Your submissions only · Ordered by latest activity" actions={<button className="button primary" onClick={openUpload}><Upload size={15}/>Upload ECG</button>}/>
    <div className="case-section-stack">
      <Panel id="clinician-finalized" title="Clinician-Finalized Cases" subtitle="AI accepted or clinician interpretation maintained · Read-only and excluded from expert review" action={<span className="count-chip blue">{finalized.length}</span>} className="table-panel">
        {finalized.length > 0 ? <AiAcceptedSubmissionTable items={finalized}/> : <div className="empty-review-column"><BrainCircuit size={25}/><strong>No clinician-finalized cases yet</strong><p>Cases appear here after you accept the AI reading or maintain your interpretation.</p></div>}
      </Panel>
      <Panel id="under-review" title="Under Expert Review" subtitle="Your latest submissions awaiting adjudication" action={<span className="count-chip amber">{awaiting.length}</span>}>
        <div className="pending-case-grid">{awaiting.map(item => <article className="pending-case" key={item.id}><header><span className="mono">{item.caseItem.patientId}</span><PriorityBadge priority={item.caseItem.priority}/></header><div><span>YOUR INPUT<strong>{item.caseItem.clinicianDx}</strong></span><span>AI READING<strong>{item.caseItem.aiDx}</strong></span><span>MATCH RATING<strong>{item.matchRating ?? "—"}{item.matchRating !== undefined && "%"}</strong></span><span>PATIENT CONTEXT<strong>{item.ageRange || `${item.caseItem.age} years`} · {item.sexLabel || item.caseItem.sex} · {item.caseItem.department}</strong></span></div>{item.reason && <p className="pending-reason"><b>Reason:</b> {item.reason}</p>}<footer><span className="review-state awaiting"><Clock3 size={13}/>Awaiting expert review</span><time>{item.submittedAt}</time></footer></article>)}</div>
        {awaiting.length === 0 && <div className="empty-review-column"><CheckCircle2 size={25}/><strong>No cases under review</strong><p>New expert-review submissions will appear here.</p></div>}
      </Panel>
      <Panel id="reviewed" title="Reviewed Cases" subtitle="Expert feedback and teaching points · Most recently reviewed first" action={<span className="count-chip green">{reviewed.length}</span>} className="table-panel">
        <ReviewedSubmissionTable items={reviewed}/>
      </Panel>
    </div>
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

function CaseDetail({ submission }: { submission: ClinicianReviewSubmission }) {
  const selected = submission.caseItem;
  const aiAccepted = submission.status === "finalized";
  const clinicianMaintained = submission.finalizedDecision === "clinician-maintained";
  return <>
    <div className="detail-title"><div className="breadcrumbs"><Link to="/cases">ECG Cases</Link><span>›</span><b>{selected.patientId}</b><PriorityBadge priority={selected.priority}/><span className={`reviewed-banner ${aiAccepted ? clinicianMaintained ? "maintained" : "accepted" : ""}`}>{aiAccepted ? clinicianMaintained ? <Stethoscope size={16}/> : <BrainCircuit size={16}/> : <CheckCircle2 size={16}/>} {aiAccepted ? `${clinicianMaintained ? "Clinician maintained" : "AI accepted"} ${submission.finalizedAt}` : `Expert reviewed ${submission.reviewedAt}`}</span></div></div>
    <div className="case-record-banner"><ShieldCheck size={18}/><div><strong>Finalized read-only case record</strong><p>{aiAccepted ? clinicianMaintained ? "This page preserves the clinician interpretation as the final comparison result alongside the simulated AI reading. It was not submitted for expert adjudication and cannot be edited." : "This page reflects the clinician input and the simulated AI interpretation the clinician accepted. It was not submitted for expert adjudication and cannot be edited." : "This page reflects the submitted clinician interpretation, simulated AI second read, and completed expert adjudication. It cannot be edited."}</p></div></div>
    <div className="detail-grid reviewed-detail">
      <div><EcgViewer/><Panel title="Case Information" action={<span className="anonymized"><ShieldCheck size={14}/>Anonymized</span>}><div className="patient-grid">{[["Patient ID",selected.patientId],["Age Range",submission.ageRange || `${selected.age} years`],["Sex",submission.sexLabel || selected.sex],["Department",selected.department],["Reason",submission.reason || selected.chiefComplaint],["AI/Clinician Match",submission.matchRating !== undefined ? `${submission.matchRating}%` : "—"],["AI Confidence",submission.aiConfidence !== undefined ? `${submission.aiConfidence}%` : "—"],["Submitted",submission.submittedAt],[aiAccepted ? "Finalized" : "Reviewed",aiAccepted ? submission.finalizedAt || "—" : submission.reviewedAt || "—"]].map(([key,value])=><div key={key}><span>{key}</span><strong className={key==="Patient ID"?"mono":""}>{value}</strong></div>)}</div></Panel></div>
      <aside className="interpretations read-only-interpretations">
        <Panel title="Clinician Input" action={<span className="record-label">SUBMITTED</span>}><div className="record-diagnosis"><span>PRIMARY DIAGNOSIS</span><h3>{selected.clinicianDx}</h3><p>The clinician interpretation was recorded before the AI second read was revealed.</p></div></Panel>
        <Panel title="AI Reading" action={<span className="model-chip">ECG-AI v2.4 · simulated</span>}><div className="record-diagnosis ai-record"><span>PRIMARY DIAGNOSIS</span><h3>{selected.aiDx}</h3><ul className="findings"><li>Rhythm morphology and interval pattern analyzed</li><li>Confidence-weighted quality-improvement comparison</li><li>Decision-support output only</li></ul></div></Panel>
        {aiAccepted ? <Panel title="Clinician Decision" action={<span className={`review-state ${clinicianMaintained ? "maintained" : "accepted"}`}>{clinicianMaintained ? <Stethoscope size={13}/> : <BrainCircuit size={13}/>} {clinicianMaintained ? "Clinician maintained" : "AI accepted"}</span>}><div className={`expert-record ai-accepted-record ${clinicianMaintained ? "clinician-maintained-record" : ""}`}><div><span>FINALIZED COMPARISON RESULT</span><h3>{clinicianMaintained ? selected.clinicianDx : selected.aiDx}</h3><small>Finalized by the treating clinician · {submission.finalizedAt}</small></div><p>{clinicianMaintained ? "The original clinician interpretation was maintained after reviewing the simulated AI comparison. No expert adjudication was requested." : "This simulated AI interpretation was accepted for the quality-improvement record. No expert adjudication was requested."}</p></div></Panel> : <>
          <Panel title="Expert Review" action={<span className="review-state reviewed"><CheckCircle2 size={13}/>Final</span>}><div className="expert-record"><div><span>FINAL DIAGNOSIS</span><h3>{submission.finalDx}</h3><small>{submission.expertName} · {submission.reviewedAt}</small></div><p>{submission.expertNotes}</p></div></Panel>
          <Panel title="Key Takeaway" action={<BookOpen size={17} className="takeaway-icon"/>}><div className="case-takeaway"><BookOpen size={21}/><p>{submission.takeaway}</p></div></Panel>
        </>}
      </aside>
    </div>
  </>;
}

function QueueCaseDetails({ caseItem, submission, completed, reviewer }: { caseItem: Case; submission?: ClinicianReviewSubmission; completed: boolean; reviewer: string }) {
  return <><div><span className="id-link">{caseItem.patientId}</span><PriorityBadge priority={caseItem.priority}/></div><p>Clinician: <strong>{caseItem.clinicianDx}</strong></p><p>AI: <strong className="blue-text">{caseItem.aiDx}</strong></p>
    {submission && <div className="queue-submission-details"><span>{submission.ageRange || `${caseItem.age} years`} · {submission.sexLabel || caseItem.sex}</span><span>{caseItem.department}</span>{submission.matchRating !== undefined && <strong>{submission.matchRating}% match</strong>}{submission.reason && <p>{submission.reason}</p>}</div>}
    {completed && <p className="final">Expert final: {caseItem.aiDx}<CheckCircle2 size={15}/></p>}<footer><span><Clock3 size={14}/>{caseItem.elapsed}</span>{completed&&<b>{reviewer}</b>}</footer></>;
}

function ReviewPage({ submissions, onReviewCompleted }: { submissions: ClinicianReviewSubmission[]; onReviewCompleted: (caseId: string, finalDx: string, takeaway: string, expertNotes: string) => void }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ caseItem: Case; completed: boolean } | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const severityRank: Record<Priority, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortBySeverity = (items: Case[]) => [...items].sort((a,b) => severityRank[b.priority] - severityRank[a.priority] || a.patientId.localeCompare(b.patientId));
  const submittedAwaiting = submissions.filter(item => item.status === "awaiting").map(item => item.caseItem);
  const submittedReviewed = submissions.filter(item => item.status === "reviewed").map(item => ({ ...item.caseItem, aiDx: item.finalDx || item.caseItem.aiDx, elapsed: item.reviewedAt || "Expert reviewed" }));
  const newlyCompleted = completedIds.map(id => cases.find(c => c.id === id)).filter((c): c is Case => Boolean(c));
  const genericAwaiting = cases.slice(0,7).filter(item => !submissions.some(submission => submission.caseItem.id === item.id));
  const columns = [
    { key: "pending", title: "YET TO REVIEW", tone: "amber", items: sortBySeverity([...submittedAwaiting, ...genericAwaiting].filter(c => !completedIds.includes(c.id))) },
    { key: "complete", title: "EXPERT REVIEWED", tone: "green", items: sortBySeverity([...submittedReviewed, ...newlyCompleted].filter((item,index,array) => array.findIndex(other => other.id === item.id) === index)) },
  ];
  return <>
    <PageHeader title="Expert Review Queue" subtitle="Only cases escalated for expert adjudication · Highest severity first" actions={<select aria-label="Department filter"><option>All Departments</option><option>Emergency</option><option>Cardiology</option></select>}/>
    <div className="review-scope-note"><ShieldCheck size={16}/><span>Clinician-only decisions and accepted AI suggestions are excluded. Completed means an expert submitted a final adjudication.</span></div>
    <div className="kanban review-kanban">{columns.map(col=><section id={col.key === "complete" ? "completed" : "pending"} key={col.key} className="kanban-col"><header className={col.tone}><span>{col.title}</span><b>{col.items.length}</b></header>{col.items.map((caseItem,index)=><button key={caseItem.id} className={`case-card ${selected?.caseItem.id === caseItem.id ? "selected" : ""}`} onClick={()=>col.key === "complete" ? navigate(`/cases/${encodeURIComponent(caseItem.patientId)}`) : setSelected({caseItem, completed:false})}><QueueCaseDetails caseItem={caseItem} submission={submissions.find(item=>item.caseItem.id===caseItem.id)} completed={col.key==="complete"} reviewer={index%2 ? "Dr. Patel" : "Dr. Chen"}/></button>)}</section>)}</div>
    {selected && <ExpertReviewDrawer key={selected.caseItem.id} submission={submissions.find(item=>item.caseItem.id===selected.caseItem.id)} completed={selected.completed} caseItem={selected.caseItem} onClose={()=>setSelected(null)} onSubmit={(finalDx,takeaway,expertNotes)=>{ setCompletedIds(ids => ids.includes(selected.caseItem.id) ? ids : [...ids, selected.caseItem.id]); onReviewCompleted(selected.caseItem.id, finalDx, takeaway, expertNotes); }}/>}
  </>;
}

function ExpertReviewDrawer({ caseItem, submission, onClose, onSubmit, completed = false }: { caseItem: Case; submission?: ClinicianReviewSubmission; onClose: () => void; onSubmit: (finalDx: string, takeaway: string, expertNotes: string) => void; completed?: boolean }) {
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
    onSubmit(finalDx, takeaway, notes);
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
          {submission && <div className="drawer-case-context">{[["Age",submission.ageRange || `${caseItem.age} years`],["Sex",submission.sexLabel || caseItem.sex],["Department",caseItem.department],["Match",submission.matchRating !== undefined ? `${submission.matchRating}%` : "—"],["AI Confidence",submission.aiConfidence !== undefined ? `${submission.aiConfidence}%` : "—"],["Reason",submission.reason || caseItem.chiefComplaint]].map(([label,value])=><span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}
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

function LearningPage({ submissions }: { submissions: ClinicianReviewSubmission[] }) {
  const radar = [{name:"Arrhythmia",you:88,dept:84},{name:"Ischemia",you:78,dept:79},{name:"Conduction",you:94,dept:86},{name:"ST Changes",you:82,dept:80},{name:"Normal",you:96,dept:91},{name:"Axis Dev.",you:85,dept:82}];
  const clinicianFinalized = submissions.filter(item => item.status === "finalized").sort((a,b) => (b.finalizedSort || 0) - (a.finalizedSort || 0));
  const reviewedByPatientId = new Map(submissions.filter(item => item.status === "reviewed").map(item => [item.caseItem.patientId, item]));
  const monthlyCaseCount = 47 + clinicianFinalized.length;
  return <>
    <PageHeader title="Learning Dashboard" subtitle="Dr. Adaeze Nkemdirim · Private · Updated daily" actions={<span className="success-badge">↗ Concordance improved 12% this quarter</span>}/>
    <div className="celebration"><Award size={35}/><div><strong>Outstanding Progress, Dr. Nkemdirim!</strong><p>You have completed {monthlyCaseCount} learning cases this month, including {clinicianFinalized.length} clinician-finalized comparison{clinicianFinalized.length === 1 ? "" : "s"} in this session. Your concordance rate is 88%.</p></div></div>
    <div className="kpi-grid"><KpiCard icon={CheckCircle2} tone="green" value="88%" label="Concordance Rate" delta="↗ 12%" note="↑ 12% from last quarter"/><KpiCard icon={Sparkles} tone="blue" value="+4.2 pts" label="Monthly Improvement" delta="↗ 14%" note="Strongest in Conduction"/><KpiCard icon={ClipboardList} tone="purple" value={String(monthlyCaseCount)} label="Learning Cases" delta={clinicianFinalized.length ? `+${clinicianFinalized.length} new` : "↗ 8%"} note={`This month · ${312 + clinicianFinalized.length} lifetime`}/><KpiCard icon={Star} tone="amber" value="18 days" label="Learning Streak" delta="↗ 0%" note="Keep going!"/></div>
    <div id="performance" className="learning-charts">
      <Panel title="Performance by ECG Type" subtitle="Your accuracy vs. department average"><div className="chart radar"><ResponsiveContainer><RadarChart data={radar} outerRadius="72%"><PolarGrid stroke={gridStyle}/><PolarAngleAxis dataKey="name" tick={tickStyle}/><Radar name="You" dataKey="you" stroke={chartBlue} fill={chartBlue} fillOpacity={.25}/><Radar name="Dept. Avg." dataKey="dept" stroke="#94A3B8" fill="#CBD5E1" fillOpacity={.15} strokeDasharray="4 3"/><Legend/></RadarChart></ResponsiveContainer></div></Panel>
      <Panel title="Personal Concordance Trend" subtitle="Your improvement over the last 6 months"><div className="chart radar"><ResponsiveContainer><AreaChart data={personalTrend} margin={{top:10,right:12,left:-12,bottom:0}}><defs><linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={green} stopOpacity=".28"/><stop offset="1" stopColor={green} stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke={gridStyle} strokeDasharray="4 4"/><XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false}/><YAxis domain={[70,95]} ticks={[70,77,84,95]} tick={tickStyle} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="rate" stroke={green} strokeWidth={2.5} fill="url(#greenFade)" dot={{r:4,fill:"#0F1B2D",stroke:green,strokeWidth:2}}/></AreaChart></ResponsiveContainer></div></Panel>
    </div>
    <Panel id="recent-learning" title="Recent Learning Activity" subtitle="Expert feedback and clinician-accepted AI comparisons" className="learning-list">
      {clinicianFinalized.map(item => { const maintained = item.finalizedDecision === "clinician-maintained"; return <article className="learning-row accepted-learning-row" key={item.id}><div className="learning-meta"><Link className="id-link" to={`/cases/${item.caseItem.patientId}`}>{item.caseItem.patientId}</Link><span className={`category ${maintained ? "maintained-category" : "ai-category"}`}>{maintained ? "Clinician maintained" : "AI accepted"}</span><span>Finalized {item.finalizedAt}</span></div><div className="dx-compare"><span>Your Dx: <b>{item.caseItem.clinicianDx}</b></span><span>{maintained ? "AI Comparison" : "Accepted AI Dx"}: <b>{item.caseItem.aiDx}</b></span></div><p className={`takeaway ${maintained ? "maintained-learning" : "ai-learning"}`}>{maintained ? <Stethoscope size={16}/> : <BrainCircuit size={16}/>}<strong>Reflection:</strong>Review the {item.matchRating}% clinician/AI match and the model’s detected features in the saved case record.</p></article>; })}
      {learningCases.map(c=><article className="learning-row" key={c.caseId}><div className="learning-meta">{reviewedByPatientId.has(c.caseId) ? <Link className="id-link" to={`/cases/${c.caseId}`}>{c.caseId}</Link> : <b className="id-link">{c.caseId}</b>}<span className="category">{c.category}</span><span>Reviewed {c.reviewedAt}</span></div><div className="dx-compare"><span>Your Dx: <b>{c.yourDx}</b></span><span>Expert Final Dx: <b>{c.expertFinalDx}</b></span></div><p className="takeaway"><BookOpen size={16}/><strong>Key Takeaway:</strong>{c.keyTakeaway}</p></article>)}
    </Panel>
  </>;
}

function AnalyticsPage() {
  const dept = [{name:"Cardiology",a:94,m:4,x:2},{name:"Emergency",a:82,m:11,x:7},{name:"ICU",a:88,m:8,x:4},{name:"Internal Med.",a:78,m:14,x:8},{name:"Surgery",a:85,m:10,x:5}];
  const dist = [{name:"Normal Sinus",value:31,color:"#2563EB"},{name:"Arrhythmia",value:22,color:"#16A34A"},{name:"Conduction Block",value:17,color:"#D97706"},{name:"Ischemia/MI",value:14,color:"#DC2626"},{name:"Other",value:16,color:"#7C3AED"}];
  const volume = personalTrend.map((x,i)=>({month:x.month,volume:245+i*18,discrepancies:17-i}));
  return <>
    <PageHeader title="Analytics" subtitle="Hospital-wide aggregate metrics · No individual physician data" actions={<><select><option>Last 6 Months</option><option>Last 12 Months</option></select><button className="button secondary"><Filter size={15}/>Export</button></>}/>
    <div className="privacy-banner"><ShieldCheck size={16}/>Aggregate quality-improvement reporting only. No individual clinician performance is shown.</div>
    <div id="review-turnaround" className="kpi-grid"><KpiCard icon={CheckCircle2} tone="green" value="88.1%" label="Overall Agreement Rate" delta="↗ 3.4%" note="All departments combined"/><KpiCard icon={AlertTriangle} tone="amber" value="4.8%" label="Significant Discrepancies" delta="↓ 1.2%" note="↓ 1.2 pts from last period"/><KpiCard icon={Clock3} tone="blue" value="23 min" label="Avg. Review Turnaround" delta="↗ 18%" note="Target: ≤30 min"/><KpiCard icon={Activity} tone="purple" value="1,847" label="Total ECGs Reviewed" delta="↗ 6%" note="This reporting period"/></div>
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

export default function EcgQiApp({ initialPath = "/", staticHosting = false }: { initialPath?: string; staticHosting?: boolean }) {
  if (typeof window === "undefined") {
    return <MemoryRouter initialEntries={[initialPath]}><Shell/></MemoryRouter>;
  }
  if (staticHosting) {
    return <HashRouter><Shell/></HashRouter>;
  }
  return <BrowserRouter><Shell/></BrowserRouter>;
}
