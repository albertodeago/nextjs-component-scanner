# GitHub Repo URL Feature

Analyze Next.js projects from GitHub URL instead of local folder.

## Architecture

```
packages/
  core/       ← platform-agnostic (unchanged)
  node/       ← NodeHost (fs-based)
  browser/    ← BrowserHost (File System Access API)
  github/     ← NEW: GitHubHost (fetch-based, works in Node + browser)
  cli/        ← can import from github/
apps/
  web/        ← can import from github/
```

New package uses only `fetch` → works everywhere (Node 18+, browsers).

## Implementation

### 1. Create `@nextxray/github` package

**Location:** `packages/github/`

```
packages/github/
  src/
    github-host.ts      ← ScannerHost implementation
    github-discovery.ts ← entry point discovery via Trees API
    github-api.ts       ← low-level API helpers + caching
    index.ts            ← exports
  package.json
  tsconfig.json
```

**github-host.ts:**

- Implement `ScannerHost` interface
- `readFile(path)` → fetch via GitHub Contents API
- `resolve(source, importer)` → same logic as BrowserHost, check file existence
- Constructor: `{ owner, repo, branch?, token? }`

**github-discovery.ts:**

- Use Trees API (`GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`)
- Single API call returns full file tree
- Filter for `page.tsx`, `layout.tsx` in `app/` or `src/app/`
- Export: `discoverEntryPoints(owner, repo, branch?, token?)`

**github-api.ts:**

- `fetchFile(owner, repo, path, token?)` → decode base64 content
- `fetchTree(owner, repo, branch, token?)` → get recursive file list
- `getDefaultBranch(owner, repo, token?)` → fetch repo metadata
- In-memory cache for all fetched content

**package.json deps:**

- `@nextxray/core` (peer dep for types)
- No other deps (uses native fetch)

### 3. GitHub URL input UI (web)

**File:** `apps/web/app/components/GitHubInput.tsx` (new)

- Text input for URL or `owner/repo`
- Parse: `github.com/owner/repo` → extract owner, repo
- Optional branch input (default: auto-detect)
- Submit button

### 4. Update useScanner hook

**File:** `apps/web/app/hooks/useScanner.ts`

- New type: `ScanSource = { type: 'local', handle } | { type: 'github', owner, repo, branch?, token? }`
- Branch scan logic based on source type
- Create `GitHubHost` or `BrowserHost` accordingly

### 5. Update ProjectPicker

**File:** `apps/web/app/components/ProjectPicker.tsx`

- Add tabs or toggle: "Local Folder" | "GitHub Repo"
- Local: existing showDirectoryPicker
- GitHub: render GitHubInput component
- Both call `onSelect(source: ScanSource)`

### 6. Update main page

**File:** `apps/web/app/page.tsx`

- Handle new ScanSource type
- Show repo name in header when GitHub source

### 7. (Optional) Token management

**Files:** `apps/web/app/components/GitHubTokenInput.tsx`

- Web: store token in localStorage, show rate limit info

## API Details

**Contents API** (single file):

```
GET /repos/{owner}/{repo}/contents/{path}
Response: { content: base64, encoding: "base64" }
```

**Trees API** (full tree):

```
GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1
Response: { tree: [{ path, type, sha }] }
```

**Repo metadata** (for default branch):

```
GET /repos/{owner}/{repo}
Response: { default_branch: "main" }
```

Rate limits:

- Unauthenticated: 60/hour
- With token: 5000/hour

## Order of Implementation

1. Create `packages/github/` with host + discovery + API helpers
2. Add `GitHubInput.tsx` component to web
3. Update `useScanner.ts` to support both sources
4. Update `ProjectPicker.tsx` with tabs
5. Wire up in `page.tsx`
6. (Optional) Token management UI

## Open Questions

- Support branches other than default? (adds complexity) -> no, for now let's just support the default branch
- Handle monorepos with Next.js in subfolder? -> yes, we can add an optional path input in the GitHub UI
- Show progress per-file or just spinner? (GitHub is slower) -> spinner is fine for now
- Cache results in localStorage to avoid re-fetching? -> not needed initially
