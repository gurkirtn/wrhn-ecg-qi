import type { EcgCase } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function listCases(): Promise<EcgCase[]> {
  const response = await fetch(`${apiBaseUrl}/cases`);
  if (!response.ok) throw new Error("Unable to load ECG cases");
  return response.json() as Promise<EcgCase[]>;
}
