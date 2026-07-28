export type Priority = "low" | "medium" | "high" | "critical";
export type CaseStatus = "new" | "waiting" | "review" | "complete";
export type Verdict = "concordant" | "minor" | "major";

export interface Case {
  id: string;
  patientId: string;
  age: number;
  sex: "Male" | "Female";
  department: string;
  orderingPhysician: string;
  chiefComplaint: string;
  bp: string;
  hrAtAcquisition: number;
  encounter: string;
  acquiredAt: string;
  waveform: string;
  priority: Priority;
  status: CaseStatus;
  clinicianDx: string;
  aiDx: string;
  verdict: Verdict;
  elapsed: string;
}

export interface Interpretation {
  caseId: string;
  author: "clinician" | "AI";
  primaryDx: string;
  findings: string[];
  note: string;
  confidence: number;
}

export interface AiPrediction extends Interpretation {
  modelVersion: string;
  latencyMs: number;
  explanation: string;
  isSimulated: boolean;
}

export interface Discrepancy {
  caseId: string;
  verdict: Verdict;
  tier: number;
}

export interface Adjudication {
  caseId: string;
  reviewer: string;
  finalDx: string;
  note: string;
  decidedAt: string;
}

export interface LearningCase {
  caseId: string;
  category: string;
  yourDx: string;
  expertFinalDx: string;
  keyTakeaway: string;
  reviewedAt: string;
}
