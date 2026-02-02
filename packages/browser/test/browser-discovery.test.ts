import { describe, it, expect } from "vitest";
import {
  discoverEntryPoints,
  isNextJsProject,
  isFileSystemAccessSupported,
} from "../src/browser-discovery.js";
import { createMockFileSystem } from "./mock-fs.js";

describe("isNextJsProject", () => {
  it("returns true when next.config.js exists", async () => {
    const mockFs = createMockFileSystem("project", {
      "next.config.js": "module.exports = {}",
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(true);
  });

  it("returns true when next.config.mjs exists", async () => {
    const mockFs = createMockFileSystem("project", {
      "next.config.mjs": "export default {}",
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(true);
  });

  it("returns true when next.config.ts exists", async () => {
    const mockFs = createMockFileSystem("project", {
      "next.config.ts": "export default {}",
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(true);
  });

  it("returns true when next is in dependencies", async () => {
    const mockFs = createMockFileSystem("project", {
      "package.json": JSON.stringify({
        name: "my-app",
        dependencies: { next: "14.0.0", react: "18.0.0" },
      }),
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(true);
  });

  it("returns true when next is in devDependencies", async () => {
    const mockFs = createMockFileSystem("project", {
      "package.json": JSON.stringify({
        name: "my-app",
        devDependencies: { next: "14.0.0" },
      }),
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(true);
  });

  it("returns false when no next config or dependency", async () => {
    const mockFs = createMockFileSystem("project", {
      "package.json": JSON.stringify({
        name: "my-app",
        dependencies: { react: "18.0.0" },
      }),
      src: {
        "index.tsx": "export default function App() {}",
      },
    });

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(false);
  });

  it("returns false for empty project", async () => {
    const mockFs = createMockFileSystem("project", {});

    const result = await isNextJsProject(mockFs);
    expect(result).toBe(false);
  });
});

describe("discoverEntryPoints", () => {
  it("discovers page.tsx files", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function Home() {}",
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toEqual(["/app/page.tsx"]);
  });

  it("discovers layout.tsx files", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "layout.tsx": "export default function RootLayout() {}",
        "page.tsx": "export default function Home() {}",
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toContain("/app/layout.tsx");
    expect(entryPoints).toContain("/app/page.tsx");
  });

  it("discovers nested entry points", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function Home() {}",
        dashboard: {
          "page.tsx": "export default function Dashboard() {}",
        },
        settings: {
          profile: {
            "page.tsx": "export default function Profile() {}",
          },
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toHaveLength(3);
    expect(entryPoints).toContain("/app/page.tsx");
    expect(entryPoints).toContain("/app/dashboard/page.tsx");
    expect(entryPoints).toContain("/app/settings/profile/page.tsx");
  });

  it("discovers entry points in route groups", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "(marketing)": {
          about: {
            "page.tsx": "export default function About() {}",
          },
          blog: {
            "page.tsx": "export default function Blog() {}",
          },
        },
        "(auth)": {
          login: {
            "page.tsx": "export default function Login() {}",
          },
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toHaveLength(3);
    expect(entryPoints).toContain("/app/(marketing)/about/page.tsx");
    expect(entryPoints).toContain("/app/(marketing)/blog/page.tsx");
    expect(entryPoints).toContain("/app/(auth)/login/page.tsx");
  });

  it("skips node_modules directory", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function Home() {}",
        node_modules: {
          "some-package": {
            "page.tsx": "should be skipped",
          },
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toEqual(["/app/page.tsx"]);
  });

  it("skips hidden directories", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function Home() {}",
        ".hidden": {
          "page.tsx": "should be skipped",
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toEqual(["/app/page.tsx"]);
  });

  it("discovers different file extensions", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function Home() {}",
        api: {
          "page.ts": "export default function API() {}",
        },
        legacy: {
          "page.jsx": "export default function Legacy() {}",
        },
        old: {
          "page.js": "export default function Old() {}",
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toHaveLength(4);
  });

  it("returns sorted entry points", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "",
        zebra: { "page.tsx": "" },
        alpha: { "page.tsx": "" },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toEqual([
      "/app/alpha/page.tsx",
      "/app/page.tsx",
      "/app/zebra/page.tsx",
    ]);
  });

  it("throws error when app directory not found", async () => {
    const mockFs = createMockFileSystem("project", {
      src: {
        "index.tsx": "export default function App() {}",
      },
    });

    await expect(discoverEntryPoints(mockFs)).rejects.toThrow(
      'Could not find "app" directory'
    );
  });

  it("discovers entry points when app is inside src", async () => {
    // Next.js supports both /app and /src/app structures
    const mockFs = createMockFileSystem("project", {
      "next.config.js": "module.exports = {}",
      "package.json": JSON.stringify({
        name: "my-app",
        dependencies: { next: "14.0.0" },
      }),
      src: {
        app: {
          "page.tsx": "export default function Home() {}",
          dashboard: {
            "page.tsx": "export default function Dashboard() {}",
          },
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toHaveLength(2);
    expect(entryPoints).toContain("/src/app/page.tsx");
    expect(entryPoints).toContain("/src/app/dashboard/page.tsx");
  });

  it("prefers /app over /src/app when both exist", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "export default function RootHome() {}",
      },
      src: {
        app: {
          "page.tsx": "export default function SrcHome() {}",
        },
      },
    });

    const entryPoints = await discoverEntryPoints(mockFs);
    expect(entryPoints).toEqual(["/app/page.tsx"]);
  });

  it("uses custom app directory name", async () => {
    const mockFs = createMockFileSystem("project", {
      src: {
        app: {
          "page.tsx": "export default function Home() {}",
        },
      },
    });

    // First get the src handle
    const srcHandle = await mockFs.getDirectoryHandle("src");
    const entryPoints = await discoverEntryPoints(srcHandle, "app");
    expect(entryPoints).toContain("/app/page.tsx");
  });

  it("calls progress callback", async () => {
    const mockFs = createMockFileSystem("project", {
      app: {
        "page.tsx": "",
        dashboard: { "page.tsx": "" },
      },
    });

    const progressMessages: string[] = [];
    await discoverEntryPoints(mockFs, "app", "/", (msg) => {
      progressMessages.push(msg);
    });

    expect(progressMessages.length).toBeGreaterThan(0);
    expect(progressMessages.some((m) => m.includes("Scanning"))).toBe(true);
  });
});

describe("isFileSystemAccessSupported", () => {
  it("returns false in Node.js environment", () => {
    // In Node.js test environment, window is not defined
    const result = isFileSystemAccessSupported();
    expect(result).toBe(false);
  });
});
