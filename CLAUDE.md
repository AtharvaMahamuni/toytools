# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

**This file holds only what is true on every task: the done-condition, the rules that prevent
irreversible mistakes, and the map of where everything else lives.** Depth belongs in a skill or a
doc, loaded when the task calls for it. If you are about to add more than a few lines here, that is
the signal it belongs somewhere below instead.

| you are... | read |
|---|---|
| building or changing UI | **`ui-design-system` skill** |
| adding a tool or an engine | **`add-tool` skill** |
| deciding what to build next | **`next-tool` skill** |
| writing a guide, FAQ or knowledge file | **`seo-content` skill** |
| giving a tool its thoughtful touch | **`tool-craft` skill** |
| judging whether a tool is actually good to use | **`tool-ux-review` skill** |
| facing a failing gate, or moving a threshold | **`gates` skill** |
| looking for system-level structure | `ARCHITECTURE.md` |
| asking "where does X live?" | `docs/code-map.json` |

## The done-condition

**Any change to shipped code is finished when `npm run verify` exits 0, and not before.**

```sh
npm run verify        # the done-condition. ~3 min.
npm run verify:fast   # everything except e2e. Inner loop only, NOT a done-condition.
```

It runs, in order: unit tests, coverage thresholds, the build with `KNOWLEDGE_REQUIRED=true`,
platform health, query coverage, tool craft, the content graph, Quality Guardian, `seo:gate` on
every tool directory changed against `origin/main`, and e2e on chromium **and** pixel5.

Steps 4 through 8 read `dist/`, so **a failed build skips five gates at once**. Fix the build first;
a green run after a red build is not evidence of anything.

`build` + `test` + `test:e2e` is **not** the gate and never was: it skips the coverage thresholds,
the health check and Quality Guardian entirely. A **Stop hook**
(`.claude/hooks/verify-on-stop.sh`) runs `verify` whenever a turn ends having changed shipped code,
and blocks on failure. Touch `.claude/.skip-verify` to opt a session out deliberately.

**Local and CI now run the same projects.** The PR workflow was chromium-only until 2026-08-17,
which meant `tests/e2e/fold.spec.ts` (it skips off pixel5) never ran on a PR and a phone regression
could merge green. CI runs both projects as parallel matrix legs, so the fold ratchet is a real PR
gate.

**If a step in the workflow changes, change `scripts/verify.sh` in the same commit, and the reverse.**
A check that only one of them runs is a check that catches nothing. There is no sanctioned
exception; any divergence is drift, and the fix is to re-sync, not to document it.

**Never weaken a check to get past it.** No raising a budget, lowering a ratchet floor, deleting an
assertion, or adding a validator exemption without saying so explicitly in the PR and giving the
reason. Details, diagnosis playbooks and the current thresholds: **`gates` skill**.

## The five hard gates

Four are **ratchets**: the number records what the catalog achieves today and moves one way only, in
the same commit as the change that earns it. The fifth is a fixed bar.

| gate | command | threshold shape | run by |
|---|---|---|---|
| performance budget | `check:budget` | ratchet — budgets only **fall** | `npm run build` |
| query coverage (retrieval, targeting, headings) | `check:queries` | ratchet — floors only **rise** | `verify`, PR CI |
| tool craft (coverage, boxes, raw hex) | `check:craft` | ratchet — coverage **rises**, the other two **fall** | `verify`, PR CI |
| the fold ratchet (chrome %, first control) | `test:e2e` | ratchet — limits only **fall** | `verify`, PR CI (pixel5 leg), weekly |
| content quality | `seo:gate -- <slug>` | **fixed** minimums, in `seo-engine/config/content-intelligence-rules.json` (`overall` 75; `writingQuality` 70, `usefulness` 60, `seoCompleteness` 50, `toyToolsStyleScore` 70, `queryTargeting` 50; `maxEmDashes` 0) | `verify`, PR CI on changed tools |

Two things worth knowing before you lean on any of them:

- **Query coverage measures us against ourselves.** Its corpus is assembled entirely from phrases we
  authored (`research/datasets/*.json`, `search-aliases.ts`, `knowledge.ts` keywords). Green means
  internally consistent, not competitive. Same for `seo:gate`, which scores prose against our own
  rules. See `docs/analysis/2026-08-16-seo-ranking-gaps.md`.
- **Craft coverage is a floor under a backlog, not proof of craft.** 5 of 107 tools declare one
  (2026-08-16). The gate tolerates about one new craftless tool before it trips.

## Standing rules for choosing work

**Never pick the next tool by intuition.** Whenever asked what to build next, for a new-tool idea, or
"let's build the next tool": run the RIE (`npm run research:next`) or invoke the **`next-tool`
skill**, present the top scored opportunity *with its reasoning*, then implement via **`add-tool`**.
To change a recommendation, change the **evidence** (`research/datasets/*.json`) and re-run. Never
hand-edit a report.

Every recommendation states three things, and the `next-tool` skill covers how:

- **AI vs algorithm.** Deterministic math, conversion and simulation is home turf. Generation,
  judgment and summarization is an architecture mismatch for a static client-side site *and* a query
  class chatbots are absorbing, so the roadmap flags it CAUTION.
- **Its craft hypothesis.** Where that tool's users fail *mid-task*, and therefore what its one
  thoughtful touch could be. `hasCandidate: false` is a legitimate answer; inventing a touch to fill
  the slot is not. This is a standing rule because craft is a gate.
- **Which report it came from.** `research:next` ranks existing demand; `research:latent` finds needs
  with no query behind them. **Never merge the two rankings** — `latentScore` and `finalScore`
  measure different things and a blended number means nothing. Never present an `unanchored`
  proposal as a latent-demand finding.

The RIE is on-demand only, **never** in `npm run build`. Full docs: `docs/research-intelligence.md`.

## Versioning & changelog

**Every PR that changes what the site ships bumps the version and adds a CHANGELOG entry, in the
same PR.** The version lives in `src/lib/version.ts` (`VERSION_CONFIG` → `APP_VERSION`) and renders
in the footer and on `/changelog/`, so a shipped change with a stale version is a change nobody can
tell landed.

| what the PR does | bump |
|---|---|
| adds a tool, or modifies one (widget, engine processor, content, group membership) | **minor** (`X.Y` → `X.Y+1`, status stays `alpha`) |
| adds a **category** (`src/data/categories.ts`) or an **engine** (`src/data/engines.ts`) | **major** (`X` → `X+1.0`, status resets to `alpha`) |
| everything else that ships: bug fix, platform/layout/token change, build or SEO tooling | **patch** |
| docs, tests, CI config, or research datasets only | none |

```sh
npm run version:bump major|minor|patch "<summary>"
npm run version:show
```

Resolving the ambiguous cases, so two PRs never answer them differently:

- **One bump per PR**, not per tool or per commit. Five tools in one batch is a single minor bump.
  Bump once, at the end, when the change is otherwise complete.
- **The highest applicable bump wins.** A PR adding a new engine *and* the first tool on it is
  **major** only. A new pattern rides along with whatever else the PR does; it is neither a category
  nor an engine and never forces a major on its own.
- **Removing a tool** is a modification: minor. Removing a category or engine is major.
- **A tool slug or category rename is a modification of that tool**, so minor, even though the
  redirect stub is the visible part of the diff.

`version:bump` rewrites `src/lib/version.ts` only. The description is inlined into a single-quoted TS
string, so keep apostrophes out of it or the next build fails to parse the file.
**It does not touch `CHANGELOG.md` — that entry is written by hand**, and the change is not done
without it. Add a section at the top matching the version the bump printed, in the Keep a Changelog
format the file already uses (`### Added` / `### Changed` / `### Fixed`, keeping only the
subsections with content). Write entries about what a visitor or the next maintainer would notice
(which URLs appeared, what broke and why), not a file-by-file diff summary. `formatVersion` omits
`.0` patches, so `alpha-v7.1` and `alpha-v7.1.2` are both well-formed; the heading must match exactly
what the bump reported.

## Breaking-changes playbook (what to touch together)

Most edits are local. These few ripple, and every listed touchpoint must move in the same change or
a validator fails — or, worse, drifts silently.

- **Add an engine or pattern** → declare it in `src/data/engines.ts` (`ENGINE_IDS`/`PATTERN_IDS`
  *and* `engineDefs`; the unions and the defs are cross-checked). `KNOWN_ENGINES`/`KNOWN_PATTERNS`
  derive from here — never edit the validator. Add a `pattern → section` row in
  `src/data/category-sections.ts`. If it has a browser runtime, add an attach module at
  `src/lib/runtime/engines/<id>.ts` and register it in **both** maps in `src/lib/runtime/loaders.ts`
  (`ENGINE_LOADERS` = the lazy `import()`; `ENGINE_GLOBALS` = the `ToyTools.*` names it attaches).
  Engine chunks load **per page** from the tool's declared engine, so an undeclared global simply
  will not exist at runtime; `validate-registry` fails the build if a widget calls one its engine
  does not provide.
- **Add a tool** → author `src/tools/<segment>/<slug>/{config.ts,Widget.astro}` and run
  `npm run registries:generate` (scaffold does it for you). Registration is **derived** from the
  directory, never hand-edited (`*.generated.ts` barrels; `validate-architecture` fails the build
  when they are stale). A `processorId` must resolve in its engine registry **and** be unique.
- **Add a category** → besides `src/data/categories.ts`, run `npm run registries:generate`: tool
  routes are **one generated file per segment** (`src/pages/tool/<segment>/[slug].astro`), so a new
  segment needs its route emitted. There is no catch-all route: a single route globbing
  `tools/*/*/Widget.astro` put every widget in its module graph and linked every bespoke widget's CSS
  on every tool page (11 render-blocking sheets, half unused). **Never reintroduce a cross-segment
  widget glob.**
- **Add a guide** → `guide:` in config + `Guide.astro` in the tool dir + regenerate. The guide route
  discovers components via `import.meta.glob`, so there is no route map to edit; a `guide:` declared
  without a `Guide.astro` on disk fails `validate-architecture`.
- **Add a FAQ / knowledge file** → author `faq.ts` / `knowledge.ts` in the tool dir + regenerate.
  File presence **is** registration; orphans are impossible while the barrels are fresh.
- **Add a simulation** (physics playground) → the exception to the tool checklist: author
  `src/lib/simulation/simulations/<id>.{ts,draw.ts,manifest.ts}` (+ `<id>.test.ts`), register the
  model in its domain plugin (`src/lib/simulation/plugins/<domain>/index.ts`) and the manifest in
  `src/lib/simulation/manifests.ts`, and add the slug to the domain's e2e spec. Every site surface
  (config/knowledge/faq/guide/SEO) is **derived** from the manifest at build time, so there are **no
  per-sim `config.ts`/`knowledge.ts`/`faq.ts`/`Guide.astro`/`Widget.astro` files** and **no registry
  edits**. Gate content with `npm run seo:gate:sim -- <slug>`.
- **Rename a category** (slug or segment) → `src/data/categories.ts`, every tool's `categorySlug`,
  and a noindex redirect stub in `src/data/tool-redirects.ts` for the old URL. Never delete the old
  URL silently.
- **Rename a tool slug** → the new slug wherever it is authored (`config.ts`, or a simulation
  manifest's `metadata.slug`), **plus** a `src/data/tool-redirects.ts` entry mapping the retired
  `<segment>/<old-slug>` path to the new tool. `src/pages/tool/[...oldPath].astro` turns every entry
  into a noindex meta-refresh stub, the only thing standing between a previously indexed URL and the
  noindex 404 page. Then sweep the slug through `src/data/search-aliases.ts`, the e2e specs,
  `research/datasets/*.json`, any `relatedTools`, and rerun `icons:generate` (deleting the old PNGs)
  and `map:generate`.
- **Add a tool group** → declare it in `src/data/tool-groups.ts` **and** set `toolGroup: '<id>'` on
  every member. `validate-registry` enforces bidirectional membership and the same engine/pattern
  across members. Members keep their own URL, metadata, guide, FAQ and sitemap entry; never merge
  URLs.
- **Change a widget's UI** → verify in a real browser with `npm run test:e2e` (chromium + pixel5).
  Build and unit tests do not catch widget JS errors.
- **Ship any of the above** → bump `src/lib/version.ts` and add the `CHANGELOG.md` entry in the same
  PR.

Two deploy-facing hard rules:

- **IndexNow:** new URLs are submitted automatically post-deploy. Never run `npm run indexnow`
  against a host whose `public/<key>.txt` is not already live (it caches a `403` ownership failure).
  See `docs/indexnow.md`.
- **Browser titles** come from `generatePageTitle` (`src/lib/titles.ts`) via the layouts. **Never set
  a title inside a tool file.** A new page *type* adds a case there.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # static output → dist/
npm run preview  # serve dist/ locally

ASTRO_SITE=https://toytoolsapp.com npm run build   # production build
```

> Do **not** set `ASTRO_BASE_PATH=/toytools`. The site is served from the apex of `toytoolsapp.com`
> (see `public/CNAME`), so a base path would push every page under `/toytools/...` while the real
> indexable URLs live at the root. Bare URLs would then fall through to GitHub Pages' `404.html`,
> which carries `noindex,nofollow` — exactly the "noindex detected in 'robots' meta tag" that Search
> Console flags.

`npm run build` runs the registry/knowledge/**architecture** validators, then Astro rendering and
strict TypeScript together, then the **performance budget**. There is no separate lint script. It is
one step inside `npm run verify`, not the verification step on its own.

```sh
npm run scaffold:tool -- --slug <slug> --name "<Name>" --category <cat> --engine <engine> \
  --pattern <pattern> --family <family> [--processor-id <id>] [--faq] [--guide] [--dry-run]
npm run scaffold:tool -- --remove --slug <slug>   # delete a tool + strip every registry entry

npm run test            # vitest — engine-level unit tests
npm run test:e2e        # Playwright — chromium + pixel5, builds and serves dist
npm run test:e2e:ui     # interactive time-travel dashboard
npm run test:e2e:report # the saved HTML report, with traces

npm run health          # post-build platform integrity superset
npm run validate:architecture  # orphan files, dead registry entries, guide-route drift, empty
                               # categories, unmapped patterns. The reverse of validate-registry:
                               # that one checks declared references resolve, this one catches files
                               # nothing wires up. Runs inside npm run build.
npm run check:duplication      # near-duplicate authored content. WARN-only; -- --strict to fail.
                               # Sibling tools trip it naturally; run before shipping a content batch.
npm run map:generate           # regenerate docs/code-map.json
npm run registries:generate    # regenerate the derived registration barrels
npm run icons:generate         # regenerate the committed per-tool PNGs

npm run intel           # Content Intelligence → dist/content-intelligence/ (on demand, not in build)
npm run research:next   # the RIE headline recommendation (see the standing rules above)
npm run seo:status -- <slug>   # ALWAYS start content work here: state + the exact next command
npm run seo:gate -- <slug>     # the content done-condition
npm run seo:doctor             # run when any seo:* command misbehaves
npm run check:indexing         # which URLs Google has actually indexed (needs GSC creds)
npm run quality:pr             # Quality Guardian, per-PR pass
```

`npm run intel` derives its expansion opportunities from the declarative
`src/lib/content-intelligence/taxonomy.ts` (`engine → family → expected[]`). Add expected tools there
as **data**; never hardcode topics in analyzer logic.

## Architecture

**Data-driven static site.** All pages are pre-rendered at build time. No server, no database, no
client-side framework. System-level patterns, widget conventions and URL structure live in
`ARCHITECTURE.md`.

**`docs/code-map.json`** (committed, generated, never hand-edited) answers "where does X live?" in
one read: every tool slug → directory, URL, engine/pattern/family, `processorId`, tool group, files
on disk, and guide/FAQ/knowledge registration, plus the engine and tool-group manifests. Read it
instead of grepping the registries. It cannot rot: `validate-architecture` fails on drift.

Tool directory anatomy:

```
src/tools/<segment>/<slug>/
├── config.ts        # ToolConfig — slug, name, description, tagline, categorySlug, tags,
│                    #              craft?, guide?, toolGroup?
├── Widget.astro     # required — a 3-line engine-widget wrapper, or self-contained bespoke
├── faq.ts           # optional — exports: const items: FAQItem[]
├── knowledge.ts     # optional — exports: const knowledge: Knowledge (overlay fields only)
└── Guide.astro      # optional — wraps GuideLayout
```

`knowledge.ts` files feed `buildGraph()` (`src/lib/knowledge/`), the `EntityMatcher`, topic clusters
and `dist/knowledge-graph.json`. Related tools, guides and FAQs are **derived** from the graph
(engine → pattern → family → category); you author only the overlay fields. Coverage gaps surface in
`npm run intel`.

The data layer (`src/data/`) holds `types.ts`, `categories.ts`, `engines.ts` (the engine/pattern
single source of truth), `registry.ts`, `tool-groups.ts`, `category-sections.ts`, `metadata.ts`, the
`*.generated.ts` barrels, and the two redirect tables (`faq-redirects.ts`, `tool-redirects.ts` —
legacy stubs; **never add new entries to either**). Engine logic lives under `src/lib/engines/`.

The deployed **`/architecture/`** page renders an interactive Mermaid map derived from the registries
at build time, and self-updates as tools and engines are added.

## Widget JavaScript rules

All tool scripts use `<script is:inline>` inside `Widget.astro`:

- No TypeScript, no imports, no `import.meta.env`.
- Access shared helpers through the `ToyTools.*` global.
- localStorage key convention `toytools.<slug>.<field>`, 50 KB cap.
- **The global arrives in two halves.** The *core* (`toast`, `copy`, `storage`, `state`, `prefs`,
  `profile`, `history`, `focus`, `mobileTooltip`, `onReady`) is an inline script and exists during
  parse, so call it directly. The *engine* surfaces (`analyze`, `process`, `runDateTime`, `runHash`,
  `runMath`, `experience`, …) load lazily, one chunk per page, so they do **not** exist when a
  widget's inline script first runs. **Anything that computes on load must be wrapped in
  `ToyTools.onReady(function () { … })`.**
- Always pair the `hidden` attribute with `[hidden] { display: none }`. Any `display` rule silently
  overrides it; this has shipped as a visible bug twice.
- **An element whose box a script computes declares that box in CSS**, from a build-time value
  (`aspect-ratio` + a `max-width` custom property). A script that sets the size after load paints
  the wrong box first: every simulator flashed a full-width 150px canvas until `boot.ts` ran.
- **Remove a border and you inherit its job.** Space is then the only thing marking a group, so
  between-group space has to beat within-group space (~2-4x). See the `ui-design-system` skill.

Widget composition, tokens, components and the design language: **`ui-design-system` skill**.

## Path/URL handling — always use `withBase`

Every internal `href` and form `action` goes through `src/lib/paths.ts:withBase()`. Bypassing it
breaks deployed links.

```astro
<a href={withBase(`/category/${category.slug}/`)}>   {/* correct */}
<a href={`/category/${category.slug}/`}>             {/* wrong — breaks on GitHub Pages */}
```

`withBase` is a build-time server function; **do not call it inside `<script is:inline>`**.

URL structure (singular, not plural):

- `/tool/{segment}/{slug}/`, `/category/{slug}/`, `/guide/{category}/{slug}/`
- `/faq/{category}/{slug}/` — redirect stubs only
- Indexable standalone pages: `/about/`, `/privacy/`, `/changelog/`, `/feedback/` (they reach the
  sitemap through `STANDALONE_PAGES` in `src/lib/content/manifest.ts`, which is the only edit needed
  to add another)
- Noindex, never in a sitemap: `/settings/`, `/offline/`, `/search/`, `/architecture/`

The sitemap is registry-derived; new tools and guides appear automatically. **Never hand-edit a
sitemap.**

> The 28 `/{lang}/` landing stubs were **deleted** on 2026-08-03: they carried `noindex` and were
> linked from nowhere, so nothing could rank them and nobody could reach them. Do not reintroduce
> them. Real localization means indexable pages with `hreflang`, which is a different project.

## Mobile-first & native feel (every tool)

ToyTools is **phone-first**: most visits are mobile, and every tool is installable to the home
screen. A tool is not done until it feels like a **native app on a phone**, not a shrunk desktop
page. Design for a ~390px viewport first, then enhance up. Never the reverse.

**Non-negotiable, for every tool, existing and new:**

- **One column on phones.** Use `ToolSplit` (stacks below 1024px) or a single column; never a fixed
  multi-column grid. The page body must **never scroll horizontally** — wide content (tables, code,
  JSON trees, diagrams) scrolls inside its own `overflow-x: auto` container.
- **Answer-first order.** On mobile: output / `HeroMetric` → input → `ToolActions`. Keep the primary
  actions within thumb reach.
- **Touch targets ≥ `var(--touch-target)` (48px)** with real spacing. Every control needs a visible
  `:active` state (phones have no hover), and any hover-only affordance needs a tap equivalent
  (`ToyTools.mobileTooltip`). Never gate a control behind `:hover`.
- **No layout shift while interacting.** Fixed-height panels (`IoPanel`) with internal scroll;
  **auto-growing textareas are forbidden**; `tabular-nums` on live numerals.
- **Right keyboard, no zoom.** Set `inputmode`/`type` to match the field, add
  `enterkeyhint`/`autocomplete` where useful, and `autocapitalize="off" autocorrect="off"
  spellcheck="false"` on code/token/hash inputs. Inputs render ≥16px so iOS never auto-zooms.
- **Respect safe areas.** Any fixed, overlay or full-bleed element pads with `env(safe-area-inset-*)`.
- **Works installed and offline.** Test in standalone mode, not just a browser tab. Honor
  `prefers-reduced-motion`.

**Canonical breakpoints — do not invent new ones: 1024px, 640px, 480px.** Every size and colour comes
from `src/styles/tokens.css`; never hardcode one.

Verified by `npm run test:e2e` on pixel5, which runs locally and as its own PR CI leg. For anything
visual, also check a real phone or the installed PWA.

## Platform notes

- **Analytics.** GA4 (`G-WHD7CL44MX`) is included on every page via `BaseLayout`. New pages inherit
  it automatically. **Never add a second `gtag` snippet.**
- **Feedback.** `/feedback/` collects user problems via a `mailto:` URL with **no third party of any
  kind**. **Do not introduce a form endpoint** (Web3Forms, Formspree, Netlify Forms, a serverless
  function): a static page cannot send email, and any "fix" for that is a third-party server, which
  is out of scope by decision, not by oversight. The contract lives in one file
  (`src/lib/feedback/templates.ts`) and `templates.test.ts` pins the rendered body character for
  character. Full docs: `docs/feedback.md`.
- **Quality Guardian** (`quality-guardian/`) crawls the built site and runs validators and
  autofixers. It is a tooling sidecar, not part of the site bundle, and not part of `npm run build`.
  Its **exemptions must be structural, not a list of paths**: the canonical and sitemap validators
  skip redirect stubs by detecting `<meta http-equiv="refresh">`, because the previous hardcoded
  prefix list went stale the first time a tool slug was renamed. If you find yourself adding a path
  to a validator, derive the rule instead.
- **Indexing coverage.** `npm run check:indexing` reports what Google has actually indexed via the
  GSC URL Inspection API. It needs `GSC_SITE_URL` + `GSC_SA_KEY_JSON`; **without them the weekly
  workflow silently skips its only real step**, which is what happened for its first seven runs.
  Setup: `docs/indexing.md`.
- **Deployment.** Push to `main` triggers `.github/workflows/deploy.yml`, which builds with
  `ASTRO_SITE=https://toytoolsapp.com` (and **no** `ASTRO_BASE_PATH`) and deploys `dist/` to GitHub
  Pages at `https://toytoolsapp.com/`.
- **Git workflow.** Always rebase against `origin/main`: `git rebase origin/main`.
- **SEO writing hard rule: no em-dashes anywhere in authored site content.** The gate fails on any
  occurrence.

## Agents (`.claude/agents/`)

Skills are in-conversation playbooks (the main session does the work); agents are fresh-context
workers for fan-out or scheduled runs. Each has an objective exit condition:

- **`research-intelligence`** — runs the RIE, returns the evidence-backed "what to build next".
  Never builds.
- **`tool-builder`** — builds ONE named tool end-to-end to a single green branch. Spawn one per tool
  in worktree isolation for parallel work; registration is derived, so parallel builds do not
  conflict. Stops and reports if the tool needs a new engine.
- **`content-writer`** — writes or upgrades ONE tool's guide/FAQ/knowledge to a passing `seo:gate`.
  Content only.
- **`tool-crafter`** — gives ONE existing tool its distinct identity, to a green `check:craft`.
  Reports back without shipping when the tool has no honest craft to add, which is a finding rather
  than a failure.
- **`site-auditor`** — read-only sweep returning one triaged report. Never fixes.

**The main session stays the orchestrator.** Engine selection for novel tool types and RIE dataset
authorship are the two judgment calls never delegated to an agent.
