"use client";

import { useEffect } from "react";
import { useScanner } from "./hooks/useScanner";
import { ProjectPicker } from "./components/ProjectPicker";
import { ScanResults } from "./components/ScanResults";

export default function Home() {
  const { state, scan, reset, checkSupport } = useScanner();

  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  const isScanning =
    state.status === "checking" ||
    state.status === "discovering" ||
    state.status === "scanning";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <main style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ marginBottom: "8px" }}>Next.js X-Ray</h1>
        <p style={{ color: "#666", marginBottom: "32px" }}>
          Analyze your Next.js project&apos;s component structure
        </p>

        {state.status === "error" && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            <strong>Error:</strong> {state.error}
            <br />
            <button
              onClick={reset}
              style={{ marginTop: "12px", padding: "8px 16px" }}
            >
              Try Again
            </button>
          </div>
        )}

        {state.status !== "done" && state.status !== "error" && (
          <ProjectPicker onSelect={scan} disabled={isScanning} />
        )}

        {state.status === "checking" && (
          <p style={{ marginTop: "16px", color: "#666" }}>
            Checking if this is a Next.js project...
          </p>
        )}

        {state.status === "discovering" && (
          <p style={{ marginTop: "16px", color: "#666" }}>{state.progress}</p>
        )}

        {state.status === "scanning" && (
          <div style={{ marginTop: "16px", color: "#666" }}>
            <p>{state.progress}</p>
            <p>
              Entry point {state.current} of {state.total}
            </p>
          </div>
        )}

        {state.status === "done" && (
          <>
            <button
              onClick={reset}
              style={{ marginBottom: "24px", padding: "8px 16px" }}
            >
              Scan Another Project
            </button>
            <ScanResults result={state.result} />
          </>
        )}
      </main>
    </div>
  );
}
