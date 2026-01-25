# implementation Plan: `packages/scanner`

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

- [ ] **Define Host Interface**:
  - `read(path: string): Promise<string>`: Fetch file content.
  - `resolve(contextPath: string, importPath: string): Promise<string | null>`: Resolve an import path (e.g. `./button` -> `/abs/path/button.tsx`).
- [ ] **Define Tree Types**:
  - `ComponentNode`: Contains `id` (path), `metadata` (from scanner), and `children` (edges).
- [ ] **Implement Crawler**:
  - Input: `entryPath` + `ScannerHost`.
  - Logic: Recursive or Queue-based traversal.
  - Features:
    - Cycle detection (visited set).
    - Concurrency control (optional, but good for performance).
- [ ] **Implement Node.js Adapter (Wrappers)**:
  - Create a reference implementation of `ScannerHost` for Node.js.
  - Use `fs` for reading.
  - Handle resolution (extensions `.tsx`, `.ts`, `index` files, `tsconfig paths` aliases).
