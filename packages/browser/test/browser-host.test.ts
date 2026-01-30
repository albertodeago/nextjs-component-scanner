import { describe, it, expect } from "vitest";
import { BrowserHost } from "../src/browser-host.js";
import { createMockFileSystem } from "./mock-fs.js";

describe("BrowserHost", () => {
  const mockTree = createMockFileSystem("project", {
    app: {
      "page.tsx": `export default function Home() { return <div>Home</div>; }`,
      "layout.tsx": `import { Header } from "../components/header";
export default function RootLayout({ children }) { return <html><body><Header />{children}</body></html>; }`,
      dashboard: {
        "page.tsx": `"use client";
import { Button } from "../../components/button";
export default function DashboardPage() { return <Button />; }`,
      },
    },
    components: {
      "button.tsx": `"use client";
export function Button() { return <button>Click</button>; }`,
      "header.tsx": `export function Header() { return <header>Header</header>; }`,
      ui: {
        "index.tsx": `export * from "./card";`,
        "card.tsx": `export function Card() { return <div>Card</div>; }`,
      },
    },
    "package.json": `{ "name": "test-app", "dependencies": { "next": "14.0.0" } }`,
  });

  describe("readFile", () => {
    it("reads a file at root level", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const content = await host.readFile("/package.json");
      expect(content).toContain('"next"');
    });

    it("reads a file in nested directory", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const content = await host.readFile("/app/page.tsx");
      expect(content).toContain("Home");
    });

    it("reads a deeply nested file", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const content = await host.readFile("/app/dashboard/page.tsx");
      expect(content).toContain("use client");
      expect(content).toContain("DashboardPage");
    });

    it("caches file content", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const content1 = await host.readFile("/app/page.tsx");
      const content2 = await host.readFile("/app/page.tsx");
      expect(content1).toBe(content2);
    });

    it("throws error for non-existent file", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      await expect(host.readFile("/nonexistent.tsx")).rejects.toThrow(
        "File not found"
      );
    });
  });

  describe("resolve", () => {
    it("resolves relative import with extension", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve(
        "./button.tsx",
        "/components/header.tsx"
      );
      expect(resolved).toBe("/components/button.tsx");
    });

    it("resolves relative import without extension (tries .tsx)", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve("./button", "/components/header.tsx");
      expect(resolved).toBe("/components/button.tsx");
    });

    it("resolves parent directory import", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve(
        "../components/button",
        "/app/page.tsx"
      );
      expect(resolved).toBe("/components/button.tsx");
    });

    it("resolves deeply nested parent import", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve(
        "../../components/button",
        "/app/dashboard/page.tsx"
      );
      expect(resolved).toBe("/components/button.tsx");
    });

    it("resolves index file in directory", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve("./ui", "/components/button.tsx");
      expect(resolved).toBe("/components/ui/index.tsx");
    });

    it("returns null for external packages", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve("react", "/app/page.tsx");
      expect(resolved).toBeNull();
    });

    it("returns null for scoped packages", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve("@radix-ui/react-dialog", "/app/page.tsx");
      expect(resolved).toBeNull();
    });

    it("returns null for next/* imports", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve("next/link", "/app/page.tsx");
      expect(resolved).toBeNull();
    });

    it("returns null for non-existent relative import", async () => {
      const host = new BrowserHost({ rootHandle: mockTree });
      const resolved = await host.resolve(
        "./nonexistent",
        "/components/button.tsx"
      );
      expect(resolved).toBeNull();
    });
  });

  describe("with custom rootPath", () => {
    it("uses custom rootPath prefix", async () => {
      const host = new BrowserHost({
        rootHandle: mockTree,
        rootPath: "/project",
      });
      const content = await host.readFile("/project/app/page.tsx");
      expect(content).toContain("Home");
    });

    it("resolves with custom rootPath", async () => {
      const host = new BrowserHost({
        rootHandle: mockTree,
        rootPath: "/project",
      });
      const resolved = await host.resolve(
        "./button",
        "/project/components/header.tsx"
      );
      expect(resolved).toBe("/project/components/button.tsx");
    });
  });
});
