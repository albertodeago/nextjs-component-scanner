import { Card, CardHeader, CardBody } from "@/components/ui";

// Server component that fetches data
async function StatsCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <StatsCard title="Total Users" value="1,234" />
        <StatsCard title="Active Sessions" value="567" />
        <StatsCard title="Revenue" value="$12,345" />
      </div>
    </div>
  );
}
