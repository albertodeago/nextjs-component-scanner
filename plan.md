# Phase 4: Browser Implementation Plan

## Package Structure

```
packages/browser/    → @nextxray/browser
  src/
    browser-host.ts      # ScannerHost impl using FileSystemDirectoryHandle
    browser-discovery.ts # Find page.tsx/layout.tsx via directory handles
    utils.ts             # Path utilities for browser
    index.ts             # Exports
  test/
  package.json
  tsconfig.json

apps/web/
  app/
    page.tsx             # Main UI: folder picker + results display
    scanner/             # Scanner page/route if needed
  components/
    ProjectPicker.tsx    # "Select Project" button + FileSystem API
    ScanResults.tsx      # Display scan results
  hooks/
    useScanner.ts        # Orchestrates: pick → detect → scan → results
```

## Dependency Graph

```
cli → node → core
browser → core
apps/web → browser → core
```

## @nextxray/browser Tasks

### 1. Package Setup
- Create `packages/browser/` dir
- `package.json`: name `@nextxray/browser`, dep on `@nextxray/core`
- `tsconfig.json`: extends root, refs `core`
- No Node.js deps (fs, path, enhanced-resolve)

### 2. BrowserHost (implements ScannerHost)

```ts
interface BrowserHostOptions {
  rootHandle: FileSystemDirectoryHandle;
  rootPath?: string; // virtual root like "/project"
}

class BrowserHost implements ScannerHost {
  // Maps virtual paths to handles
  private handleCache: Map<string, FileSystemFileHandle>;

  async readFile(path: string): Promise<string>;
  async resolve(source: string, importer: string): Promise<string | null>;
}
```

**readFile(path)**:
- Convert virtual path to handle traversal
- Cache file handles
- Read via `handle.getFile().text()`

**resolve(source, importer)**:
- Skip external packages (return null) → `react`, `next/*`, `@radix-ui/*`
- Relative imports: resolve from importer dir
- Try extensions: `.tsx`, `.ts`, `.jsx`, `.js`
- Try `/index.tsx` etc for directories
- Path aliases: optional (tsconfig.json parsing)

### 3. BrowserDiscovery

```ts
async function discoverEntryPoints(
  rootHandle: FileSystemDirectoryHandle,
  appDirName?: string // default "app"
): Promise<string[]>
```

- Find `app/` dir handle first
- Recursive walk via `entries()`
- Match `page.tsx`, `layout.tsx` etc
- Skip `node_modules`, hidden dirs
- Return virtual paths like `/app/page.tsx`

### 4. Utility: isNextJsProject

```ts
async function isNextJsProject(
  rootHandle: FileSystemDirectoryHandle
): Promise<boolean>
```

- Check for `next.config.js` or `next.config.mjs` or `next.config.ts`
- OR check `package.json` has `next` dependency

### 5. Exports

```ts
// index.ts
export { BrowserHost } from './browser-host';
export { discoverEntryPoints, isNextJsProject } from './browser-discovery';
export type { BrowserHostOptions } from './browser-host';

// Re-export core types for convenience
export * from '@nextxray/core';
```

## apps/web Tasks

### 1. ProjectPicker Component

```tsx
function ProjectPicker({ onSelect }: { onSelect: (handle: FileSystemDirectoryHandle) => void }) {
  const handleClick = async () => {
    const handle = await window.showDirectoryPicker();
    onSelect(handle);
  };
  return <button onClick={handleClick}>Select Project</button>;
}
```

### 2. useScanner Hook

```ts
type ScanState =
  | { status: 'idle' }
  | { status: 'scanning'; progress?: string }
  | { status: 'error'; error: string }
  | { status: 'done'; result: ProjectScanResult };

function useScanner() {
  const [state, setState] = useState<ScanState>({ status: 'idle' });

  const scan = async (handle: FileSystemDirectoryHandle) => {
    setState({ status: 'scanning' });

    // 1. Check if Next.js project
    if (!await isNextJsProject(handle)) {
      setState({ status: 'error', error: 'Not a Next.js project' });
      return;
    }

    // 2. Discover entry points
    const entryPoints = await discoverEntryPoints(handle);

    // 3. Create host + crawler
    const host = new BrowserHost({ rootHandle: handle });
    const crawler = new Crawler(host);

    // 4. Crawl all entries
    for (const entry of entryPoints) {
      await crawler.crawl(entry);
    }

    // 5. Aggregate results
    const result = aggregate(crawler.results, crawler.visited, entryPoints, '/app');
    setState({ status: 'done', result });
  };

  return { state, scan };
}
```

### 3. ScanResults Component

Simple display:
- Project stats (total files, client/server ratio)
- List of routes with their component counts
- Most used shared components
- Render as JSON initially (MVP)

### 4. Main Page

```tsx
export default function Home() {
  const { state, scan } = useScanner();

  return (
    <main>
      <h1>Next.js X-Ray</h1>
      <ProjectPicker onSelect={scan} />

      {state.status === 'scanning' && <p>Scanning...</p>}
      {state.status === 'error' && <p>Error: {state.error}</p>}
      {state.status === 'done' && <ScanResults result={state.result} />}
    </main>
  );
}
```

## Implementation Order

1. `packages/browser/` setup (package.json, tsconfig)
2. `browser-host.ts` - BrowserHost class
3. `browser-discovery.ts` - discoverEntryPoints + isNextJsProject
4. `index.ts` exports
5. `apps/web/` - useScanner hook
6. `apps/web/` - ProjectPicker + ScanResults components
7. `apps/web/` - main page integration
8. Test with real Next.js project in browser

## Known Limitations (MVP)

- No tsconfig path alias support (relative imports only) → **Phase 4.1: add tsconfig parsing**
- External packages always return null (expected)
- No `node_modules` resolution (not needed for component scanning)
- File System Access API: Chrome/Edge only (no Firefox/Safari)

## Decisions

1. **Path alias support**: Skip for MVP. Add in Phase 4.1.
2. **Error handling**: Fail fast - exit completely and show error on failure.
3. **Progress feedback**: File-by-file progress reporting.
4. **Browser compatibility**: Show error explaining FS API unavailable + suggest Chrome/Edge.
