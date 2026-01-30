# Implementation Plan: `@nextxray/*` packages

## Goal

Create a Node.js and Browser compatible package (isomorphic) that accepts React component source code (as a string) and extracts information about used child components.

## Architecture

- **Input**: Source code string (no file system access).
- **Core Dependencies**: `@babel/parser`, `@babel/traverse`, `@babel/types`.
- **Environment**: Isomorphic (Node.js + Browser).

## Todo List

- [x] **Setup Dependencies**: Install `@babel/parser`, `@babel/traverse`, `@babel/types` in `packages/scanner`.
- [x] **Define Types**: Create TypeScript interfaces for the scanner output (e.g., `ComponentInfo`, `ScanResult`).
- [x] **Implement Core Scanner**:
  - [x] Setup parser to handle TypeScript and JSX.
  - [x] Implement Import Collection (gathering all imports and their local names).
  - [x] Implement JSX Traversal (identifying JSX tags).
  - [x] Implement Resolution Logic (linking JSX tags to Imports).
- [x] **Refine Heuristics**:
  - [x] Handle Named Imports (`import { A } ...`).
  - [x] Handle Default Imports (`import A ...`).
  - [x] Handle Aliased Imports (`import { A as B } ...`).
  - [x] Handle Namespace Imports (`import * as N ...`).
  - [x] Handle Local Component Definitions.
- [x] **Add Tests**: Create unit tests with hardcoded component strings to verify detection logic.

## Phase 2: Component Tree Crawler

We need to stitch the single-file scans into a graph. To keep this isomorphic, we will invert the control of file access and path resolution.

### New Goals

- Build a dependency graph (Tree/DAG) of components.
- Abstract file system operations behind a `ScannerHost` interface.

### Todo List

- [x] **Define Host Interface**:
  - `read(path: string): Promise<string>`: Fetch file content.
  - `resolve(contextPath: string, importPath: string): Promise<string | null>`: Resolve an import path (e.g. `./button` -> `/abs/path/button.tsx`).
- [x] **Define Tree Types**:
  - `ComponentNode`: Contains `id` (path), `metadata` (from scanner), and `children` (edges).
- [x] **Implement Crawler**:
  - Input: `entryPath` + `ScannerHost`.
  - Logic: Recursive or Queue-based traversal.
  - Features:
    - Cycle detection (visited set).
    - Concurrency control (optional, but good for performance).
- [x] **Implement Node.js Adapter (Wrappers)**:
  - Create a reference implementation of `ScannerHost` for Node.js.
  - Use `fs` for reading.
  - Handle resolution (extensions `.tsx`, `.ts`, `index` files, `tsconfig paths` aliases).

## Phase 3: Next.js Project Scanner

We now have the tools to analyze a single component tree. We need to scale this up to understand a full Next.js application by analyzing its directory structure.

### New Goals

- Automatically discover entry points (`page.tsx`, `layout.tsx`) in the `app/` directory.
- Perform efficient bulk scanning (reusing shared component analysis).
- Aggregate data to answer project-wide questions.

### Todo List

- [x] **Implement File Discovery**:
  - Create logic to recursively find all `page.tsx` and `layout.tsx` files in a given directory (`app/`).
- [x] **Implement Project Scanner**:
  - Input: Project Root Path.
  - Logic:
    - Find all standard Next.js entry points.
    - Run the `Crawler` on each entry point.
    - Use a shared cache/visited map to ensure shared components (like `ui/button`) are only scanned once across the whole project.
- [x] **Data Aggregation**:
  - Create a structure to represent the "Application Map" (Routes -> Component Trees).
  - Calculate stats: Client vs Server component ratio, most used shared components.
- [x] **CLI Update**:
  - Update CLI to accept a directory.
  - If directory -> Run Project Scan.
  - If file -> Run Single Crawler.
- [x] **Improve "use client" detection**:
  - ~~Current implementation uses simple string check (`code.includes('"use client"')`) which can give false positives if the string appears in comments.~~
  - Now uses AST-based detection via `ast.program.directives` - no false positives from comments, strings, or JSX content.

## Phase 3.5: Multi-Package Architecture Migration ✅

Split monolithic `packages/scanner` into scoped packages under `@nextxray/*` for clean separation of concerns and guaranteed browser compatibility.

### Target Structure

```
packages/
  core/      → @nextxray/core      ✅
  node/      → @nextxray/node      ✅
  cli/       → @nextxray/cli       ✅
  browser/   → @nextxray/browser   (Phase 4)
```

### Dependency Graph

```
cli → node → core
browser → core (Phase 4)
```

### Package Contents

**@nextxray/core** (platform-agnostic, browser-safe):
- `scan()` function + AST parsing
- All visitor plugins (imports, exports, jsx, dynamic, definitions)
- `ScannerHost` interface (contract only)
- `Crawler` class (uses injected host)
- `aggregate()` function
- All types (`ScanResult`, `AnalyzedComponent`, `RouteEntry`, `ProjectStats`, etc.)

**@nextxray/node** (Node.js specific):
- `NodeHost` (ScannerHost implementation using fs + enhanced-resolve)
- `discoverNextJsEntryPoints()` (fs-based file discovery)
- `ProjectScanner` class (orchestrates discovery + crawl + aggregate)

**@nextxray/cli**:
- CLI entry point
- Output formatting
- File vs directory mode handling

### Todo List

- [x] **Setup monorepo structure**:
  - Create `packages/core/`, `packages/node/`, `packages/cli/` directories
  - Configure package.json for each with `@nextxray/*` names
  - Setup tsconfig references between packages
  - Configure shared build tooling

- [x] **Migrate @nextxray/core**:
  - Move: `index.ts`, `types.ts`, `debug.ts`, `contract.ts`, `crawler.ts`, `aggregator.ts`, `project-types.ts`
  - Move: `visitors/` directory
  - Update imports to be internal
  - Configure exports in package.json
  - Verify zero Node.js dependencies (no `fs`, `path`, `enhanced-resolve`)

- [x] **Migrate @nextxray/node**:
  - Move: `node-host.ts`, `node-discovery.ts`, `project-scanner.ts`
  - Add `@nextxray/core` as dependency
  - Update imports to use `@nextxray/core`
  - Re-export core types for convenience

- [x] **Migrate @nextxray/cli**:
  - Move: `cli.ts`
  - Add `@nextxray/node` as dependency
  - Update imports
  - Configure bin entry point

- [x] **Update tests**:
  - Split tests by package
  - Core tests: scan function, visitors, crawler with mock host
  - Node tests: NodeHost, ProjectScanner, discovery
  - CLI tests: integration tests

- [x] **Browser compatibility verification**:
  - Add test that imports @nextxray/core in jsdom environment
  - Verify bundle with esbuild `platform: 'browser'`

- [x] **Cleanup**:
  - Remove old `packages/scanner/`
  - Update root package.json workspaces
  - Update any documentation

---

## Phase 4: Browser Implementation

Bring the scanner to the web using the File System Access API.

### Todo List

- [ ] **Browser Host Adapter**:
  - Implement `ScannerHost` using `FileSystemDirectoryHandle`.
  - Implement a basic resolution strategy for the browser (mapping paths to handles).
- [ ] **Web UI**:
  - Simple React UI to pick a folder.
  - Visualize the dependency graph (D3.js or React Flow?).
