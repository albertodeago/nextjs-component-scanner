"use client";

import type { ProjectScanResult } from "@nextxray/browser";

interface ScanResultsProps {
  result: ProjectScanResult;
}

export function ScanResults({ result }: ScanResultsProps) {
  const { stats, routes } = result;
  const { sharedComponents } = stats;

  return (
    <div style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Scan Results</h2>

      <section style={{ marginBottom: "24px" }}>
        <h3>Project Stats</h3>
        <ul>
          <li>Total files scanned: {stats.totalFiles}</li>
          <li>Entry points: {routes.length}</li>
          <li>
            Client components: {stats.clientComponents} (effective:{" "}
            {stats.effectiveClientComponents})
          </li>
          <li>
            Server components: {stats.serverComponents} (effective:{" "}
            {stats.effectiveServerComponents})
          </li>
          <li>Client/Server ratio: {(stats.ratio * 100).toFixed(1)}%</li>
          <li>Shared components: {sharedComponents.length}</li>
        </ul>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h3>Routes ({routes.length})</h3>
        <ul>
          {routes.map((route) => (
            <li key={route.route + route.entryFile} style={{ marginBottom: "8px" }}>
              <strong>{route.route}</strong> ({route.entryType})
              <br />
              <small>
                {route.entryFile} - {route.tree.children.length} direct children
                {route.tree.metadata.component.isClientComponent &&
                  " (client boundary)"}
              </small>
            </li>
          ))}
        </ul>
      </section>

      {sharedComponents.length > 0 && (
        <section style={{ marginBottom: "24px" }}>
          <h3>Most Used Shared Components</h3>
          <ul>
            {sharedComponents.slice(0, 10).map((comp) => (
              <li key={comp.id}>
                <code>{comp.id}</code> - used by {comp.usageCount} file(s)
              </li>
            ))}
          </ul>
        </section>
      )}

      <details>
        <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
          Raw JSON Output
        </summary>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "16px",
            overflow: "auto",
            maxHeight: "400px",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}
