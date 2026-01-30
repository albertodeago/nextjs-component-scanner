"use client";

import { useState, useMemo } from "react";
import type { RouteEntry, ScanResult } from "@nextxray/browser";
import { ComponentTree } from "./ComponentTree";

interface TreeViewProps {
  routes: RouteEntry[];
  results: Record<string, ScanResult>;
}

export function TreeView({ routes, results }: TreeViewProps) {
  const resultsMap = useMemo(() => new Map(Object.entries(results)), [results]);

  return (
    <section style={{ marginBottom: "24px" }}>
      <h3>Component Trees</h3>
      <div
        style={{
          fontSize: "12px",
          marginBottom: "12px",
          color: "#666",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            backgroundColor: "#dcfce7",
            border: "1px solid #22c55e",
            marginRight: "4px",
            verticalAlign: "middle",
          }}
        />
        Server Component
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid #ef4444",
            marginLeft: "16px",
            marginRight: "4px",
            verticalAlign: "middle",
          }}
        />
        Client Component
      </div>

      {routes.map((route) => (
        <RouteTreeSection
          key={route.route + route.entryFile}
          route={route}
          resultsMap={resultsMap}
        />
      ))}
    </section>
  );
}

interface RouteTreeSectionProps {
  route: RouteEntry;
  resultsMap: Map<string, ScanResult>;
}

function RouteTreeSection({ route, resultsMap }: RouteTreeSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      style={{
        marginBottom: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "12px",
          backgroundColor: "#f9fafb",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontFamily: "monospace" }}>{expanded ? "▼" : "▶"}</span>
        <strong>{route.route}</strong>
        <span
          style={{
            fontSize: "12px",
            color: "#666",
            backgroundColor: "#e5e7eb",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {route.entryType}
        </span>
      </div>
      {expanded && (
        <div style={{ padding: "12px" }}>
          <ComponentTree node={route.tree} results={resultsMap} depth={0} />
        </div>
      )}
    </div>
  );
}
