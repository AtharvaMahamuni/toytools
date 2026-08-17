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

### B1. 55 of 121 tool titles are truncated in the SERP

p50 60 characters, p90 67, max 73, and **all 14 health tools** over. The discriminating words sit
after the cut, because the pattern is `Name: qualifier, qualifier ● ToyTools`.

**Why not now.** Every title is an editorial decision about which words earn the first 60
characters, and titles are one of the four slots `check:queries` scores `targeting` from. Shortening
55 of them can drop the targeting ratchet, so the batch has to be measured tool by tool with
`npm run check:queries` after each pass. That is a content batch with a gate in the loop, not a
mechanical edit. Do health first: 14 tools, worst affected, and the cluster that can least afford a
weak snippet.

### B2. 37 guides have two or fewer inbound internal links

Guides sit at a median of 5 inbound links against 13 for tool pages, 56 of 121 are at click depth 3,
and six have exactly one. The guide answers the informational query, which is the query class a young
domain can realistically win first.

**Why not now.** The fix is a change to the internal link graph, which means deciding where guide
links belong in the page grammar. That interacts with the fold ratchet and the three-zone rule, so
it is a design change with an e2e gate behind it, not a data fix.

## Tier C — programs and decisions, not fixes

Recorded with what each actually needs, so none of them silently becomes nobody's job.

| gap | what it needs | who |
|---|---|---|
| **Indexing data absent for 7 weeks.** `GSC_SA_KEY_JSON` was never set, so the weekly workflow has skipped its only real step since 2026-06-29. | Two repository secrets. `docs/indexing.md` has the setup. **Cannot be done from inside this repo.** | repo owner |
| **Every quality gate is self-referential.** `seo:gate` scores our prose against our rules; `check:queries` scores targeting against a corpus we wrote. Nothing compares a page to what ranks. | A `competitorCoverage` criterion fed by the existing `seo:research` stage, whose output is currently gitignored and read by no gate. Largest item on this list. | after the indexing data exists |
| **89 untargeted query phrasings, 114 that retrieve nothing.** Worst is `remove-line-breaks` at 1 of 7. | Content work. `npm run check:queries -- --report` is already the brief. | content batch |
| **Zero authority signal.** 0 of 121 tool pages carry an external citation or a named author, against 22 YMYL pages competing with the CDC and banks. | A strategy call: add real citations and authorship to health and finance, or accept those clusters are a slower game and spend the effort on text and developer. | decision |
| **75 of 121 tools have no demand evidence.** | RIE dataset authorship, which CLAUDE.md marks as never delegated to an agent. | judgment call |
| **Pixel 5 is not a PR gate.** `fold.spec.ts` skips off pixel5 and the PR job runs chromium only, so the fold ratchet never runs on a PR. | A decision: accept the speed tradeoff as documented, or add a pixel5 PR job. Now documented accurately either way. | decision |
| **Craft coverage is 5/107 against a 4.6% floor.** | The `tool-craft` backlog, one tool per run. | ongoing |

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
