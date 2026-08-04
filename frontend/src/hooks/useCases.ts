"use client";

import { useEffect, useState } from "react";
import { listCases } from "../lib/api";
import type { EcgCase } from "../lib/types";

export function useCases() {
  const [cases, setCases] = useState<EcgCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { listCases().then(setCases).catch(reason => setError(String(reason))).finally(() => setLoading(false)); }, []);
  return { cases, loading, error };
}
