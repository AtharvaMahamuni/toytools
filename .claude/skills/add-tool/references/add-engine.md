# Adding a New Engine Type

Use this reference only when the tool you are building requires an engine that does not yet exist in the platform. For tools that fit an existing engine (`text-processor`, `encoding`, `hashing`, `structured-data`, `text-analysis`), go to `add-tool.md` directly.

---

## When to add a new engine

A new engine is warranted only when **all** of the following are true:
- No existing engine covers the operation type (see `tool-classification.md`)
- The new engine will serve at least 2–3 tools (single-tool engines are a smell)
- The shared widget logic cannot be expressed by configuring an existing engine

---

## Step-by-step

### 1. Define types

**File:** `src/lib/engines/<engine-name>/types.ts`

```ts
// Define the tool interface (what each implementation must satisfy)
export type MyEngineFamily = 'familyA' | 'familyB';

export interface MyEngineTool {
  id: string;
  family: MyEngineFamily;
  execute(input: string): MyEngineResult;  // shape depends on the engine
}

export interface MyEngineResult {
  ok: boolean;
  output: string;
  error?: string;
}
```

Requirements:
- `execute()` (or equivalent) **must never throw** — wrap errors in `{ ok: false, error }`.
- Keep browser-only APIs (`crypto.subtle`, `btoa`, etc.) inside method bodies, never at module top-level, so the file is safe to import under Node/vitest.

### 2. Create the registry

**File:** `src/lib/engines/<engine-name>/registry.ts`

```ts
import type { MyEngineTool, MyEngineResult } from './types';
import { myFirstImpl } from './myFirstImpl';

export const MY_ENGINE_TOOLS: Record<string, MyEngineTool> = {
  'my-first-impl': myFirstImpl,
};

// Never throws. Unknown id returns a safe error result.
export function runMyEngine(id: string, input: string): MyEngineResult {
  const tool = MY_ENGINE_TOOLS[id];
  if (!tool) {
    console.warn(`[my-engine] Unknown id "${id}"`);
    return { ok: false, output: '', error: `Unknown engine id: ${id}` };
  }
  return tool.execute(input);
}
```

### 3. Register engine + pattern in `src/data/engines.ts`

Add an entry to the `engineDefs` array:

```ts
{
  id: 'my-engine',
  name: 'My Engine',
  category: 'developer-utilities',   // category this engine belongs to
  patterns: ['my-pattern'],           // all patterns this engine supports
  runtimeGlobal: 'runMyEngine',       // function name exposed on ToyTools.* at runtime
},
```

### 4. Register pattern section in `src/data/category-sections.ts`

Add a row for each new pattern:
```ts
'my-pattern': { title: 'My Section Title', order: 10 },
```

### 5. Bundle into `ToyToolsRuntime.astro`

**File:** `src/components/ToyToolsRuntime.astro` (or wherever the runtime bundle is built)

Add the import and expose the function on the `ToyTools` namespace:
```ts
import { runMyEngine } from '../lib/engines/my-engine/registry';
// ...
ToyTools.runMyEngine = runMyEngine;
```

### 6. Create the shared widget

**File:** `src/tools/_shared/MyEngineWidget.astro`

The widget is generic — it reads `processorId` (or equivalent) from a prop and calls the runtime function. It must:
- Never import a specific implementation directly
- Handle empty input, error states, and loading states
- Use `IoPanel.astro` for framing (never hand-write `.io-panel` markup)
- Place action buttons in `<ToolActions>` slot
- Update live on input (no Submit button)
- Use `ToyTools.state.save/load(slug, data)` for persistence
- Never change per-tool — only props change

### 7. Add the first tool

Follow `references/add-tool.md` from Phase 1 onward for the first tool that uses this engine.

### 8. Add unit tests

**File:** `src/lib/engines/<engine-name>/<engine-name>.test.ts`

Test the registry resolver and each impl. Cover: happy path, empty input, invalid input (should return error result, never throw).

---

## Validation

```sh
npm run build    # validates engine id + pattern refs from all tool configs
npm run test     # runs vitest, including the new engine test file
npm run health   # platform integrity check
```
