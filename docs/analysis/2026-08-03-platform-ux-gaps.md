# Platform UX gaps: the standard site features ToyTools is missing

Date: 2026-08-03
Scope: platform layer only (nav, runtime, layouts, service worker, standalone pages). No new tools.
Status: plan. Nothing here is built yet.

This is the implementation plan for twelve gaps found by reading the platform layer rather than the
tool registry. Each workstream states the evidence (file and line), the design, the exact files it
touches, and its acceptance condition.

## 1. Baseline measured today

Catalog: 114 tool pages, 114 guides, 11 categories, 32 standalone/other pages, 272 pages total.

`npm run check:budget` against the current `dist/` (gzipped, worst page per kind):

| kind | n | sheets | CSS | JS | HTML | TOTAL | budget | worst page |
|---|---|---|---|---|---|---|---|---|
| tool | 114 | 4 | 11.2K | 19.9K | 19.9K | 51.0K | 60K | `/tool/developer-utilities/json-tree-viewer/` |
| guide | 114 | 2 | 9.5K | 2.0K | 17.0K | 28.5K | 42K | `/guide/productivity/pomodoro-technique/` |
| category | 11 | 1 | 6.4K | 2.0K | 10.6K | 19.0K | 40K | `/category/physics/` |
| page | 32 | 1 | 6.4K | 2.0K | 24.9K | 33.3K | 48K | `/search/` |
| (exception) | | | | | | 168.2K | 190K | `/architecture/` |

**Headroom on the worst tool page is the binding constraint for everything below: JS 4.1K, CSS 4.8K,
HTML 14.1K, TOTAL 9.0K.** Guide, category and page kinds have 13K or more spare.

## 2. Design constraints that shape every decision here

1. **The JS headroom is 4.1K gzipped.** No workstream may add a `<script src>` to tool pages. Any
   new behaviour is either (a) a few hundred bytes of inline script inside `ToyToolsRuntime.astro`
   (counted as HTML, where 14.1K is spare) or (b) a chunk loaded by dynamic `import()` on first
   user interaction, which is genuinely off the critical path.
2. **Option (b) is a measurement blind spot and must not be abused.** `scripts/check-budget.ts:173`
   resolves only the engine chunk named in `<meta name="tt-engines">` and the simulation model named
   in `data-simulation-id`, plus `<script src>` tags. An interaction-loaded palette chunk would be
   invisible to it. W0.4 below closes that hole before we use the technique.
3. **The runtime arrives in two halves** (`src/lib/runtime/index.ts`). Anything computing on load
   wraps in `ToyTools.onReady`. New core surfaces added to `ToyToolsRuntime.astro` are inline and
   available during parse.
4. **Mobile-first is a gate.** Every new surface ships a Pixel 5 e2e assertion, 48px touch targets,
   safe-area padding on anything overlaid, and no horizontal body scroll.
5. **No em-dashes** anywhere in content, comments or commits. `seo:gate` fails on them.
6. **Sensitive input never travels.** `allowsInputCapture(engine, pattern)` already exists as the
   build-time gate that keeps the feedback capture script off `jwt` / `hashing` / `encoding` /
   `generate-credential` tools. URL state (W2) reuses that precedent rather than inventing a
   second policy.

## 3. Phase 0: shared foundations

Four small pieces that three or more workstreams each depend on. Building these first is what keeps
the later PRs thin. This follows the standing engine-first rule: reusable core first, thin UI over it.

### W0.1 Search index as a build-time artifact

Today `src/pages/search.astro` server-renders all 114 `ToolCard`s and filters them with
`data-search.includes(query)`. That markup is why `/search/` is the heaviest `page` at 24.9K HTML.
It also cannot be reused by the nav palette or the 404 page.

Build a single derived index instead:

- `src/lib/search/index.ts` (new): `buildSearchIndex()` reading `src/data/registry.ts` and
  `src/data/categories.ts`, returning `{ s: slug, n: name, u: url, c: categoryName, k: string[] }[]`
  with short keys to keep the payload small. Include tags, `keywords`, `family`, category name and
  aliases (W0.2) flattened into `k`.
- `src/pages/search-index.json.ts` (new): a build-time endpoint emitting the index. Expected size
  for 114 tools is roughly 12K raw and 4K gzipped; assert a ceiling in a unit test.
- `src/lib/search/rank.ts` (new): dependency-free scoring, exact name > name prefix > word-start in
  name > alias exact > substring in name > substring in keywords > subsequence fuzzy match with an
  edit budget of 2. Ties break on shorter name. Pure, unit-tested, no DOM.

Consumers: nav palette (W1), `/search/` (W10), `/404` (W10), offline page (W8).

### W0.2 Search aliases as data

Ranking cannot fix vocabulary. "percent off" must find the discount calculator; "epoch" the unix
converter; "celcius" (misspelled) the temperature converter.

- `src/data/search-aliases.ts` (new): `export const searchAliases: Record<string, string[]>` mapping
  slug to alias phrases. One file, grows by hand, no tool config churn.
- `scripts/validate-registry.ts`: fail the build when an alias key is not a registered slug, and
  when two slugs claim an identical alias phrase.
- Seed roughly 60 entries covering the obvious misses across the 114 tools.

### W0.3 A dialog primitive in the runtime core

Three workstreams need the same overlay (palette W1, shortcut help W6, settings sheet W5). Write it
once, inline, in `src/components/ToyToolsRuntime.astro` as `TT.sheet`:

- `TT.sheet.open(el)` / `TT.sheet.close()`, backdrop, Esc to close, focus trap, focus restore to the
  invoking element, `inert` on `<main>` while open, `env(safe-area-inset-*)` padding, and a mobile
  bottom-sheet presentation below 640px vs centred dialog above.
- Budget: target under 900 bytes gzipped of inline script. Measure before merging.
- Reuse `--color-overlay-*` (theme-invariant) per the design language.

### W0.4 Teach the budget checker about interaction-loaded chunks

Before any workstream ships an interaction-loaded chunk, `scripts/check-budget.ts` gains a second,
separate check so the bytes are still governed:

- `INTERACTION_ASSETS: { chunk: string; maxKb: number }[]` listing the palette chunk and the search
  index, resolved out of `dist/` by filename pattern and gzipped.
- Printed as its own line in the report and failing the build when over. It is deliberately not
  folded into the per-page critical-path totals, because it is not fetched on load; keeping it a
  separate line preserves the meaning of the existing table.

## 4. Workstreams

### W1. Global search palette in the nav (Tier 1, largest win)

**Evidence.** `src/components/Nav.astro` renders exactly a logo and a theme toggle. `HeroSearch` and
`SearchBar` are imported only by `src/pages/index.astro`. The global `/` shortcut at
`src/components/ToyToolsRuntime.astro:475` focuses `#q`, which exists only on the homepage, so the
shortcut is a silent no-op on all 114 tool pages plus every guide and category page. From a tool
page there is no way to reach another tool except scrolling to `CategoryDiscovery` or going home.

**Design.**

- `Nav.astro` gains a search affordance: full input above 640px, icon button below (48px target).
  Server-rendered markup only, no script, plus an empty `<div id="tt-palette" hidden>` shell.
- On first focus, click, `/`, or Ctrl/Cmd+K, an inline handler dynamic-imports
  `src/lib/search/palette.ts` (new) and fetches `/search-index.json` once, caching both on
  `window.ToyTools`. Subsequent opens are instant.
- Palette behaviour: type to filter with W0.1 ranking, arrow keys to move, Enter to open, Esc to
  close, top 8 results, category shown as a dim suffix. Empty query shows favourites (W3) then
  recents (`TT.getRecent`), then a "Browse all tools" link.
- Accessibility: `role="combobox"` on the input with `aria-expanded` and `aria-activedescendant`,
  `role="listbox"` and `role="option"` on results, results announced via a polite live region.
- Fallback: the input sits in a real `<form action="/search/" method="get">` so with JS off or the
  chunk failing, Enter still lands on the working `/search/` page.

**Files.** `src/components/Nav.astro`, `src/components/ToyToolsRuntime.astro` (retarget `/` to the
palette, add Ctrl/Cmd+K), `src/lib/search/palette.ts` (new), `src/lib/search/{index,rank}.ts`
(W0.1), `src/pages/search-index.json.ts` (new), `tests/e2e/palette.spec.ts` (new).

**Acceptance.** Palette opens from a tool page, a guide page and a category page on desktop and
Pixel 5; keyboard path works end to end; zero added bytes to any page's load-time JS
(`check:budget` table unchanged in the JS column); palette chunk under 6K gzipped in the W0.4 line;
`/` works on every page.

### W2. URL state, shareable results, and Web Share (Tier 1)

**Evidence.** `URLSearchParams` appears in exactly one file in the whole `src/` tree,
`src/components/feedback/feedbackForm.client.ts`. No tool reads or writes query state.
`navigator.share` appears nowhere. So no calculator result can be bookmarked, returned to, or sent
to someone, on a site that is explicitly phone-first.

**Design.** Core first, adoption second.

1. **`TT.url` in the runtime core** (inline, target under 600 bytes gzipped):
   - `TT.url.read()` returns a plain object of decoded params.
   - `TT.url.write(obj)` debounced 300ms, `history.replaceState` only (never `pushState`, which would
     turn every keystroke into a back-button trap), omits empty values, and skips entirely when the
     serialized query would exceed 1500 characters.
   - `TT.url.share({ title, url })` uses `navigator.share` when present, otherwise falls back to
     `TT.copy(url)` plus the existing toast.
2. **A build-time policy gate**, mirroring `allowsInputCapture`: `allowsUrlState(engine, pattern)` in
   `src/lib/feedback/` or a new `src/lib/url-state.ts`. Returns false for `jwt`, `hashing`,
   `encoding` and `generate-credential` patterns, so tokens, secrets and hashes are never written to
   the address bar, browser history, or a shared link.
3. **Two adoption modes.**
   - *Auto-sync*: pure calculators and converters with short numeric inputs. State restores inside
     `ToyTools.onReady` and syncs on change. Rollout order by traffic value:
     `ConverterWidget.astro`, `FinanceWidget.astro`, `MathWidget.astro`, `DateTimeWidget.astro`.
   - *Explicit only*: everything else gets a "Copy link" action that builds the URL on click without
     the page ever mutating `location`. This is mandatory for `WellnessWidget.astro` and
     `TrackerWidget.astro`, where auto-sync would silently write someone's weight or body metrics
     into shared links and browser history.
4. **`ToolActions.astro`** gains optional `shareTarget` rendering a "Copy link" button (and "Share"
   where `navigator.share` exists), consistent with the existing `data-action` delegation.

**Files.** `src/components/ToyToolsRuntime.astro`, `src/lib/url-state.ts` (new) plus its test,
`src/components/tool/ToolActions.astro`, the five shared widgets above, `tests/e2e/url-state.spec.ts`
(new).

**Acceptance.** Loading a shared URL reproduces the exact result on desktop and Pixel 5; no
`pushState` entries accumulate while typing; a `jwt`/`hashing`/`encoding`/credential tool writes
nothing to the URL under any interaction (asserted in e2e); over-long state degrades to a toast
rather than a broken link.

### W3. Favourites (Tier 1)

**Evidence.** `TT.getRecent` exists and `src/pages/index.astro:52` renders recent chips, but recents
are unranked, capped at 10, and homepage-only. There is no pinning anywhere in `src/`.

**Design.**

- `TT.favorites` in the runtime core: `list()`, `has(slug)`, `toggle(slug)`, backed by
  `localStorage` key `toytools:favorites`, capped at 50, never throws. Roughly 300 bytes inline.
- A star toggle in `ToolLayout.astro` beside `InstallButton`, 48px, with a visible pressed state and
  `aria-pressed`.
- Surfaces: palette empty state (W1), a "Favourites" row above "Recent" on the homepage (reusing the
  existing chip markup and script), and the settings page (W5) for bulk removal.
- Homepage renders every tool already, so surfacing favourites is a class toggle with no extra fetch
  and no new markup per tool.

**Files.** `src/components/ToyToolsRuntime.astro`, `src/layouts/ToolLayout.astro`,
`src/pages/index.astro`, `tests/e2e/discovery.spec.ts` (extend).

**Acceptance.** Star persists across reload and across tools; favourites appear first in the palette;
homepage row hides cleanly when empty; Pixel 5 green.

### W4. Privacy, About (Tier 2, trust)

**Evidence.** GA4 loads on every page via `BaseLayout` (through the runtime's analytics guard), the
health tools persist a body profile and tracker logs to `localStorage`, the service worker caches
pages, and `src/components/Footer.astro` asserts "Private" as a tooltip. There is no page anywhere in
`src/pages/` backing that claim. This is standard furniture for a utility site, an E-E-A-T signal for
the finance and health calculators, and a prerequisite for any future monetisation.

**Design.** Two indexable pages written to match the code exactly, not boilerplate:

- `/privacy/`: what runs in the browser and never leaves it (every tool's computation); what GA4
  collects and the exact exclusions in `src/lib/analytics/guard.ts` (dev, E2E, automation,
  localhost); the `localStorage` namespace `toytools:*` with the 50KB cap, what each family of keys
  holds, and that clearing site data erases it permanently; the service worker cache; that
  `/feedback/` composes a `mailto:` handed to the visitor's own mail client with no relay, no
  endpoint and no database; that there are no ads, no third-party embeds, no fonts fetched from a
  CDN. Link the export and delete controls on `/settings/` (W5) from here, since a privacy page that
  cannot act is decoration.
- `/about/`: what ToyTools is, the design constraints (static, client-side, no accounts), who builds
  it, and how to suggest a tool. Links `/architecture/`, `/feedback/`, `/changelog/`.

**Files.** `src/pages/privacy.astro` (new), `src/pages/about.astro` (new), `src/lib/titles.ts`
(add `privacy` and `about` to `PageType`), `src/lib/content/manifest.ts` (add both to
`STANDALONE_PAGES`, priority 0.4, changefreq yearly), `src/components/Footer.astro`.

**Acceptance.** Both indexable and in the sitemap; every factual claim traceable to code; `page`
budget (48K, worst today 33.3K) unaffected.

### W5. Settings page (Tier 2)

**Evidence.** `TT.data` at `src/components/ToyToolsRuntime.astro:122` already implements
`collect`, `serialize`, `download`, `restore`, `persist` and `pressure`, a complete and careful
backup layer. Its only consumer is `src/tools/_shared/TrackerWidget.astro:327`. So the export and
import machinery exists and is reachable from health tracker tools only; someone who used the
finance or productivity tools has no path to it at all, and there is no global delete.

**Design.** `/settings/` (noindex, follow), a plain single-column page:

- **Appearance**: theme (light / dark / system), mirroring the `Nav` toggle and the same
  `toytools.theme` key.
- **Your data**: storage usage from `TT.data.pressure()`, "Export backup" calling
  `TT.data.download()`, "Import backup" calling `TT.data.restore()` with the existing merge
  semantics, and "Delete everything" with a two-step confirm using `--color-danger`, clearing every
  `toytools:*` key plus `toytools.*` legacy keys.
- **Body profile**: view and clear `TT.profile` (the health tools' shared facts).
- **Preferences**: `TT.prefs` entries currently written by `FinanceWidget` and `CurrencyInput`.
- **Favourites**: list with remove (W3).

Then simplify `TrackerWidget`'s bespoke export and import buttons into links to this page, so the
behaviour lives in one place.

**Files.** `src/pages/settings.astro` (new), `src/lib/titles.ts`, `src/components/Footer.astro`,
`src/tools/_shared/TrackerWidget.astro` (delegate), `tests/e2e/settings.spec.ts` (new).

**Acceptance.** Export produces a file that import restores on a clean profile (asserted in e2e);
delete removes every namespaced key and nothing else; page is noindex and absent from the sitemap.

### W6. Changelog page (Tier 2)

**Evidence.** `CHANGELOG.md` exists and `npm run version:bump` maintains it, while
`src/components/Nav.astro:8` advertises "Alpha Version, major UI revamp under progress" in a tooltip
with nothing to click through to.

**Design.** `/changelog/` renders `CHANGELOG.md` parsed at build time (read from disk in frontmatter,
rendered with the existing markdown path used elsewhere, or a minimal heading and list parser if no
markdown renderer is already in the dependency set). Never a hand-maintained copy, so it cannot
drift. The nav version badge links to it.

**Files.** `src/pages/changelog.astro` (new), `src/components/Nav.astro`, `src/lib/titles.ts`,
`src/lib/content/manifest.ts`.

**Acceptance.** Page content equals `CHANGELOG.md` after a `version:bump`; badge links through;
`page` budget respected (the file will grow, so cap the render at the most recent 20 releases with a
link to the repo for older ones).

### W7. Accessibility baseline (Tier 3)

**Evidence.** `src/layouts/BaseLayout.astro:101` renders a bare `<main>` with no id and no label, and
there is no skip link anywhere. `<header>` has `role="banner"` but nav landmarks are unlabelled.
Every page carries nav, breadcrumb schema, tool, related tools, FAQ and footer, so a keyboard or
screen reader user traverses the whole chrome on every one of 272 pages. Separately, `ToolLayout`
emits `BreadcrumbList` JSON-LD (`src/layouts/ToolLayout.astro:29`) but renders no visible breadcrumb.

**Design.**

- Skip link as the first focusable element in `<body>`, visually hidden until `:focus-visible`,
  targeting `<main id="main" tabindex="-1">`.
- `aria-label` on the nav and footer landmarks; `aria-current="page"` where breadcrumbs render.
- Visible breadcrumb on tool pages to match the schema already emitted (small, one row, reuses
  `Breadcrumb.astro` which `GuideLayout` and category pages already use).
- Add `@axe-core/playwright` as a devDependency (zero site bytes) and a `tests/e2e/a11y.spec.ts`
  covering home, one tool, one guide, one category, `/settings/`, and the open palette, on both
  Desktop and Pixel 5, failing on serious and critical violations.

**Files.** `src/layouts/BaseLayout.astro`, `src/layouts/ToolLayout.astro`,
`src/components/{Nav,Footer}.astro`, `src/styles/global.css`, `tests/e2e/a11y.spec.ts` (new),
`package.json`.

**Acceptance.** Axe reports zero serious or critical violations on the six sampled page types;
skip link reachable with one Tab from load.

### W8. Keyboard shortcut discoverability (Tier 3)

**Evidence.** `/`, Esc, Ctrl/Cmd+Shift+C and Ctrl/Cmd+Shift+X are implemented at
`src/components/ToyToolsRuntime.astro:475` and are mentioned nowhere in the UI.

**Design.** `?` (when not typing) opens a `TT.sheet` listing every shortcut, including the new
Ctrl/Cmd+K from W1. A discreet "Shortcuts" link in the footer opens the same sheet, since a shortcut
whose only trigger is a shortcut helps nobody. Hidden below 640px where it is irrelevant. Content is
static markup, no chunk needed.

**Files.** `src/components/ToyToolsRuntime.astro`, `src/components/Footer.astro`.

**Acceptance.** Sheet opens from `?` and from the footer link, traps focus, closes on Esc, restores
focus; `?` never fires while typing in an input, textarea, select or contenteditable.

### W9. Print stylesheet (Tier 3)

**Evidence.** Zero occurrences of `@media print` in `src/styles/`. People print and save as PDF from
calculators (loan schedules, macro targets, unit conversions) and from guides; today the output
carries nav, theme toggle, install button, feedback link, related tools and footer, and fixed-height
`IoPanel`s clip their own content at the panel edge.

**Design.** `@media print` block appended to `src/styles/global.css` (roughly 300 bytes gzipped
against 4.8K of CSS headroom on the worst tool page; a separate `media="print"` link would be a
fifth stylesheet request, so inline is cheaper):

- Hide `header`, `footer`, `.tool-actions`, `InstallButton`, `FeedbackLink`, `CategoryDiscovery`,
  `RelatedTools`, `GroupSwitcher`, the palette shell and the back button.
- `IoPanel` and any fixed-height panel become `height: auto; overflow: visible` so nothing clips.
- Force the light palette regardless of `data-theme`, since printing dark tokens wastes ink.
- `a[href^="http"]::after { content: " (" attr(href) ")" }` inside guide prose only.
- `break-inside: avoid` on stat cards, FAQ items and table rows; `break-after: avoid` on headings.

**Files.** `src/styles/global.css`.

**Acceptance.** Print preview of a finance tool, a metric tool and a guide shows only the content;
no clipped panels; CSS column in `check:budget` moves by less than 0.5K.

### W10. Offline correctness (Tier 3)

**Evidence.** `public/sw.js:28` precaches only `['/']`, and the navigation fallback at line 85 serves
the cached root for any uncached navigation. The fetch handler is network-first and does cache every
successful same-origin GET, so a *visited* tool already works offline; the gaps are (a) an installed
tool opened offline before its first successful load falls back to the homepage rather than anything
useful, (b) the cache is unbounded, and (c) there is no offline page telling the user what they can
still reach.

**Design.**

- New `/offline/` page: static, tiny, noindex, listing favourites (W3) and recents from
  `localStorage` as links, with a line explaining that already-visited tools still work.
- `sw.js`: precache `['/', '/offline/']` plus the shared CSS bundle at install; use `/offline/` as
  the navigation fallback instead of `/`; bump `CACHE` to `toytools-cache-v3` (the existing activate
  handler already purges old caches).
- Cache discipline: cap the runtime cache at 150 entries, trimming oldest-first on each successful
  put, so a heavy user does not accumulate the whole site indefinitely.
- Keep the registration gate as is (skipped under dev, E2E, automation and localhost).

**Files.** `public/sw.js`, `src/pages/offline.astro` (new), `src/lib/titles.ts`,
`src/lib/content/manifest.ts` (deliberately excluded from the sitemap; add a comment saying so).

**Acceptance.** With the network disabled in a Playwright context, a visited tool still renders and
an unvisited URL lands on `/offline/` with working links; cache entry count stays capped.

### W11. Search page upgrade (Tier 1 follow-on)

**Evidence.** `src/pages/search.astro`'s inline script runs once on load: it reads `?q=`, filters,
and stops. There is no `input` listener, so typing in the search box does nothing until submit. It is
also the heaviest `page` at 24.9K HTML because it server-renders 114 cards.

**Design.** Keep the server-rendered cards (they are the no-JS fallback and the reason the page works
at all without the index), but layer on: live filtering as you type, W0.1 ranking so results reorder
rather than merely hide, arrow-key navigation and Enter to open, and a result count that reflects
ranking. Reuse `src/lib/search/rank.ts` from the same interaction-loaded chunk as the palette, so
there is one ranking implementation on the site. Also wire `/404` to suggest the three closest tools
for the attempted path using the same index.

**Files.** `src/pages/search.astro`, `src/pages/404.astro`, `src/lib/search/rank.ts`.

**Acceptance.** Typing filters and reorders without submit; `?q=` deep links still work; no-JS
rendering still lists every tool; `page` budget respected.

### W12. Language stubs: switcher or removal (Tier 3, decision needed)

**Evidence.** `src/pages/` contains 20 locale directories (`ar`, `cs`, `da`, `de`, `el`, `es`, `fi`,
`fr`, `hi`, `hu`, `id`, `it`, `ja`, `ko`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `sv`, `th`, `tr`, `uk`,
`vi`, `zh`, `zh-hk`, `zh-tw`). Every one is `robots="noindex,follow"`, deliberately excluded from the
sitemap (`src/lib/content/manifest.ts:128`), and reachable from nowhere on the site: there is no
language switcher in nav or footer. No visitor arrives at one from inside ToyTools.

**Design.** Two honest options, and the choice belongs to you:

- **Keep and connect**: a footer `<details>` language menu, plain links, no script. Cost is roughly
  0.5K gzipped of HTML on all 272 pages for a surface whose targets are noindex stubs.
- **Remove**: delete the 20 directories. The tools are English; the stubs neither rank (noindex) nor
  get visited (unlinked), so they are pure maintenance surface.

Recommendation: remove, unless localized tool content is actually on the roadmap. If it is, the
stubs should become indexable localized landing pages with `hreflang` alternates, which is a
different and much larger project than a footer menu.

## 5. Sequencing

Six PRs, each independently shippable, each green on `npm run build` (validators plus budget) and
`npm run test:e2e` (Desktop and Pixel 5) before merge, rebased on `origin/main`.

| PR | Contents | Size | Rationale for the order |
|---|---|---|---|
| 1 | W0.1 index, W0.2 aliases, W0.3 sheet, W0.4 budget check | M | Pure foundations, no user-visible change, unblocks four workstreams. Ships with unit tests only. |
| 2 | W1 palette, W8 shortcut help, W11 search and 404 | L | The navigation fix, the single biggest win. Consumes all of PR 1. |
| 3 | W2 URL state, share and copy link | L | Independent of PR 2; second biggest win. Engine (`TT.url` plus the policy gate) first, widget adoption second. |
| 4 | W4 privacy, W4 about, W6 changelog, W5 settings | M | The trust cluster. `TT.data` already exists, so this is mostly page authoring. |
| 5 | W3 favourites | S | Wants the palette (PR 2) and the settings page (PR 4) to land on. |
| 6 | W7 a11y, W9 print, W10 offline, W12 decision | M | Polish sweep; the a11y spec should run last so it covers every surface added above. |

## 6. Risks and open decisions

1. **Interaction-loaded chunks are outside the current budget contract.** W0.4 must land in PR 1 or
   the technique becomes an unmeasured leak. Non-negotiable.
2. **URL state on personal-data tools.** The `allowsUrlState` gate is the whole safety story for W2.
   Health and finance auto-sync would put someone's weight or salary into browser history and any
   shared link. Explicit copy-link only for those, enforced by the build-time gate and asserted in
   e2e, not by convention.
3. **The privacy page must describe GA4 accurately.** The footer says "Private" and the tools genuinely
   are, but analytics does load for real users. The page should say so plainly. Claiming "no
   tracking" would be false.
4. **Palette markup lands on all 272 pages.** Budgeted at under 0.5K gzipped HTML against 14.1K of
   headroom on the worst tool page. Measure in PR 2 rather than assume.
5. **`/settings/` centralizes destructive actions.** Delete-everything needs a two-step confirm and
   must never be reachable by a single tap on mobile.
6. **W12 needs your call** before PR 6: connect the locale stubs or delete them.

## 7. Explicitly out of scope

No new tools, no new engines, no changes to the RIE, Content Intelligence, Knowledge Graph or SEO
Engine, no third-party services of any kind (the feedback system's `mailto:` constraint stands), no
accounts, no server. Everything above stays a static, client-side, offline-capable site.
