---
name: add-tool
description: Add a new tool or engine to ToyTools. Use when asked to build a new tool, implement a new engine type, or extend an existing engine with a new implementation. Covers the complete file checklist, engine selection, and validation steps.
---

# Add Tool / Engine

One contract. Every agent that adds a tool or engine MUST follow it in order.

## Fastest path: scaffold the tool, then fill it in

For a tool on an existing engine, do **not** hand-create files and hand-edit five registries —
run the generator. It writes the tool directory and wires every registry (registry, faq-registry,
guide-registry + the guide route, knowledge registry) in one step:

```sh
npm run scaffold:tool -- --slug my-tool --name "My Tool" --category text-utilities \
  --engine text-processor --pattern text-transform --family transform \
  --processor-id myProcessor --description "One-line description." [--faq] [--guide] [--no-knowledge]
# add --dry-run first to preview the files + registry edits without writing
```

Engine-backed engines (`text-processor`, `encoding`, `hashing`, `structured-data`, `jwt`) get a
real 3-line widget; other engines get a placeholder Widget.astro to implement by hand. When the
`--processor-id` does not already resolve in its engine registry, the generator also scaffolds the
**engine impl stub + its registry import/entry** for `text-processor`/`encoding`/`structured-data`
(a passthrough you must implement, plus test cases in the engine's colocated `*.test.ts`; hashing
and jwt impls stay hand-written). It emits TODO stubs for config/faq/guide/knowledge — fill them
with real content, then run `npm run build` and `npm run test:e2e`. `--remove` is the full inverse
(including an engine impl no other tool uses). The rest of this contract still applies to what you
write. For "where does X live", read `docs/code-map.json` first.

## Hard rules

1. **Identify engine type first.** The engine determines which files to create, which registry to update, and which shared widget to use. Read `references/tool-classification.md` if you are unsure.

2. **Never edit shared widget files.** `TextProcessorWidget.astro`, `ConverterWidget.astro`, `StructuredDataWidget.astro`, `TextMetricWidget.astro`, `FinanceWidget.astro`, `JwtWidget.astro` — these are platform infrastructure. A tool's `Widget.astro` is always a 3-line wrapper that passes props into the shared widget.

3. **Never add rendering or processing logic inside a tool folder.** If behavior is used by more than one tool (or could be), it belongs in the engine lib or shared widget. A tool folder contains only: `config.ts`, `Widget.astro`, and optionally `faq.ts`, `Guide.astro`, `knowledge.ts`.

4. **Engine selection is permanent.** Do not change a tool's `engine` value after the tool ships. Analytics, the knowledge graph, tool groups, and runtime APIs may all depend on engine identity. If a different engine is genuinely needed, create a new tool.

5. **`processorId` in `config.ts` must exactly match the `id` field** in the engine registry entry (e.g., `PROCESSORS`, `ENCODERS`, `HASHERS`, `STRUCTURED_TOOLS`). `validate-registry` now fails the build on an unknown id **or** a collision (two tools claiming the same id). The one residual silent case: a typo that happens to match a *different real* processor — so still double-check the id resolves to the transform you intend.

6. **`npm run build` is the primary gate.** It runs `validate-registry.ts` + `validate-knowledge.ts` + `validate-architecture.ts` (orphan/drift detection), then Astro render + TypeScript in one pass. Run it before declaring done. Then **`npm run test:e2e`** (desktop + Pixel 5) — the build does NOT catch widget JS errors; e2e does, and it is a PR gate. Finish with `npm run health` for sitemap/manifest/knowledge coverage.

## Decision tree

```
Are you adding a new engine type that doesn't exist yet?
├── YES → read references/add-engine.md first, then references/add-tool.md
└── NO  → run `npm run scaffold:tool` (see "Fastest path" above) to generate + wire the tool,
          then read references/add-tool.md to fill in real content

Does the tool need a guide, FAQ, or knowledge file?
└── YES → read references/optional-content.md for those steps
```

## Platform ownership map

| Concern | Source of truth |
|---------|----------------|
| Tool registration (all tools) | `src/data/registry.ts` |
| Category definitions | `src/data/categories.ts` |
| Engine + pattern definitions | `src/data/engines.ts` |
| Tool groups | `src/data/tool-groups.ts` |
| Category page sections | `src/data/category-sections.ts` |
| FAQs | `src/data/faq-registry.ts` |
| Guides | `src/data/guide-registry.ts` + `src/pages/guide/[...slug].astro` |
| Knowledge graph | `src/lib/knowledge/registry.ts` |
| Text processor impls | `src/lib/text/processors/registry.ts` |
| Encoding impls | `src/lib/engines/encoding/registry.ts` |
| Hashing impls | `src/lib/engines/hashing/registry.ts` |
| Structured-data impls | `src/lib/engines/structured-data/registry.ts` |

## Reference files (read on demand)

| File | When to read |
|------|-------------|
| `references/tool-classification.md` | Choosing the right engine for a user request |
| `references/add-tool.md` | Adding any tool (main checklist — always read this) |
| `references/add-engine.md` | Adding a brand-new engine type that doesn't exist yet |
| `references/engine-types.md` | Exact interface, registry path, and Widget template per engine |
| `references/examples.md` | Real copy-paste implementations from the codebase |
| `references/optional-content.md` | Guides, FAQs, knowledge files |
