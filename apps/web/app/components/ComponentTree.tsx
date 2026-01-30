"use client";

import { useState } from "react";
import type { ScanResult } from "@nextxray/browser";

interface ComponentTreeProps {
  node: ScanResult;
  results: Map<string, ScanResult>;
  depth?: number;
}

const clientStyles = {
  backgroundColor: "#fee2e2",
  borderLeft: "3px solid #ef4444",
};

const serverStyles = {
  backgroundColor: "#dcfce7",
  borderLeft: "3px solid #22c55e",
};

function shortenPath(path: string): string {
  const parts = path.split("/");
  if (parts.length <= 3) return path;
  return ".../" + parts.slice(-3).join("/");
}

export function ComponentTree({ node, results, depth = 0 }: ComponentTreeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const isClient = node.metadata.component.isClientComponent;

  const nodeStyle: React.CSSProperties = {
    padding: "8px",
    marginBottom: "4px",
    borderRadius: "4px",
    marginLeft: depth * 20,
    ...(isClient ? clientStyles : serverStyles),
  };

  const toggleStyle: React.CSSProperties = {
    cursor: "pointer",
    fontFamily: "monospace",
    marginRight: "8px",
    userSelect: "none",
    display: "inline-block",
    width: "16px",
  };

  const componentName = node.metadata.component.name || "(anonymous)";

  return (
    <div>
      <div style={nodeStyle}>
        {hasChildren ? (
          <span style={toggleStyle} onClick={() => setExpanded(!expanded)}>
            {expanded ? "▼" : "▶"}
          </span>
        ) : (
          <span style={toggleStyle}> </span>
        )}
        <strong>{componentName}</strong>
        <span style={{ marginLeft: "8px", fontSize: "12px", color: "#666" }}>
          {shortenPath(node.id)}
        </span>
        {isClient && (
          <span
            style={{
              marginLeft: "8px",
              fontSize: "11px",
              color: "#dc2626",
              fontWeight: 500,
            }}
          >
            client
          </span>
        )}
      </div>

      {expanded &&
        hasChildren &&
        node.children.map((child, idx) => {
          const childNode = results.get(child.childId);
          if (!childNode) {
            return (
              <div
                key={child.childId + idx}
                style={{
                  marginLeft: (depth + 1) * 20,
                  padding: "8px",
                  marginBottom: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#f3f4f6",
                  borderLeft: "3px solid #9ca3af",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <span style={{ fontFamily: "monospace", marginRight: "8px", width: "16px", display: "inline-block" }}> </span>
                {child.params.name}
                <span style={{ marginLeft: "8px", color: "#999" }}>
                  (unresolved: {child.params.source})
                </span>
              </div>
            );
          }
          return (
            <ComponentTree
              key={child.childId + idx}
              node={childNode}
              results={results}
              depth={depth + 1}
            />
          );
        })}
    </div>
  );
}
