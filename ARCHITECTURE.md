# ToyTools Architecture

System-level patterns and conventions. Reference this when adding new tools, widgets, or UI patterns.

---

## Tool Directory Convention

Tools live under `src/tools/{url-segment}/{slug}/`, where the segment matches the URL and the category's `segment` field in `categories.ts`.

```
src/tools/text/word-counter/
src/tools/number/percentage-calculator/
src/tools/developer/base64-encoder-decoder/
src/tools/productivity/todo-list/
```

Each tool directory contains:
```
config.ts      ← ToolConfig (required)
Widget.astro   ← Self-contained UI (required)
Guide.astro    ← Educational content (optional)
faq.ts         ← FAQ items (optional)
```

Relative imports within a tool (`./config`, `./faq`) are unchanged by category nesting.

---

## URL Structure

All URLs are **singular** (not plural):

| Route | URL pattern |
|-------|-------------|
| Tool page | `/tool/{segment}/{slug}/` |
| Category page | `/category/{slug}/` |
| Guide page | `/guide/{category}/{slug}/` |
| FAQ page | `/faq/{category}/{slug}/` |

Always use `withBase()` from `src/lib/paths.ts` for internal hrefs.

---

## Widget Patterns

### text-metric pattern

Used by: word-counter, character-counter, sentence-counter, paragraph-counter, reading-time-calculator

Component: `src/tools/_shared/TextMetricWidget.astro`

```astro
<TextMetricWidget
  slug="word-counter"
  stats={[
    { metric: 'words',     label: 'Words',     formatter: 'integer' }, // stats[0] → hero
    { metric: 'characters', label: 'Characters' },                      // stats[1+] → secondary
    { metric: 'sentences', label: 'Sentences' },
  ]}
/>
```

**Layout (2-column on desktop):**
- Wrapped in `ToolSplit` (`ratio="3-1"`, `stackOrder="output-first"`). Desktop ≥1024px: textarea
  left, hero + secondary metrics in the **sticky** right column. Below 1024px it stacks
  **answer-first** (metrics → textarea → actions) so the result is visible while typing.
- `stats[0]` → `HeroMetric.astro` — large numeral, `clamp(--text-3xl, 6vw, --text-5xl)`, bold, mono.
- `stats[1+]` → `StatGrid.astro` — symmetrical grid of boxed stat cards (2-up; a lone trailing card spans the row).
- Empty state: secondary metrics are **hidden entirely** (not `0 0 0 0`); hero shows the zero-format
  (`0` / `0 min`) plus the hint "Paste or type text to begin." (direction-neutral).
- Hero value briefly pulses (`.is-updated`, color-only, `prefers-reduced-motion` guarded) on change.
- Desktop autofocus; text persisted via `ToyTools.state` (restores on reload).

**Components used:**
- `src/tools/_shared/ToolSplit.astro` — the canonical 2-column shell (see below)
- `src/components/tool/HeroMetric.astro` — primary metric display
- `src/components/tool/StatGrid.astro` → `StatCard.astro` — secondary metrics
- `src/components/tool/TrustNotice.astro` — privacy badge
- `src/components/tool/TextareaInput.astro` — auto-height textarea
- `src/components/tool/ToolActions.astro` — Paste + Copy + Clear (all transparent utility buttons)
- `src/components/tool/CategoryDiscovery.astro` — "more in this category" cross-link below the output

---

### ToolSplit — canonical 2-column layout

Component: `src/tools/_shared/ToolSplit.astro`. Named slots `input` (left) and `output` (right).

```astro
<ToolSplit ratio="3-1" stackOrder="output-first" stickyOutput={true}>
  <div slot="input">…controls / textarea…</div>
  <div slot="output">…result / metrics…</div>
</ToolSplit>
```

- `ratio`: `'1-1' | '3-2' | '3-1'`. `stackOrder`: `'input-first' | 'output-first'` (mobile order).
- Breakpoint **1024px** — stacks to one column below it. `stickyOutput` pins the output column on desktop.
- Used by: text metrics (3-1), text-processor tools (1-1, via `TextProcessorWidget`),
  percentage-calculator (3-2), base64 (1-1), keep-screen-awake (1-1), pomodoro-timer (3-2).
  Single-column (no split): notepad, todo-list.
- Generalizes the former `CompareLayout`; transform tools use `input-first`, answer-first tools
  (metrics) use `output-first`.

**Live tools:** text-processor tools (see Text Processor System below) and percentage-calculator
update on input/option change — no Convert/Calculate buttons. Keep Copy/Clear only.

---

### Tool action buttons (`ToolActions.astro`)

All actions are **transparent utility controls** by default (`1px` border, no fill, no accent).
State is communicated only by subtle tints. Button styles are global (`.action-btn` in
`tool-widget.css`) so any widget can reuse them. Props: `copyTarget`, `clearTarget`, `pasteTarget`,
`downloadFilename`.

- **Paste** — `navigator.clipboard.readText()` into the target (hidden if unsupported).
- **Copy** — copies the target's value; shows "✓ Copied" with `--color-success` / `--color-success-bg`
  tint for 2s, then reverts.
- **Clear** — two-click confirm: click 1 swaps the label to "Confirm Clear" with `--color-danger` /
  `--color-danger-bg` tint and auto-reverts after 3s; click 2 clears the target. Disarms on outside click.

No overlays or modals. The original label is stored in `data-label`; timers reset on re-click.

CSS tokens: `--color-success(-bg)`, `--color-danger(-bg)`.

---

### CategoryDiscovery — contextual cross-linking

Component: `src/components/tool/CategoryDiscovery.astro` (props `{ toolSlug }`). Rendered below a
tool's output and near the end of guide/FAQ content. Fully data-driven from the registry +
`categories.ts`: "Looking for more? Browse all N {Category} →" plus 2–3 sibling quick-links (from
`getRelatedTools`). Subtle, text-only, category accent shown only as a small dot. Hidden when the
category has a single tool. The bottom `RelatedTools` grid carries a matching "See all {Category} →"
heading.

---

### Platform foundation (persistence, continuity, scalability)

- **Persistence** — `ToyTools.state.save/load/clear(toolId, data)` (on the runtime global in
  `ToyToolsRuntime.astro`). Versioned envelope `{ v: 1, data }` under `toytools:{toolId}`; never
  throws; version mismatch → null (defaults). Tools restore on load. Pomodoro persists prefs only
  (never a running session); keep-screen-awake never restores an active wake lock. (Some complex
  tools still use their own `STORAGE_KEY`; the unified API is the default for new tools.)
- **Recent tools** — `ToyTools.recordRecent(slug, segment)` (called by `ToolLayout`), read via
  `ToyTools.getRecent()`. Deduped, most-recent-first, capped at 10. Homepage shows up to 5 by cloning
  the matching `ToolCard` nodes; the section renders only when data exists.
- **Keyboard shortcuts** (desktop, never hijack typing): `/` focus search, `Esc` blur field,
  `Ctrl/Cmd+Shift+C` copy, `Ctrl/Cmd+Shift+X` clear. Tool-specific: Pomodoro `Space`, Notepad
  `Ctrl/Cmd+S` export.
- **ResultPanel** — `src/components/tool/ResultPanel.astro` standardizes labelled output + actions
  header (adopt where practical; not for custom outputs like the timer ring).
- **Metadata** — `ToolConfig` carries `engine/pattern/family` (+ optional `keywords/inputs/outputs`),
  driving related tools, search, and future discovery. Search index covers name/description/tags/
  keywords/family/category (command-palette ready; no palette UI yet).
- **Tool health** — `src/lib/tools/health.ts` reports `{hasTool,hasGuide,hasFAQ,hasRelatedTools,
  hasMetadata,hasStructuredData}`. Infra only — no UI.

---

## CSS Token System

All design values in `src/styles/tokens.css`. Never hardcode colors or sizes.

| Token group | Key tokens |
|-------------|-----------|
| Accent | `--color-accent` (single retheme point) |
| Semantic | `--color-success(-bg)`, `--color-danger(-bg)` |
| Gold brand | `--color-gold`, `--color-gold-highlight`, `--color-gold-subtle` |
| Surfaces | `--color-bg`, `--color-surface`, `--color-surface-hover` |
| Text | `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse` |
| Typography | `--text-xs` → `--text-5xl` (3rem); `--font-sans`, `--font-mono` |
| Spacing | `--space-1` (4px) → `--space-20` (80px) |
| Touch | `--touch-target` (48px minimum) |
| Widths | `--width-shell` (1440 — chrome/home/category), `--width-content` (1100 — tool pages/splits), `--width-prose` (72ch — guides), `--width-tool` (820 — FAQ/narrow). `--width-nav`/`--width-category` alias `--width-shell`. |

`BaseLayout` `maxWidth` prop: `'shell' | 'content' | 'tool' | 'full'` (`'category'` kept as a shell alias).

Dark mode: both `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]` override the same tokens.

---

## Text Processor System

The transform/cleanup engine — the processor equivalent of the text-analysis engine behind the
metric tools. **Engine first, tool second:** every transform/cleanup tool is the same
`text → process(text) → text` shape with identical UI, so they share **one** widget and a single
processor registry. Adding a tool is a processor file + a config + a 3-line wrapper — never a widget,
runtime, or routing edit.

**Flow:**

```
Text → Processor Registry → Processor → Output → Shared Widget
        (src/lib/text/processors/registry.ts)      (TextProcessorWidget.astro)
```

**Processor interface** (`src/lib/text/processors/types.ts`):

```ts
export interface TextProcessor {
  id: string;                       // lookup id, referenced by a config's processorId
  family: 'transform' | 'cleanup';  // grouping for future discovery systems
  process(text: string): string;    // pure, synchronous, O(n) where possible, no deps
}
```

**Registry as single source of truth** (`src/lib/text/processors/registry.ts`): imports every
processor into `PROCESSORS` (keyed by id, holding the rich object so metadata like `title`/
`description` can be added later without changing the API) and exposes
`runProcessor(id, text)` — which resolves the processor and runs it, returning the input unchanged
(with a `console.warn`) for an unknown id. It **never throws**.

**Runtime exposure:** `ToyToolsRuntime.astro` bundles the registry and attaches
`ToyTools.process = runProcessor` — exactly how `ToyTools.analyze` is bundled from the text-analysis
engine. Widget inline scripts (which cannot import TS) call `ToyTools.process(processorId, text)`.

**Shared widget** (`src/tools/_shared/TextProcessorWidget.astro`, `pattern: 'text-processor'`):
generic input → output. `ToolSplit ratio="1-1"` (50/50 desktop, stacks <1024px), live update on
input, `TrustNotice` + `ToolActions` (paste/clear/copy) + `CategoryDiscovery` + guide/FAQ previews,
state via `ToyTools.state`. It reads `processorId` from a data attribute and **never names a
processor** — no `switch`, no `if/else`. The per-tool `Widget.astro` is only a 3-line wrapper:

```astro
---
import TextProcessorWidget from '@tools/_shared/TextProcessorWidget.astro';
import { config } from './config';
import { items as faqItems } from './faq';
---
<TextProcessorWidget slug={config.slug} processorId={config.processorId!} config={config} faqItems={faqItems} />
```

**Tool config metadata:** `engine: 'text-processor'`, `family: 'transform' | 'cleanup'`,
`processorId`. Mirrors `engine: 'text-analysis'` on the metric tools, so discovery systems can query
by engine + family + category with no parallel metadata.

**Adding a processor tool** — and nothing else is required:

1. Create the processor file in `transform/` or `cleanup/`.
2. Register it in `registry.ts` (one import + one `PROCESSORS` entry).
3. Add `config.ts` (`engine: 'text-processor'`, `family`, `processorId`) + the 3-line `Widget.astro`.
4. Optional: `Guide.astro` (+ static import in the guide route) and `faq.ts` (+ entry in
   `faq-registry.ts`).

`validate-registry.ts` enforces that every `text-processor` tool has a `processorId` that resolves
in the registry.

**Future families** (`extract/`, `compare/`, `validate/`, `format/`) register the same way — same
interface, same registry, same widget, same `ToyTools.process`. The widget must never learn family
names. **If a new family requires editing the widget, the architecture has failed.**

**Current processors** — transform: `uppercase`, `lowercase`, `titleCase`, `sentenceCase`,
`camelCase`, `snakeCase`, `kebabCase`; cleanup: `removeExtraSpaces`, `removeBlankLines`,
`removeDuplicateLines`, `trimLines`, `normalizeWhitespace`, `removeTabs`. (The former multi-mode
`case-converter` was retired in favor of single-purpose transform tools.)

---

## Developer Engines (`src/lib/engines/`)

The Developer category is built from three more engines, each following the *same* pattern as the
Text Processor System — `types.ts` + a never-throwing `registry.ts` resolver + per-impl files +
colocated `*.test.ts` — bundled into `ToyToolsRuntime` and consumed by **one generic widget per
engine**. New engines live under `src/lib/engines/`; the original two text engines remain under
`src/lib/text/` (relocating them would break many imports for no functional gain).

Each engine has a different runtime signature — that is **why there are three widgets, not one**:

| Engine | Lib | Runtime global | Signature | Widget | Tools |
|--------|-----|----------------|-----------|--------|-------|
| Encoding | `engines/encoding/` | `ToyTools.runEncoding(id, mode, text)` | → `{ ok, output, error }` (decode can fail) | `EncodingWidget.astro` (mode/swap/sample/error) | base64, url, html-entity |
| Hashing | `engines/hashing/` | `ToyTools.runHash(id, text)` | → `Promise<string>` (async; SHA via `crypto.subtle`, MD5 pure-JS) | `HashWidget.astro` (Generate button, awaits) | md5, sha1, sha256 |
| Structured-Data | `engines/structured-data/` | `ToyTools.runStructuredData(id, input)` | → `{ ok, output, error }` (✓/✗ status line) | `StructuredDataWidget.astro` | json-formatter, json-minifier, json-validator |

Every resolver **never throws** on an unknown id (encoding passes input through; hashing returns `''`;
structured-data returns a result error). Browser-only APIs (`btoa`/`atob`/`crypto.subtle`) stay
*inside* methods so importing a registry under `tsx`/vitest is side-effect-free. The universal
config→engine lookup key is `processorId`. base64 was migrated from a bespoke widget onto the encoding
engine with byte-parity and a one-time fallback from its legacy `toytools.base64.input` storage key.

**Shared widget conventions.** All three widgets use the two-pane `.io-panel`/`.io-header`/`.io-label`/
`.io-mode`/`.io-status` classes in `src/styles/tool-widget.css` (one source of truth — never re-declare
per widget). All updates are **live on input** (no Generate/Convert button), matching percentage-calculator
and the text tools; hashing runs `await ToyTools.runHash` race-guarded by a monotonic token so out-of-order
async results can't clobber a newer one. Extra controls (Encode/Decode select in the header; Swap/Sample)
go in the **single** `.tool-actions` row via `<ToolActions>`'s trailing `<slot/>`, so paste/clear/swap/sample
share one aligned row driven by `ToolActions`' delegated `[data-action]` handler.

**Adding a tool to an existing engine:** impl file + one `registry.ts` entry + `config.ts`
(`engine`/`pattern`/`family`/`processorId`) + a 3-line `Widget.astro` wrapping the engine widget +
optional guide/faq. `validate-registry.ts` enforces that the `processorId` resolves in the matching
registry. **Tests target the engine, not the tool** (`encoding.test.ts`, `hashing.test.ts`,
`structured-data.test.ts`) — tools are configuration, engines are behavior.

## Platform Metadata & Manifests

- **Engine manifest** (`src/data/engines.ts`) — `engineRegistry` is the platform-level list of every
  engine: declared `patterns` (the authoritative allow-list) plus `supportedFamilies`/`toolCount`
  derived from the registry. `validate-registry` derives its KNOWN engines/patterns from here; a
  category's `engines` are derived from it too. Categories own engines; engines own tools.
- **Metadata contract** (`src/data/metadata.ts`) — `BaseToolMetadata` is the engine-agnostic view of
  a tool. `getToolMetadata()` **derives** it from `ToolConfig` (mapping `categorySlug → category`,
  `guide?.slug → guideSlug`, etc.) so configs are never rewritten and there is no second metadata
  system. Every tool — including the legacy productivity/calculator tools — exposes the full contract.
- **Content manifest** (`src/lib/content/manifest.ts`) — `buildContentManifest()` is the canonical
  registry-derived list of every indexable surface (home/tool/guide/faq/category/language). It is the
  single source the sitemap derives from; search and related-content can derive from it next.
- **Search prep** (`src/lib/search/`) — `buildSearchIndex()` produces a serializable index from the
  metadata contract. Architecture only; no UI yet.
- **Analytics contract** (`src/lib/analytics/events.ts`) — a frozen `AnalyticsEvents` vocabulary so
  engine interactions share event names instead of fragmenting per tool.

## Knowledge Graph & Relationship Engine (`src/lib/knowledge/`)

Phase D. A build-time relationship layer that lets every content item know what it relates to,
what it's used with, what comes next, and what alternatives exist — and auto-generates internal-
linking sections with zero per-page wiring. Built **on top of** the metadata contract and the
proven `getRelatedTools()` algorithm, not a second system.

- **Schema** (`types.ts`) — the `Knowledge` interface. Relationships are typed
  `RelationshipReference` objects (`slug` + optional `reason` + `strength`/`priority`), never bare
  slugs, so each edge carries a human reason (UI + semantic SEO) and a ranking weight. Concepts split
  into `primaryConcepts`/`secondaryConcepts`; `ContentType`/`RelationType` are **open** string models
  (constants, not closed unions) so new node/relation types need no code change; each tool declares a
  `workflowStage`. Every file carries `schemaVersion` (`KNOWLEDGE_SCHEMA_VERSION`) so V1/V2 coexist.
- **Co-located source** — each tool's `knowledge.ts` sits beside its `config.ts` and exports
  `const knowledge: Knowledge`. `src/lib/knowledge/registry.ts` is the explicit-import hub (mirrors
  `data/registry.ts`; not `import.meta.glob`, so tsx scripts + vitest + Astro all consume it).
- **Derive + overlay** (`graph.ts`) — `buildGraph()` produces tool/guide/faq/category nodes and edges.
  `relatedTools/Guides/Faqs` are **derived** from engine→pattern→family→category (reusing
  `getRelatedTools` + new `getRelatedGuides`/`getRelatedFaqs` in `src/lib/tools/related.ts`) with
  tier-based strength. `usedWith`/`alternatives`/`nextSteps` are **overlaid** from the knowledge file
  with their reason/strength/priority. So a new tool gets related content for free; authors add only
  the curated, non-derivable workflow edges.
- **Query APIs** (`queries.ts`) — `getKnowledgeFor`, `getRelatedTools|Guides|Faqs`, `getUsedWith`,
  `getAlternatives`, `getNextSteps`, `getTopicCluster`, `getWorkflow`. O(1) over a prebuilt adjacency
  map; sort = priority asc → strength desc → declared order; unknown slug → empty (never throws).
- **EntityMatcher** (`entity-matcher.ts`) — config-driven surface-form index (no hardcoded keyword
  lists) from primaryConcepts (100) / secondary+aliases (60) / name (80) / keywords (40).
  `getEntityMatches()` uses `\b` token-boundary matching with longest-match-then-highest-score
  disambiguation. **Returns matches only** — inline prose rewriting is deferred to Phase E.
- **Recommendations** (`recommendations.ts`) — task-oriented You-May-Also-Need / Next-Steps /
  Alternatives blocks from the overlay edges, with reason subtitles.
- **Components** (`src/components/knowledge/`) — `RelatedContent` (derived tools), `YouMayAlsoNeed`
  (curated workflow, only when a knowledge file exists), `ContinueLearning` (derived guides + FAQs).
  Wired once into `GuideLayout`/`FAQLayout`; they self-resolve from `toolSlug`. Id-less `<section>`s
  stay out of the guide TOC. Typography-first, capped, accessible — no cards/sidebars/spam.
- **Validation** (`scripts/validate-knowledge.ts`, in the build after `validate-registry`) — ERRORs
  on invalid shape, `schemaVersion` mismatch, slug/category mismatch, unresolved relationship target,
  or duplicate slug. WARNs on missing knowledge file (→ ERROR when `KNOWLEDGE_REQUIRED=true`), empty
  workflow links, and single-family recommendation bubbles (`diversity.ts`).
- **Diagnostics** — `scripts/knowledge-diagnostics.ts` writes `dist/knowledge-graph.json`
  (nodes/edges/coverage/density/orphans/brokenLinks) after build — "Search Console for the internal
  graph". `npm run health` prints a knowledge-coverage line.
- **Reserved Phase E (Semantic Discovery Engine)** — search suggestions, related searches, Typical
  Workflow blocks, topic hubs, collections, popular paths, and the deferred inline prose auto-linking
  will consume this layer with no schema migration.

## Sitemap (`src/lib/sitemap/` + `src/pages/sitemaps/`)

Registry-driven, not `@astrojs/sitemap`. `src/pages/sitemap-index.xml.ts` emits a sitemap **index**
(filename preserved so `robots.txt`, the astro.config `seoValidator`, and quality-guardian
build-integrity keep working), referencing five semantic buckets under `src/pages/sitemaps/`:
`tools.xml`, `guides.xml`, `faqs.xml`, `categories.xml` (+ home), `languages.xml`. Each endpoint
filters `buildContentManifest()` by type and renders via `src/lib/sitemap/render.ts`, building
absolute, trailing-slashed `<loc>`s as `new URL(withBase(path), Astro.site)`. `quality-guardian`'s
sitemap validator scans `dist/sitemaps/` for route coverage. New tools/guides/faqs appear in the
sitemap automatically — no sitemap edits.

---

## Registration Pattern

Every tool requires exactly two registration steps:

1. **`src/data/registry.ts`** — one import + one array entry
2. **`src/pages/tool/[category]/[slug].astro`** — already glob-based (`../../../tools/*/*/Widget.astro`), no change needed for new tools

For guides: add a static import in `src/pages/guide/[...slug].astro`.
For FAQs: add an import in `src/data/faq-registry.ts`.
For knowledge: add `knowledge.ts` beside `config.ts` and one import + entry in
`src/lib/knowledge/registry.ts`. Derived related tools/guides/FAQs are automatic; author only the
overlay fields (`usedWith`/`alternatives`/`nextSteps`, concepts, `workflowStage`). Missing knowledge
WARNs; invalid knowledge fails the build.

---

## Build & Verification

```sh
npm run build    # validate-registry (metadata + reference integrity) + Astro + TS strict — must pass before any PR
npm run health   # post-build platform integrity superset (metadata, manifests, search index, sitemap output)
npm run test     # vitest — engine-level tests (encoding/hashing/structured-data/manifest/metadata/search/sitemap)
npm run dev      # dev server at localhost:4321
```

No separate lint or test command. The build is the single verification step.

## E2E Testing (`tests/e2e/`)

Browser-level verification with **Playwright Test** (`@playwright/test`). This is a
**unified, registry-driven platform framework**, not a per-tool script — the developer
tools are the pilot deep suite, and every current and future tool gets generic smoke
coverage for free. E2E is a local/CI layer, deliberately **not** wired into `npm run build`.

```sh
npm run test:e2e          # headless; webServer builds + serves dist, runs all projects
npm run test:e2e:headed   # watch the real browser run
npm run test:e2e:ui       # interactive time-travel dashboard (pick/step tests)
npm run test:e2e:report   # open the saved interactive HTML report (with traces)
```

- **Config** (`playwright.config.ts`): `webServer` runs `npm run build && npm run preview`
  and waits, so the command is turnkey. Two projects — **chromium** (Desktop Chrome) and
  **pixel5** (Pixel 5); ToyTools is mobile-first, so every spec runs on both. Reporters:
  `html` (interactive dashboard) + `list` (console) + `json` (`playwright-report/results.json`,
  archivable). `trace: 'retain-on-failure'` → replay failures in the Trace Viewer.
- **Helpers** (`tests/e2e/helpers/tools.ts`): `toolPaths()` reads the **built** sitemap
  (`dist/sitemaps/tools.xml`) for every tool's path — decoupling tests from source path-aliases
  (`@tools`) so coverage tracks the registry automatically. `DevTool` is a viewport-agnostic
  page object (locates by role/label/id) for the developer-engine widgets.
- **Specs**: `smoke.spec.ts` (every tool — render + accessibility + interaction + console/page-error
  hardening), `dev-tools.spec.ts` (the 9 developer tools — functional assertions), `performance.spec.ts`
  (navigation-timing guardrails), `integrity.spec.ts` (registry/sitemap structural integrity).
- **Non-goals**: no screenshot/visual-regression/pixel-diff tooling (Percy/Chromatic/image-snapshot) —
  behavior, accessibility, and metadata integrity deliver higher ROI at this scale.

Chromium is already cached locally, so no `npx playwright install` browser download is needed.
