# Tool Identity Architecture: analysis (2026-08-08)

The proposition: a ToyTools URL should read as **"this is a Base64 tool, and ToyTools is the
infrastructure behind it"**, not **"this is a ToyTools page that contains a Base64 tool"**. Tool in
front, platform behind. Independent tools, unified infrastructure.

This document establishes what is true today (measured, not remembered), which parts of the
proposal already shipped, which parts are real gaps, which parts fight the platform's existing
gates, and what the design language decisions actually are. The step by step plan is the companion
document, `2026-08-08-tool-identity-implementation.md`.

Baseline for future diffing: **119 tools**, 20 engines, 29 patterns, 13 tool groups (74 tools in a
group), 119/119 with a guide, FAQ and knowledge file. `APP_VERSION` at time of writing is on the
`query-tool-matching` branch head (47ef2dd).

---

## 1. What was measured

Two passes over the committed `dist/`, so every number below describes shipped output rather than
intent.

**Geometry.** Playwright against a static server on `dist/`, Pixel 5 (393x727) and desktop
(1440x900), ten representative tools across nine engines. Recorded: the top and bottom of every
page zone, and the Y position of the first genuinely interactive control inside the tool body.

**Markup.** A pass over all 142 built `dist/tool/**/index.html` (119 tools plus 23 redirect stubs)
extracting every `<h1>`, `<h2>`, `<title>` and meta description, which are exactly the four slots
`scripts/check-query-coverage.ts` scores targeting against.

**Registry.** `docs/code-map.json` and `src/data/registry.ts` for per tool description lengths,
engine distribution and content registration.

### 1.1 The vertical anatomy of a tool page, Pixel 5

`/tool/developer-utilities/base64-encoder-decoder/`, viewport 727px, document 2885px:

| zone | pixels | share of document |
|---|---|---|
| nav (sticky) | 0 to 65 | |
| breadcrumb | 97 to 139 | |
| `.tool-header` (h1, description, trust, install) | 155 to 452 | |
| **everything before the tool** | **0 to 452** | **15.7%** |
| widget | 452 to 1519 | 37.0% |
| CategoryDiscovery | 1519 to 1647 | |
| ToolNavRow | 1679 to 1822 | |
| FAQ | 1854 to 2592 | |
| FeedbackLink | 2624 to 2726 | |
| footer | 2758 to 2885 | |
| **everything after the tool** | **1519 to 2885** | **47.3%** |

### 1.2 Where the first control lands

The number that decides whether a page reads as a tool or as a document: how far down the first
screen you must look before you can do anything.

> **Superseded, 2026-08-08.** The table below sampled ten tools. Phase 0 instrumented the whole
> registry (`tests/e2e/fold.spec.ts`) and the real distribution is worse: see 1.2b. The sample
> missed the worst case by 37 points. Keep the table for the desktop comparison, which the full
> run does not measure.

| tool | Pixel 5 first control | share of fold | desktop |
|---|---|---|---|
| age-calculator | 548px | 75% | 38% |
| base64-encoder-decoder | 541px | 74% | 44% |
| json-formatter | 568px | 78% | 44% |
| percentage-calculator | 589px | 81% | 55% |
| bmi-calculator | 604px | 83% | 44% |
| word-counter | 721px | 99% | 50% |
| pomodoro-timer | 753px | **104%** | 41% |
| password-generator | 1013px | **139%** | 51% |

Desktop is healthy at 38% to 55%. `.tool-header` alone costs 235px to 324px depending on the tool.

### 1.2b The full registry, measured (119 tools, Pixel 5, 727px viewport)

Two distinct numbers, because they fail for different reasons:

| measure | min | median | worst |
|---|---|---|---|
| **chrome**: where the tool begins (`.tool-header` bottom / viewport) | 51% | **59%** | **74.8%** (`combinations-permutations-calculator`) |
| **fold**: where the tool becomes usable (first control / viewport) | 61% | **80%** | **175.8%** (`lorem-ipsum-generator`) |

- **30 of 119 tools (25%) put no interactive control on the first screen at all.**
- 94 of 119 (79%) are worse than the 74% the base64 sample showed.
- On the median tool, **59% of the phone's first screen is spent before the tool starts.**

The two measures must be held separately, which the sample did not reveal. The *chrome* number is
platform-owned (nav, breadcrumb, title, description, trust, install) and near-identical on every
page, so it is what the identity phases actually move. The *fold* number is widget-owned and is
partly legitimate: `lorem-ipsum-generator` measures 176% because mobile stacking is answer-first by
design (output above input, per `CLAUDE.md`), not because it has a masthead. Holding that one to a
tight ceiling would be a test demanding the design rules be broken, so it is a loose guard while
chrome carries the real ratchet.

This is the single strongest finding, because it contradicts a hard rule the project already
states. `CLAUDE.md` says ToyTools is phone first, that most visits are mobile, and that a tool is
not done until it feels like a native app on a phone. A native app does not spend the first screen
on a title block.

### 1.3 The H2 slot is spent on furniture

Across the 119 shipped tool pages:

| H2 count | pages |
|---|---|
| exactly 2 | 84 |
| 3 | 20 |
| 4 | 1 |
| 9 or 10 (simulations) | 14 |

The two universal H2s, present on **119 of 119** pages:

- `Add to Home Screen` (the title of the InstallButton's install sheet, a `role="dialog"` that is
  always in the DOM)
- `Common Questions`

So on 84 pages the entire H2 inventory is an install dialog title and the word "Questions". On
`base64-encoder-decoder` the full list is `["Add to Home Screen", "Recent conversions", "Common
Questions"]`.

**Measured once instrumented (phase 0): only 22 of 119 tool pages (18.5%) carry a single H2 that
names a concept.** That is worse than the 29% first estimated here, because the estimate counted a
page's third heading as concept-bearing when it is usually `Recent conversions`, a widget panel
label appearing on 13 pages. The floor in `THRESHOLDS.conceptHeadings` records the measured 18.5%.

Targeting sits at **63.4% (220/347)** against a floor of 0.62, over a haystack of four slots:
`<title>`, meta description, `<h1>`, `<h2>`. One entire slot out of four currently says nothing
about what the tool does. That is not a coincidence, it is a quarter of the available surface spent
on chrome.

### 1.4 Authored knowledge that renders nowhere

Every one of the 119 tools has a `knowledge.ts` carrying `realWorldUseCases`, `commonMistakes`,
`commonQuestions` and `summary`. These are validated by `src/lib/knowledge/schema.ts` and required
by the build.

Outside `knowledge.ts` files themselves, the only references to `realWorldUseCases` and
`commonMistakes` in the entire `src/` tree are: the type declaration, the schema validator, a test
fixture, and `src/lib/simulation/generate.ts` (which copies them from a sim manifest into the same
unread field).

**No component, layout or page renders either field.** The catalog has 119 tools' worth of authored
use cases and mistakes, gated by a build validator, visible to nobody.

### 1.5 Descriptions have already drifted off their own contract

`ARCHITECTURE.md` states tool descriptions should run 56 to 110 characters so they wrap to exactly
two lines at the 55ch measure, and `.tool-description` reserves `2lh` on desktop to hold the widget
at a stable Y across sibling pages.

Measured: median 117 characters, max 159. **94 of 119 exceed 80 characters, and 68 of 119 (57%)
exceed the stated 110 ceiling.** The two line reservation is a two line reservation for three or
more lines of text on a phone.

### 1.6 Platform chrome lives inside the tool component

`CategoryDiscovery.astro` is imported by **33 files**, including all 13 shared engine widgets
(`ConverterWidget`, `TextMetricWidget`, `WellnessWidget`, `JwtWidget`, and so on) plus 20 bespoke
widgets. A cross linking surface owned by the platform is rendered from inside each tool's own UI
component.

---

## 2. What is already true

A substantial fraction of the proposal describes work that has already shipped. Saying so precisely
matters, because it means the remaining gap is narrow and specific rather than a rewrite.

| proposal | status today |
|---|---|
| Use `<details>` for the FAQ, not a dialog | **Shipped.** `FaqAccordion.astro` is a native `<details>` per question. |
| Keep the FAQ in static HTML, collapsed but present | **Shipped.** Emitted at build time, plus `FAQPage` JSON-LD. |
| Related tools as a compact strip, not a grid | **Shipped.** `ToolNavRow` renders `Related: A · B · C` as one line of text. |
| Do not put long SEO prose in the tool's visual hierarchy | **Shipped.** There is no "About X" or "How X works" article on the tool page at all. That content lives at `/guide/{category}/{slug}/`. |
| A three layer page model (utility, trust, knowledge) | **Shipped in concept.** `ToolNavRow`'s own source comments literally say "Layer 2 (FAQ + Guide) and Layer 3 (Related Tools)". |
| A quiet trust line rather than a banner | **Shipped.** `TrustNotice.astro`, `--text-xs`, muted, with a tap tooltip. |
| Content types with distinct identity | **Half shipped.** `generatePageTitle` already emits `Name ● ToyTools Guide` for guides and `Name ● ToyTools` for tools. The distinction exists in the `<title>` and nowhere on the page. |
| URL architecture unchanged | **Correct, and it stays unchanged.** |
| Personality from engine composition, not decoration | **Shipped structurally.** 20 engines and 13 shared widgets mean `base64-encoder-decoder` and `word-counter` genuinely do not look alike. |

The proposal's diagnosis of the *feeling* is right. Its diagnosis of the *cause* is not: the page
does not feel like an article because of long prose below the widget (there is none). It feels like
an article because **the first screen on a phone is a masthead**, and because the machine readable
structure of the page (its H2s) describes furniture rather than the tool.

---

## 3. Findings, ranked

### F1. The tool does not own the first screen on a phone (highest impact)

Evidence: section 1.2. First control at 74% to 139% of the Pixel 5 fold; three of ten sampled tools
have no interactive control on the first screen.

The 297px header on `base64-encoder-decoder` breaks down roughly as: `<h1>` at `--text-3xl`
(30px, bold) plus margin, description at `--text-lg` over three lines on a 393px viewport, the
trust badge, the InstallButton at a full 48px touch target, then `padding-bottom: var(--space-8)`
plus `margin-bottom: var(--space-8)`, which is 64px of pure separation below the header before the
widget begins.

Nothing in that block is wrong on its own. Together they are a magazine masthead in front of a
utility.

### F2. A quarter of the ranking surface is furniture

Evidence: section 1.3. `Add to Home Screen` and `Common Questions` are the only H2s on 84 of 119
pages, while `check-query-coverage.ts` scores targeting over exactly four slots and reports 63.4%.

This makes the redesign and the SEO ratchet the *same* piece of work rather than competing ones,
which is the most useful thing in this analysis. Replacing furniture H2s with concept bearing H2s
("How Base64 encoding works", "When Base64 is the wrong choice") raises `targeting` by construction,
without stuffing a single keyword into a title.

### F3. The knowledge layer is authored and invisible

Evidence: section 1.4. 119 tools' worth of `realWorldUseCases` and `commonMistakes` render nowhere.

This is the answer to "what goes in the drawers". The proposal's "Information Drawer" pattern needs
content, and the instinct would be to pull it from the guide. That would be wrong (see T2). The
right source is already sitting in the repo, already validated, already unique per tool, and
currently costing authoring effort for zero visitor benefit.

### F4. Discovery chrome is embedded in 33 widget files

Evidence: section 1.6. Every shared engine widget imports `CategoryDiscovery`.

Two costs. Architectural: a tool's widget cannot be reasoned about, budgeted or reused without
dragging a platform cross link with it, which is precisely the platform-inside-the-tool inversion
this whole phase exists to reverse. Practical: any change to the discovery surface is a 33 file edit
with 33 chances to diverge.

### F5. The tool header draws the one boundary the design system forbids

`ARCHITECTURE.md` states the section boundary recipe explicitly: the *lower* section draws the
hairline with symmetric breathing room, and **sections never own a `border-bottom`**.

`ToolLayout.astro` line 98: `.tool-header { padding-bottom: var(--space-8); border-bottom: var(--border); margin-bottom: var(--space-8); }`

So the most prominent horizontal rule on every tool page, the one that visually separates "brand and
title" from "the tool", is drawn by the wrong element using the one pattern the recipe bans. It is
also the line that most strongly signals "this is a document with a header", because that is what
a masthead rule means.

### F6. Descriptions break their own contract on 57% of the catalog

Evidence: section 1.5. Median 117 characters against a stated 56 to 110 ceiling.

This matters more than it looks, because of the trap in F7.

### F7. The description is load bearing for SEO, so shortening it naively regresses targeting

`tool.description` is used twice: as `.tool-description` on the page, and as the page's
`<meta name="description">` (via `ToolLayout` to `BaseLayout`). The meta description is one of the
four targeting slots.

So "cut every description to one line" is not a free visual win. It shrinks the targeting haystack
across all 119 pages and would push `targeting` down toward or through its 0.62 floor, failing
`npm run verify`. The two needs have to be separated into two fields rather than traded off. This
is the single most important implementation constraint in the plan.

### F8. The design language has three sources of truth and they disagree

- `CLAUDE.md` (mobile rules, breakpoints, budgets)
- `ARCHITECTURE.md` to "Design Language" (palette, section boundary recipe, IoPanel vocabulary)
- `.claude/skills/ui-design-system.md` (8 KB reference loaded by agents building UI)

The skill still says **"Grayscale base, single accent"** and **"Design for 375px width"**. The
palette has been Warm Paper and Ink with a forest green accent since the retheme, and the canonical
breakpoints are 1024 / 640 / 480. An agent that loads that skill builds to a design system that no
longer exists. If every agent is to align to a new phase, this file is the thing they align to, and
today it is stale.

### F9. Things that are already right and must not be broken

- The engine and widget layer genuinely produces different tools rather than 119 clones.
- The FAQ is native HTML, collapsed, and indexable.
- Guides are separate indexable URLs with `Article` schema, a TOC, and knowledge graph nodes.
- The nav search palette is the only route from one tool to another on a tool page. It was added
  deliberately in `2026-08-03-platform-ux-gaps.md` for exactly that reason.
- Per tool PWA identity already exists: manifest, scope, theme colour, and a derived icon.

---

## 4. Where the proposal fights the platform

These are the points where the proposal, taken literally, would break something that currently
works. Each has a resolution that keeps the intent.

### T1. "Powered by ToyTools" instead of the nav

If the sticky nav goes, the search palette goes with it, and a visitor on a tool page can reach
another tool only via the three item Related strip or by going home. That regression was already
diagnosed and fixed once.

**Resolution.** Keep the nav, reduce its voice. The endorsement line belongs in the tool's own
header where it reads as attribution, not at the top of the viewport where it reads as ownership.
The brand keeps its 65px of chrome, and stops being the first thing the eye lands on inside the
content column.

### T2. Pulling "About" and "How it works" into drawers on the tool page

There is no such content on the tool page today. Adding it means either duplicating the guide
(which `npm run check:duplication` exists to catch, and which cannibalises the guide URL that the
topic cluster is built on) or hollowing out 119 guides.

**Resolution.** The drawers carry knowledge that is authored per tool and rendered nowhere
(F3): use cases, common mistakes, the knowledge summary, plus the existing FAQ. The guide stays a
separate reading experience and is linked, not inlined. This gives the proposal its Zone C without
touching the content architecture.

### T3. `<summary>` labels would keep the H2 slot empty

If drawers use bare `<summary>Common questions</summary>`, the H2 haystack stays furniture and
targeting cannot move. If the drawer heading is an `<h2>` **inside** the `<summary>` (valid HTML,
`summary` accepts heading content), each drawer contributes a real concept bearing H2 while
remaining collapsed.

**Resolution.** Every Zone C drawer's summary contains an `<h2>` naming the concept, not the
furniture. `Common Questions` becomes something like `Base64 encoding questions`. This is what turns
a visual change into a measurable ranking improvement, and it is the reason to do the drawer work at
all rather than simply deleting things.

### T4. Per tool marks and personalities

119 authored marks is 119 assets to design, review and keep consistent, and it directly contradicts
"do not want 500 different websites".

**Resolution, and a free win.** The tool already has a derived visual mark.
`src/lib/icons/tool-icon.ts` composes a category seeded gradient plus a family or slug glyph;
`src/pages/icons/tool/[slug].svg.ts` serves it as a scalable build time endpoint, and 238 PNGs sit
committed in `public/icons/tool/`. It is used for the home screen icon and shown on the page
**never**. Rendering that existing icon at 28 to 32px beside the h1 gives every tool a distinct
visual identity with zero new authoring, zero new decisions, and zero new tokens.

### T5. Every addition is charged against a hard byte budget

Tool pages are capped at 34 KB HTML and 60 KB total gzipped, and `json-tree-viewer` is already at
54.6 KB. Knowledge drawers add HTML to all 119 pages.

**Resolution.** The phase must be net neutral or better on bytes, and the removals have to pay for
the additions: the `CategoryDiscovery` markup moves rather than duplicates, and the header sheds
elements. `npm run check:budget` runs per phase, not once at the end. Raising a budget number is
not available (`CLAUDE.md`: fix the cause, do not raise the budget).

### T6. e2e specs assert current geometry

`tests/e2e/health.spec.ts` asserts that the answer and the start of its chart land above the fold on
each health calculator. Shrinking the header helps that assertion rather than hurting it, but the
suite pins positions and must be re run. `tests/e2e/discovery.spec.ts` pins directory counts and
group collapse; moving `CategoryDiscovery` out of widgets touches that surface.

**Resolution.** Treat the geometry change as a behaviour change with tests, not a CSS tweak. Which
leads to the central architectural decision.

---

## 5. The central decision: make the fold a ratchet

Every invariant this project actually holds is a gate, not a guideline. Byte budgets fail the build.
Query targeting has a floor that fails on a drop. Knowledge files fail validation. Registration
drift fails `validate-architecture`. Guidelines that are only written down have already drifted:
57% of descriptions break the stated ceiling (F6), the tool header breaks the stated boundary recipe
(F5), and the design skill describes a palette that no longer exists (F8).

A tool identity phase enforced by prose will drift the same way, faster, because the catalog is
growing and the roadmap talks about thousands of tools.

**So the deliverable of this phase is not a nicer page. It is a fold ratchet.**

A Playwright spec, running on the Pixel 5 project across the registry, asserting for every tool that
the first interactive control inside the tool body lands above a fixed fraction of the viewport.
Today's measured worst case becomes the recorded baseline; the floor only ever tightens. A future
tool that reintroduces a 300px masthead fails `npm run verify` the way a fat page fails
`check-budget` today.

Proposed target: **the first control lands within the top 45% of the Pixel 5 fold** (roughly 327px),
against 74% to 139% today. That is achievable purely by the header surgery in section 6, without
touching a single widget.

Secondary ratchet, in the same spirit: **no tool page may have zero concept bearing H2s.** Extend
`check-query-coverage.ts` to report and then gate it, and raise the `targeting` floor once the
drawers ship.

---

## 6. Design language decisions

These are decisions, with reasons, not options. Anything not listed here is unchanged.

### D1. Page grammar: three named zones with a closed inventory

The page is `Zone A: Do`, `Zone B: Trust`, `Zone C: Know`. Each zone has an allowed inventory, and
nothing outside its inventory may enter it. This is the rule that stops the page re-accreting
furniture over the next thousand tools.

```
Zone A  Do        breadcrumb (one line) | tool icon + h1 | tagline | GroupSwitcher | widget | ToolActions
Zone B  Trust     one line: trust notice, attribution, install affordance
Zone C  Know      drawers (use cases, mistakes, questions) | guide link | related | category | feedback
```

`Zone A` is the only zone above the fold on a phone. `Zone B` is exactly one line high. `Zone C`
begins at the page's first and only hairline.

### D2. The tool leads, the platform signs

The h1 is the tool name and never the brand. The brand appears in the content column once, as a
single micro line in Zone B, in the established uppercase letter spaced micro label voice already
used by `.io-label`, `.dir-heading` and the ToolNavRow "Related" label:

```
POWERED BY TOYTOOLS ●        Private ● Runs entirely in your browser
```

Placed **below** the tool rather than above the title. Above the title it competes with the h1 for
the first fixation, which is the thing we are trying to stop. Below the tool it reads as a maker's
mark, which is the Intel Inside model the proposal is reaching for.

### D3. Typography: the tool page's hero is the widget, not the title

- Tool `<h1>`: `--text-2xl` (24px) at `--font-weight-semibold`, down from the global `--text-3xl`
  bold. It stays the largest text in Zone A and stops being a masthead.
- Guide `<h1>` stays large. The size difference between a tool h1 and a guide h1 becomes the
  cheapest possible signal of Tool Mode versus Reading Mode, using tokens that already exist.
- Tagline: `--text-base`, `--color-text-muted`, **one line**, no reserved second line.
- Zone B micro line: `--text-xs`, uppercase, `0.06em` tracking, `--color-text-muted`.
- Drawer headings: `<h2>` at `--text-lg` rather than the global `--text-2xl`, because in Zone C a
  heading is a label on a closed drawer, not a section title.

### D4. The tool wears its own icon

The derived icon from `/icons/tool/<slug>.svg` renders at 28px (mobile) and 32px (desktop) to the
left of the h1, forming a title row that reads as an application header rather than an article
title. No new assets, no per tool decisions, no new tokens. This is the whole of "tool identity
through a mark", and it is free.

### D5. One hairline per page

`.tool-header` loses its `border-bottom`. Zone A ends in space, not a rule. The first and only
hairline on a tool page is the one Zone C draws above itself, per the existing recipe (lower section
draws it, `margin-top` + `border-top` + `padding-top`). Fewer rules means fewer perceived sections,
which means one application rather than a stack of article blocks.

### D6. Tagline and description become two fields

Driven by F7. `ToolConfig` gains an optional `tagline` (target 40 to 80 characters) used for on page
display. `description` keeps its current text and its current job as the `<meta name="description">`
and as the description in search, category lists and the knowledge graph. When `tagline` is absent
the page falls back to `description`, so the change is additive and lands per tool at whatever pace
suits.

This is what makes "one line under the title" safe. Without it, the visual change costs SEO.

### D7. Zone C is drawers, and every drawer is a real heading

Native `<details>`, always in the static HTML, closed by default, each `<summary>` containing an
`<h2>` that names a concept rather than a page part. Drawer inventory, in order:

1. `What people use {tool} for` from `knowledge.realWorldUseCases`
2. `Where {concept} goes wrong` from `knowledge.commonMistakes`
3. `{concept} questions` from the existing FAQ items
4. The guide link, the related strip and the category link, as one line each, uncollapsed

Content already exists for 1 and 2 on all 119 tools. Nothing is written from scratch, though thin
entries become visible and therefore worth a content pass.

### D8. Discovery leaves the widget

`CategoryDiscovery` is removed from all 33 widget files and rendered once by `ToolPage.astro` inside
Zone C. Widgets stop knowing that a catalog exists. This is a pure move, so it is byte neutral, and
after it a widget is a self contained tool UI, which is what "independent tools, unified
infrastructure" means at the code level.

### D9. The install affordance stops being a heading

`Add to Home Screen` becomes a `<p>` or a `<span>` with `aria-labelledby` preserved via an `id`, not
an `<h2>`. Purely a markup change, and it removes one of the two furniture H2s from all 119 pages on
its own. The button itself moves from the header into Zone B, where it is one line rather than a
48px block above the tool.

### D10. Content type identity, visible

Guides gain a Reading Mode eyebrow above the h1, matching the `<title>` that already says
`● ToyTools Guide`:

```
TOYTOOLS ● GUIDE
How Base64 Encoding Works
```

Tool pages get no eyebrow. The absence is the signal: Tool Mode has no eyebrow, larger widget,
smaller title; Reading Mode has an eyebrow, a large title, and a TOC.

### D11. Tokens added: none

This phase adds **zero** colour tokens, zero typography steps and zero breakpoints. Every value
above already exists in `src/styles/tokens.css`. If an implementation step appears to need a new
token, that is a signal the step is wrong, not that the scale is short.

### D12. Explicitly not doing

- No per tool colour themes, typefaces or bespoke marks beyond the derived icon (T4).
- No dialog based FAQ. Native `<details>` is better on every axis that matters here (T3).
- No guide content inlined into tool pages (T2).
- No removal of the nav or the search palette (T1).
- No new URLs, no slug changes, no redirect stubs. The URL architecture is correct and untouched.
- No auto growing textareas, no layout shift, no new hover only affordances. Existing rules stand.

---

## 7. What this is expected to change, and how it will be known

| metric | today | target | measured by |
|---|---|---|---|
| Chrome above the tool, Pixel 5, worst | 74.8% of fold | under 22% | `tests/e2e/fold.spec.ts` (`CHROME_LIMIT`) |
| Chrome above the tool, Pixel 5, median | 59% of fold | under 20% | same |
| First control, Pixel 5, worst | 175.8% of fold | under 100% | same (`FOLD_LIMIT`) |
| Tools with no control on the first screen | 30 of 119 | 0 | same |
| Tool pages with a concept-bearing H2 | 22 of 119 (18.5%) | 119 of 119 | `THRESHOLDS.conceptHeadings` |
| Query targeting | 63.4% | raise the floor after the drawers ship | `npm run check:queries` |
| Widget files importing platform chrome | 33 | 0 | grep, and an architecture validator rule |
| Knowledge fields rendered on the tool page | 0 of 4 | 3 of 4 | code review |
| Tool page bytes, worst | 54.6 KB | no increase | `npm run check:budget` |

The honest uncertainty: **none of this can be shown to improve rankings within this phase.** The
`2026-08-04` cluster work already carries that caveat and is not re-measurable until Search Console
data lands around September 2026. Targeting is a proxy the project chose deliberately because it is
measurable at build time. This phase should be justified on the two things it can prove (the tool
owns the phone screen, and the ranking surface stops describing furniture), and the ranking effect
should be treated as a hypothesis to check later, not a promise.

---

## 8. Open decisions

Four calls that change the work and are genuinely yours to make.

1. **The version badge in the nav.** It currently links to the changelog and carries a tooltip.
   Moving it to the footer makes the nav quieter, at the cost of the alpha signal's visibility.
   Recommendation: move it. The footer already renders the version.
2. **Attribution wording.** `POWERED BY TOYTOOLS ●` versus `A TOYTOOLS UTILITY ●` versus just
   `TOYTOOLS ●`. Recommendation: `POWERED BY TOYTOOLS ●`, because it is the only one that states
   the infrastructure relationship the whole phase is about.
3. **Tagline authoring pace.** 119 taglines is real writing. Options: author them as part of this
   phase (slower, one consistent voice), or ship the field with a `description` fallback and let the
   `content-writer` agent fill them per tool over time. Recommendation: ship the fallback, then batch
   the writing by category so the voice stays consistent within a cluster.
4. **`.claude/skills/ui-design-system.md`.** It is stale (F8) and duplicates `ARCHITECTURE.md`.
   Options: rewrite it as the single design authority and thin `ARCHITECTURE.md` to a pointer, or
   delete it and point agents at `ARCHITECTURE.md`. Recommendation: rewrite it, because agents load
   skills and do not reliably read a 911 line architecture doc, but make it own only the design
   language and defer everything else.

---

## 9. Summary

The proposal is right about the destination and wrong about the obstacle. The tool page is not
buried under SEO prose, because there is none: the FAQ is already a collapsed native accordion, the
related tools are already one line of text, and guides are already separate URLs. What actually
makes a ToyTools URL read as a document is that on a phone the first 452 pixels are a masthead, and
that the machine readable structure of every page describes an install dialog and the word
"Questions".

Both are fixable in the platform layer, in a handful of shared files, without touching a URL, a
widget's behaviour or the content architecture. The knowledge to fill the proposal's information
drawers is already authored on all 119 tools and currently renders nowhere. The per tool visual mark
the proposal wants already exists as a build time asset and is currently shown only on a home screen.

The part worth insisting on is the enforcement. This project holds its invariants with ratchets, and
every design rule it holds only in prose has already drifted. So the phase ships a fold ratchet and
an H2 quality gate alongside the redesign, and the design language decisions in section 6 get
written into the one place agents actually load.

Companion document: `docs/analysis/2026-08-08-tool-identity-implementation.md`.
