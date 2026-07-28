# Health & Fitness UI Plan

**Date:** 2026-07-28
**Baseline:** 109 tools total, 9 in `health-fitness` (6 wellness calculators, 3 trackers).
**Scope:** UI, storage durability, and discovery for the `health-fitness` category. Three of the
seven workstreams are platform-level and benefit every engine.

---

## 1. Current state

### What works

`TrackerWidget.astro` is the strongest health UI on the site: progress ring, tap-to-log, day
streak, longest streak, and an inline SVG chart from `src/lib/engines/tracker/viz.ts` (bars, line,
progress ring). The viz module is pure, DOM-free, deterministic, unit-tested, and themed through
CSS classes rather than hard-coded fills. Tracker records are a clean `{date, value}` log with
everything else derived (`src/lib/engines/tracker/model.ts`).

The wellness engine is architecturally sound. A calculator returns a full `InteractiveResult`:
hero, metrics, insights, milestones, assumptions, explanation, next questions, decisions.

### What does not

The calculator UI discards most of that richness, and the storage layer has no durability story.

| Gap | Evidence |
| --- | --- |
| Calculators render zero graphics | All 6 declare only `capabilities: { loadExample: true }`; `visualization` defaults false (`src/lib/results/types.ts:160`) and `ExperienceRenderer.astro:51` is a placeholder heading with no renderer behind it |
| Users retype their body 4x | height in 4 tools, units in 4, sex in 3, weight in 3, age in 2; state is per-slug (`WellnessWidget.astro:149`) |
| Macro is a dead end | `macro.ts` asks for `calories`, which is TDEE's output; the link exists, the number does not travel |
| Calculators keep no history | `WellnessWidget.astro:143` saves `{fields}` only; every recalculation overwrites |
| Quota failures are silent | `TT.state.save` (`ToyToolsRuntime.astro:183`) is `try { setItem } catch (_) {}` and skips the 50 KB cap `TT.storage.set` enforces |
| No export on the one engine with irreplaceable data | Converter, CSV, Generator, TextProcessor, StructuredData all wire a download; `TrackerWidget` offers only "Clear all history" (:111) while promising "Never leaves your device" (:28) |
| No migration path | `TT.state.VERSION` is 1 and `load` returns `null` on mismatch, so a schema change wipes user history |
| Browser eviction unhandled | `navigator.storage.persist()` is never called; Safari caps script-writable storage after a week without first-party interaction |
| Result panel is a wall on mobile | `DEFAULT_LAYOUT` renders 11 sections; only timeline and assumptions use `<details>` |
| Inputs fight the content | 2-to-3-option selects render as native dropdowns; bounded human ranges (age, height, weight) have no slider |
| Category reads as taxonomy | `category-sections.ts:36` labels the groups "Calculators" and "Trackers & Logs" |

---

## 2. Storage tiers (reference)

All in `src/components/ToyToolsRuntime.astro`.

| API | Backing | Key | Cap | Used by |
| --- | --- | --- | --- | --- |
| `ToyTools.storage` (:162) | localStorage | caller's | 50 KB on write | raw string needs |
| `ToyTools.state` (:179) | localStorage | `toytools:{slug}` | none | every tool's saved input |
| `ToyTools.prefs` (:203) | localStorage | `toytools:prefs` | none | cross-tool UI prefs |
| `ToyTools.history` (:224) | sessionStorage | `toytools:hist:{key}` | 5 items | ConverterWidget only |
| `ToyTools.recordRecent` (:249) | localStorage | `toytools:recent-tools` | 10 | recents |

**IndexedDB is rejected.** A decade of daily entries across all three trackers is roughly 300 KB
against a 5 MB localStorage budget, and every read happens once on page load. Async storage buys
nothing here and costs a lot against the "no imports inside `is:inline`" rule. Revisit only if
photo or meal logging is ever added.

---

## 3. Workstreams

Ordered by dependency. Each is one fully-ready PR with stepwise commits, engine-first (reusable
core on the `ToyTools` global, then thin UI over it).

### PR 1: Visualization renderer + BMI vertical slice (platform)

Closes the dead `visualization` seam. Ships one calculator end to end so the seam is proven rather
than merely present.

- `src/lib/visualization/render.ts`: pure `VizSpec -> SVG string` functions, mirroring
  `tracker/viz.ts` conventions (fixed viewBox, `width="100%"`, `class="viz"` theming, escaped
  labels, rounded coordinates for deterministic output).
- Add a `band` kind to `VizKind` in `src/lib/visualization/types.ts`: a value marker on a segmented
  scale, plus a `bandSpec()` builder alongside the existing `lineSpec`/`progressSpec`/`partsSpec`.
- `src/lib/visualization/render.test.ts`: deterministic string assertions per kind, including
  degenerate input (empty parts, single band, value outside range).
- `src/lib/experience/render.ts:209`: replace the capability gate stub with real injection.
- `ExperienceRenderer.astro:51`: swap `experience-placeholder` for a live mount node.
- `src/styles/tool-widget.css`: `.viz-band`, `.viz-marker`, `.viz-segment` tokens-only styling,
  light and dark verified.
- `bmi.ts`: declare `visualization: true`, emit a band spec.

**Done when:** `npm run build` and `npm run test` green, `npm run test:e2e` green on desktop and
Pixel 5, BMI renders the band in both themes.

### PR 2: Remaining five calculators

Pure data changes on top of PR 1, roughly 15 lines each. Parallelisable one agent per calculator,
though a single PR is likely cheaper to review.

| Tool | Kind | Shows |
| --- | --- | --- |
| body-fat | band | Marker on essential / athletic / fit / average / obese |
| ideal-weight | band | Four formula estimates as one range instead of four rows |
| tdee | stacked | BMR vs activity burn, with deficit and surplus targets |
| macro | distribution | Protein / carb / fat split with gram labels |
| heart-rate-zones | bars | Five zones as an intensity ladder |

**Done when:** build, unit, e2e green; `npm run seo:gate -- <slug>` still passes for all six.

### PR 3: Storage durability (platform)

- `TT.state.save`: route through the size cap, and surface a toast on write failure instead of
  swallowing it.
- `TT.state.load`: run registered migrations instead of returning `null` on a version bump.
- New `ToyTools.data.export()` / `.import()`: dump and restore every `toytools:*` key as JSON,
  reusing the Blob and anchor pattern in `GeneratorWidget.astro:206-272`.
- Call `navigator.storage.persist()` on a tracker's first entry; use `navigator.storage.estimate()`
  to warn before the quota bites.
- Add an Export / Import row to `TrackerWidget` next to "Clear all history".

**Testing note:** the runtime is an `is:inline` script and cannot be unit tested. Coverage is e2e:
a spec that writes entries, exports, clears, imports, and asserts the log is restored.

**Done when:** e2e round-trip spec passes; a tracker survives export, clear, and import intact.

### PR 4: Shared body profile

- New key `toytools:profile:body` holding `{unit, sex, age, height, weight}`, deliberately separate
  from any tool's state so it survives a single tool's schema change and exports on its own.
- `WellnessWidget.astro`: prefill any field whose id matches a profile key, write back on change.
  Roughly 25 lines in one shared widget, zero per-tool changes.
- Visible affordance, never invisible magic: "Using your saved details (male, 30, 175 cm, 70 kg).
  Edit".
- `macro.ts`: prefill `calories` from the last TDEE result, labelled "From your TDEE: 2,340 kcal.
  Change".

**Depends on:** PR 3 for durable writes.
**Done when:** e2e spec walks BMI to TDEE to body fat entering details once; macro opens pre-filled
after a TDEE run.

### PR 5: Calculator snapshots, delta, sparkline

- Extend the wellness envelope from `{fields}` to `{fields, history: [{ts, inputs, hero, raw}]}`,
  capped at 50 entries, appended only when the result changes and at most once per day. A BMI
  snapshot is about 60 bytes, so the cap costs roughly 3 KB.
- Result panel gains a delta line: "BMI 24.1, down 0.4 from your last check."
- Sparkline of the stored history via the PR 1 renderer.
- Prune tracker entries at 2 years or 1000 entries, rolling the oldest into monthly aggregates.

**Depends on:** PR 1 (renderer) and PR 3 (storage).
**Done when:** a second visit with changed inputs shows the delta; history survives a reload.

### PR 6: Segmented and slider field types (platform)

- Add `segmented` and `slider` to `SmartFieldType` (`src/lib/inputs/field.ts:5`).
- Render both in `SmartInput.astro`, behaviour in `smartInput.client.ts`.
- Apply across wellness fields: units / sex / diet / method become segmented; age / height / weight
  gain a slider paired with the number; activity becomes a stacked radio list so all five prose
  labels are readable at once.
- Every engine inherits these, so this is not a health-only change.

**Done when:** touch targets meet `var(--touch-target)`; keyboard and screen-reader paths verified;
e2e green on Pixel 5.

### PR 7: Result layout and category framing

- Per-calculator `layout` overrides (already supported as data, `WellnessCalculator.layout`) to
  collapse `explanation` and `nextQuestions` behind disclosure. No renderer change.
- Category sections: `category-sections.ts` keys on `pattern`, and health has only two
  (`health-calculate`, `health-track`). The intended measure / plan / keep-it-up split does not fall
  out of that.
  - **Default (cheap):** relabel the two existing sections into intent language.
  - **Richer (deferred):** teach `CategoryToolList` to subsection by `family`. The families already
    encode the split (body-composition, energy, nutrition, cardio, measurement, habit), so this is a
    platform change with no registry churn. Adding a third pattern is the wrong lever and is
    explicitly not proposed.

**Done when:** build green; category page reads as a journey.

---

## 4. Sequencing

```
PR1 (viz platform + bmi) ─┬─> PR2 (5 calculators)
                          └─────────────┐
PR3 (storage durability) ──> PR4 (profile) ─> PR5 (snapshots + delta + sparkline)
PR6 (input types)          independent
PR7 (layout + category)    independent, cheapest
```

PR 1 and PR 3 are the two roots and can run in parallel. PR 6 and PR 7 can be picked up any time.

## 5. What does not change

Not a redesign. "Warm Paper & Ink" palette and the single `--color-accent` retheme point stay.
Charts are inline SVG from pure functions with theme-aware CSS classes, exactly as
`tracker/viz.ts` already works, so no new dependency, no canvas, no client framework, and both
themes work by construction. Every chart stays paired with the text values it draws, so screen
readers and copy-to-clipboard lose nothing. `ToolSplit`, sticky output, and the 1100px content
width are untouched.

## 6. Open questions

1. PR 7 default (relabel two sections) or the deferred family subsectioning?
2. Snapshot cap of 50 and tracker prune at 2 years: confirm or adjust.
3. Should export cover all `toytools:*` keys, or trackers and profile only?
