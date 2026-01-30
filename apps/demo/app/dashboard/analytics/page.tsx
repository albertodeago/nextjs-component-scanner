"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";

// Client component with state
function DateRangePicker({ onChange }: { onChange: (range: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button onClick={() => onChange("7d")}>7 Days</Button>
      <Button onClick={() => onChange("30d")}>30 Days</Button>
      <Button onClick={() => onChange("90d")}>90 Days</Button>
    </div>
  );
}

// Local chart placeholder
function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div style={{ height: "200px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p>{title} Chart</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div>
      <h1>Analytics</h1>
      <DateRangePicker onChange={setDateRange} />
      <p>Showing data for: {dateRange}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "16px" }}>
        <Card title="Page Views">
          <CardBody>
            <ChartPlaceholder title="Page Views" />
          </CardBody>
        </Card>
        <Card title="User Sessions">
          <CardBody>
            <ChartPlaceholder title="Sessions" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
