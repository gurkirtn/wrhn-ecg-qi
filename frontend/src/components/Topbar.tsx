import type { ReactNode } from "react";

export function Topbar({ title, actions }: { title: string; actions?: ReactNode }) {
  return <header><strong>{title}</strong>{actions && <div>{actions}</div>}</header>;
}
