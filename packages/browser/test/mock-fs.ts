/**
 * Mock implementations of File System Access API for testing.
 * These mocks simulate FileSystemDirectoryHandle and FileSystemFileHandle
 * using an in-memory file tree structure.
 */

export type MockFileTree = {
  [name: string]: string | MockFileTree;
};

export class MockFileHandle implements FileSystemFileHandle {
  readonly kind = "file" as const;
  readonly name: string;
  private content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }

  async getFile(): Promise<File> {
    return new File([this.content], this.name, { type: "text/plain" });
  }

  // Not implemented - not needed for our tests
  async createWritable(): Promise<FileSystemWritableFileStream> {
    throw new Error("Not implemented");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by interface
  async isSameEntry(_other: FileSystemHandle): Promise<boolean> {
    return false;
  }

  async queryPermission(): Promise<PermissionState> {
    return "granted";
  }

  async requestPermission(): Promise<PermissionState> {
    return "granted";
  }
}

export class MockDirectoryHandle implements FileSystemDirectoryHandle {
  readonly kind = "directory" as const;
  readonly name: string;
  private _entries: Map<string, MockFileHandle | MockDirectoryHandle>;

  constructor(name: string, tree: MockFileTree) {
    this.name = name;
    this._entries = new Map();

    for (const [entryName, value] of Object.entries(tree)) {
      if (typeof value === "string") {
        this._entries.set(entryName, new MockFileHandle(entryName, value));
      } else {
        this._entries.set(entryName, new MockDirectoryHandle(entryName, value));
      }
    }
  }

  async getFileHandle(name: string): Promise<FileSystemFileHandle> {
    const entry = this._entries.get(name);
    if (!entry || entry.kind !== "file") {
      throw new DOMException(
        `File not found: ${name}`,
        "NotFoundError"
      );
    }
    return entry;
  }

  async getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle> {
    const entry = this._entries.get(name);
    if (!entry || entry.kind !== "directory") {
      throw new DOMException(
        `Directory not found: ${name}`,
        "NotFoundError"
      );
    }
    return entry;
  }

  async *values(): AsyncIterableIterator<FileSystemHandle> {
    for (const entry of this._entries.values()) {
      yield entry;
    }
  }

  async *keys(): AsyncIterableIterator<string> {
    for (const key of this._entries.keys()) {
      yield key;
    }
  }

  async *entries(): AsyncIterableIterator<[string, FileSystemHandle]> {
    for (const entry of this._entries.entries()) {
      yield entry;
    }
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]> {
    return this.entries();
  }

  // Not implemented - not needed for our tests
  async removeEntry(): Promise<void> {
    throw new Error("Not implemented");
  }

  async resolve(): Promise<string[] | null> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by interface
  async isSameEntry(_other: FileSystemHandle): Promise<boolean> {
    return false;
  }

  async queryPermission(): Promise<PermissionState> {
    return "granted";
  }

  async requestPermission(): Promise<PermissionState> {
    return "granted";
  }
}

/**
 * Creates a mock directory handle from a file tree object.
 */
export function createMockFileSystem(
  name: string,
  tree: MockFileTree
): MockDirectoryHandle {
  return new MockDirectoryHandle(name, tree);
}
