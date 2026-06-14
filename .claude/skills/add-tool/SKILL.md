---
name: add-tool
description: Add a new tool or engine to ToyTools. Use when asked to build a new tool, implement a new engine type, or extend an existing engine with a new implementation. Covers the complete file checklist, engine selection, and validation steps.
---

# Add Tool / Engine

One contract. Every agent that adds a tool or engine MUST follow it in order.

## Hard rules

1. **Identify engine type first.** The engine determines which files to create, which registry to update, and which shared widget to use. Read `references/tool-classification.md` if you are unsure.

2. **Never edit shared widget files.** `TextProcessorWidget.astro`, `EncodingWidget.astro`, `HashWidget.astro`, `StructuredDataWidget.astro`, `TextMetricWidget.astro` — these are platform infrastructure. A tool's `Widget.astro` is always a 3-line wrapper that passes props into the shared widget.

3. **Never add rendering or processing logic inside a tool folder.** If behavior is used by more than one tool (or could be), it belongs in the engine lib or shared widget. A tool folder contains only: `config.ts`, `Widget.astro`, and optionally `faq.ts`, `Guide.astro`, `knowledge.ts`.

4. **Engine selection is permanent.** Do not change a tool's `engine` value after the tool ships. Analytics, the knowledge graph, tool groups, and runtime APIs may all depend on engine identity. If a different engine is genuinely needed, create a new tool.

5. **`processorId` in `config.ts` must exactly match the `id` field** in the engine registry entry (e.g., `PROCESSORS`, `ENCODERS`, `HASHERS`, `STRUCTURED_TOOLS`). A mismatch causes a runtime no-op — the build does NOT catch it.

6. **`npm run build` is the primary gate.** It runs Astro render + TypeScript + `validate-registry.ts` in one pass. Run it before declaring done. Follow with `npm run health` for sitemap/manifest/knowledge coverage.

## Decision tree

```
Are you adding a new engine type that doesn't exist yet?
├── YES → read references/add-engine.md first, then references/add-tool.md
└── NO  → start directly at references/add-tool.md

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
