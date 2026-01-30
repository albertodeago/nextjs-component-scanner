// Browser-specific implementations
export { BrowserHost } from "./browser-host.js";
export type { BrowserHostOptions } from "./browser-host.js";

export {
  discoverEntryPoints,
  isNextJsProject,
  isFileSystemAccessSupported,
} from "./browser-discovery.js";

// Re-export core for convenience
export {
  scan,
  Crawler,
  aggregate,
  calculateStats,
  extractRoute,
  getEntryType,
} from "@nextxray/core";

export type {
  AnalyzedComponent,
  ScanContext,
  ScanResult,
  ScannerHost,
  EntryType,
  RouteEntry,
  SharedComponentUsage,
  ProjectStats,
  ProjectScanResult,
} from "@nextxray/core";
