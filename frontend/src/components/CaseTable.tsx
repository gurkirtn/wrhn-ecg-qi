import type { EcgCase } from "../lib/types";

export function CaseTable({ cases }: { cases: EcgCase[] }) {
  return <table><thead><tr><th>Patient ID</th><th>Clinician diagnosis</th><th>AI diagnosis</th><th>Status</th></tr></thead>
    <tbody>{cases.map(item => <tr key={item.id}><td>{item.patientId}</td><td>{item.clinicianDiagnosis}</td><td>{item.aiDiagnosis}</td><td>{item.status}</td></tr>)}</tbody></table>;
}
