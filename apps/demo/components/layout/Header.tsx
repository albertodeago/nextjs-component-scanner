import Link from "next/link";

export function Header() {
  return (
    <header style={{ padding: "16px", borderBottom: "1px solid #eee" }}>
      <nav style={{ display: "flex", gap: "16px" }}>
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/settings">Settings</Link>
        <Link href="/examples">Examples</Link>
      </nav>
    </header>
  );
}
