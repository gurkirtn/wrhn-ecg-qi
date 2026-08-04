"use client";

import { useState } from "react";
import { findDemoUser } from "../lib/auth";
import type { SessionUser } from "../lib/types";

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  return { user, login: (id: string) => setUser(findDemoUser(id) ?? null), logout: () => setUser(null) };
}
