import Link from "next/link";
import type { ComponentType } from "react";

export interface SidebarItem {
  href: string;
  label: string;
  icon?: ComponentType<{ size?: number }>;
}

export function Sidebar({ items, activePath }: { items: SidebarItem[]; activePath: string }) {
  return <aside aria-label="Application navigation">
    <nav>{items.map(({ href, label, icon: Icon }) =>
      <Link key={href} href={href} aria-current={activePath === href ? "page" : undefined}>
        {Icon && <Icon size={18}/>}<span>{label}</span>
      </Link>)}</nav>
  </aside>;
}
