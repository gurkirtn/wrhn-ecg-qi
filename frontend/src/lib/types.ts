export type UserRole = "clinician" | "expert";
export type CaseStatus = "draft" | "awaiting_review" | "reviewed" | "finalized";

export interface EcgCase {
  id: string;
  patientId: string;
  clinicianDiagnosis: string;
  aiDiagnosis: string;
  status: CaseStatus;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  displayName: string;
  roles: UserRole[];
}
