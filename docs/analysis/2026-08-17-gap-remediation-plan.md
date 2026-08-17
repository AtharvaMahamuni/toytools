# Gap remediation plan

**Date:** 2026-08-17
**Inputs:** `docs/analysis/2026-08-16-seo-ranking-gaps.md`, the CLAUDE.md restructure, and the UX
audit recorded in `.claude/skills/tool-ux-review/SKILL.md`.
**Question asked:** plan every gap found, then fix them in one go.

Fourteen gaps were identified across the three audits. They are not one kind of work. Four are
mechanical defects with a single correct answer and a build that can prove it. Two are batches
needing per-item editorial judgment. Seven are programs or strategy calls, and one cannot be done
from inside this repository at all.

**This change ships tier A in full.** Tiers B and C are specified here so the next person starts
from a brief rather than a re-audit, and the reasons for deferring each are recorded.

## Tier A — mechanical defects, shipped in this change

Each has one correct answer, changes no editorial content, and is provable by `npm run verify`.

### A1. Guide schema dates are not dates

**Defect.** 102 of 121 guide pages emit `"datePublished":"Jul 2026"` and
`"dateModified":"Jul 2026"`. Schema.org requires ISO 8601, so Google drops both properties and the
`Article` item is degraded on every guide in health, physics, finance, text, developer, generate,
design and productivity.

**Root cause.** `src/data/types.ts:36` documents `GuideConfig.updatedAt` as
`// display string, e.g. "Jun 2026"`, and `GuideLayout.astro:56-57` feeds that display string
straight into the `Article` schema. One field is doing two jobs and failing both: the 19 guides that
are valid are valid by accident, because somebody typed an ISO date into a display field, and those
19 render `Updated 2026-06-07` to the visitor.

**Measured shape of the data.**

| field | count | ISO 8601 |
|---|---|---|
| tool-level `updatedAt` | 107 | **107** |
| guide-level `updatedAt` | 107 | 19 |

Simulation manifests repeat the pattern exactly: `presentation.updatedAt` is ISO,
`guide.updatedAt` is `'Jul 2026'`.

**Fix.** Make `GuideConfig.updatedAt` an ISO date, the single source of truth, and derive the display
string at render time.

1. Retype the field in `src/data/types.ts` and `src/lib/simulation/manifest.ts` with the ISO
   contract stated.
2. Convert the 88 non-ISO guide values and the 14 sim manifest guide values. Where the month matches
   the tool's own ISO `updatedAt`, use that exact date, which is the real one. Otherwise use the
   first of the stated month, which is the most precise honest value available.
3. Add `formatMonthYear()` and have `GuideLayout` render it for the visible `Updated …` line while
   the schema takes the ISO value.
4. Assert the format in `validate-registry` so it cannot recur.

**Result.** All 121 guides emit valid dates, and all 121 render `Jun 2026` to the visitor. Both
halves of the bug close, and the visible text is unchanged for the 88 that were already correct on
screen.

### A2. Tool pages carry no freshness or authorship signal

**Defect.** `dateModified` appears in 121 built files, every one a guide. The tool page, the page
meant to win the head term, has no recency signal of any kind. Its `SoftwareApplication` schema is
`name`, `description`, `url`, `applicationCategory`, `operatingSystem`, `offers`.

**Fix.** In `src/layouts/ToolLayout.astro`, add `dateModified` from the tool's existing ISO
`updatedAt` (107/107 present and valid, currently unused for this) and a `publisher` Organization,
matching the author entity the guides already declare.

**Explicitly not in scope:** an `aggregateRating`. We have no ratings, and inventing them is
fabricated structured data.

### A3. No tool control acknowledges a tap

**Defect.** `src/styles/tool-widget.css` defines **11 `:hover` rules and 0 `:active` rules**.
`.primary-action`, `.action-btn`, `.action-btn--sample`, `.smart-step`, `.smart-preset`,
`.smart-segment`, `.conv-hist-btn` and `.tm-stat-row` each declare a hover state and none declares a
pressed state. Phones have no hover, so tapping any control on any of the 121 tools produces no
acknowledgement from the stylesheet that styles them all.

CLAUDE.md lists this as a mobile-first non-negotiable: *"Every control needs a visible `:active`
state (phones have no hover)."* It has no gate, and it is honoured nowhere in that file.

**Fix.** Pair every one of those control classes with an `:active` rule, using existing tokens and
the file's existing `prefers-reduced-motion` block for the transform.

**Not a gap, checked:** keyboard focus is already handled. `global.css:89` sets one
`:focus-visible` ring everywhere from `--focus-ring`. No change needed.

### A4. The return key is unlabelled on every calculator

**Defect.** `enterkeyhint` appears on 2 of 121 pages.

**Fix.** Add `enterkeyhint` to `src/components/inputs/SmartInput.astro`, the shared input layer
behind the `wellness`, `finance`, `calculator`, `units`, `color`, `math` and `datetime` engines. The
value is `done`: these tools compute live as you type, so the return key's real job is to dismiss the
keyboard and reveal the result, not to submit.

## Tier B — real, but each needs its own batch

Deferred because each item requires per-item judgment that cannot be verified by a build, and
bundling them into a mechanical change would hide that judgment in a large diff.

### B1. Tool title length — WITHDRAWN 2026-08-17, there is no defect here

The original finding said 55 of 121 titles exceed 60 characters and are truncated in the SERP. That
measured the wrong thing, and acting on it would have made the catalog worse.

Re-measured by the question that decides whether truncation costs anything — *is the discriminating
term still visible?* — **121 of 121 titles have their head term inside the first 57 characters.**
Median length without the `● ToyTools` suffix is 49; the longest is 62. The suffix itself costs 11
characters on every title, and it is what gets cut:

```
full   "Combinations & Permutations Calculator: nCr, nPr ● ToyTools"   (63)
shown  "Combinations & Permutations Calculator: nCr, nPr ● To"
cut    "yTools"
```

Three things follow, and together they invert the recommendation:

1. **Title length is not a ranking factor.** Truncation is a display behaviour. Google indexes the
   whole tag and matches against all of it.
2. **Characters past the cut still earn relevance.** A longer title is more matching surface, and
   `check:queries` scores `targeting` partly from the title, so shortening titles would have pushed
   that ratchet *down*.
3. **What is being truncated is the brand suffix**, which is the correct thing to lose.

**The rule, stated so it does not get relitigated:** front-load the discriminating term; after that,
length is free. Do not shorten a title to hit a character count. The one thing worth checking on a
new tool is that its head term lands before roughly character 55, which every tool currently
satisfies.

The rule this does **not** license is padding titles with extra keywords to farm `targeting`.
CLAUDE.md already forbids that ("never satisfy targeting by stuffing keywords into a title: cover
the intent instead"), and it remains the right rule: more surface is only worth having when it is
surface a person would actually type.

### B2. Guides were orphaned — DONE 2026-08-17

Guides sat at a median of 5 inbound links against 13 for tool pages, 56 of 121 at click depth 3, six
with exactly one.

**Root cause, found by tracing which page kinds link a guide at all:**

| linked from | guides reached |
|---|---|
| their own tool page | 121 / 121 |
| another guide | 87 / 121 |
| **a category page** | **0 / 121** |
| the homepage | 0 / 121 |

No category page linked a single guide. The 11 category hubs are depth-1 pages and they pointed only
at tools.

**Fix.** `src/components/CategoryGuideList.astro`, rendered by `src/pages/category/[slug].astro`
below the tool list. A plain list of links, not cards, because the tools are what the category page
is for and the guides should not compete with them.

**Result.** Every guide is now at **click depth 2** (from 56 at depth 3), minimum inbound rises from
1 to 2 and the median from 5 to 6. The depth change is the substantive part: it is what moves crawl
priority.

## Tier C — programs and decisions, not fixes

Recorded with what each actually needs, so none of them silently becomes nobody's job.

| gap | status | what it needs |
|---|---|---|
| **Pixel 5 was not a PR gate.** `fold.spec.ts` skips off pixel5 and the PR job ran chromium only, so the fold ratchet never ran on a PR. | **DONE 2026-08-17** | CI now runs both projects as parallel matrix legs with `fail-fast: false`. Both are Chromium, so it costs one browser install and no extra download, and the PR waits only for the slower leg. `verify.sh` always ran both; CI matches it now, and the "one sanctioned divergence" wording is gone from CLAUDE.md and the `gates` skill. |
| **Zero authority signal** on 121 tool pages, against 22 YMYL pages competing with the CDC and banks. | **PARTLY DONE 2026-08-17** | A `methodology` field on `ToolConfig`, rendered in Zone B beside the privacy badge, naming the published method the engine actually implements. Populated for the 7 wellness calculators whose formula is verifiable in `models.ts` and pinned by its tests: Mifflin-St Jeor, US Navy circumference, Devine/Robinson/Miller/Hamwi, Karvonen with the Tanaka maximum, Atwater factors, WHO classification. **Deliberately not external citations:** a link I cannot verify resolves is a worse signal than none, and naming the method is the part that is both true and checkable. Finance and the remaining health tools are the obvious next pass. |
| **Every quality gate is self-referential.** Nothing compares a page to what actually ranks. | **BLOCKED** | Needs a `competitorCoverage` criterion fed by `seo:research`, which fetches live SERPs. The sandbox proxy refuses them (`CONNECT tunnel failed, 403` for both Google and DuckDuckGo), so the stage cannot run and a gate built on it could not be validated here. Build it where the research stage can actually fetch. |
| **Indexing data absent for 7+ weeks.** `GSC_SA_KEY_JSON` was never set, so the weekly workflow has skipped its only real step since 2026-06-29. | **CANNOT BE DONE FROM THIS REPO** | Two repository secrets, `GSC_SITE_URL` and `GSC_SA_KEY_JSON`. `docs/indexing.md` has the setup. This is the item everything else is waiting on: it is the only way to tell "outranked" from "not indexed". |
| **89 untargeted query phrasings, 114 that retrieve nothing.** Worst was `remove-line-breaks` at 1 of 7. | **STARTED 2026-08-17 — 6 tools done, ~35 left** | Six were done because they *forced* the issue: `kebab-case-converter`, `normalize-whitespace`, `remove-duplicate-lines`, `remove-line-breaks`, `snake-case-converter` and `trim-text` were all failing `seo:gate` on `queryTargeting` and nobody knew, because the changed-tool gate only runs on directories a branch touches and nothing had touched theirs. The A1 date fix touched all 102 configs, and six pre-existing failures fell out. Fixed by extending each meta description to use the words people actually type: "dash case", "underscore case", "dedupe", "unique lines", "clean whitespace", "join lines", "strip newlines". `remove-line-breaks` went 1/7 → **7/7**; catalog targeting 75.3% → **78.7%**, and the ratchet floor moved 0.75 → 0.78 in the same commit. The remaining ~35 are the same job, one tool at a time. |
| **75 of 121 tools have no demand evidence.** | **NOT DONE** | RIE dataset authorship, which CLAUDE.md names as one of the two judgment calls never delegated. Inventing evidence to fill the gap would corrupt the input the whole roadmap is scored from. |
| **Craft coverage is 5/107 against a 4.6% floor.** | **NOT DONE** | 102 tools, one `tool-craft` run each, and the skill's own rule is that a tool with no honest touch declares none. This is a standing backlog, not a task. |

## What is still open in existing tools, measured 2026-08-17 after the fixes above

Every number here was measured, not recalled. Two of them corrected an assumption.

### The good news first, so nobody re-audits it

**All 107 non-simulation tools pass `seo:gate`.** This was swept one tool at a time rather than
trusted, because the changed-tool gate only sees directories a branch touches and the six failures
found earlier had been hiding behind exactly that. There is no larger hidden backlog: the six were
the backlog.

> **Items 1 and 2 were fixed later the same day.** All 14 simulations now pass `seo:gate:sim`, the
> 12 identical FAQ pairs are gone, and catalog targeting reached 82.5%. What is written below is the
> state that prompted the work; the closing notes are at the end of each item.

### 1. Three simulations fail their gate

Simulations gate through `npm run seo:gate:sim`, not `seo:gate`. Swept separately, 11 of 14 pass:

| tool | failing criterion |
|---|---|
| `simple-harmonic-motion-calculator` | `queryTargeting` 43 (need 50) **and** `highImpactActions` 4 (need ≤3) |
| `probability-calculator` | `queryTargeting` 43 (need 50) |
| `ideal-gas-law-calculator` | `highImpactActions` 4 (need ≤3) |

**Closed.** `probability` and `simple-harmonic-motion` both went from 3/7 targeted phrasings to 7/7
by saying in the meta description what the simulation actually models: "dice", "odds",
"demonstration" and "experiment" for one, "SHM", "spring oscillation" and Hooke's law for the other.
`ideal-gas-law` needed three entities its guide never named ("gas laws", "kinetic theory", "gas law
simulator") plus a mistake heading that stated the answer instead of only the misconception:
"Thinking pressure comes from the gas weight" became "…, not particle collisions". All 14 sims pass.

**A checker bug surfaced doing it, and it mattered more than the content.** `targets()` normalized
apostrophes on the query side only: `queryWords` splits on `/[^a-z0-9]+/`, so someone typing
"hookes law" or "boyles law" arrives without one, while the page slots kept theirs. A page correctly
writing "Hooke's law" could therefore never match, and the apparent fix was to misspell the prose.
Both sides now drop apostrophes before comparing. This is the same asymmetry as finding 3 of the
2026-08-04 audit, which fixed the query side and left the slots alone.

### 2. Twelve pairs of identical FAQ answers, across nine tools

`npm run check:duplication` reports 33 near-duplicate pairs, **12 of them at 100%**:

- `faq-6` is byte-identical across `ideal-gas-law`, `momentum-collision`, `inclined-plane`,
  `doppler-effect` and `simple-harmonic-motion`, with `frequency-period` and `ohms-law` also in the
  cluster.
- `faq-5` is byte-identical between `age-calculator` and `date-difference-calculator`.

This is the one item on the list that **nothing gates**: `check:duplication` is WARN-only and is not
part of `npm run verify`. Identical answers across pages are the definition of the mass-produced
content Google collapses, and these are sibling tools competing for adjacent queries.

**Closed, by deleting the answer rather than rewriting it.** Every duplicate was the same boilerplate
privacy FAQ ("Does the simulator send my data anywhere?"), always the last item. Rewriting it 14
times would have produced 14 near-duplicates instead of 12 exact ones and taught a reader nothing:
**the claim is already on every tool page**, delivered better, by the `TrustNotice` badge in Zone B
with a tooltip. So it was removed from all 14 simulations and from `age-calculator` and
`date-difference-calculator`.

Worth noting what the 100% threshold hid: six more sims carried the same answer *individually
reworded* ("Does the simulator upload anything?", "Does the lab upload anything or need an
account?"), so they scored below 100% and never appeared in the report. They were the same redundancy
and were removed too. **33 near-duplicate pairs fell to 8, and nothing now sits above 79%.**

### 3. Seventy-seven untargeted phrasings, concentrated in ~40 tools

Down from 89. The worst, at four missing phrasings each: `simple-harmonic-motion-calculator`,
`px-to-dp-converter`, `probability-calculator`, `ideal-gas-law-calculator`,
`color-contrast-checker`. `npm run check:queries -- --report` is the per-tool brief.

### 4. `methodology` is populated on 7 of ~47 eligible tools

The field and its Zone B row shipped with the 7 wellness calculators. Still bare, and all of them
implement something nameable:

| engine | populated |
|---|---|
| physics | 0 / 11 |
| finance | 0 / 8 |
| calculator | 0 / 7 |
| wellness | 7 / 11 |
| math, math-lab, units | 0 / 3 each |
| color | 0 / 2 |

### 5. Craft: 5 of 107

Unchanged. The gate tolerates roughly one more craftless tool.

### 6. Knowledge overlay warnings: 61, plus 17 orphan guide nodes

The build prints them and does not fail: 19 tools have no `usedWith` or `nextSteps`, and 42 have
related tools drawn from a single family. Separately, 17 guide nodes sit in the knowledge graph with
no edge at all (`guide:word-counter`, `guide:jwt-decoder`, `guide:trim-text` and 14 more).

### Where the work concentrates

`simple-harmonic-motion-calculator`, `probability-calculator` and `ideal-gas-law-calculator` appear
in items 1, 2, 3 **and** 4. Three tools carry a failing gate, duplicated answers, the most missing
phrasings, and no method line. They are the obvious first batch, and fixing them moves four measures
at once.

## Done condition for this change

`npm run verify` exits 0, plus these specific assertions:

1. Zero non-ISO `datePublished`/`dateModified` in `dist/` — down from 204 across 102 pages.
2. All 121 guides still render `Updated <Mon YYYY>` to the visitor, including the 19 that previously
   showed a raw ISO date.
3. 121 tool pages carry `dateModified`, up from 0.
4. Every `:hover` rule on a control class in `tool-widget.css` has an `:active` partner.
5. `check:budget` still green: the additions are two JSON properties, one attribute and a CSS block.
6. `check:queries` targeting unchanged, since no title, H1, H2 or meta description is touched.

Version: **patch**. This is a platform, layout and schema fix. No tool gains or loses a widget, an
engine processor, or a word of authored content, and the visible text is unchanged everywhere except
the 19 guides that were rendering a raw ISO date at a visitor.
