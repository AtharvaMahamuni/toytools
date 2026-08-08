# Tool Identity Architecture: implementation plan (2026-08-08)

Step by step execution of the design phase analysed in
`docs/analysis/2026-08-08-tool-identity-architecture.md`. Read that first: this document assumes
its findings (F1 to F9), its tensions (T1 to T6) and its design decisions (D1 to D12) without
restating the reasoning.

Scope: **no URL changes, no slug changes, no redirect stubs, no widget behaviour changes, no new
tokens.** Almost all of the work lands in shared platform files. The per tool work is content, and
it is optional per tool because every new field falls back.

---

## 0. Ground rules for this phase

1. **`npm run verify` is the done condition** for every phase, not `build` plus `test`. The Stop
   hook enforces it. A phase is not finished when the page looks right.
2. **Every phase ends green and shippable.** No phase depends on a later phase to restore a gate.
3. **Ratchets tighten in the same commit as the improvement that earns it.** Never loosen one.
   If a phase would drop `targeting` or `retrieval`, the phase is wrong, not the floor.
4. **Byte budgets are checked per phase.** `npm run check:budget` after each. Removals pay for
   additions (T5). Raising a `BUDGETS` number is not available.
5. **No em-dashes** in any authored content, commit message or doc.
6. **One version bump for the whole phase**, at the end, with the `CHANGELOG.md` entry written by
   hand. Per the versioning table this is a **minor** bump (it modifies existing tools), unless a
   category or engine is added, which it is not.
7. **Branch:** `tool-identity-architecture`, rebased on `origin/main`.

---

## 1. Phase map

| # | phase | files touched | risk | gate it moves |
|---|---|---|---|---|
| 0 | Instrumentation: the fold ratchet and the H2 report | 2 new, 1 edited | none (measures only) | establishes baseline |
| 1 | Install sheet stops being an `<h2>` | 1 | low | H2 furniture 119 to 0 on one axis |
| 2 | Zone A: the tool header rebuild | 2 edited, 1 new | medium (geometry) | fold ratchet |
| 3 | `tagline` field and the two field split | 3 edited | low | protects `targeting` |
| 4 | Zone B: the trust and attribution line | 2 edited | low | none |
| 5 | Zone C: knowledge drawers with real H2s | 2 new, 1 edited | medium (bytes, content) | raises `targeting` floor |
| 6 | Discovery leaves the widget | 34 edited | low but wide | architecture rule |
| 7 | Reading Mode identity for guides | 1 edited | low | none |
| 8 | Content pass: taglines and thin knowledge | up to 119 | none technically | `seo:gate` |
| 9 | Alignment: docs, skills, agents | 7 | none | future drift |
| 10 | Version bump and changelog | 2 | none | release |

Phases 0 to 7 are the platform work and can land as one PR of ten commits, or as three PRs
(0 to 2, 3 to 6, 7 to 10). Phase 8 is per tool and parallelisable across `content-writer` agents.

---

## 2. Phase 0: instrumentation first

Nothing is changed. This phase exists so that every later phase has a number to move, and so a
regression in 2027 fails a build rather than being noticed by a person.

### 0.1 `tests/e2e/fold.spec.ts` (new)

Registry driven, Pixel 5 project only (skip on desktop, where the geometry is already healthy).
For every tool in `src/data/registry.ts`:

- navigate to the tool URL
- locate the first visible `textarea`, `input:not([type=hidden])`, `select` or `button` positioned
  at or below the bottom of `.tool-header`
- assert `top < FOLD_LIMIT * viewportHeight`

```ts
// Records what the catalog achieves today. Same discipline as THRESHOLDS in
// scripts/check-query-coverage.ts and BUDGETS in scripts/check-budget.ts:
// this number only ever goes DOWN, in the same commit as the change that earns it.
const FOLD_LIMIT = 1.40;   // phase 0 baseline: worst measured is password-generator at 1.39
```

Tighten in later phases: **0.55 after phase 2, 0.45 after phase 4.** Each tightening is a one line
diff in the same commit as the change that makes it pass.

Record in the spec's header comment the measured baseline table from the analysis doc (section 1.2),
so the next maintainer can see what moved.

### 0.2 H2 quality report in `scripts/check-query-coverage.ts` (edit)

The script already parses every built page's `<h2>` for targeting (`slotsFor`). Add a third
reported section, initially report only:

- for each tool, the set of H2s with the known furniture strings removed
  (`Add to Home Screen`, `Common Questions`, `Install app`)
- report the count of tools whose remaining set is empty

Add to `THRESHOLDS` a fourth floor, set to today's value so it cannot get worse:

```ts
/**
 * Share of tool pages carrying at least one H2 that names a concept rather than a page part.
 * 2026-08-08: measured 29.4% (35/119). Furniture H2s ("Add to Home Screen", "Common Questions")
 * do not count: they are on every page and discriminate nothing.
 */
conceptHeadings: 0.29,
```

Raise it to 1.0 after phase 5, where every tool gains three concept H2s by construction.

### 0.3 Done condition

`npm run verify` green with the new spec passing at its loose baseline, and
`npm run check:queries -- --report` printing the H2 section. No visual change.

---

## 3. Phase 1: the install sheet stops being a heading

**File:** `src/tools/_shared/InstallButton.astro`

The install sheet is a `role="dialog"` present in the DOM of all 119 tool pages, and its title is an
`<h2 id="tt-install-sheet-title">Add to Home Screen</h2>`. It is referenced by `aria-labelledby`.

Change the element to a `<p class="tt-install-title" id="tt-install-sheet-title">`, keeping the id
and therefore the accessible name. Move the heading's visual weight into the class (the sheet
already has its own styles).

Why first: it is a one line change that removes a furniture H2 from every page in the catalog, and
it makes the phase 0 report immediately meaningful.

**Done condition:** `npm run verify`; `npm run check:queries` shows `targeting` unchanged or better
(the string contributed nothing discriminating, so it should be exactly unchanged);
`tests/e2e/a11y.spec.ts` green (the dialog keeps its accessible name).

---

## 4. Phase 2: Zone A, the tool header rebuild

The core of the phase. One file does most of the work.

**Files:**
- `src/layouts/ToolLayout.astro` (rewrite of the header block and its styles)
- `src/components/tool/ToolIdentity.astro` (new)
- `src/components/tool/ToolPage.astro` (no change yet)

### 4.1 `ToolIdentity.astro` (new)

Renders the title row per D2, D3 and D4:

```
[icon 28/32px]  Base64 Encoder & Decoder            [☆]
                Encode and decode Base64 in your browser.
```

- Icon: `<img src={withBase(`/icons/tool/${tool.slug}.svg`)} width="32" height="32" alt="" />`,
  `alt=""` because the name is right beside it. The SVG endpoint already exists
  (`src/pages/icons/tool/[slug].svg.ts`); no new assets.
- `<h1>` at `--text-2xl`, `--font-weight-semibold`, `min-width: 0` so long names wrap rather than
  push the star off the row.
- `FavoriteButton` keeps its place at the end of the title row (it was put there deliberately to
  save a 48px row on the health calculators; that reasoning is unchanged and stronger now).
- Tagline `<p class="tool-tagline">` at `--text-base`, `--color-text-muted`, **no `min-height`**.

Set the icon to `loading="eager"` and give it explicit width and height so it cannot cause layout
shift. It is an SVG endpoint, so it is a separate request: confirm in phase 2's budget run that it
does not push a page over. If it does, inline the SVG at build time instead of linking it.

### 4.2 `ToolLayout.astro` (edit)

- Replace the `.tool-header` block with `<ToolIdentity tool={tool} />`.
- **Remove `border-bottom` from `.tool-header`** (D5, F5). Zone A ends in space.
- Reduce the separation below the identity block from `space-8` + `space-8` (64px) to a single
  `margin-bottom: var(--space-5)` (20px).
- **Move `TrustNotice` and `InstallButton` out of Zone A**; they are rendered by phase 4's Zone B
  component below the widget. In this phase, temporarily render them immediately after the `<slot />`
  so nothing disappears between phases.
- Remove the desktop `min-height: 2lh` reservation on the description. The pointer stability
  argument it was written for is real, but it was solving for a two line description that 57% of
  the catalog does not have (F6), and phase 3's tagline gives a genuine one line invariant instead.

### 4.3 Expected geometry after phase 2

On `base64-encoder-decoder`, Pixel 5, the header block should fall from 297px to roughly 110 to 130px:
title row about 40px, tagline about 24px, 20px of separation. First control moves from 541px to
roughly 360 to 380px, which is 50% to 52% of the fold.

Tighten `FOLD_LIMIT` to **0.55** in this commit.

### 4.4 Done condition

`npm run verify` green, including `tests/e2e/health.spec.ts` (whose above the fold assertion gets
easier) and `fold.spec.ts` at 0.55. `npm run check:budget` shows no page increased.
Visual check on a real phone and in the installed PWA, per the mobile rules in `CLAUDE.md`.

---

## 5. Phase 3: `tagline` and `description` become two fields

This exists because of F7: `description` is the page's `<meta name="description">` and one of the
four targeting slots, so shortening it for visual reasons costs SEO across 119 pages.

**Files:**
- `src/data/types.ts` (add the field)
- `src/components/tool/ToolIdentity.astro` (consume it)
- `scripts/validate-registry.ts` (validate it)

### 5.1 The field

```ts
/**
 * Short on-page line under the tool's title. 40 to 80 characters, one line on a 393px phone.
 *
 * Deliberately separate from `description`: that one is the page's <meta name="description">
 * and one of the four slots scripts/check-query-coverage.ts scores targeting against, so it
 * must stay long enough to carry the tool's query vocabulary. Falls back to `description`
 * when absent, so adding this per tool is optional and incremental.
 */
tagline?: string;
```

### 5.2 Validation

In `validate-registry.ts`, warn (do not fail) when `tagline` is present and over 80 characters, and
warn when it is absent and `description` exceeds 80, since that tool will render a multi line
tagline. Warnings, not errors: 94 tools would fail on day one and the fix is content work, not a
wiring mistake. Convert to an error at the end of phase 8 once the backlog is cleared.

### 5.3 Done condition

`npm run verify` green. `npm run check:queries` shows `targeting` **unchanged**, which is the whole
point of the split: confirm the meta description did not move.

---

## 6. Phase 4: Zone B, one line of trust and attribution

**Files:**
- `src/components/tool/ToolSignature.astro` (new)
- `src/layouts/ToolLayout.astro` (render it after the slot)

### 6.1 The component

One flex row below the widget, wrapping to two lines on small phones:

```
Private ● Runs entirely in your browser        [Install app]      POWERED BY TOYTOOLS ●
```

- Left: the existing `TrustNotice` component unchanged, including its tap tooltip.
- Middle: `InstallButton`, still mobile only, still controlled by CSS classes and never the
  `hidden` attribute (that rule is in `CLAUDE.md` and holds).
- Right: `.tool-attribution`, `--text-xs`, uppercase, `letter-spacing: 0.06em`,
  `--color-text-muted`, ending in the existing `.gold-dot`. Links to `/` (the brand's only job in
  Zone B is to be clickable if someone wants the ecosystem).

Wording per open decision 2 in the analysis doc; default to `POWERED BY TOYTOOLS ●`.

### 6.2 Nav quieting (open decision 1)

If the call is yes: in `src/components/Nav.astro`, drop `.nav-logo` from `--text-lg` bold to
`--text-base` medium, and move `.nav-version` to `src/components/Footer.astro` (which already
renders the version). Keep the changelog link. Keep the search palette and the theme toggle exactly
as they are (T1).

### 6.3 Done condition

`npm run verify`, `fold.spec.ts` tightened to **0.45**. Confirm on Pixel 5 that Zone B is one line
at 393px and does not introduce horizontal scroll.

---

## 7. Phase 5: Zone C, knowledge drawers

The phase that turns a visual change into a measurable ranking change (T3, D7).

**Files:**
- `src/components/tool/KnowledgeDrawers.astro` (new)
- `src/components/tool/ToolPage.astro` (render it, replace the bare FAQ section)
- `src/lib/knowledge/registry.ts` (read only; already exports `KNOWLEDGE_ENTRIES`)

### 7.1 Markup contract

Each drawer, in order, rendered only when its source array is non empty:

```astro
<details class="kd">
  <summary class="kd-summary">
    <h2 class="kd-heading">What people use Base64 encoding for</h2>
  </summary>
  <ul class="kd-body">…</ul>
</details>
```

The `<h2>` **inside** the `<summary>` is the load bearing detail. It is valid HTML, it keeps the
disclosure semantics, and it puts a concept bearing heading into the four slot targeting haystack
while the content stays collapsed.

Drawer inventory and sources:

| drawer | heading pattern | source |
|---|---|---|
| 1 | `What people use {primaryConcept} for` | `knowledge.realWorldUseCases` |
| 2 | `Where {primaryConcept} goes wrong` | `knowledge.commonMistakes` |
| 3 | `{primaryConcept} questions` | `faqsByToolSlug[slug]`, rendered through the existing `FaqAccordion` inside the drawer body |

`{primaryConcept}` comes from `knowledge.primaryConcepts[0]`, falling back to `tool.name`. This is
what makes the headings discriminating without hand authoring 119 of them: the concept vocabulary is
already the thing the knowledge layer exists to hold.

Below the drawers, uncollapsed, one line each: the guide link (existing `ToolNavRow` teaser), the
related strip, the category link (`CategoryDiscovery`, arriving in phase 6), and `FeedbackLink`.

### 7.2 The `#faq` anchor must survive

`ToolNavRow` links to `#faq`, and `src/data/faq-redirects.ts` turns every retired `/faq/...` URL
into a noindex stub pointing at the tool page's `#faq`. Those are previously indexed URLs. Put
`id="faq"` on drawer 3, and add `open` to it when the URL hash is `#faq` via a three line inline
script, so arriving from a redirect stub lands on open content rather than a closed drawer.

Cover it in `tests/e2e/pages.spec.ts`.

### 7.3 Byte budget

This adds markup to all 119 pages. Mitigations, in order of preference:

1. The FAQ markup **moves** rather than duplicates (net zero).
2. Cap drawers 1 and 2 at 5 items each; a knowledge file with 9 use cases renders 5 and the guide
   carries the rest.
3. If a page still exceeds, the cause is that page's widget, not the drawers. Fix the cause.

Run `npm run check:budget` before and after and record the delta on `json-tree-viewer` (the worst
page at 54.6 KB) in the PR.

### 7.4 Ratchets

After this phase every tool has three concept H2s. In the same commit:

- raise `conceptHeadings` to **1.0**
- re-run `npm run check:queries` and raise `targeting` to the newly measured value

Do not guess the new `targeting` number. Measure it, then write it.

### 7.5 Done condition

`npm run verify` green with both floors raised, `check:budget` showing no regression, and
`npm run seo:gate -- <slug>` still passing on a sample across five engines (the gate reads
`queryTargeting` from `seo-engine/cache/query-coverage.json`, which `check:queries` rewrites).

---

## 8. Phase 6: discovery leaves the widget

**Files:** 33 widget files plus `ToolPage.astro`.

1. Remove the `CategoryDiscovery` import and usage from all 13 shared widgets in
   `src/tools/_shared/` and the 20 bespoke widgets that import it.
2. Render it once, in `ToolPage.astro`, at the bottom of Zone C.
3. Add a rule to `scripts/validate-architecture.ts`: **no file under `src/tools/` may import
   `CategoryDiscovery`.** Without the validator this un-fixes itself the first time someone copies
   an existing widget as a template.

Sims render through `SimulationWidget`, which is in the shared set, so they are covered by the same
move.

**Done condition:** `npm run verify`, `tests/e2e/discovery.spec.ts` green,
`npm run check:budget` (expect a small improvement on the pages whose widget CSS shrinks), and
`grep -rl CategoryDiscovery src/tools/` returning nothing.

---

## 9. Phase 7: Reading Mode identity for guides

**File:** `src/layouts/GuideLayout.astro`

Add an eyebrow above the h1 (D10), in the same micro label voice:

```
TOYTOOLS ● GUIDE
How Base64 Encoding Works
```

The guide h1 keeps its current large size. The tool h1 is now `--text-2xl`. That size delta plus the
eyebrow is the entire Tool Mode versus Reading Mode signal, and it costs one element and no tokens.

Do **not** add an eyebrow to tool pages. Its absence is the signal.

**Done condition:** `npm run verify`. Confirm `npm run check:queries` is unchanged (the eyebrow is
not a heading and must not be one).

---

## 10. Phase 8: the per tool content pass

This is the only part of the phase that touches individual tools, and none of it is blocking:
every field falls back.

### 10.1 Inventory

| work item | tools affected | source |
|---|---|---|
| Author a `tagline` (40 to 80 chars) | 94 of 119 have a description over 80 chars | measured |
| Descriptions over the stated 110 ceiling, worth a rewrite for the meta slot too | 68 of 119 | measured |
| `realWorldUseCases` thin or generic, now visible | audit needed | `knowledge.ts` |
| `commonMistakes` thin or generic, now visible | audit needed | `knowledge.ts` |

The knowledge fields have been authored for a build validator, not for a reader (F3). Some of them
will read as filler once they are on screen. That is the expected cost of making dead content live,
and it is worth doing per category rather than per tool so the voice is consistent within a cluster.

### 10.2 Batching

Work category by category, largest first, one `content-writer` agent per slug, spawned in parallel
within a category. Suggested order by tool count: text (27 across analysis, processor and
interactive), health (14), developer utilities (22 across encoding, hashing, structured data, jwt),
finance (8), the rest.

Per tool the agent's brief is:

1. `npm run seo:status -- <slug>` first, always.
2. Write `tagline`: 40 to 80 characters, says what the tool does, no marketing adjectives, no
   em-dash.
3. Read `realWorldUseCases` and `commonMistakes` as if seeing them on the page for the first time.
   Rewrite anything that reads as generated. 3 to 5 entries each, specific, one sentence.
4. `npm run seo:gate -- <slug>` must exit 0.

### 10.3 Done condition

`npm run check:queries` shows `targeting` at or above the floor raised in phase 5, and the
`validate-registry` tagline warning count reaches zero, at which point convert it to an error.

---

## 11. Phase 9: making it stick

The analysis found three sources of design truth that disagree (F8). A design phase that does not
fix that will be re-litigated by the next agent that builds a tool.

| file | change |
|---|---|
| `.claude/skills/ui-design-system.md` | **Rewrite.** It currently says "Grayscale base, single accent" and "design for 375px", both wrong. Make it own the design language only: the three zone page grammar (D1), the typographic hierarchy (D3), the one hairline rule (D5), the micro label voice, the token table, the mobile rules. Defer engine and widget architecture to `ARCHITECTURE.md` with a pointer. Add the fold ratchet as a stated invariant. |
| `ARCHITECTURE.md` to "Design Language" | Add the Zone A / B / C grammar with its closed inventory, the tool h1 versus guide h1 rule, and the corrected section boundary statement (the tool header no longer owns a `border-bottom`, so the recipe is now true everywhere it claims to be). |
| `ARCHITECTURE.md` to "Tool-page guide/FAQ surface" | Rewrite for Zone C: drawers, the `<h2>` inside `<summary>` contract, the `#faq` anchor obligation, and where knowledge fields now render. |
| `CLAUDE.md` | Add the fold ratchet to the gates list beside the byte budget and query coverage. Add `tagline` to the tool directory anatomy. Note that `CategoryDiscovery` is platform-rendered and forbidden in widgets. |
| `.claude/skills/add-tool/SKILL.md` | Add `tagline` to the checklist. State that a new widget renders the tool UI only: no discovery, no trust, no install, no attribution. Point at the fold ratchet as a done condition. |
| `.claude/agents/tool-builder.md` | Same three points, plus: `fold.spec.ts` is part of the definition of a finished tool. |
| `.claude/agents/content-writer.md` | `realWorldUseCases` and `commonMistakes` are now **rendered content**, not metadata. Raise the bar accordingly and add `tagline` to its remit. |
| `.claude/agents/site-auditor.md` | Add the fold measurement and the H2 concept report to the sweep. |
| `.claude/skills/seo-content/SKILL.md` | Note that concept H2s now come from `knowledge.primaryConcepts[0]`, so that field is load bearing for targeting and is worth getting right. |

The rule to write into all of them, because it is the one sentence version of this phase:

> The widget renders the tool. The platform renders everything that is not the tool. A widget that
> knows about the catalog, the brand, installation or trust is a layering error.

---

## 12. Phase 10: release

1. `npm run version:bump minor "Tool identity architecture: tool-first page grammar"`
   (minor per the versioning table: this modifies existing tools; no category or engine is added).
2. Write the `CHANGELOG.md` entry by hand, at the top, matching the version the bump printed.
   Write it for a visitor and the next maintainer: what changed on the page, what moved, what is
   now enforced. Not a file diff.
3. `npm run verify` one final time.

---

## 13. Verification matrix

What each phase must prove before the next begins.

| phase | `npm run verify` | `check:budget` | `check:queries` | fold spec | manual |
|---|---|---|---|---|---|
| 0 | green | unchanged | report added | baseline 1.40 | none |
| 1 | green | unchanged | `targeting` unchanged | 1.40 | a11y sheet name |
| 2 | green | no increase | unchanged | **0.55** | real phone, installed PWA |
| 3 | green | unchanged | `targeting` unchanged | 0.55 | none |
| 4 | green | no increase | unchanged | **0.45** | 393px, no h-scroll |
| 5 | green | delta recorded | **floors raised** | 0.45 | `#faq` from a redirect stub |
| 6 | green | improvement expected | unchanged | 0.45 | none |
| 7 | green | unchanged | unchanged | 0.45 | guide reads as Reading Mode |
| 8 | green | unchanged | at or above floor | 0.45 | `seo:gate` per slug |

---

## 14. Risks

| risk | likelihood | mitigation |
|---|---|---|
| Zone C markup pushes a page over its byte budget | medium | FAQ moves rather than duplicates; cap drawers at 5 items; measure before and after; never raise `BUDGETS` |
| The tool icon SVG adds a request that hurts the critical path | medium | explicit dimensions and `eager`; if it costs, inline the SVG at build time |
| `targeting` drops because descriptions were shortened | low, and designed against | phase 3 exists precisely for this; phase 2 does not touch `description` |
| `health.spec.ts` fold assertions break | low | the header shrinks, so the assertion gets easier; re-run on every phase |
| Removing `CategoryDiscovery` from 33 widgets misses one, or it creeps back | medium | a `validate-architecture` rule, not a code review |
| `<h2>` inside `<summary>` reads oddly to a screen reader | low | it is valid and common; verify in `a11y.spec.ts`, and keep the disclosure semantics intact |
| Knowledge content reads as filler once visible | **high** | this is the real cost of phase 5; phase 8 is the answer and should not be skipped |
| The phase drifts back over 500 more tools | high without ratchets | the fold spec and `conceptHeadings` floor are the entire defence |

---

## 15. Explicitly out of scope

- Any URL, slug, category or segment change.
- Per tool colour themes, typefaces or hand authored marks.
- Inlining guide content into tool pages.
- Removing the nav or the search palette.
- A dialog based FAQ.
- New design tokens of any kind.
- Localisation. The `/{lang}/` stubs were deleted on 2026-08-03 and stay deleted.
- Any claim about ranking improvements. The proxy this phase moves is `targeting`; the ranking
  effect is a hypothesis to check against Search Console data later, alongside the 2026-08-04
  cluster work.

---

## 16. Outcome

To be written when the phase lands, per the convention in `docs/analysis/`: the measured before and
after for the fold positions, the H2 inventory, `targeting`, and the byte budget deltas.
