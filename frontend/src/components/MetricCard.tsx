import type { ReactNode } from "react";

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail?: string; icon?: ReactNode }) {
  return <article>{icon}<strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</article>;
}
