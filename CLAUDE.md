# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # static output → dist/
npm run preview  # serve dist/ locally

# Production build (custom apex domain toytoolsapp.com — served from root, NO base path)
ASTRO_SITE=https://toytoolsapp.com npm run build
```

> Do **not** set `ASTRO_BASE_PATH=/toytools`. The site is served from the apex of
> `toytoolsapp.com` (see `public/CNAME`), so a base path would push every page under
> `/toytools/...` while the real, indexable URLs live at the root. Bare URLs would then fall
> through to GitHub Pages' `404.html`, which carries `noindex,nofollow` — exactly the
> "noindex detected in 'robots' meta tag" that Search Console flags.

`npm run build` is the verification step — it runs the registry/knowledge/**architecture** validators, then Astro rendering and strict TypeScript together. There is no separate lint script.

```sh
npm run validate:architecture  # architectural lint pass (orphan files, dead registry entries,
                               # guide-route drift, self-referential knowledge, empty categories)
```

`validate-architecture.ts` is the *reverse* of `validate-registry.ts`: that one checks declared
references resolve; this one catches files/entries that exist but nothing wires up (the drift that
slips past a green build because Astro does not type-check `.astro` frontmatter and engine
registries never throw). It runs inside `npm run build`; run it alone with the command above.

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

```sh
npm run quality:pr      # Quality Guardian — per-PR crawl/validate/autofix pass (quality-guardian/)
npm run quality:weekly  # Quality Guardian — scheduled full-site sweep
npm run version:bump     # bump src/lib/version.ts (APP_VERSION) + CHANGELOG.md
npm run version:show     # print the current APP_VERSION
```

**Quality Guardian** (`quality-guardian/` — a self-contained sub-project with its own
`package.json`) crawls the built site and runs validators/autofixers (links, metadata, schema,
accessibility). It is **not** part of `npm run build`; it runs on its own CI workflow. Treat it
like `seo-engine/`: a tooling sidecar, not part of the site bundle.

## Indexing coverage

`npm run check:indexing` reports which live URLs Google has actually indexed (indexed /
crawled-not-indexed / discovered / excluded-noindex), via the Google Search Console URL Inspection
API — no Search Console UI. It reads the same manifest-derived URL list as the sitemap/IndexNow
(`dist/indexnow-urls.json`, so run `npm run build` first) and writes reports to
`quality-guardian/reports/indexing/`. Use `-- --dry-run` to validate without credentials. The live
path needs `GSC_SITE_URL` + `GSC_SA_KEY_JSON` (CI secrets); setup + the multi-provider seam are in
`docs/indexing.md`. Runs weekly via `.github/workflows/indexing.yml` (never in the deploy path).

## Analytics

Google Analytics (GA4) is included on every page via `src/layouts/BaseLayout.astro`. The tag ID is `G-WHD7CL44MX`. Since all pages go through `BaseLayout`, no further action is needed when adding new pages or tool types — the tag is inherited automatically. Do **not** add a second `gtag` snippet to individual pages or layouts.

## SEO Engine

Local-first pipeline for researching, writing, and auditing tool content (guides, FAQs, knowledge files). The **`seo-content` skill** (`.claude/skills/seo-content/`) is the entry point for all content work — it routes through `seo:status` and the generated per-tool authoring brief.

```sh
npm run seo:status -- <slug>   # ALWAYS start here: pipeline state + exact next command
npm run seo:gate -- <slug>     # quality gate (exit 1 below the bar) — the done-condition for content
npm run seo:doctor             # run when any seo:* command misbehaves: detects engine/codebase drift
```

Research → extract → scaffold produce `seo-engine/output/<slug>/PROMPT.md`, a self-contained authoring brief (style contract, registration snippets, acceptance commands). Full command table: `seo-engine/README.md`. Writing hard rule: **no em-dashes anywhere** (the gate fails on any occurrence).

## Git workflow

Always rebase against `origin/main`: `git rebase origin/main`

## Architecture

**Data-driven static site.** All pages are pre-rendered at build time. No server, no database, no client-side framework.

See `ARCHITECTURE.md` at the project root for system-level patterns, widget conventions, and URL structure.

### Breaking-changes playbook (what to touch together)

Most edits are local, but a few changes ripple across files. When you make one of these, update
**every** listed touchpoint in the same change or a validator/build will fail (or, worse, drift silently):

- **Add an engine or pattern** → declare it in `src/data/engines.ts` (`ENGINE_IDS`/`PATTERN_IDS`
  *and* `engineDefs`; the unions and the defs are cross-checked). `KNOWN_ENGINES`/`KNOWN_PATTERNS`
  derive from here — never edit the validator. Add a `pattern → section` row in
  `src/data/category-sections.ts`. If it has a runtime, wire it into `ToyToolsRuntime`.
- **Add a tool** → `src/tools/<segment>/<slug>/{config.ts,Widget.astro}` + one import/entry in
  `src/data/registry.ts`. A `processorId` must resolve in its engine registry **and** be unique
  (collisions now fail `validate-registry`).
- **Add a guide** → `guide:` in config + `Guide.astro` + slug in `src/data/guide-registry.ts`
  **and** import in `src/pages/guide/[...slug].astro`. Missing the route import renders an empty
  page — `validate-architecture` now catches it.
- **Add a FAQ / knowledge file** → register in `src/data/faq-registry.ts` /
  `src/lib/knowledge/registry.ts`. An authored file left unregistered is an orphan (it never
  renders) and `validate-architecture` fails the build.
- **Rename a category** (slug or segment) → `src/data/categories.ts`, every tool's
  `categorySlug`, and add a noindex redirect stub in `src/data/tool-redirects.ts` for the old URL.
  Never delete the old URL silently.
- **Verify UI changes in a real browser** with `npm run test:e2e` (desktop + Pixel 5). Build/unit
  tests do not catch widget JS errors; e2e does and is a PR gate.

### Knowledge Graph (Phase D/E)

`knowledge.ts` files feed `buildGraph()` (`src/lib/knowledge/`), the `EntityMatcher`, topic
clusters, and `dist/knowledge-graph.json`. Related-tools/guides/FAQs are **derived** from the
graph (engine→pattern→family→category); you author only the overlay fields (see "Adding a
knowledge file" below). Coverage gaps surface in `npm run intel`.

For a live bird's-eye view, the deployed **`/architecture/`** page (`src/pages/architecture.astro`) renders an interactive Mermaid map of Categories → Engines + cross-cutting layers, derived from the registries at build time (click any block to drill in). It self-updates as tools/engines are added — see `ARCHITECTURE.md` → "Architecture Diagram".

### Adding a tool (2 steps)

> The **`add-tool` skill** (`.claude/skills/add-tool/`) is the canonical entry point — it walks
> the full file checklist, engine selection, and validation. Use it when building any new tool or engine.

1. Create `src/tools/<segment>/<slug>/` with two required files:
   - `config.ts` — exports a named `const config: ToolConfig` with all tool metadata
   - `Widget.astro` — self-contained Astro component: HTML + `<style is:global>` + `<script is:inline>`
2. Add one import line and one array entry in `src/data/registry.ts` — **this is the only other file that changes**.

All tool pages, category pages, search, and homepage update automatically at build time.

**Search-engine notification (IndexNow):** new URLs are submitted to IndexNow **automatically** on
the next production deploy (the post-deploy `indexnow` CI job derives the URL list from the Content
Manifest — no manual step, no per-page registration). The one hard rule: never run `npm run indexnow`
against a host whose `public/<key>.txt` isn't already live, or IndexNow caches a `403` ownership
failure. See `docs/indexnow.md` → "Registration & adding new URLs".

**Browser title** is handled automatically by `ToolLayout` via `generatePageTitle('tool', ...)` in `src/lib/titles.ts`. Do not set titles manually inside tool files. If adding a new page type (not a tool), add a new case to `generatePageTitle` and call it from the layout or page.

### Adding a text processor tool (transform/cleanup)

For any `text → process(text) → text` tool, use the **Text Processor System** instead of hand-writing a widget — it's the processor equivalent of the text-analysis engine. See `ARCHITECTURE.md` → "Text Processor System".

1. Create the processor in `src/lib/text/processors/transform/` or `cleanup/` — one object implementing `TextProcessor` (`{ id, family, process }`).
2. Register it in `src/lib/text/processors/registry.ts` (one import + one `PROCESSORS` entry). It becomes available in the browser as `ToyTools.process(id, text)`.
3. Create `config.ts` (`engine: 'text-processor'`, `family`, `processorId`) + a **3-line** `Widget.astro` that renders `TextProcessorWidget` (do **not** write processing logic in the widget) + optional `Guide.astro`/`faq.ts`. Then the usual registry/guide/faq registration.

The shared `TextProcessorWidget.astro` is generic and must never be edited to add a tool or a new processor family (`extract`/`compare`/`validate`/`format` register the same way). `validate-registry.ts` enforces that each `text-processor` tool's `processorId` resolves in the registry.

### Tool Groups (unified workspaces)

Sibling tools sharing one engine + experience (e.g. the 7 case converters) can form a **tool group**: each member keeps its own URL/metadata/guide/FAQ/sitemap entry (never merge URLs), but the tool page renders a `GroupSwitcher` pill row above the widget and `TextProcessorWidget` persists input under the shared key `group:{id}` so text survives mode switches. Declare the group in `src/data/tool-groups.ts` (ordered members + switcher labels) and set `toolGroup: '<id>'` in each member's `config.ts` — `validate-registry.ts` enforces bidirectional membership and same engine/pattern across members. Switching is real `<a>` navigation (sibling pages are prefetched; `@view-transition` in `global.css` gives a CSS-only cross-fade). See `ARCHITECTURE.md` → "Tool Groups".

### Adding a developer-engine tool (encoding / hashing / structured-data / jwt)

The Developer category has four engines under `src/lib/engines/`, each with the same shape as the text-processor system: `types.ts` + a never-throwing `registry.ts` resolver + per-impl files + a colocated `*.test.ts`, bundled into `ToyToolsRuntime` and consumed by **one generic widget per engine**. See `ARCHITECTURE.md` → "Developer Engines" for the full table.

| Engine | Runtime | Widget | `engine` / `pattern` |
|--------|---------|--------|----------------------|
| Encoding | `ToyTools.runEncoding(id, mode, text)` → `{ok,output,error}` | `EncodingWidget.astro` | `encoding` / `encode-decode` |
| Hashing | `ToyTools.runHash(id, text)` → `Promise<string>` | `HashWidget.astro` | `hashing` / `hash` |
| Structured-Data | `ToyTools.runStructuredData(id, input)` → `{ok,output,error}` | `StructuredDataWidget.astro` | `structured-data` / `structured-transform`\|`structured-validate` |
| JWT | `ToyTools.runJwt(token)` → `{ok,output,error}` | (interactive widget) | `jwt` / `token-decode` |

The full engine manifest lives in `src/data/engines.ts` (the single source of truth for which engines/patterns exist). Besides the four developer engines, the platform also declares: `text-analysis` (`text-metric`), `text-processor` (`text-transform`/`text-cleanup`), `text-interactive` (`text-interactive` — e.g. find-replace, text-compare; self-contained widgets, no runtime global), `calculator` (`calculate` — the number tools), and `productivity` (`stateful`). Register a new engine/pattern there, never in the validator.

1. Add the impl in the engine's lib dir + one `registry.ts` entry. Keep browser APIs (`btoa`/`atob`/`crypto.subtle`) **inside** methods — never at module top-level.
2. Create `config.ts` (`engine`, `pattern`, `family`, `processorId`, and curated `relatedTools`) + a **3-line** `Widget.astro` rendering the engine widget. Add the registry import + array entry.
3. Extend the engine's `*.test.ts` (test the engine, not the tool). Optional guide/faq register as usual.

**Widget conventions** (apply if you ever touch the shared engine widgets): every framed pane is composed from the `IoPanel` primitive (`src/tools/_shared/IoPanel.astro`) — **never hand-write `.io-panel`/`.io-header` markup**; the `.io-*` styles live in `src/styles/tool-widget.css` (don't re-declare per widget); widgets update **live on input** (no Generate/Convert button); panels are fixed-height with internal scroll (no auto-growing textareas — page geometry must not change while typing) and equalize column heights on desktop; the mode select goes in `IoPanel`'s `header-end` slot, Swap/Sample in the **single** `.tool-actions` row via `<ToolActions>`'s trailing `<slot/>`. See `ARCHITECTURE.md` → "Design Language". Verify in a real browser with `npm run test:e2e` (Playwright, runs desktop + mobile).

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
│   ├── letter-counter/
│   ├── line-counter/
│   ├── space-counter/
│   ├── find-replace/                # text-interactive engine (text-interactive pattern)
│   ├── text-compare/                # text-interactive engine
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
├── number/              # number-utilities category (calculator engine, calculate pattern)
│   ├── percentage-calculator/
│   ├── margin-calculator/
│   ├── discount-calculator/
│   └── tip-calculator/
├── developer-utilities/ # developer-utilities category (URL segment: developer-utilities)
│   ├── base64-encoder-decoder/      # encoding engine (encode-decode pattern)
│   ├── url-encoder-decoder/         # encoding engine
│   ├── html-entity-encoder-decoder/ # encoding engine
│   ├── hex-encoder-decoder/         # encoding engine
│   ├── md5-hash-generator/          # hashing engine (hash pattern)
│   ├── sha1-hash-generator/         # hashing engine
│   ├── sha256-hash-generator/       # hashing engine
│   ├── sha512-hash-generator/       # hashing engine
│   ├── json-formatter/              # structured-data engine (structured-transform pattern)
│   ├── json-minifier/               # structured-data engine
│   ├── json-validator/              # structured-data engine (structured-validate pattern)
│   ├── json-to-csv-converter/       # structured-data engine
│   ├── csv-to-json-converter/       # structured-data engine
│   ├── json-to-yaml-converter/      # structured-data engine
│   ├── yaml-to-json-converter/      # structured-data engine
│   ├── json-tree-viewer/            # structured-data engine
│   └── jwt-decoder/                 # jwt engine (token-decode pattern)
└── productivity/        # productivity category (productivity engine, stateful pattern)
    ├── todo-list/
    ├── notepad/
    ├── keep-screen-awake/
    └── pomodoro-timer/
```

> **Note:** the developer category's URL segment was renamed `developer` → `developer-utilities`
> (and its slug `developer-tools` → `developer-utilities`). Old `/tool/developer/{slug}/` and
> `/category/developer-tools/` URLs are preserved as noindex meta-refresh redirect stubs via
> `src/data/tool-redirects.ts` (consumed by `src/pages/tool/developer/[slug].astro` and
> `src/pages/category/[oldSlug].astro`). Never add new entries there.

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
├── types.ts            # ToolConfig, GuideConfig, FAQItem, Category, EcosystemEntry
├── categories.ts       # Category definitions (accent colors, segments)
├── engines.ts          # Engine manifest — single source of truth for engines/patterns
├── registry.ts         # Single source of truth — imports all tool configs
├── faq-registry.ts     # Imports all faq.ts files by tool slug
├── guide-registry.ts   # registeredGuideSlugs — declared guides must appear here
├── tool-groups.ts      # Tool group definitions (unified workspaces)
├── category-sections.ts# pattern → category-page section rows
├── metadata.ts         # Shared SEO/metadata helpers
├── faq-redirects.ts    # Legacy /faq/ redirect stubs (noindex)
└── tool-redirects.ts   # Legacy /tool/developer/ + /category/developer-tools/ redirect stubs
```

Engine logic lives under `src/lib/engines/` (`encoding/`, `hashing/`, `structured-data/`, `jwt/`),
with supporting libraries in `src/lib/text/` (analysis, processors, compare, transforms),
`src/lib/json/` (explorer + yaml), `src/lib/csv/`, `src/lib/knowledge/`,
`src/lib/content-intelligence/`, `src/lib/content/` (manifest), and `src/lib/analytics/`.

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
- `/{lang}/` — per-language landing stubs (e.g. `/es/`, `/ja/`, `/zh-hk/`) in `src/pages/{lang}/index.astro`.
  These are localized hero stubs, **`robots="noindex,follow"`**, and in no sitemap — they exist to greet
  non-English visitors and link back to the (English) tool catalog. Use the `language` page type in
  `generatePageTitle`. `generatePageTitle` (`src/lib/titles.ts`) covers: `home`/`tool`/`guide`/`faq`/
  `category`/`language`/`search`/`architecture`/`notFound`.

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
- Palette: "Warm Paper & Ink" — warm off-white surfaces + soft-ink text (light), warm graphite (dark). Accent family: `--color-accent` (forest green `#2F6B4F` light / `#84C2A3` dark — single retheme point), `--color-accent-subtle`, `--color-accent-strong` (accent text on accent-subtle, AA). See `ARCHITECTURE.md` → "Design Language".
- Semantic status tokens: `--color-success` (brighter/cooler green than the accent — transient state only, never links/focus), `--color-danger` (red). Use `--color-danger` for destructive action confirmation states.
- Immersive fullscreen overlays use the theme-invariant `--color-overlay-*` tokens (always dark, never themed).
- Focus: one global `:focus-visible` ring from `--focus-ring`/`--focus-ring-offset` — don't add per-component rings.
- Typography scale: `--text-xs` through `--text-5xl` (3rem). Hero metrics use `--text-5xl` with `tabular-nums`.
- Transitions: only `color`, `background-color`, `border-color`. Durations: `150ms` or `200ms` only.
- Touch targets: minimum `var(--touch-target)` (48px).
- Section boundaries: one hairline drawn by the lower section (`margin-top`/`border-top`/`padding-top`, 32px rhythm; guides 48px). Sections never own a `border-bottom`.
- Widths: shell/chrome/home/category `var(--width-shell)` (1440px), tool pages & 2-col splits `var(--width-content)` (1100px), guide prose `var(--width-prose)` (72ch), FAQ/narrow forms `var(--width-tool)` (820px). `--width-category`/`--width-nav` alias `--width-shell`. Applied via `BaseLayout`'s `maxWidth` prop (`'shell' | 'content' | 'tool' | 'full'`; `'category'` aliases shell) on an inner `.page-content` div — `<main>` spans shell width. Status tints: `--color-success-bg`, `--color-danger-bg`.
- Shared widget CSS lives in `src/styles/tool-widget.css` (imported by `global.css`).

### TypeScript path aliases

`@components/*`, `@data/*`, `@layouts/*`, `@styles/*`, `@tools/*`, `@lib/*` — configured in `tsconfig.json`, auto-synced to Vite by Astro.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with `ASTRO_SITE=https://toytoolsapp.com` (and **no** `ASTRO_BASE_PATH`, so pages are served from the apex root) and deploys `dist/` to GitHub Pages at the custom domain `https://toytoolsapp.com/` (custom domain pinned by `public/CNAME`).
