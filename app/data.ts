import type { AiPrediction, Case, LearningCase } from "./types";

const diagnoses = [
  ["Sinus Tachycardia", "Sinus Tachycardia", "concordant"],
  ["Normal Sinus Rhythm", "1st Degree AV Block", "minor"],
  ["Atrial Fibrillation", "Atrial Flutter", "major"],
  ["RBBB", "RBBB + Ant. STEMI", "major"],
  ["STEMI", "STEMI with LVH", "major"],
  ["Normal Sinus Rhythm", "WPW Pattern", "major"],
  ["Sinus Bradycardia", "2nd Degree AV Block", "major"],
  ["LBBB", "LBBB", "concordant"],
  ["Ventricular Paced Rhythm", "Ventricular Paced Rhythm", "concordant"],
  ["VT", "Wide Complex Tachycardia", "minor"],
  ["Normal Sinus Rhythm", "Posterior MI", "major"],
  ["Atrial Flutter", "Atrial Flutter", "concordant"],
  ["1st Degree AV Block", "1st Degree AV Block", "concordant"],
  ["Ischemia", "NSTEMI", "minor"],
  ["Axis Deviation", "Left Axis Deviation", "minor"],
  ["Atrial Fibrillation", "Atrial Fibrillation", "concordant"],
  ["Normal Sinus Rhythm", "Normal Sinus Rhythm", "concordant"],
  ["ST Changes", "Acute Pericarditis", "major"],
  ["RBBB", "RBBB", "concordant"],
  ["Sinus Tachycardia", "Atrial Flutter", "major"],
] as const;

const departments = ["Emergency", "Cardiology", "ICU", "Internal Medicine", "Surgery"];

export const cases: Case[] = diagnoses.map((d, i) => ({
  id: `case-${20839 + i}`,
  patientId: `PT-${20839 + i}`,
  age: i === 0 ? 67 : 38 + ((i * 7) % 47),
  sex: i % 3 === 0 ? "Female" : "Male",
  department: departments[i % departments.length],
  orderingPhysician: i === 0 ? "Dr. M. Reyes" : ["Dr. Chen", "Dr. Patel", "Dr. Okafor"][i % 3],
  chiefComplaint: i === 0 ? "Chest pain, palpitations" : ["Dizziness", "Dyspnea", "Syncope", "Chest discomfort"][i % 4],
  bp: i === 0 ? "138/84 mmHg" : `${112 + i}/${70 + (i % 14)} mmHg`,
  hrAtAcquisition: i === 0 ? 148 : 58 + ((i * 11) % 93),
  encounter: `ENC-${881204 + i}`,
  acquiredAt: `Dec ${18 - (i % 8)}, 2024 · ${String(9 + (i % 6)).padStart(2, "0")}:${String(12 + i * 3).slice(-2)}`,
  waveform: `waveform-${i + 1}`,
  priority: i === 0 || i === 4 ? "high" : i % 7 === 0 ? "critical" : i % 3 === 0 ? "medium" : "low",
  status: i < 4 ? "waiting" : i < 7 ? "review" : "complete",
  clinicianDx: d[0],
  aiDx: d[1],
  verdict: d[2],
  elapsed: i < 7 ? `${8 + i * 7} min` : `${1 + (i % 4)}.${i % 6} hr`,
}));

export const aiPredictions: Record<string, AiPrediction> = {
  "PT-20839": {
    caseId: "case-20839",
    author: "AI",
    modelVersion: "v2.4",
    latencyMs: 99,
    primaryDx: "Atrial Flutter",
    findings: ["Regular sawtooth flutter waves at ~300 bpm", "2:1 AV block pattern detected", "Ventricular rate ~150 bpm (regular)"],
    note: "Decision-support output only; clinician judgment remains final.",
    confidence: 76,
    explanation: "Regular flutter waves at ~300 bpm with 2:1 block were detected. RR interval regularity and sawtooth morphology distinguish this from AF.",
    isSimulated: true,
  },
};

export const learningCases: LearningCase[] = [
  { caseId: "PT-20710", category: "Arrhythmia", yourDx: "Sinus Tachycardia", expertFinalDx: "Atrial Flutter", reviewedAt: "Dec 18", keyTakeaway: "Flutter waves at 300 bpm with 2:1 block can mimic sinus tachycardia - check V1 carefully." },
  { caseId: "PT-20698", category: "Ischemia", yourDx: "Normal Sinus Rhythm", expertFinalDx: "Posterior MI", reviewedAt: "Dec 15", keyTakeaway: "Reciprocal ST depression in V1-V3 with tall R waves is a posterior STEMI equivalent." },
  { caseId: "PT-20681", category: "Conduction", yourDx: "Left Bundle Branch Block", expertFinalDx: "Ventricular Paced Rhythm", reviewedAt: "Dec 12", keyTakeaway: "Look for subtle pacing spikes before each broad QRS complex." },
];

export const trend12 = [
  { month: "Jan", rate: 81.2 }, { month: "Feb", rate: 82.7 }, { month: "Mar", rate: 83.0 },
  { month: "Apr", rate: 84.8 }, { month: "May", rate: 85.3 }, { month: "Jun", rate: 86.1 },
  { month: "Jul", rate: 87.4 }, { month: "Aug", rate: 86.9 }, { month: "Sep", rate: 88.2 },
  { month: "Oct", rate: 89.0 }, { month: "Nov", rate: 88.7 }, { month: "Dec", rate: 90.1 },
];

export const personalTrend = [
  { month: "Jul", rate: 76 }, { month: "Aug", rate: 78 }, { month: "Sep", rate: 80 },
  { month: "Oct", rate: 79 }, { month: "Nov", rate: 83 }, { month: "Dec", rate: 88 },
];

export const discrepancyData = [
  { name: "ST Changes", value: 14 }, { name: "Arrhythmia", value: 9 }, { name: "Conduction", value: 18 },
  { name: "Ischemia", value: 7 }, { name: "Axis Deviation", value: 12 }, { name: "Chamber Hyp.", value: 8 },
];

export const aiService = {
  async getReadForCase(caseId: string): Promise<AiPrediction> {
    await new Promise((resolve) => setTimeout(resolve, 320));
    return aiPredictions[caseId] ?? { ...aiPredictions["PT-20839"], caseId };
  },
};

export function classify(clinicianDx: string, aiDx: string, referenceDx = aiDx) {
  if (clinicianDx === aiDx) return "concordant" as const;
  const critical = ["STEMI", "VT", "Posterior MI", "Atrial Flutter"];
  return critical.some((x) => referenceDx.includes(x)) ? "major" as const : "minor" as const;
}
