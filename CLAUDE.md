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
                               # guide-route drift, self-referential knowledge, empty categories,
                               # unmapped patterns that fall into the "Other" section bucket)
```

`validate-architecture.ts` is the *reverse* of `validate-registry.ts`: that one checks declared
references resolve; this one catches files/entries that exist but nothing wires up (the drift that
slips past a green build because Astro does not type-check `.astro` frontmatter and engine
registries never throw). It runs inside `npm run build`; run it alone with the command above.

```sh
npm run check:duplication      # near-duplicate authored content (descriptions, FAQ answers,
                               # knowledge summaries, common-mistakes) — WARN-only; -- --strict to fail
```

`check-duplication.ts` flags content that reads mass-produced as the catalog scales (word-shingle
Jaccard similarity). Sibling tools naturally trip it (hash generators, case converters), so it is
informational by default; run before shipping a batch of new tool content.

```sh
npm run scaffold:tool -- --slug <slug> --name "<Name>" --category <cat> --engine <engine> \
  --pattern <pattern> --family <family> [--processor-id <id>] [--faq] [--guide] [--dry-run]
```

`scaffold-tool.ts` generates a new tool's directory **and** wires every registry in one step (the
inverse of the multi-file checklist) so adding a tool is one command. It emits TODO stubs to fill
in; engine-backed engines (`text-processor`/`encoding`/`hashing`/`structured-data`/`jwt`) get a
real 3-line widget, others a placeholder. Idempotent; refuses an existing slug. See the
**`add-tool` skill** for the full flow.

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

## Research Intelligence Engine (RIE)

The RIE is a permanent subsystem (alongside Registry, Content Intelligence, Knowledge Graph, SEO
Engine) that answers **"what should we build next, why, and how?"** from evidence. It mirrors the
content-intelligence architecture (pure analyzers over an injected inputs bundle, registry-driven,
never-throw, deterministic) and lives in `src/lib/research/`. Full docs: `docs/research-intelligence.md`.

```sh
npm run research            # run pipeline + validate + write reports to research/reports/ (on demand)
npm run research:next       # write + print research/reports/next-build.md (the headline recommendation)
npm run research:roadmap    # roadmap.md + next-build.md
npm run research:clusters   # clusters.json
npm run research:gaps       # gap classification + missing-engines.json
npm run research:validate   # CI gate: datasets + registry + report integrity (exit 1 on error)
```

On demand only — **never** in `npm run build`. Providers read local seed datasets in
`research/datasets/*.json` (offline/deterministic); the 15 external sources (`reddit`, `github`,
`autocomplete`, ...) are documented live-API seams in `src/lib/research/providers/` that return `[]`
until wired. Scoring weights are data in `src/lib/research/config.ts`; longer-horizon engine
hypotheses are data in `src/lib/research/taxonomy.ts`. To change recommendations, change the
**evidence** (seed datasets) and re-run — never hand-edit a report.

> **Standing rule — evidence-driven tool selection.** Never pick the next tool by intuition. Whenever
> asked what to build next, for a new-tool idea/suggestion, or "let's build the next tool," first run
> the RIE (`npm run research:next`) — or invoke the **`next-tool` skill** / the
> **`research-intelligence` agent** — present the top scored opportunity *with reasoning* (demand,
> weak incumbents, why ToyTools can win, the reusable engine and what it unlocks, suggested
> guides/FAQs/links, effort/SEO/maintenance estimates), then implement via the **`add-tool`** skill.

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

### The code map — "where does X live?" in one read

**`docs/code-map.json`** (committed, generated — never hand-edit) maps every tool slug →
directory, URL, engine/pattern/family, `processorId`, tool group, files on disk, and
guide/FAQ/knowledge registration — plus the engine manifest (each engine's patterns, runtime
global, and **shared widget**) and the tool-group manifest. Read it instead of grepping the
registries. It cannot rot: `validate-architecture` (part of `npm run build`) fails on drift, and
`scaffold-tool` regenerates it; regenerate manually with `npm run map:generate`. The authoritative
TS sources behind it: `src/data/engines.ts` (engines/patterns), `src/data/registry.ts` (tools),
`src/data/tool-groups.ts` (groups).

### Adding a tool

> The **`add-tool` skill** (`.claude/skills/add-tool/`) is the canonical playbook — engine
> selection, the full file checklist, optional content (guide/FAQ/knowledge), and validation.
> This file intentionally does not duplicate it.

```sh
npm run scaffold:tool -- --slug <slug> --name "<Name>" --category <cat> --engine <engine> \
  --pattern <pattern> --family <family> [--processor-id <id>] [--faq] [--guide] [--dry-run]
```

writes `src/tools/<segment>/<slug>/` (config + widget + optional faq/guide/knowledge stubs), wires
**all five registries** (registry, faq-registry, guide-registry + the guide route, knowledge
registry), and regenerates the code map. Engine-backed tools get a real 3-line widget wrapping the
engine's shared widget; bespoke engines get a placeholder. Fill the TODO stubs (for a new
engine-backed transform, also the engine impl + its registry entry + `*.test.ts` — keep browser
APIs inside methods, never at module top-level), then `npm run build` (validate-registry +
validate-knowledge + validate-architecture catch every wiring mistake) and `npm run test:e2e`.

Two deploy-facing hard rules:
- **IndexNow:** new URLs are submitted automatically post-deploy. Never run `npm run indexnow`
  against a host whose `public/<key>.txt` isn't already live (it caches a `403` ownership
  failure). See `docs/indexnow.md`.
- **Browser titles** come from `generatePageTitle` (`src/lib/titles.ts`) via the layouts — never
  set titles inside tool files. A new page *type* adds a case there.

The sitemap is registry-driven — new tools/guides appear automatically; never hand-edit a sitemap.
Engines/patterns register in `src/data/engines.ts`, **never** in the validators (they derive from
it). Widget conventions (IoPanel composition, live-on-input, fixed-height panels, ToolActions row)
live in `ARCHITECTURE.md` → "Design Language".

### Removing a tool

`npm run scaffold:tool -- --remove --slug <slug>` deletes the tool directory, strips every
registry entry, and regenerates the code map (`--dry-run` to preview).

### Tool Groups (unified workspaces)

Sibling tools sharing one engine + experience (case converters, text counters, text cleanup,
encoders, hash generators, JSON tools) form **tool groups**: each member keeps its own
URL/metadata/guide/FAQ/sitemap entry (never merge URLs), but the tool page renders a
`GroupSwitcher` pill row and the engine widgets persist input under the shared key `group:{id}` so
text survives mode switches (tool-specific state like conversion direction stays per-slug).
Declare the group in `src/data/tool-groups.ts` and set `toolGroup: '<id>'` in each member's
`config.ts` — `validate-registry.ts` enforces bidirectional membership and same engine/pattern
across members. See `ARCHITECTURE.md` → "Tool Groups".

### Tool directory anatomy

```
src/tools/<segment>/<slug>/
├── config.ts        # ToolConfig — slug, name, description, categorySlug, tags, guide?, toolGroup?
├── Widget.astro     # Tool UI (required) — 3-line engine-widget wrapper or self-contained bespoke
├── faq.ts           # exports: const items: FAQItem[] (optional — renders on the tool page only)
├── knowledge.ts     # exports: const knowledge: Knowledge (overlay fields only; relations derived)
└── Guide.astro      # Wraps GuideLayout with full guide content (optional)
```

The full per-tool inventory (which of these exist for every slug, and where) is in
`docs/code-map.json`. Historical URL notes: old `/faq/...` pages and the old `developer` segment
are preserved as noindex redirect stubs (`src/data/faq-redirects.ts`, `src/data/tool-redirects.ts`)
— never add new entries to either.

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
