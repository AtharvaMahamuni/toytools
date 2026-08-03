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

`npm run build` is the verification step — it runs the registry/knowledge/**architecture** validators, then Astro rendering and strict TypeScript together, then the **performance budget**. There is no separate lint script.

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
npm run check:budget           # per-page critical-path budget (runs last in npm run build; needs dist/)
npm run check:budget -- tool/text/word-counter   # print specific pages
```

## Performance budget (a hard gate for every new tool)

**Every page has a byte budget and `npm run build` fails when one is exceeded.** This is not
advisory. `scripts/check-budget.ts` measures the built `dist/` — render-blocking stylesheets, all JS
the page fetches on load, and the HTML document, all gzipped — and compares each page against its
kind's budget. It resolves the *actual* lazy chunks a page pulls (the engine named in
`<meta name="tt-engines">`, the model named in `data-simulation-id`), so the numbers match a real
browser trace exactly rather than over- or under-counting.

Current budgets (gzipped) and the worst real page against each:

| kind | sheets | CSS | JS | HTML | TOTAL | worst today |
|---|---|---|---|---|---|---|
| tool | 6 | 16 KB | 24 KB | 34 KB | **60 KB** | 54.6 KB (`json-tree-viewer`) |
| guide | 4 | 13 KB | 8 KB | 26 KB | 42 KB | 31.4 KB |
| category | 4 | 12 KB | 8 KB | 26 KB | 40 KB | 21.9 KB |
| page | 4 | 12 KB | 12 KB | 30 KB | 48 KB | 41.7 KB (`/search/`) |

A typical new tool lands around **33-40 KB gzipped total**, so the budget has real headroom for
content. If a new tool blows it, the cause is almost always structural, not the content:

- **JS over budget** → the tool's engine is pulling something it should not, or an engine got
  statically imported back into `src/lib/runtime/index.ts`. Engines must stay lazy (see
  "Client Runtime" in `ARCHITECTURE.md`). A two-line static import regressed 134 pages when tested.
  A second shape of this: an engine whose runtime module imports its **whole processor registry**,
  so every new tool on that engine makes every existing page on it heavier. `wellness` hit its
  budget that way at eleven calculators and now loads exactly one, keyed by the widget's
  `data-wellness` attribute (`src/lib/engines/wellness/lazy.ts`; `check-budget.ts` follows that
  attribute the same way it follows `data-simulation-id`). Prefer this the moment an engine passes
  a handful of processors.
- **Sheets/CSS over budget** → a route is globbing components outside its own segment, hoisting
  other tools' stylesheets onto the page. Never reintroduce a cross-segment widget glob.
- **HTML over budget** → the page is emitting far more markup than its siblings (runaway FAQ,
  duplicated JSON-LD, a widget rendering per-item DOM it could render on demand).

**Fix the cause; do not raise the budget.** Raising a number in `BUDGETS` is a decision to spend
every visitor's bandwidth and needs a reason in the PR. `EXCEPTIONS` is for pages whose weight is
inherent to what they are (only `/architecture/`, which renders the Mermaid map) and still caps
them. Rationale and the full before/after: `docs/analysis/2026-07-31-critical-path-performance.md`.

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
>
> **Standing rule — AI vs algorithm.** For every tool suggestion, state whether a deterministic
> algorithm or AI serves the need better. The RIE scores this per record (`algorithmicFit`, 0–100,
> in `research/datasets/*.json`; weight in `src/lib/research/config.ts`): high fit (exact math,
> conversions, simulations) is ToyTools' home turf; AI-shaped needs (generation, judgment,
> summarization) are an architecture mismatch for a client-side static site AND a query class being
> absorbed by chatbots, so they score down and the roadmap flags them with a CAUTION reason.

## Agent roster (`.claude/agents/`)

Skills are in-conversation playbooks (the main session does the work); agents are fresh-context
workers for fan-out or scheduled runs. Four project agents, each with an objective exit condition:

- **`research-intelligence`** — runs the RIE, returns the evidence-backed "what to build next";
  hands implementation back to the caller (never builds).
- **`tool-builder`** — builds ONE named tool end-to-end (scaffold → engine + tests → widget →
  content → build/e2e/seo:gate green, single ready branch). For parallel production spawn one per
  tool in worktree isolation; registration is derived, so parallel builds don't conflict. Stops
  and reports if the tool needs a new engine (caller-level decision).
- **`content-writer`** — writes/upgrades ONE tool's guide/FAQ/knowledge, driving seo:status →
  seo:gate to exit 0. Content only; one agent per slug for batch work.
- **`site-auditor`** — read-only sweep (build, health, duplication, Quality Guardian, indexing
  coverage, seo:status table) returning one triaged report. Never fixes; scheduled/weekly use.

The main session stays the orchestrator: engine selection for novel tool types and RIE dataset
authorship are the two judgment calls never delegated to agents.

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

## Feedback & Product Discovery

`/feedback/` collects **user problems** (not feature requests). Fully static with **no third party
of any kind**: the page composes a structured message and hands it to the visitor's own mail client
via a `mailto:` URL. No backend, no relay, no database, no stored state, no setup. There are
deliberately **no** thumbs, ratings, votes, counters, or analytics events in this system.
Full docs: `docs/feedback.md`.

- **Do not introduce a form endpoint** (Web3Forms, Formspree, Netlify Forms, a serverless
  function). A static page cannot send email, so any "fix" for that is a third-party server, which
  is explicitly out of scope for this project. `mailto:` is the deliberate choice, not a stopgap.
- The contract lives in **one file**: `src/lib/feedback/templates.ts` owns both the form's questions
  and the email they produce, and `templates.test.ts` pins the rendered body character for
  character. Change a heading and the test fails — which is what stops the inbox filters silently
  breaking.
- **The composed message is always shown on the page** with a Copy button and the address in
  selectable text. A `mailto:` does nothing at all, silently, on a machine with no mail client, so
  the visible copy is the only thing that keeps that from being a dead end. Never remove it.
- `deliver.ts` trims the **mailto** body to `MAX_MAILTO_LENGTH` (mail clients ignore over-long
  URLs) while `composed.body` stays complete for copying. Trimming walks whole **code points**:
  slicing mid-emoji leaves a lone surrogate and `encodeURIComponent` throws `URIError`.
- `src/pages/feedback.astro` is a standalone content page, **not** a registry tool. It reaches the
  sitemap and IndexNow through `STANDALONE_PAGES` in `src/lib/content/manifest.ts` (the `'page'`
  content type) — that is the only edit needed to add another such page.
- `FeedbackLink` is auto-included by `ToolLayout`, so every tool inherits it with **zero per-tool
  edits**. No tool file ever mentions feedback.
- The bug-report "include what I typed" opt-in is gated at **build time** by
  `allowsInputCapture(engine, pattern)` — on `jwt`/`hashing`/`encoding`/`generate-credential` tools
  the capturing script is not even emitted, because that input may be a live secret.

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
  `src/data/category-sections.ts`. If it has a browser runtime, add an attach module at
  `src/lib/runtime/engines/<id>.ts` and register it in **both** maps in `src/lib/runtime/loaders.ts`
  (`ENGINE_LOADERS` = the lazy `import()`; `ENGINE_GLOBALS` = the `ToyTools.*` names it attaches).
  Engine chunks are loaded **per page** from the tool's declared engine, so a global that is not
  declared simply will not exist at runtime — `validate-registry` fails the build if a widget calls
  one its engine does not provide.
- **Add a tool** → author `src/tools/<segment>/<slug>/{config.ts,Widget.astro}` and run
  `npm run registries:generate` (scaffold runs it for you) — registration is **derived** from the
  directory, never hand-edited (`*.generated.ts` barrels; `validate-architecture` fails the build
  when they are stale). A `processorId` must resolve in its engine registry **and** be unique
  (collisions fail `validate-registry`).
- **Add a category** → besides `src/data/categories.ts`, run `npm run registries:generate`: tool
  routes are **one generated file per segment** (`src/pages/tool/<segment>/[slug].astro`), so a new
  segment needs its route emitted. There is no `[category]/[slug].astro` catch-all — a single route
  globbing `tools/*/*/Widget.astro` put every widget in its module graph, and Astro then linked
  every bespoke widget's CSS on every tool page (11 render-blocking sheets, half of it unused).
  Never reintroduce a cross-segment widget glob. See `ARCHITECTURE.md` → "Registration Pattern".
- **Add a guide** → `guide:` in config + `Guide.astro` in the tool dir + regenerate. The guide
  route discovers components via `import.meta.glob`, so there is no route map to edit; a `guide:`
  declared without a `Guide.astro` on disk fails `validate-architecture`.
- **Add a FAQ / knowledge file** → author `faq.ts` / `knowledge.ts` in the tool dir + regenerate.
  File presence **is** registration; orphans are impossible while the generated barrels are fresh.
- **Add a simulation** (physics playground) → the exception to the tool checklist: author
  `src/lib/simulation/simulations/<id>.{ts,draw.ts,manifest.ts}` (+ `<id>.test.ts`), register the
  model in its domain plugin (`src/lib/simulation/plugins/<domain>/index.ts` — `physics/` and
  `math/` exist) and the manifest in `src/lib/simulation/manifests.ts`, and add the slug to the
  domain's e2e spec (`tests/e2e/physics.spec.ts` / `tests/e2e/math.spec.ts`). Every site
  surface (config/knowledge/faq/guide/SEO) is **derived** from the manifest at build time and spread
  into the registries, so there are **no per-sim `config.ts`/`knowledge.ts`/`faq.ts`/`Guide.astro`/
  `Widget.astro` files** and **no registry edits**. Gate content with `npm run seo:gate:sim -- <slug>`.
  See `ARCHITECTURE.md` → "Simulation Platform".
- **Rename a category** (slug or segment) → `src/data/categories.ts`, every tool's
  `categorySlug`, and add a noindex redirect stub in `src/data/tool-redirects.ts` for the old URL.
  Never delete the old URL silently.
- **Rename a tool slug** → the new slug wherever it is authored (`config.ts`, or a simulation
  manifest's `metadata.slug`), **plus** a `src/data/tool-redirects.ts` entry mapping the retired
  `<segment>/<old-slug>` path to the new tool. `src/pages/tool/[...oldPath].astro` turns every
  entry into a noindex meta-refresh stub, which is the only thing standing between a previously
  indexed URL and the noindex 404 page. Then sweep the slug through `src/data/search-aliases.ts`,
  the e2e specs, `research/datasets/*.json`, any `relatedTools`, and rerun `icons:generate`
  (deleting the old PNGs) and `map:generate`.
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

writes `src/tools/<segment>/<slug>/` (config + widget + optional faq/guide/knowledge stubs), then
regenerates the **derived registration barrels** (`npm run registries:generate`) and the code map —
registration follows from the directory contract; no registry file is ever hand-edited. Engine-backed tools get a real 3-line widget wrapping the
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
├── registry.ts         # Single source of truth — merges sims + registry.generated.ts
├── registry.generated.ts    # GENERATED barrel (npm run registries:generate) — never hand-edit
├── faq-registry.ts     # faqsByToolSlug — merges sims + faq-registry.generated.ts
├── faq-registry.generated.ts # GENERATED barrel — never hand-edit
├── guide-registry.ts   # registeredGuideSlugs — derived from Guide.astro presence on disk
├── guide-registry.generated.ts # GENERATED barrel — never hand-edit
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
- **The global arrives in two halves.** The *core* (`toast`, `copy`, `storage`, `state`, `prefs`,
  `profile`, `history`, `focus`, `mobileTooltip`, `onReady`) is an inline script and exists during
  parse — call it directly. The *engine* surfaces (`analyze`, `process`, `runDateTime`, `runHash`,
  `runMath`, `experience`, …) load lazily, one chunk per page, so they do **not** exist yet when a
  widget's inline script first runs. Anything that computes on load must be wrapped in
  `ToyTools.onReady(function () { … })`. This has always been the contract; the wait is just a
  round-trip longer now. See `src/lib/runtime/index.ts`.

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
- Standalone pages: `/about/`, `/privacy/`, `/changelog/`, `/feedback/` (indexable, in the sitemap via
  `STANDALONE_PAGES`), plus `/settings/`, `/offline/`, `/search/`, `/architecture/` (noindex, never in a
  sitemap). `generatePageTitle` (`src/lib/titles.ts`) covers: `home`/`tool`/`guide`/`faq`/`category`/
  `search`/`architecture`/`feedback`/`privacy`/`about`/`changelog`/`settings`/`offline`/`notFound`.

> The 28 `/{lang}/` landing stubs were **deleted** on 2026-08-03. They carried `noindex` and were linked
> from nowhere on the site, so nothing could rank them and nobody could reach them. Do not reintroduce
> them as stubs: real localization means indexable pages with `hreflang`, which is a different project.
> See `docs/analysis/2026-08-03-platform-ux-gaps.md`.

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

## Mobile-first & native feel (every tool)

ToyTools is **phone-first**: most visits are mobile, and every tool is **installable to the home
screen** (per-tool web manifest + maskable icon + `InstallButton`, offline via `public/sw.js`; see
"Install & offline (PWA)" below). A tool is not done until it feels like a **native app on a phone** —
not a shrunk desktop page. Design for a ~390px viewport first, then enhance up; never the reverse.
This is a hard requirement, enforced on the **Pixel 5** e2e project (a PR gate). Rationale and the
design-detail version live in `ARCHITECTURE.md` → "Design Language" → "Mobile & native feel"; build
from the mobile primitives there rather than bespoke responsive CSS.

**Non-negotiable rules — hold for every tool, existing and new:**
- **One column on phones.** Use `ToolSplit` (stacks to one column below 1024px) or a single column;
  never a fixed multi-column grid. The page body must **never scroll horizontally** — wide content
  (tables, code, JSON trees, diagrams) scrolls inside its own `overflow-x: auto` container.
- **Answer-first order.** On mobile the result comes first: output / `HeroMetric` → input →
  `ToolActions`. Keep the primary actions (copy/clear/paste) within thumb reach; don't strand them.
- **Touch targets ≥ `var(--touch-target)` (48px)** with real spacing — no dense tap clusters. Every
  control needs a visible **`:active`/pressed** state (phones have no hover), and any hover-only
  affordance needs a tap equivalent (`ToyTools.mobileTooltip`). Never gate a control behind `:hover`.
- **No layout shift while interacting.** Fixed-height panels (`IoPanel`) with internal scroll;
  **auto-growing textareas are forbidden**; `font-variant-numeric: tabular-nums` on live numerals so
  digits don't reflow.
- **Right keyboard, no zoom.** Set `inputmode`/`type` so the mobile keyboard matches the field
  (`inputmode="decimal"` for numbers, `type="email"|"url"`, …), add `enterkeyhint`/`autocomplete`
  where useful, and `autocapitalize="off" autocorrect="off" spellcheck="false"` on code/token/hash
  inputs. Inputs render ≥16px (via the type scale) so iOS never auto-zooms on focus.
- **Respect safe areas.** Any fixed / overlay / full-bleed element (install sheet, immersive
  fullscreen, sticky bars) pads with `env(safe-area-inset-*)` so nothing hides behind a notch or the
  home indicator.
- **Works installed & offline.** Test changes in **standalone mode** (installed PWA), not just a
  browser tab: navigation stays usable and the tool still works with no network (it's a static
  client-side app). Motion stays subtle — only `color`/`background-color`/`border-color` at
  150/200ms, and honor `prefers-reduced-motion`.

**Canonical breakpoints — do not invent new ones:** **1024px** (two-column → single), **640px**
(mobile chrome: BackButton, install button), **480px** (small-phone tightening). Every size and color
comes from `src/styles/tokens.css` — never hardcode one.

**Verify on mobile:** `npm run test:e2e` runs every tool on Desktop **and** Pixel 5; a UI change is
not shippable until Pixel 5 is green. For anything visual, also sanity-check a real phone / the
installed PWA.

### Install & offline (PWA)

Every tool installs to the home screen as its own app, all derived from the registry:
- **Per-tool manifest** — `src/pages/manifest/[slug].webmanifest.ts` (per-tool `scope`/`start_url`,
  seeded `theme_color`/`background_color`, PNG `any`+`maskable` icons + scalable SVG).
- **Icons** — composed from `src/lib/icons/` (category-color seeded gradient + a family/slug glyph;
  see `src/lib/icons/tool-icon.ts`). The scalable SVG is a build-time endpoint
  (`src/pages/icons/tool/[slug].svg.ts`); the raster **PNGs (192 + 512) are committed static assets**
  under `public/icons/tool/`, generated by `npm run icons:generate` (Chromium renders the glyphs,
  `sharp` compresses). `validate-architecture` **fails the build** if any tool is missing its PNGs —
  rerun `icons:generate` after adding a tool or changing a glyph/color.
- **Install button** — `src/tools/_shared/InstallButton.astro` (auto-included by `ToolLayout`,
  mobile-only): native `beforeinstallprompt` one-tap install on Android, a platform-aware manual sheet
  (Chrome ⋮ menu vs iOS Safari share) as fallback. **Control visibility with CSS classes, never the
  `hidden` attribute** — a `display` rule silently overrides `[hidden]`.
- **Service worker** — `public/sw.js`: `skipWaiting()` + `clients.claim()` so it controls the page on
  the visit (required for installability), network-first with `no-store` navigations (deploys show
  immediately) and a Cache-API offline fallback. Registered for real users only (gated like analytics;
  skipped under dev/E2E/automation/localhost) — bump `CACHE` when its behavior changes.

The head tags (`<link rel="manifest">`, `apple-touch-icon`, `theme-color`, `apple-mobile-web-app-*`)
are emitted by `BaseLayout` via `ToolLayout`'s `pwa` prop — never hand-add them per tool.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which builds with `ASTRO_SITE=https://toytoolsapp.com` (and **no** `ASTRO_BASE_PATH`, so pages are served from the apex root) and deploys `dist/` to GitHub Pages at the custom domain `https://toytoolsapp.com/` (custom domain pinned by `public/CNAME`).
