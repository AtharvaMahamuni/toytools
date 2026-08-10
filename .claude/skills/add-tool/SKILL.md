---
name: add-tool
description: Add a new tool or engine to ToyTools. Use when asked to build a new tool, implement a new engine type, or extend an existing engine with a new implementation. Covers the complete file checklist, engine selection, and validation steps.
---

# Add Tool / Engine

One contract. Every agent that adds a tool or engine MUST follow it in order.

## Fastest path: scaffold the tool, then fill it in

For a tool on an existing engine, run the generator. Registration is **derived from the
directory contract** — the scaffold writes the tool directory, then regenerates the registration
barrels (`npm run registries:generate` — never hand-edit any `*.generated.ts` file or the
registry hubs) and the code map:

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
with real content, then run `npm run verify`. `--remove` is the full inverse
(including an engine impl no other tool uses). The rest of this contract still applies to what you
write. For "where does X live", read `docs/code-map.json` first.

## Hard rules

1. **Identify engine type first.** The engine determines which files to create, which registry to update, and which shared widget to use. Read `references/tool-classification.md` if you are unsure.

2. **Never edit shared widget files.** `TextProcessorWidget.astro`, `ConverterWidget.astro`, `StructuredDataWidget.astro`, `TextMetricWidget.astro`, `FinanceWidget.astro`, `JwtWidget.astro` — these are platform infrastructure. A tool's `Widget.astro` is always a 3-line wrapper that passes props into the shared widget.

3. **Never add rendering or processing logic inside a tool folder.** If behavior is used by more than one tool (or could be), it belongs in the engine lib or shared widget. A tool folder contains only: `config.ts`, `Widget.astro`, and optionally `faq.ts`, `Guide.astro`, `knowledge.ts`.

4. **Engine selection is permanent.** Do not change a tool's `engine` value after the tool ships. Analytics, the knowledge graph, tool groups, and runtime APIs may all depend on engine identity. If a different engine is genuinely needed, create a new tool.

5. **`processorId` in `config.ts` must exactly match the `id` field** in the engine registry entry (e.g., `PROCESSORS`, `ENCODERS`, `HASHERS`, `STRUCTURED_TOOLS`). `validate-registry` now fails the build on an unknown id **or** a collision (two tools claiming the same id). The one residual silent case: a typo that happens to match a *different real* processor — so still double-check the id resolves to the transform you intend.

6. **`npm run verify` is the gate, and the only done-condition.** It mirrors the PR workflow step for step: unit tests, coverage thresholds, the build with `KNOWLEDGE_REQUIRED=true` (validators + Astro render + TypeScript + `check-budget.ts`), platform health, Quality Guardian, `seo:gate` on every tool directory the branch touched, and e2e on desktop + Pixel 5. Use `npm run verify:fast` (no e2e) to iterate, but never call a tool done on it. Running `build` + `test` + `test:e2e` by hand is what let a red PR through: those three skip coverage, health and Quality Guardian entirely.

7. **The new tool's page must come in under the performance budget.** `check-budget.ts` runs last in `npm run build` and fails it, so this is enforced, not advisory. A tool page's ceiling is **60 KB gzipped total** (≤6 render-blocking stylesheets, ≤16 KB CSS, ≤24 KB JS, ≤34 KB HTML); a typical tool lands at 33-40 KB, so content has room. When a new tool trips it the cause is structural, not wordcount:
   - **JS** → the engine is pulling something it should not, or an engine was statically imported back into `src/lib/runtime/index.ts`. Engine runtimes must stay lazy: add `src/lib/runtime/engines/<id>.ts` and register it in **both** maps in `src/lib/runtime/loaders.ts`.
   - **Sheets/CSS** → a route globbed components outside its own segment and hoisted other tools' stylesheets onto the page. Never reintroduce a cross-segment widget glob.
   - **HTML** → the widget renders markup it could render on demand, or the FAQ/JSON-LD ballooned.

   **Fix the cause; never raise the budget to make a new tool fit.** Background: `docs/analysis/2026-07-31-critical-path-performance.md`.

8. **Widgets must call engine APIs inside `ToyTools.onReady()`.** The core global (`state`, `toast`, `copy`, `storage`, `prefs`) exists during parse, but engine surfaces (`analyze`, `process`, `runDateTime`, `runMath`, …) load lazily per page and are **not** there when the widget's inline script first runs. `validate-registry` fails the build if a widget calls a `ToyTools.*` global its declared engine does not provide.

## Decision tree

```
Are you adding an interactive SIMULATION (physics playground)?
├── YES → do NOT use this scaffold or the registry checklist. A sim is manifest-driven:
│         author src/lib/simulation/simulations/<id>.{ts,draw.ts,manifest.ts} (+ <id>.test.ts),
│         register the model in plugins/physics/index.ts and the manifest in manifests.ts, add the
│         slug to tests/e2e/physics.spec.ts. Config/knowledge/faq/guide/SEO derive from the manifest;
│         no registry edits. Gate with `npm run seo:gate:sim -- <slug>`.
│         See ARCHITECTURE.md → "Simulation Platform".
└── NO ↓

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
| Tool registration (all tools) | the tool directory itself — barrels derive via `npm run registries:generate` |
| Category definitions | `src/data/categories.ts` |
| Engine + pattern definitions | `src/data/engines.ts` |
| Tool groups | `src/data/tool-groups.ts` |
| Category page sections | `src/data/category-sections.ts` |
| FAQs | `faq.ts` in the tool dir (derived into `faq-registry.generated.ts`) |
| Guides | `Guide.astro` in the tool dir (glob-discovered by the guide route) |
| Knowledge graph | `knowledge.ts` in the tool dir (derived into `knowledge/registry.generated.ts`) |
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

## Layering and the page grammar (2026-08-08)

A tool page is three zones with a closed inventory (`ARCHITECTURE.md` → "Design Language" →
"Page grammar"). The rule that follows from it:

> **The widget renders the tool. The platform renders everything that is not the tool.**

A widget that knows about the catalog, the brand, installation or trust is a layering error.
`validate-architecture` fails the build on any `CategoryDiscovery` import under `src/tools/`.

- `config.ts` needs a **`tagline`** (max 80 chars, a build error above that): the one line under
  the tool's title. Keep `description` long, it is the meta description and a query-targeting slot.
- Do not render trust, install, brand or category cross-links from a widget. `ToolSignature` and
  `KnowledgeDrawers` are platform-rendered by `ToolPage`.
- `knowledge.primaryConcepts[0]` now heads the tool page's H2s, so it is load-bearing for query
  targeting rather than metadata. Get it right.
- A tool is not finished until `tests/e2e/fold.spec.ts` passes on Pixel 5.
