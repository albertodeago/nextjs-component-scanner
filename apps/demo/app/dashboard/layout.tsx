import { Sidebar } from "@/components/layout/Sidebar";

const sidebarItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/users", label: "Users" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
      <Sidebar items={sidebarItems} />
      <div style={{ flex: 1, padding: "16px" }}>{children}</div>
    </div>
  );
}
