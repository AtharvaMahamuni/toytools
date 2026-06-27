# Date & Time Engine - Phase F1 Technical Design

> **Status:** Design only. No engine, widget, or tool code ships in Phase F1. This document is the
> blueprint a future build phase follows. It deliberately mirrors the existing ToyTools
> engine-first conventions (see `ARCHITECTURE.md` → "Developer Engines" and "Text Processor
> System") so implementation requires no new platform patterns.

## Context

ToyTools today covers Text, Number, Developer, and Productivity categories, all built on an
engine-first, configuration-driven, static-first architecture: pure calculation libraries under
`src/lib/`, a never-throwing registry resolver per engine, one generic widget per engine, and one
config plus content (guide/FAQ/knowledge) file per tool. The next strategic category is **Date &
Time**, a cluster intended to eventually power **30 to 50 evergreen utilities** (age, date
difference, business days, durations, plus later scheduling, health, finance, and education
families).

The goal of this phase is not to ship pages. It is to design a **reusable Date Engine** plus the
configuration model and shared UI vocabulary so future tools are mostly *data*, not new code. Date
& Time should become one of ToyTools' highest-authority topical clusters, built once and extended
by configuration.

### Principles confirmed in review

- **One public entry point.** Widgets call only `ToyTools.runDateTool(calculationId, inputs)`. All
  primitives stay internal to the engine, the same contract as `runEncoding` and `runHash`. The UI
  can never bypass the registry, and internals can be refactored without touching widgets.
- **Phase 1 is pure deterministic date math.** No timers, no holidays, no timezone, no recurrence,
  no calendar or timeline visuals in the first implementation.
- **Recurrence is a separate domain.** `nextOccurrence` and recurrence rules are documented here
  but relocated to a future Scheduling Engine. The Date Engine answers questions about dates; the
  Scheduling Engine answers questions about repeating events.
- **Business days, Phase 1, are configurable weekends only.** Holiday datasets are a later
  extension.
- **Descriptors are small and colocated** with each tool (`<tool>/descriptor.ts`), not in one
  central file. Each `Widget.astro` imports its own descriptor; there is no central descriptor
  registry.
- **Primitives before tools.** The engine is organized around orthogonal primitive groups; every
  tool is a *composition* of them, captured in the Primitive Composition Matrix.

---

## How this maps to the existing architecture

Grounded in the current code so the design fits with zero framework drift:

- **Engine manifest** `src/data/engines.ts` declares each engine once in `engineDefs[]` as
  `{ id, name, category, patterns[], runtimeGlobal }`. `knownPatterns` and the validator's known
  engine/pattern sets derive from here. A new engine is one entry.
- **Engine lib shape** `src/lib/engines/<engine>/` is `types.ts`, a `registry.ts` with a
  `Record<string, Impl>` map plus a **never-throwing** `run*` resolver that wraps errors as
  `{ ok, output, error }`, per-impl files, and a colocated `*.test.ts`. Browser-only APIs stay
  inside methods so importing a registry under `tsx`/vitest is side-effect-free.
- **Runtime global** `src/components/ToyToolsRuntime.astro` has a deferred `<script>` that imports
  each resolver and attaches it to `window.ToyTools.*`, plus an `is:inline` script that provides
  `toast`/`copy`/`storage`/`state`/`onReady` immediately. Widgets that compute on load call
  `ToyTools.onReady(run)` so the first render waits for the deferred engine attach. A new engine is
  one import plus one `TT.x = run` line.
- **Generic widget per engine** `src/tools/_shared/*Widget.astro` reads `processorId` off config,
  calls the matching `ToyTools.*`, renders live on input, and persists via `ToyTools.state`. The
  per-tool `Widget.astro` is a 3-line wrapper. Widgets compose `ToolSplit` + `IoPanel` +
  `ToolActions`; `.io-*` styles live in `src/styles/tool-widget.css`. The **calculator** engine
  (`percentage-calculator`) is the precedent for heterogeneous-input tools: a hand-written widget,
  `HeroMetric` output, live recompute, two-click confirm clear, and `ToyTools.state` persistence.
- **Config schema** `src/data/types.ts` `ToolConfig` carries
  `slug/name/description/categorySlug/tags` plus `engine/pattern/family/processorId/relatedTools/
  guide`, an optional `primaryMetric { metric, label, formatter }`, `inputs[]`, `outputs[]`, and
  `toolGroup`.
- **Category** `src/data/categories.ts` is `{ slug, name, description, accent, segment }`;
  `toolCount` and `engines` derive from the registry. Current accents: text `#F97316`, number
  `#C89B3C`, developer `#6366F1`, productivity `#16A34A`.
- **Auto-generated surfaces** read the registry: sitemap and manifest (`src/lib/content/`),
  category sections (`src/data/category-sections.ts`), knowledge graph (`src/lib/knowledge/`),
  guides (`src/data/guide-registry.ts` + `src/pages/guide/[...slug].astro`), FAQs
  (`src/data/faq-registry.ts`), and the expansion roadmap
  (`src/lib/content-intelligence/taxonomy.ts`).
- **Validators** `scripts/validate-registry.ts` and `scripts/validate-knowledge.ts` enforce
  engine/pattern resolution, slug and URL uniqueness, guide registration, and knowledge
  `slug == tool slug` plus category match.
- **Confirmed:** no existing date/time engine. Only `pomodoro-timer` and `reading-time-calculator`
  are adjacent, and no shared date-formatting helper exists yet. The new engine will own it.

---

## 1. Overall architecture

The same pipeline as every other ToyTools engine, end to end:

```
Pure Engine → Registry → Descriptor → Generic Widget → Tool Page → Guide → FAQ → Knowledge Graph
```

Three replaceable layers:

1. **Calculation engine** (`src/lib/engines/date/`) - pure, dependency-free, fully unit-tested
   primitives organized into orthogonal groups (section 2). No DOM, no I/O, deterministic. The only
   source of date math on the platform.
2. **Descriptor layer** (colocated `<tool>/descriptor.ts`) - each tool described as data: `inputs`,
   `calculation`, `outputs`, `validation`, `presets`. A new tool is a new descriptor, not new
   logic. There is no central descriptor file.
3. **Presentation layer** (`src/tools/_shared/DateToolWidget.astro` plus shared field and result
   sub-components) - one generic widget interprets a descriptor. An **escape hatch** lets unusual
   tools supply a custom widget while still reusing the engine and result cards.

### Single public API

Engine declaration in `src/data/engines.ts`:

```ts
{ id: 'date-time', name: 'Date & Time Engine', category: 'date-time',
  patterns: ['date-calculate', 'date-convert'],
  runtimeGlobal: 'runDateTool' }   // exposes ONLY ToyTools.runDateTool
```

Widgets never touch individual primitives. The build-time `Widget.astro` imports its colocated
descriptor, bakes the render-time bits (input fields, labels) into HTML, and serializes the runtime
bits (`calculation` id, `validation` rules, `outputs` formatters) into a JSON `<script>` block or
`data-*` attributes. The `is:inline` script reads the input values and calls:

```js
ToyTools.runDateTool(calculationId, inputs) // → { ok, results, error }
```

The engine's internal registry maps `calculationId → primitive composition`. Primitives are never
exposed globally, so the UI cannot bypass the registry and engine internals stay free to change.

---

## 2. Engine design - primitives first

`src/lib/engines/date/`, all pure and tested. Organized as **orthogonal primitive groups** so
every tool composes them rather than introducing new business logic.

| Group | Phase 1 primitives | Notes |
|-------|--------------------|-------|
| **Parse** | `parseDate(input, opts) → DateParseResult`, `parseTime(input) → minutes` | tolerant ISO / locale / epoch |
| **Validate** | `validateDate(input, rules) → ValidationResult` | shared live validation for every tool |
| **Normalize** | `normalizeDate(date) → Date` | strip time, set to UTC midnight |
| **Compare** | `compareDates(a, b) → -1 \| 0 \| 1` | ordering, before/after |
| **Difference** | `calendarDayDifference(a, b)`, `ageDifference(birth, on?) → {years, months, days, totalDays}` | `ageDifference` is a named convenience over Difference |
| **Shift** | `addDays(d, n)`, `subtractDays(d, n)` | |
| **Business** | `businessDayDifference(a, b, opts)`, `addBusinessDays(d, n, opts)` | Phase 1: `WorkdayOptions { weekendDays: number[] }` only |
| **Working** | `workingHours(start, end, opts) → {hours, minutes}` | `ShiftOptions { breakMinutes; overnight }` |
| **Duration** | `formatDuration(ms \| parts, style) → string` | |
| **Format** | `formatDate(date, preset \| pattern, locale?) → string` | `Intl.DateTimeFormat`-backed |

### Deferred (documented, not Phase 1)

- **Business holidays** - a `holidays.ts` data module of country → date[] sets, threaded into
  `WorkdayOptions` later. Deferred because country-specific, regional, and observed-holiday rules
  carry annual maintenance and are not needed to validate the architecture.
- **Timezone** - `Intl`-based conversion primitives, a `date-convert` extension.
- **Recurrence / Scheduling** - `nextOccurrence(rule, from?)` and `RelativeRule` move to a future
  **Scheduling Engine** (a separate engine id), keeping the Date Engine purely about dates.

### Engine contract

No external date library (no date-fns, no dayjs). Primitives are thin, isolated wrappers over
`Date` and `Intl`, kept swappable behind the group modules. The resolver and every primitive
**never throw** to the widget; invalid input returns `{ ok: false, error }`. A colocated
`date.test.ts` covers each primitive (leap years, DST boundaries, month-end rollover, negative
differences, empty input) and the resolver's unknown-id and error-capture paths, the same testing
discipline as `encoding.test.ts` and `hashing.test.ts`: tests target the engine, not the tools.

---

## 3. Shared modules

- `parse.ts` - Parse, Validate, Normalize.
- `compare.ts` - Compare.
- `difference.ts` - Difference and Age.
- `arithmetic.ts` - Shift.
- `business.ts` - Business.
- `working.ts` - Working.
- `duration.ts` - Duration.
- `format.ts` - Format.
- `types.ts` - shared option and result types (`WorkdayOptions`, `ShiftOptions`, the `*Result`
  shapes).
- `registry.ts` - an internal `CALCULATIONS: Record<string, (inputs) => DateToolResult>` map plus
  the `runDateTool(calculationId, inputs)` resolver. Each calculation is a small composition of the
  primitives above.

---

## 4. Folder structure

```
src/lib/engines/date/        # pure engine: types, parse, compare, difference, arithmetic,
                             #   business, working, duration, format, registry, date.test.ts
src/tools/_shared/
  DateToolWidget.astro       # generic descriptor-driven widget (escape hatch: custom widget)
  date/                      # shared sub-components: DateField, TimeField, DurationField,
                             #   ResultCard, RelativePresets
src/tools/date-time/<slug>/  # per tool: config.ts, descriptor.ts, Widget.astro (wrapper),
                             #   faq.ts, Guide.astro, knowledge.ts
```

Category URL segment `date-time` produces `/tool/date-time/<slug>/`. Descriptors are **colocated**;
there is no `src/data/date-tools.ts`.

---

## 5. Configuration model

A tool is a **small, colocated descriptor** (`<tool>/descriptor.ts`):

```ts
interface DateToolDescriptor {
  calculation: string;          // engine calculation key, e.g. 'ageDifference'
  inputs: DateInputSpec[];      // ordered fields the widget renders
  outputs: ResultSpec[];        // hero + secondary result cards
  validation?: ValidationSpec;  // reuses engine validateDate rules
  presets?: PresetSpec[];       // "Sample" / quick-fill values
}
// Everything else (live recompute, copy, share-URL, state persistence) is inferred by
// the widget. It is NOT part of the descriptor.

type DateInputSpec =
  | { kind: 'date'; id: string; label: string; default?: 'today' | string }
  | { kind: 'time'; id: string; label: string }
  | { kind: 'number'; id: string; label: string; min?: number; max?: number }
  | { kind: 'select'; id: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'duration'; id: string; label: string };

interface ResultSpec {
  id: string;
  label: string;
  formatter: 'integer' | 'duration' | 'date' | 'text';
  hero?: boolean;
}
```

The generic widget renders `inputs` via the shared field components, calls
`ToyTools.runDateTool(descriptor.calculation, collectedInputs)`, and paints `outputs[]` into result
cards: `outputs[0]` with `hero: true` becomes a large `HeroMetric` numeral, and the rest become a
StatGrid-style card grid reusing `TextMetricWidget`'s visual language. Behavior is never hardcoded
in pages.

Keeping the descriptor to five fields is deliberate. Small descriptors are easier to review, easier
to maintain, and harder to misuse; anything the widget can infer (live recompute, the action bar,
persistence keys) is inferred rather than configured.

Per-tool `config.ts` stays minimal and matches existing tools:

```ts
export const config: ToolConfig = {
  slug: 'age-calculator',
  name: 'Age Calculator',
  categorySlug: 'date-time',
  engine: 'date-time',
  pattern: 'date-calculate',
  family: 'calculation',
  processorId: 'age-calculator',
  tags: [/* ... */],
  relatedTools: [/* ... */],
  guide: {/* ... */},
};
```

`Widget.astro` is a 3-line wrapper rendering `DateToolWidget` with the colocated descriptor.

---

## 6. Tool roadmap - Phase 1 selection

Phase 1 is **8 fully deterministic tools** (no timers, no holidays). Add Days and Subtract Days form
a **tool group** (shared engine and experience, separate URLs and SEO).

| Tool | Pattern | Calculation |
|------|---------|-------------|
| Age Calculator | date-calculate | `ageDifference` |
| Date Difference Calculator | date-calculate | `calendarDayDifference` |
| Add Days | date-calculate | `addDays` (group: shift-days) |
| Subtract Days | date-calculate | `subtractDays` (group: shift-days) |
| Business Days Calculator | date-calculate | `businessDayDifference` |
| Working Hours Calculator | date-calculate | `workingHours` |
| Time Duration Calculator | date-calculate | `formatDuration` |
| Date Formatter / Converter | date-convert | `formatDate` |

Every tool is deterministic and maps to one primitive composition, and together they exercise every
input kind (single date, two dates, date plus number, date plus time, mode select), so the
descriptor model is proven broad before scaling. **Countdown is explicitly Phase 2.** It is the only
candidate that needs timers, intervals, visibility handling, and cleanup, and including it would
contaminate an otherwise pure first cut.

### 6a. Primitive Composition Matrix

This is the real expansion roadmap: it shows whether a *new* tool needs a *new* primitive or simply
composes existing ones. (`P` = Parse, `V` = Validate, `Δ` = Difference, `S` = Shift, `B` = Business,
`W` = Working, `D` = Duration, `F` = Format.)

| Tool | Composition |
|------|-------------|
| Age Calculator | P → V → Δ(age) → F |
| Date Difference | P → V → Δ(calendar) → F |
| Add Days / Subtract Days | P → V → S → F |
| Business Days | P → V → B(diff) → F |
| Working Hours | P → V → W → D → F |
| Time Duration | P → V → D → F |
| Date Formatter | P → V → F |
| *Sleep Calculator (later)* | P → S → D → F &nbsp; *(pure composition, no new primitive)* |
| *Deadline Calculator (later)* | P → B(add) → F &nbsp; *(reuses Business)* |
| *Weeks Between (later)* | P → Δ(calendar) → F &nbsp; *(reuses Difference)* |
| *Countdown (Phase 2)* | P → Δ + interval loop &nbsp; *(needs runtime ticking, not a new primitive)* |

The matrix makes a key point explicit: Sleep and Age are not primitives, they are compositions. Age
is a thin named convenience over Difference; Sleep is pure Shift plus Duration. Genuinely new
primitives are rare, which is exactly the property that lets the category scale by configuration.

---

## 7. UI component inventory

A consistent vocabulary under `src/tools/_shared/date/`, built from existing primitives (`IoPanel`,
`ToolActions`, `HeroMetric`, the `.io-*` classes, and the design tokens):

- **DateField** - `<input type="date">` plus a parsed echo, with `default: today`.
- **TimeField** - `<input type="time">`.
- **DurationField** - an hours/minutes/seconds composite that yields milliseconds.
- **RelativePresets** - quick chips ("Today", "+1 week", "End of month").
- **ResultCard / HeroResult** - reuse `HeroMetric` and the StatGrid look for the answer.

Reused as-is from the platform: the **CopyButton** protocol, **Share URL** (encode inputs into the
query string for prefilled deep links), **Reset/Clear** (two-click confirm), **Sample** (descriptor
presets), `CategoryDiscovery`, and `GroupSwitcher` for grouped siblings.

Deferred to Phase 2 or later: **CalendarPreview** (month grid highlighting a range) and
**ResultTimeline** (horizontal start-to-end visualization). Both are visual-only and not needed to
validate the engine.

---

## 8. SEO strategy

The category becomes a full topic cluster, auto-wired:

- **Category** `date-time` is added to `src/data/categories.ts` (proposed accent `#0EA5E9`, a
  sky-blue distinct from the existing four), with `category-sections.ts` rows:
  `date-calculate → "Date Calculators"` and `date-convert → "Time Zone & Format"`.
- Each tool ships **config + Guide.astro + faq.ts + knowledge.ts**, so the sitemap, manifest, FAQ
  JSON-LD, related tools, and knowledge graph all generate automatically. Sitemaps are never
  hand-edited.
- **Knowledge graph** overlays (`usedWith`, `alternatives`, `nextSteps`) curate intra-cluster links
  (age ↔ date difference ↔ duration), giving automatic internal linking and topic clustering.
- **Expansion roadmap as data:** a `date-time` block in
  `src/lib/content-intelligence/taxonomy.ts` lists the full 30 to 50 `expected[]` slugs, so
  `npm run intel` surfaces gaps without hardcoding topics in analyzer logic.
- Content is authored through the existing `seo-content` skill and `seo:*` pipeline, including the
  no-em-dash writing rule.

Because every discovery surface is registry-driven, the only authoring work per tool is the config
plus the three content files. Internal linking is largely automatic.

---

## 9. Scalability analysis

The descriptor plus primitive-composition model scales to the future families below **without
architectural change**. Each is a new colocated descriptor plus content, reusing primitives:

- **Date** (weeks between, days until) → Difference.
- **Business** (deadline, shift duration, overtime) → Business and Working; holidays arrive later as
  a `WorkdayOptions` extension.
- **Health** (sleep, nap, sleep debt) → Shift plus Duration compositions.
- **Finance** (interest days, billing cycle) → Difference; renewal and recurring billing → the
  Scheduling Engine.
- **Education** (semester length, attendance, study planner) → Business and Working.
- **Scheduling** (meeting planner, event countdown, reminder date, timezone meeting) → a separate
  future **Scheduling Engine** owning recurrence and `nextOccurrence`. The timezone meeting grid
  uses the **escape-hatch** custom widget over the shared primitives.

### Interactive philosophy

The experience helps users understand the result, not just compute it, and this is structural
rather than per-tool:

- The widget recomputes **live** on every input, with no Calculate button, matching
  `percentage-calculator` and the text tools.
- `validateDate` runs on every input, so error states are live and human-readable.
- Result cards carry a human-readable formula or explanation line alongside the numeral.
- `presets` provide example fills via the Sample action.
- Results are copyable and **shareable via URL** (inputs encoded into the query string).
- Global keyboard shortcuts (`/` to focus search, Ctrl/Cmd+Shift+C and Ctrl/Cmd+Shift+X for
  copy/clear) already apply through the runtime.

### Competitor review

A short comparison of the major incumbents and where ToyTools can be cleaner. No layouts or content
are copied; this is a positioning study only.

| Competitor | Friction | ToyTools counter-position |
|------------|----------|---------------------------|
| calculator.net | Dense ads, non-live forms that require a Calculate click, cramped mobile layout | Instant live results, no ads, mobile-first single column |
| timeanddate.com | Feature-rich but heavy navigation, interstitials, ambiguous "business day" terminology | Plain-language output, one tool per page, explicit weekend configuration |
| Omni Calculator | Long forms, slow first paint, inconsistent result formatting | Small descriptors, static-first fast paint, consistent result cards |

The recurring opportunities are: live recalculation everywhere, plain-language explanations of what
"business day" or "age" actually means, mobile-first single-column layouts, and shareable result
URLs.

---

## 10. Recommended implementation order

For the follow-on build phase (not this doc-only task):

1. Engine lib plus tests (`src/lib/engines/date/`) - primitives green first, tools second.
2. Registration: `engines.ts`, `categories.ts`, and `category-sections.ts`; wire
   `ToyTools.runDateTool` into `ToyToolsRuntime.astro`.
3. `DateToolWidget` plus the shared `date/` field and result components.
4. Phase 1 tools: colocated `descriptor.ts` plus `config.ts` plus a 3-line `Widget.astro`.
5. Content: guide, FAQ, and knowledge per tool via the `seo-content` pipeline.
6. The `taxonomy.ts` expansion block for the roadmap.
7. `npm run build`, `npm run test`, and `npm run health` green; spot-check E2E smoke coverage.

---

## Deliverable coverage checklist

Mapping this document to the Phase F1 brief:

| Brief deliverable | Addressed in |
|-------------------|--------------|
| 1. Category & engine architecture | Context, "How this maps", sections 1 to 4 |
| 2. Date Engine primitives | Section 2 (full primitive table, including documented-but-deferred `nextOccurrence`) |
| 3. Phase 1 tool selection | Section 6 |
| 4. Configuration model | Section 5 |
| 5. Reusable UI inventory | Section 7 |
| 6. Future scalability | Section 9 (Date / Business / Scheduling / Health / Finance / Education) |
| 7. SEO architecture | Section 8 |
| 8. Competitor review | Section 9, Competitor review |
| 9. Interactive philosophy | Section 9, Interactive philosophy |
| Final: 10-section design doc | Sections 1 to 10 plus the Primitive Composition Matrix (6a) |
