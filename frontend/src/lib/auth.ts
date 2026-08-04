import type { SessionUser } from "./types";

export const demoUsers: SessionUser[] = [
  { id: "clinician", displayName: "Dr. Elena Rossi", roles: ["clinician"] },
  { id: "expert", displayName: "Dr. Maya Chen", roles: ["expert"] },
  { id: "dual", displayName: "Dr. A. Nkemdirim", roles: ["clinician", "expert"] },
];

export function findDemoUser(id: string): SessionUser | undefined {
  return demoUsers.find(user => user.id === id);
}
