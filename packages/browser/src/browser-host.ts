import type { ScannerHost } from "@nextxray/core";

export interface BrowserHostOptions {
  rootHandle: FileSystemDirectoryHandle;
  rootPath?: string;
}

const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const INDEX_FILES = EXTENSIONS.map((ext) => `index${ext}`);

export class BrowserHost implements ScannerHost {
  private rootHandle: FileSystemDirectoryHandle;
  private rootPath: string;
  private fileCache = new Map<string, string>();
  private handleCache = new Map<string, FileSystemFileHandle>();

  constructor(options: BrowserHostOptions) {
    this.rootHandle = options.rootHandle;
    this.rootPath = options.rootPath ?? "/";
  }

  async readFile(filePath: string): Promise<string> {
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath)!;
    }

    const handle = await this.getFileHandle(filePath);
    if (!handle) {
      throw new Error(`File not found: ${filePath}`);
    }

    const file = await handle.getFile();
    const content = await file.text();
    this.fileCache.set(filePath, content);
    return content;
  }

  async resolve(source: string, importer: string): Promise<string | null> {
    // Skip external packages (not relative paths)
    if (!source.startsWith(".") && !source.startsWith("/")) {
      return null;
    }

    // Get the directory of the importer
    const importerDir = this.dirname(importer);

    // Resolve the path relative to importer
    const resolvedPath = this.resolvePath(importerDir, source);

    // Try to find the file with various extensions
    const result = await this.tryResolve(resolvedPath);
    return result;
  }

  private async getFileHandle(
    filePath: string
  ): Promise<FileSystemFileHandle | null> {
    if (this.handleCache.has(filePath)) {
      return this.handleCache.get(filePath)!;
    }

    // Remove root path prefix if present
    let relativePath = filePath;
    if (relativePath.startsWith(this.rootPath)) {
      relativePath = relativePath.slice(this.rootPath.length);
    }
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }

    const parts = relativePath.split("/").filter(Boolean);
    if (parts.length === 0) {
      return null;
    }

    try {
      // Traverse directories to get to the file
      let currentHandle: FileSystemDirectoryHandle = this.rootHandle;

      for (let i = 0; i < parts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(parts[i]!);
      }

      const fileName = parts[parts.length - 1]!;
      const fileHandle = await currentHandle.getFileHandle(fileName);
      this.handleCache.set(filePath, fileHandle);
      return fileHandle;
    } catch {
      return null;
    }
  }

  private async tryResolve(basePath: string): Promise<string | null> {
    // Try exact path first (if it has an extension)
    if (this.hasExtension(basePath)) {
      const handle = await this.getFileHandle(basePath);
      if (handle) return basePath;
      return null;
    }

    // Try adding extensions
    for (const ext of EXTENSIONS) {
      const pathWithExt = `${basePath}${ext}`;
      const handle = await this.getFileHandle(pathWithExt);
      if (handle) return pathWithExt;
    }

    // Try as directory with index file
    for (const indexFile of INDEX_FILES) {
      const indexPath = `${basePath}/${indexFile}`;
      const handle = await this.getFileHandle(indexPath);
      if (handle) return indexPath;
    }

    return null;
  }

  private hasExtension(path: string): boolean {
    const lastPart = path.split("/").pop() ?? "";
    return lastPart.includes(".") && !lastPart.startsWith(".");
  }

  private dirname(filePath: string): string {
    const parts = filePath.split("/");
    parts.pop();
    return parts.join("/") || "/";
  }

  private resolvePath(base: string, relative: string): string {
    if (relative.startsWith("/")) {
      return relative;
    }

    // Remove rootPath prefix from base if present to avoid duplication
    let normalizedBase = base;
    const rootWithoutTrailing = this.rootPath.endsWith("/")
      ? this.rootPath.slice(0, -1)
      : this.rootPath;
    if (normalizedBase.startsWith(rootWithoutTrailing)) {
      normalizedBase = normalizedBase.slice(rootWithoutTrailing.length);
    }

    const baseParts = normalizedBase.split("/").filter(Boolean);
    const relativeParts = relative.split("/");

    for (const part of relativeParts) {
      if (part === ".") {
        continue;
      } else if (part === "..") {
        baseParts.pop();
      } else {
        baseParts.push(part);
      }
    }

    const joinedPath = baseParts.join("/");
    if (this.rootPath.endsWith("/")) {
      return this.rootPath + joinedPath;
    }
    return this.rootPath + "/" + joinedPath;
  }
}
