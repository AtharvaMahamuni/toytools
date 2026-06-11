# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # static output → dist/
npm run preview  # serve dist/ locally

# Production build (GitHub Pages — base path /toytools)
ASTRO_SITE=https://atharvamahamuni.github.io ASTRO_BASE_PATH=/toytools npm run build
```

`npm run build` is the verification step — it runs Astro rendering and strict TypeScript together. There is no separate lint script.

```sh
npm run test            # vitest — engine-level unit tests
npm run test:e2e        # Playwright — browser E2E (builds + serves dist, runs chromium + pixel5)
npm run test:e2e:headed # watch the real browser run
npm run test:e2e:ui     # interactive time-travel dashboard
npm run test:e2e:report # open the saved interactive HTML report (with traces)
```

E2E is a registry-driven platform framework (every tool gets generic smoke coverage; the developer tools are the pilot deep suite) and is **not** wired into `npm run build`. See `ARCHITECTURE.md` → "E2E Testing". Mobile-first: every spec runs on desktop **and** Pixel 5.

```sh
npm run health  # post-build platform integrity superset (registry/manifest/sitemap/knowledge coverage)
npm run intel   # Content Intelligence: ecosystem analysis → dist/content-intelligence/ (on demand, not in build)
```

`npm run intel` generates coverage/gap/category-health/engine-opportunity/topic-cluster/roadmap/
ecosystem reports from the registries (no external data). Expansion opportunities come from the
declarative `src/lib/content-intelligence/taxonomy.ts` (`engine → family → expected[]`) — add
expected tools there as data; never hardcode topics in analyzer logic. See `ARCHITECTURE.md` →
"Content Intelligence Layer".

## Analytics

Google Analytics (GA4) is included on every page via `src/layouts/BaseLayout.astro`. The tag ID is `G-WHD7CL44MX`. Since all pages go through `BaseLayout`, no further action is needed when adding new pages or tool types — the tag is inherited automatically. Do **not** add a second `gtag` snippet to individual pages or layouts.

## SEO Engine

Local-first pipeline for researching and improving tool content quality. All commands run from the project root.

| Command | Purpose |
|---------|---------|
| `npm run seo:research -- <slug>` | Fetch SERP + competitor pages + Reddit signals |
| `npm run seo:extract -- <slug>` | Parse into structured `research/<slug>.json` |
| `npm --prefix seo-engine run seo:writing-tool -- <slug>` | Audit Guide.astro + faq.ts quality (20 dimensions) |
| `npm --prefix seo-engine run seo:writing -- <slug>` | Writing-only quality scan |

See `.claude/skills/seo-engine.md` for the full pipeline, score interpretation, reddit workflow, and runbooks.

## Git workflow

Always rebase against `origin/main`: `git rebase origin/main`

## Architecture

**Data-driven static site.** All pages are pre-rendered at build time. No server, no database, no client-side framework.

See `ARCHITECTURE.md` at the project root for system-level patterns, widget conventions, and URL structure.

For a live bird's-eye view, the deployed **`/architecture/`** page (`src/pages/architecture.astro`) renders an interactive Mermaid map of Categories → Engines + cross-cutting layers, derived from the registries at build time (click any block to drill in). It self-updates as tools/engines are added — see `ARCHITECTURE.md` → "Architecture Diagram".

### Adding a tool (2 steps)

1. Create `src/tools/<segment>/<slug>/` with two required files:
   - `config.ts` — exports a named `const config: ToolConfig` with all tool metadata
   - `Widget.astro` — self-contained Astro component: HTML + `<style is:global>` + `<script is:inline>`
2. Add one import line and one array entry in `src/data/registry.ts` — **this is the only other file that changes**.

All tool pages, category pages, search, and homepage update automatically at build time.

**Browser title** is handled automatically by `ToolLayout` via `generatePageTitle('tool', ...)` in `src/lib/titles.ts`. Do not set titles manually inside tool files. If adding a new page type (not a tool), add a new case to `generatePageTitle` and call it from the layout or page.

### Adding a text processor tool (transform/cleanup)

For any `text → process(text) → text` tool, use the **Text Processor System** instead of hand-writing a widget — it's the processor equivalent of the text-analysis engine. See `ARCHITECTURE.md` → "Text Processor System".

1. Create the processor in `src/lib/text/processors/transform/` or `cleanup/` — one object implementing `TextProcessor` (`{ id, family, process }`).
2. Register it in `src/lib/text/processors/registry.ts` (one import + one `PROCESSORS` entry). It becomes available in the browser as `ToyTools.process(id, text)`.
3. Create `config.ts` (`engine: 'text-processor'`, `family`, `processorId`) + a **3-line** `Widget.astro` that renders `TextProcessorWidget` (do **not** write processing logic in the widget) + optional `Guide.astro`/`faq.ts`. Then the usual registry/guide/faq registration.

The shared `TextProcessorWidget.astro` is generic and must never be edited to add a tool or a new processor family (`extract`/`compare`/`validate`/`format` register the same way). `validate-registry.ts` enforces that each `text-processor` tool's `processorId` resolves in the registry.

### Tool Groups (unified workspaces)

Sibling tools sharing one engine + experience (e.g. the 7 case converters) can form a **tool group**: each member keeps its own URL/metadata/guide/FAQ/sitemap entry (never merge URLs), but the tool page renders a `GroupSwitcher` pill row above the widget and `TextProcessorWidget` persists input under the shared key `group:{id}` so text survives mode switches. Declare the group in `src/data/tool-groups.ts` (ordered members + switcher labels) and set `toolGroup: '<id>'` in each member's `config.ts` — `validate-registry.ts` enforces bidirectional membership and same engine/pattern across members. Switching is real `<a>` navigation (sibling pages are prefetched; `@view-transition` in `global.css` gives a CSS-only cross-fade). See `ARCHITECTURE.md` → "Tool Groups".

### Adding a developer-engine tool (encoding / hashing / structured-data)

The Developer category has three more engines under `src/lib/engines/`, each with the same shape as the text-processor system: `types.ts` + a never-throwing `registry.ts` resolver + per-impl files + a colocated `*.test.ts`, bundled into `ToyToolsRuntime` and consumed by **one generic widget per engine**. See `ARCHITECTURE.md` → "Developer Engines" for the full table.

| Engine | Runtime | Widget | `engine` / `pattern` |
|--------|---------|--------|----------------------|
| Encoding | `ToyTools.runEncoding(id, mode, text)` → `{ok,output,error}` | `EncodingWidget.astro` | `encoding` / `encode-decode` |
| Hashing | `ToyTools.runHash(id, text)` → `Promise<string>` | `HashWidget.astro` | `hashing` / `hash` |
| Structured-Data | `ToyTools.runStructuredData(id, input)` → `{ok,output,error}` | `StructuredDataWidget.astro` | `structured-data` / `structured-transform`\|`structured-validate` |

1. Add the impl in the engine's lib dir + one `registry.ts` entry. Keep browser APIs (`btoa`/`atob`/`crypto.subtle`) **inside** methods — never at module top-level.
2. Create `config.ts` (`engine`, `pattern`, `family`, `processorId`, and curated `relatedTools`) + a **3-line** `Widget.astro` rendering the engine widget. Add the registry import + array entry.
3. Extend the engine's `*.test.ts` (test the engine, not the tool). Optional guide/faq register as usual.

**Widget conventions** (apply if you ever touch the shared engine widgets): the two-pane look comes from the shared `.io-*` classes in `src/styles/tool-widget.css` (don't re-declare per widget); widgets update **live on input** (no Generate/Convert button); extra controls (mode select, Swap, Sample) live in the **single** `.tool-actions` row via `<ToolActions>`'s trailing `<slot/>`. Verify in a real browser with `npm run test:e2e` (Playwright, runs desktop + mobile).

`processorId` is the universal config→engine lookup key. `KNOWN_ENGINES`/`KNOWN_PATTERNS` in `validate-registry.ts` derive from `engineRegistry` (`src/data/engines.ts`) — **register a new engine/pattern there**, not in the validator. `validate-registry` also checks metadata completeness, category/engine/pattern/relatedTools resolution, and duplicate slugs/URLs. Run `npm run health` for the post-build platform integrity superset.

The sitemap is registry-driven (`src/pages/sitemap-index.xml.ts` + `src/pages/sitemaps/*.xml.ts` from `buildContentManifest()`) — new tools/guides appear automatically; never hand-edit a sitemap.

### Removing a tool (2 steps)

1. Delete `src/tools/<segment>/<slug>/`
2. Remove the import and array entry from `src/data/registry.ts`

Nothing else needs to change.

### Adding a guide to a tool

In `config.ts`, add a `guide: GuideConfig` object, then create `Guide.astro` in the same tool
directory. Add **two** entries: a static import in `src/pages/guide/[...slug].astro`
(its `guidesBySlug` map) **and** the tool's slug in `registeredGuideSlugs` (`src/data/guide-registry.ts`).
`validate-registry.ts` fails the build when a declared guide is not registered.

### Adding a FAQ to a tool

FAQ lives **on the tool page only** — there is no `faq` config field and no standalone FAQ pages.
Create `faq.ts` (exports `const items: FAQItem[]`) in the tool directory and register it with one
import + `faqsByToolSlug` entry in `src/data/faq-registry.ts`. The tool page then automatically
renders the `FaqAccordion` in its `#faq` section, emits `FAQPage` JSON-LD, and shows the
"Common Questions (N)" anchor in `ToolNavRow`.

Historical note: the old `/faq/{segment}/{slug}/` pages are **redirect stubs** (meta-refresh +
canonical → tool page `#faq`), generated from `src/data/faq-redirects.ts`. They are noindex and in
no sitemap. Never add new entries there — it exists only to preserve previously-indexed URLs.

### Adding a knowledge file (Knowledge Graph — Phase D)

Every tool should also have a co-located `knowledge.ts` exporting `const knowledge: Knowledge`
(`@lib/knowledge/types`), registered with one import + one entry in `src/lib/knowledge/registry.ts`.
This powers the auto-generated Related Tools / You May Also Need / Continue Learning sections,
topic clusters, the EntityMatcher, and `dist/knowledge-graph.json` diagnostics.

- **Derived for free** (do NOT author): related tools/guides/FAQs come from engine→pattern→family→
  category via the graph. You only author the **overlay** fields: `primaryConcepts`/`secondaryConcepts`,
  `intentGroups`, `realWorldUseCases`, `commonMistakes`, `commonQuestions`, and the curated
  relationships `usedWith` / `alternatives` / `nextSteps` (typed `RelationshipReference`:
  `{ slug, reason?, strength?, priority? }`), plus `workflowStage`, `keywords`, `entityAliases`.
- `slug` must equal the tool slug, `category` must equal `categorySlug`, `summary` ≤160 chars,
  `schemaVersion: KNOWLEDGE_SCHEMA_VERSION`.
- `seo:scaffold <slug>` emits a `knowledge.draft.ts` stub (concepts/intents pre-filled, relations TODO).
- Build gating: a **missing** knowledge file WARNs; an **invalid** one (bad shape, unresolved
  relationship target, slug/category mismatch) **fails the build** via `scripts/validate-knowledge.ts`.
  `KNOWLEDGE_REQUIRED=true` promotes the missing-file WARN to an ERROR.

### Tool directory structure

Tools are organized by URL segment under `src/tools/`:

```
src/tools/
├── _shared/             # Shared widget components (TextMetricWidget, TextProcessorWidget, ToolSection, ToolAction)
├── text/                # text-utilities category (URL segment: text)
│   ├── word-counter/                # text-metric tools (text-analysis engine)
│   ├── character-counter/
│   ├── sentence-counter/
│   ├── paragraph-counter/
│   ├── reading-time-calculator/
│   ├── uppercase-converter/         # text-processor tools (transform family)
│   ├── lowercase-converter/
│   ├── title-case-converter/
│   ├── sentence-case-converter/
│   ├── camel-case-converter/
│   ├── snake-case-converter/
│   ├── kebab-case-converter/
│   ├── remove-extra-spaces/         # text-processor tools (cleanup family)
│   ├── remove-blank-lines/
│   ├── remove-duplicate-lines/
│   ├── trim-text/
│   ├── normalize-whitespace/
│   └── remove-tabs/
├── number/              # number-utilities category
│   └── percentage-calculator/
├── developer/           # developer-tools category
│   ├── base64-encoder-decoder/      # encoding engine (encode-decode pattern)
│   ├── url-encoder-decoder/         # encoding engine
│   ├── html-entity-encoder-decoder/ # encoding engine
│   ├── md5-hash-generator/          # hashing engine (hash pattern)
│   ├── sha1-hash-generator/         # hashing engine
│   ├── sha256-hash-generator/       # hashing engine
│   ├── json-formatter/              # structured-data engine (structured-transform pattern)
│   ├── json-minifier/               # structured-data engine
│   └── json-validator/              # structured-data engine (structured-validate pattern)
└── productivity/        # productivity category
    ├── todo-list/
    ├── notepad/
    ├── keep-screen-awake/
    └── pomodoro-timer/
```

Each tool directory contains:
```
src/tools/<segment>/<slug>/
├── config.ts        # ToolConfig — slug, name, description, categorySlug, tags, guide?, toolGroup?
├── Widget.astro     # Self-contained tool UI (required)
├── faq.ts           # exports: const items: FAQItem[] (optional — only if tool has FAQ)
└── Guide.astro      # Wraps GuideLayout with full guide content (optional)
```

Shared sub-components for widgets: `src/tools/_shared/ToolSection.astro`, `ToolAction.astro`, `ToolSplit.astro`.

### Two-column layout (`ToolSplit`)

`src/tools/_shared/ToolSplit.astro` is the canonical desktop 2-column shell (named slots `input`/`output`).
Props: `ratio` (`'1-1'|'3-2'|'3-1'`), `stackOrder` (`'input-first'|'output-first'`), `stickyOutput`.
Stacks to one column below **1024px**. Most tools use it (metrics, case, percentage, base64, keep-awake,
pomodoro); notepad/todo stay single-column. case-converter & percentage-calculator are **live** (update
on input — no Convert/Calculate buttons). See `ARCHITECTURE.md` for the per-tool map.

`CategoryDiscovery.astro` renders below each tool's output (and in guides/FAQ) — a data-driven
"Browse all N {Category} →" cross-link. `ToyTools.state.save/load/clear(toolId, data)` is the unified
versioned persistence API; tools restore on load. See `ARCHITECTURE.md` → Platform foundation.

### Hero Metric Pattern (text analysis tools)

Text metric tools use `src/tools/_shared/TextMetricWidget.astro`, which accepts a `stats[]` array:
- `stats[0]` → rendered as **HeroMetric** (`src/components/tool/HeroMetric.astro`) — large numeral, `clamp(--text-3xl, 6vw, --text-5xl)`, bold, `--font-mono`, in the sticky output column
- `stats[1+]` → rendered as **StatGrid** — symmetrical grid of boxed stat cards (2-up; lone trailing card spans the row)

Empty state: secondary metrics are **hidden entirely**; hero shows `0`/`0 min` via `ToyTools.formatMetric(0, fmt)` plus the hint "Paste or type text to begin." Mobile order is answer-first (metrics → textarea → actions).

```astro
<TextMetricWidget
  slug="word-counter"
  stats={[
    { metric: 'words',    label: 'Words',    formatter: 'integer' }, // → hero
    { metric: 'sentences', label: 'Sentences' },                      // → secondary grid
  ]}
/>
```

### Data layer

```
src/data/
├── types.ts          # ToolConfig, GuideConfig, FAQItem, Category, EcosystemEntry
├── categories.ts     # Category definitions (accent colors, segments)
├── registry.ts       # Single source of truth — imports all tool configs
└── faq-registry.ts   # Imports all faq.ts files by tool slug
```

### Widget JavaScript rules

All tool scripts use `<script is:inline>` inside `Widget.astro`:
- No TypeScript, no imports, no `import.meta.env`
- Access shared helpers via `ToyTools.*` global (from `ToyToolsRuntime.astro` in BaseLayout):
  - `ToyTools.toast(msg)` — show the global toast notification
  - `ToyTools.storage.get/set/clear(key)` — localStorage with 50 KB cap
  - `ToyTools.copy(text)` — clipboard copy with toast feedback
- localStorage key convention: `toytools.<slug>.<field>`, 50 KB cap

### BackButton

`src/components/BackButton.astro` renders a mobile-only ← Back button (hidden above 640px).
It is automatically included in `GuideLayout`.
Do not add it manually in widgets.

### Path/URL handling — always use `withBase`

Every internal `href` and form `action` must go through `src/lib/paths.ts:withBase()`. It prepends `import.meta.env.BASE_URL` (empty locally, `/toytools` on GitHub Pages). Bypassing it breaks deployed links.

```ts
// correct
<a href={withBase(`/category/${category.slug}/`)}>
// wrong — breaks on GitHub Pages
<a href={`/category/${category.slug}/`}>
```

URL structure (singular, not plural):
- `/tool/{segment}/{slug}/` — tool pages
- `/category/{slug}/` — category pages
- `/guide/{category}/{slug}/` — guide pages
- `/faq/{category}/{slug}/` — redirect stubs only (→ tool page `#faq`; see faq-redirects.ts)

**Discovery surfaces:** the homepage renders `ToolDirectory.astro` (compact per-category link
columns; tool groups collapse to one entry) and category pages render `CategoryToolList.astro`
(sectioned rows from `src/data/category-sections.ts` — add a `pattern → section` row there when
registering a new pattern). No tile grids. See `ARCHITECTURE.md` → "Discovery surfaces".

`withBase` is a build-time server function; do not call it inside `<script is:inline>`.

### Dark mode

Two CSS layers in `src/styles/tokens.css`:
- `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])` — respects OS preference
- `:root[data-theme="dark"]` — user override

The user's choice is stored in `localStorage` and applied before first paint by an inline script in `BaseLayout.astro`'s `<head>`. Toggle logic lives in `Nav.astro`.

### CopyButton protocol

`CopyButton.astro` reads two data attributes on its target element:
- `data-empty` — present when output is the placeholder state → shows "Nothing to copy!" toast
- `data-error` — present when output is an error state, value is the error message → shows that message as toast, blocks copy

Add `data-copy-bar` to any panel header that should turn green on copy.

### CSS design system

All values come from `src/styles/tokens.css` custom properties. Key constraints:
- Single accent token: `--color-accent`. Change it to retheme everything.
- Semantic status tokens: `--color-success` (green), `--color-danger` (red, `#dc2626` light / `#ef4444` dark). Use `--color-danger` for destructive action confirmation states.
- Typography scale: `--text-xs` through `--text-5xl` (3rem). Hero metrics use `--text-5xl`.
- Transitions: only `color`, `background-color`, `border-color`. Durations: `150ms` or `200ms` only.
- Touch targets: minimum `var(--touch-target)` (48px).
- Widths: shell/chrome/home/category `var(--width-shell)` (1440px), tool pages & 2-col splits `var(--width-content)` (1100px), guide prose `var(--width-prose)` (72ch), FAQ/narrow forms `var(--width-tool)` (820px). `--width-category`/`--width-nav` alias `--width-shell`. Applied via `BaseLayout`'s `maxWidth` prop (`'shell' | 'content' | 'tool' | 'full'`; `'category'` aliases shell) on an inner `.page-content` div — `<main>` spans shell width. Status tints: `--color-success-bg`, `--color-danger-bg`.
- Shared widget CSS lives in `src/styles/tool-widget.css` (imported by `global.css`).

### TypeScript path aliases

`@components/*`, `@data/*`, `@layouts/*`, `@styles/*`, `@tools/*`, `@lib/*` — configured in `tsconfig.json`, auto-synced to Vite by Astro.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with `ASTRO_BASE_PATH=/toytools` and deploys `dist/` to GitHub Pages at `https://atharvamahamuni.github.io/toytools/`.
