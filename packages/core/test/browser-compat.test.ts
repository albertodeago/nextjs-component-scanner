import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * This test verifies that the core package has no Node.js-specific dependencies.
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
        `Found Node.js-specific imports in core package:\n\n${message}`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it("should be able to import the scan function", async () => {
    // This test ensures the module can be dynamically imported
    // without requiring Node.js runtime APIs
    const { scan } = await import("../src/index.js");
    expect(typeof scan).toBe("function");
  });

  it("should be able to run scan() with inline code", async () => {
    const { scan } = await import("../src/index.js");

    const result = scan({
      code: `
        "use client";
        import { Button } from "./button";
        export default function MyComponent() {
          return <Button />;
        }
      `,
    });

    expect(result.component.isClientComponent).toBe(true);
    expect(result.importedComponents).toHaveLength(1);
    expect(result.importedComponents[0]?.name).toBe("Button");
  });
});
