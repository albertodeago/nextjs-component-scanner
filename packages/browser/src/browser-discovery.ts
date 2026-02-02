const ENTRY_FILES = [
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
  "layout.tsx",
  "layout.ts",
  "layout.jsx",
  "layout.js",
];

const NEXT_CONFIG_FILES = [
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
];

/**
 * Checks if a directory handle represents a Next.js project.
 * Looks for next.config.* or next in package.json dependencies.
 */
export async function isNextJsProject(
  rootHandle: FileSystemDirectoryHandle
): Promise<boolean> {
  // Check for next.config.* files
  for (const configFile of NEXT_CONFIG_FILES) {
    try {
      await rootHandle.getFileHandle(configFile);
      return true;
    } catch {
      // File doesn't exist, continue checking
    }
  }

  // Check package.json for next dependency
  try {
    const packageHandle = await rootHandle.getFileHandle("package.json");
    const file = await packageHandle.getFile();
    const content = await file.text();
    const pkg = JSON.parse(content);

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    return "next" in deps;
  } catch {
    return false;
  }
}

/**
 * Discovers Next.js entry points (page.tsx and layout.tsx) in an app directory.
 * Checks both /app and /src/app locations (Next.js supports both).
 * @param rootHandle The root directory handle
 * @param appDirName The name of the app directory (default: "app")
 * @param rootPath Virtual root path prefix (default: "/")
 * @param onProgress Optional callback for progress reporting
 * @returns Array of virtual paths to entry point files
 */
export async function discoverEntryPoints(
  rootHandle: FileSystemDirectoryHandle,
  appDirName = "app",
  rootPath = "/",
  onProgress?: (message: string) => void
): Promise<string[]> {
  const entryPoints: string[] = [];

  // Try to find app directory - check both /app and /src/app
  let appHandle: FileSystemDirectoryHandle;
  let appPath: string;

  try {
    appHandle = await rootHandle.getDirectoryHandle(appDirName);
    appPath = rootPath.endsWith("/")
      ? `${rootPath}${appDirName}`
      : `${rootPath}/${appDirName}`;
  } catch {
    // Try src/app
    try {
      const srcHandle = await rootHandle.getDirectoryHandle("src");
      appHandle = await srcHandle.getDirectoryHandle(appDirName);
      appPath = rootPath.endsWith("/")
        ? `${rootPath}src/${appDirName}`
        : `${rootPath}/src/${appDirName}`;
    } catch {
      throw new Error(
        `Could not find "${appDirName}" directory. Is this a Next.js app router project?`
      );
    }
  }

  async function walkDir(
    dirHandle: FileSystemDirectoryHandle,
    currentPath: string
  ): Promise<void> {
    onProgress?.(`Scanning ${currentPath}...`);

    for await (const handle of dirHandle.values()) {
      const name = handle.name;
      const fullPath = `${currentPath}/${name}`;

      if (handle.kind === "directory") {
        // Skip node_modules and hidden directories
        if (name !== "node_modules" && !name.startsWith(".")) {
          await walkDir(handle as FileSystemDirectoryHandle, fullPath);
        }
      } else if (handle.kind === "file" && ENTRY_FILES.includes(name)) {
        entryPoints.push(fullPath);
      }
    }
  }

  await walkDir(appHandle, appPath);
  return entryPoints.sort();
}

/**
 * Checks if the File System Access API is available in the current browser.
 */
export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== "undefined" && "showDirectoryPicker" in window
  );
}
