import Link from "next/link";
import { Card, CardBody } from "@/components/ui";

// Server component for settings navigation
function SettingsNav() {
  const links = [
    { href: "/settings", label: "General" },
    { href: "/settings/profile", label: "Profile" },
    { href: "/settings/notifications", label: "Notifications" },
  ];

  return (
    <nav style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Settings</h1>
      <SettingsNav />
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
}
