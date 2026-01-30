# Next.js X-Ray - Future Plans

## Known Limitations

- External packages return null (expected)
- No `node_modules` resolution (not needed for component scanning)
- File System Access API: Chrome/Edge only (no Firefox/Safari)

## Phase 7: Analysis Features

**Goal**: Add actionable insights?

**Ideas**:

- "Client boundary opportunities" - server components that could stay server
- Large component detection (high import count)
- Circular dependency detection
- Unused local component detection
- Route complexity score

## Phase 8: Export & Integration

**Ideas**:

- Export to JSON/CSV
- GitHub Action for CI scanning ?
