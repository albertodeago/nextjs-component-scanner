"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";

// Namespace import - all UI components
import * as UI from "@/components/ui";

// Named imports
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Dynamic import with next/dynamic
const DynamicChart = dynamic(() => import("@/components/heavy/Chart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
}) as React.ComponentType<{ data: number[]; title: string }>;

// Dynamic import with React.lazy
const LazyEditor = React.lazy(() => import("@/components/heavy/RichTextEditor"));

// Dynamic import with custom loading
const DynamicTable = dynamic(
  () => import("@/components/heavy/DataTable"),
  {
    loading: () => <div style={{ height: "200px", background: "#f5f5f5" }}>Loading table...</div>,
  }
) as React.ComponentType<{
  data: Array<Record<string, unknown>>;
  columns: Array<{ key: string; header: string }>;
}>;

// Local component using namespace import
function NamespaceDemo() {
  return (
    <UI.Card title="Namespace Import Demo">
      <UI.CardBody>
        <p>This card uses namespace imports (UI.*)</p>
        <UI.Button>Namespace Button</UI.Button>
      </UI.CardBody>
    </UI.Card>
  );
}

// Sample data for demos
const chartData = [10, 25, 15, 30, 45, 20, 35];
const tableData = [
  { id: 1, name: "Item A", category: "Cat 1", price: 100 },
  { id: 2, name: "Item B", category: "Cat 2", price: 200 },
  { id: 3, name: "Item C", category: "Cat 1", price: 150 },
];

export default function ExamplesPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);

  return (
    <div>
      <h1>Edge Cases Examples</h1>

      {/* Namespace imports */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Namespace Imports (import * as UI)</h2>
        <NamespaceDemo />
      </section>

      {/* Dynamic imports with next/dynamic */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Dynamic Import (next/dynamic)</h2>
        <Card>
          <CardHeader>Chart Component</CardHeader>
          <CardBody>
            <Button onClick={() => setShowChart(!showChart)}>
              {showChart ? "Hide" : "Show"} Chart
            </Button>
            {showChart && <DynamicChart data={chartData} title="Sales Data" />}
          </CardBody>
        </Card>
      </section>

      {/* React.lazy */}
      <section style={{ marginBottom: "32px" }}>
        <h2>React.lazy Import</h2>
        <Card>
          <CardHeader>Rich Text Editor</CardHeader>
          <CardBody>
            <Button onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? "Hide" : "Show"} Editor
            </Button>
            {showEditor && (
              <Suspense fallback={<p>Loading editor...</p>}>
                <LazyEditor initialValue="Start typing..." />
              </Suspense>
            )}
          </CardBody>
        </Card>
      </section>

      {/* Another dynamic import */}
      <section style={{ marginBottom: "32px" }}>
        <h2>Dynamic Import with Custom Loading</h2>
        <Card>
          <CardHeader>Data Table</CardHeader>
          <CardBody>
            <Button onClick={() => setShowTable(!showTable)}>
              {showTable ? "Hide" : "Show"} Table
            </Button>
            {showTable && (
              <DynamicTable
                data={tableData}
                columns={[
                  { key: "id", header: "ID" },
                  { key: "name", header: "Name" },
                  { key: "category", header: "Category" },
                  { key: "price", header: "Price" },
                ]}
              />
            )}
          </CardBody>
        </Card>
      </section>

      {/* Mixed imports */}
      <section>
        <h2>Mixed Import Styles</h2>
        <div style={{ display: "flex", gap: "16px" }}>
          <Card title="Named Import">
            <CardBody>
              <Button>Named Import Button</Button>
            </CardBody>
          </Card>
          <UI.Card title="Namespace Import">
            <UI.CardBody>
              <UI.Button>Namespace Button</UI.Button>
            </UI.CardBody>
          </UI.Card>
        </div>
      </section>
    </div>
  );
}
