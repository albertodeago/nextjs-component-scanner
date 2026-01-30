import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * This test verifies that the browser package has no Node.js-specific dependencies.
 * It scans all source files for forbidden imports that would break browser compatibility.
 */
describe("browser compatibility", () => {
  const FORBIDDEN_IMPORTS = [
    "node:fs",
    "node:path",
    '"fs"',
    "'fs'",
    '"path"',
    "'path'",
    '"fs/promises"',
    "'fs/promises'",
    "enhanced-resolve",
    "node:child_process",
    "node:os",
    "node:crypto",
  ];

  const srcDir = path.join(import.meta.dirname, "../src");

  function getAllTsFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllTsFiles(fullPath));
      } else if (entry.name.endsWith(".ts")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  it("should not import Node.js-specific modules in src/", () => {
    const files = getAllTsFiles(srcDir);
    const violations: { file: string; line: string; import: string }[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        for (const forbidden of FORBIDDEN_IMPORTS) {
          if (line.includes(forbidden) && line.includes("import")) {
            violations.push({
              file: path.relative(import.meta.dirname, file),
              line: `Line ${i + 1}: ${line.trim()}`,
              import: forbidden,
            });
          }
        }
      }
    }

    if (violations.length > 0) {
      const message = violations
        .map((v) => `${v.file}\n  ${v.line}\n  (forbidden: ${v.import})`)
        .join("\n\n");
      throw new Error(
        `Found Node.js-specific imports in browser package:\n\n${message}`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it("should be able to import the BrowserHost class", async () => {
    const { BrowserHost } = await import("../src/index.js");
    expect(typeof BrowserHost).toBe("function");
  });

  it("should be able to import discovery functions", async () => {
    const { discoverEntryPoints, isNextJsProject, isFileSystemAccessSupported } =
      await import("../src/index.js");
    expect(typeof discoverEntryPoints).toBe("function");
    expect(typeof isNextJsProject).toBe("function");
    expect(typeof isFileSystemAccessSupported).toBe("function");
  });

  it("should re-export core functions", async () => {
    const { scan, Crawler, aggregate, calculateStats } = await import(
      "../src/index.js"
    );
    expect(typeof scan).toBe("function");
    expect(typeof Crawler).toBe("function");
    expect(typeof aggregate).toBe("function");
    expect(typeof calculateStats).toBe("function");
  });
});
