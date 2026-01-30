"use client";

import { useState } from "react";
import Link from "next/link";

interface SidebarProps {
  items: Array<{ href: string; label: string }>;
}

export function Sidebar({ items }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{ width: collapsed ? "60px" : "200px", borderRight: "1px solid #eee" }}>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? ">" : "<"}
      </button>
      {!collapsed && (
        <nav>
          {items.map((item) => (
            <Link key={item.href} href={item.href} style={{ display: "block", padding: "8px" }}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </aside>
  );
}
