# Date & Time Engine: Phase F1 Technical Design

> **Status:** design only. This document defines the Date Engine, its configuration model,
> and the shared UI vocabulary for the upcoming Date & Time category. No engine, registry,
> config, widget, or content code is written in Phase F1. The follow-on build phase
> implements it in the order given in Section 10.

## Why this exists

ToyTools today covers Text, Number, Developer, and Productivity. Every category is built the
same way: a pure calculation library under `src/lib/`, a never-throwing registry resolver per
engine, one generic widget per engine, and one config plus content file per tool. Tools are
configuration; engines are behavior.

Date & Time is the next strategic category, intended to eventually power 30 to 50 evergreen
utilities (age, date difference, business days, durations, plus later scheduling, health,
finance, and education families). The goal of this phase is not to ship pages. It is to
design a reusable Date Engine so future date tools are mostly data, not new code, exactly the
way the encoding, hashing, and text-processor engines already work.

The design below was grounded in the live codebase so it fits with zero framework drift. Every
code sketch references a real file and pattern that already ships.

---

## 1. Overall architecture

The Date Engine reuses the same three-layer pipeline as every other ToyTools engine:

```
ToolConfig (data)  ->  Descriptor (data)  ->  DateToolWidget (one generic widget)
                                                     |
                                                     v
                                      ToyTools.runDateTool(id, inputs)
                                                     |
                                                     v
                          src/lib/engines/date/registry.ts  (never-throwing resolver)
                                                     |
                                                     v
                          pure primitives: parse / compare / difference / ...
```

Three replaceable layers:

1. **Calculation engine** (`src/lib/engines/date/`) is pure, dependency-free, and fully unit
   tested. It is the only source of date math: no DOM, no I/O, deterministic. It is organized
   into orthogonal primitive groups (Section 2).
2. **Descriptor layer** (colocated `<tool>/descriptor.ts`) describes each tool as data:
   inputs, the calculation id, outputs, validation, and presets. A new tool is a new
   descriptor, not new logic. There is no central descriptor file: each `Widget.astro` imports
   its own descriptor.
3. **Presentation layer** (`src/tools/_shared/DateToolWidget.astro` plus shared field and
   result sub-components) is one generic widget that interprets a descriptor. An escape hatch
   lets an unusual tool supply a custom widget while still reusing the engine and the result
   cards.

### Single public entry point

Widgets call only `ToyTools.runDateTool(calculationId, inputs)`. All primitives stay internal
to the engine, exactly like `runEncoding` and `runHash`. The engine is declared once in the
manifest, following the real `engineDefs[]` entry shape in `src/data/engines.ts`:

```ts
// src/data/engines.ts -> engineDefs[]
{ id: 'date', name: 'Date Engine', category: 'date-time',
  patterns: ['date-calculate', 'date-convert'], runtimeGlobal: 'runDateTool' },
```

`knownPatterns`, `engineIds`, and the validator's KNOWN sets all derive from this single
entry, and a category's `engines` list derives from it too. A new engine is one entry here.

The public API returns the same shape family the other engines use:

```ts
ToyTools.runDateTool(calculationId, inputs)
  -> { ok: true,  results: DateResult[] }
   | { ok: false, error: string }
```

`Widget.astro` runs at build time. It imports its colocated descriptor and bakes the
render-time bits (input fields and labels) into HTML, then serializes the runtime bits
(calculation id, validation rules, output formatters) into a JSON `<script type="application/json">`
block or `data-*` attributes. The inline script reads the live input values and calls
`ToyTools.runDateTool(calculationId, inputs)`. The engine's internal registry maps
`calculationId` to a primitive composition. Primitives are never attached to `window`, so the
UI can never bypass the registry and the internals can be refactored freely.

This mirrors `src/components/ToyToolsRuntime.astro`, where a deferred module imports each
resolver and assigns it (`TT.runEncoding = runEncoding`), while an `is:inline` block makes
`toast`, `copy`, `storage`, `state`, and `onReady` available immediately. Date tools that
compute on load schedule their first render through `ToyTools.onReady(run)` because the engine
functions attach via the deferred module, not during parse. Wiring the new engine is one
import plus one `TT.runDateTool = runDateTool` line.

---

## 2. Engine design: primitives first

Everything lives under `src/lib/engines/date/`, pure and tested. The engine is organized as
orthogonal primitive groups so every tool composes them rather than introducing new business
logic.

| Group | Phase 1 primitives | Notes |
|-------|--------------------|-------|
| Parse | `parseDate(input, opts) -> DateParseResult`, `parseTime(input) -> minutes` | tolerant ISO / locale / epoch |
| Validate | `validateDate(input, rules) -> ValidationResult` | shared live-validation for every tool |
| Normalize | `normalizeDate(date) -> Date` | strip time, set to UTC midnight |
| Compare | `compareDates(a, b) -> -1 | 0 | 1` | ordering, before / after |
| Difference | `calendarDayDifference(a, b)`, `ageDifference(birth, on?) -> { years, months, days, totalDays }` | `ageDifference` is a named convenience over Difference |
| Shift | `addDays(d, n)`, `subtractDays(d, n)` | calendar arithmetic |
| Business | `businessDayDifference(a, b, opts)`, `addBusinessDays(d, n, opts)` | Phase 1: `WorkdayOptions { weekendDays: number[] }` only |
| Working | `workingHours(start, end, opts) -> { hours, minutes }` | `ShiftOptions { breakMinutes; overnight }` |
| Duration | `formatDuration(ms | parts, style) -> string` | human-readable spans |
| Format | `formatDate(date, preset | pattern, locale?) -> string` | `Intl.DateTimeFormat`-backed |

### Deferred (documented, not built in Phase 1)

- **Business holidays.** A `holidays.ts` of country to `date[]` datasets, added to
  `WorkdayOptions` later. Phase 1 business-day math is configurable weekends only.
- **Timezone.** `Intl`-based conversion primitives, shipped later as a `date-convert`
  extension.
- **Recurrence and scheduling.** `nextOccurrence(rule, from?)` and `RelativeRule` move to a
  future Scheduling Engine (a separate engine id). The Date Engine answers questions about
  dates; the Scheduling Engine answers questions about repeating events.

### Engine conventions

- **No external date library.** No `date-fns`, no `dayjs`. The primitives are thin, isolated
  wrappers over `Date` and `Intl`, swappable later without touching tools.
- **Browser APIs stay inside methods.** Anything that touches `Intl` is called inside a
  primitive, never at module top level, matching the rule the encoding and hashing engines
  follow for `btoa` / `atob` / `crypto.subtle`.
- **Nothing throws to the widget.** The resolver and every primitive capture errors; invalid
  input returns `{ ok: false, error }`. This is the exact contract of
  `src/lib/engines/encoding/registry.ts`:

```ts
// shape mirrors runEncoding() in src/lib/engines/encoding/registry.ts
export function runDateTool(calculationId: string, inputs: DateInputs): DateToolResult {
  const calc = CALCULATIONS[calculationId];
  if (!calc) {
    console.warn(`[date] Unknown calculation id "${calculationId}".`);
    return { ok: false, error: 'Unknown calculation.' };
  }
  try {
    return { ok: true, results: calc(inputs) };
  } catch (_) {
    return { ok: false, error: 'Could not compute a result from these inputs.' };
  }
}
```

- **Colocated tests.** `src/lib/engines/date/date.test.ts` covers each primitive: leap years,
  DST boundaries, month-end rollover (Jan 31 + 1 month), negative differences, empty input,
  and the resolver's unknown-id and error-capture paths. Tests target the engine, not the
  tools, exactly like `encoding.test.ts` and `hashing.test.ts`.

---

## 3. Shared modules

Inside `src/lib/engines/date/`:

| File | Owns |
|------|------|
| `parse.ts` | Parse, Validate, Normalize |
| `compare.ts` | Compare |
| `difference.ts` | Difference, Age |
| `arithmetic.ts` | Shift |
| `business.ts` | Business |
| `working.ts` | Working |
| `duration.ts` | Duration |
| `format.ts` | Format |
| `types.ts` | shared option and result types (`WorkdayOptions`, `ShiftOptions`, `*Result`, `DateInputs`, `DateResult`) |
| `registry.ts` | internal `CALCULATIONS: Record<string, (inputs) => DateResult[]>` map plus the `runDateTool` resolver |

Each entry in `CALCULATIONS` is a small composition of the primitives above (see the matrix in
Section 6a). The map is the single source of truth for which calculations exist, just like
`ENCODERS` in the encoding engine.

---

## 4. Folder structure

```
src/lib/engines/date/
  parse.ts compare.ts difference.ts arithmetic.ts
  business.ts working.ts duration.ts format.ts
  types.ts registry.ts date.test.ts

src/tools/_shared/
  DateToolWidget.astro          # one generic widget for the engine
  date/                         # shared date field + result sub-components
    DateField.astro TimeField.astro DurationField.astro
    RelativePresets.astro ResultCard.astro HeroResult.astro

src/tools/date-time/<slug>/
  config.ts                     # minimal ToolConfig
  descriptor.ts                 # colocated tool description (data)
  Widget.astro                  # 3-line wrapper -> DateToolWidget
  Guide.astro faq.ts knowledge.ts   # content (optional, registered as usual)
```

The category URL segment is `date-time`, so tool pages live at `/tool/date-time/<slug>/`.
Descriptors are colocated. There is no `src/data/date-tools.ts` and no central descriptor
registry.

---

## 5. Configuration model

A tool is a small, colocated descriptor:

```ts
// src/tools/date-time/age-calculator/descriptor.ts
import type { DateToolDescriptor } from '@tools/_shared/date/types';

export const descriptor: DateToolDescriptor = {
  calculation: 'age-difference',          // resolves in the engine registry
  inputs: [
    { id: 'birthDate', kind: 'date', label: 'Date of birth', default: 'today' },
    { id: 'asOf',      kind: 'date', label: 'As of',         default: 'today', optional: true },
  ],
  outputs: [
    { id: 'years', label: 'Age', formatter: 'integer', hero: true },
    { id: 'months', label: 'Months', formatter: 'integer' },
    { id: 'totalDays', label: 'Total days', formatter: 'integer' },
  ],
  validation: { order: 'birthDate <= asOf', message: 'Birth date cannot be after the as-of date.' },
  presets: [
    { label: 'Example', values: { birthDate: '1990-05-20' } },
  ],
};
```

`DateToolWidget.astro` interprets the descriptor: it renders the inputs through the shared
field components, calls `ToyTools.runDateTool(descriptor.calculation, collectedInputs)` live on
every input, and paints `outputs[]` into result cards. `outputs[0]` with `hero: true` renders
as a large `HeroMetric` numeral; the rest render as a StatGrid-style card grid, reusing the
visual language already in `src/tools/_shared/TextMetricWidget.astro`. Behavior is never
hardcoded in a page.

The per-tool `config.ts` stays minimal and uses only real `ToolConfig` fields from
`src/data/types.ts` (which already carries `inputs[]`, `outputs[]`, and
`primaryMetric { metric, label, formatter }`, so no schema change is needed):

```ts
// src/tools/date-time/age-calculator/config.ts
import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'age-calculator',
  name: 'Age Calculator',
  description: 'Calculate exact age in years, months, and days from a date of birth.',
  categorySlug: 'date-time',
  tags: ['date', 'age', 'birthday', 'age calculator'],
  engine: 'date',
  pattern: 'date-calculate',
  family: 'date',
  processorId: 'age-difference',   // universal config -> engine lookup key
  primaryMetric: { metric: 'years', label: 'Age', formatter: 'integer' },
  relatedTools: ['date-difference-calculator', 'time-duration-calculator'],
};
```

`Widget.astro` is a three-line wrapper, the same shape developer-engine tools use:

```astro
---
import DateToolWidget from '@tools/_shared/DateToolWidget.astro';
import { descriptor } from './descriptor';
---
<DateToolWidget descriptor={descriptor} slug="age-calculator" />
```

### Escape hatch

An unusual tool (for example a future timezone meeting grid) can supply its own widget instead
of `DateToolWidget` while still calling `ToyTools.runDateTool` and reusing the shared result
cards. This matches how the calculator engine lets `percentage-calculator` ship a hand-written
live widget over the shared platform primitives.

---

## 6. Tool roadmap: Phase 1 selection

Phase 1 is 8 fully deterministic tools. No timers, no holidays, no timezone. Add Days and
Subtract Days form a tool group (shared engine and experience, separate URLs and SEO).

| Tool | Pattern | Calculation |
|------|---------|-------------|
| Age Calculator | `date-calculate` | `ageDifference` |
| Date Difference Calculator | `date-calculate` | `calendarDayDifference` |
| Add Days | `date-calculate` | `addDays` (group: `shift-days`) |
| Subtract Days | `date-calculate` | `subtractDays` (group: `shift-days`) |
| Business Days Calculator | `date-calculate` | `businessDayDifference` |
| Working Hours Calculator | `date-calculate` | `workingHours` |
| Time Duration Calculator | `date-calculate` | `formatDuration` |
| Date Formatter / Converter | `date-convert` | `formatDate` |

Rationale: every tool is deterministic and maps to one primitive composition, exercising every
input kind (single date, two dates, date plus number, date plus time, mode select) so the
descriptor model is proven broad before the category scales. Countdown is explicitly Phase 2:
it is the only tool needing timers, intervals, visibility handling, and cleanup, and it would
contaminate an otherwise pure first cut.

### 6a. Primitive Composition Matrix

The architectural roadmap. It shows whether a new tool needs a new primitive or just composes
existing ones. (P = Parse, V = Validate, D = Difference, S = Shift, B = Business, W = Working,
Dur = Duration, F = Format.)

| Tool | Composition |
|------|-------------|
| Age Calculator | P -> V -> D(age) -> F |
| Date Difference | P -> V -> D(calendar) -> F |
| Add Days / Subtract Days | P -> V -> S -> F |
| Business Days | P -> V -> B(diff) -> F |
| Working Hours | P -> V -> W -> Dur -> F |
| Time Duration | P -> V -> Dur -> F |
| Date Formatter | P -> V -> F |
| Sleep Calculator (later) | P -> S -> Dur -> F  (pure composition, no new primitive) |
| Deadline Calculator (later) | P -> B(add) -> F  (reuses Business) |
| Weeks Between (later) | P -> D(calendar) -> F  (reuses Difference) |
| Countdown (Phase 2) | P -> D + interval loop  (needs runtime ticking, not a new primitive) |

The matrix makes the central claim explicit: Sleep and Age are not primitives, they are
compositions. Age is a thin named convenience over Difference, and Sleep is pure Shift plus
Duration.

---

## 7. UI component inventory

A consistent vocabulary under `src/tools/_shared/date/`, built from the primitives that already
ship (`IoPanel`, `ToolActions`, `HeroMetric`, the `.io-*` styles in
`src/styles/tool-widget.css`, and the design tokens in `src/styles/tokens.css`).

**New shared components**

- `DateField` (`<input type="date">` plus a parsed echo line, default today)
- `TimeField` (`<input type="time">`)
- `DurationField` (a hours / minutes / seconds composite)
- `RelativePresets` (quick chips: "Today", "+1 week", "End of month")
- `ResultCard` / `HeroResult` (reuse `HeroMetric` plus the StatGrid visual language for the
  answer)

**Reused as-is**

CopyButton protocol, Share URL (encode inputs to a query string for prefilled deep links),
Reset / Clear (two-click confirm), Sample (descriptor presets), `CategoryDiscovery`,
`GroupSwitcher`.

**Deferred**

`CalendarPreview`, `ResultTimeline` (Phase 2 and later, visual only).

All framed panes are composed from `IoPanel`; widgets never hand-write `.io-panel` markup, never
re-declare `.io-*` styles, and update live on input with no Generate or Calculate button, per
the widget conventions in ARCHITECTURE.md.

---

## 8. SEO strategy

A full topic cluster, auto-wired through the existing platform surfaces.

- **Category.** Add `date-time` to `src/data/categories.ts` with a proposed accent `#0EA5E9`
  (sky-blue), alongside the existing accents (text `#F97316`, number `#C89B3C`, developer
  `#6366F1`, productivity `#16A34A`).
- **Category sections.** Add rows to `src/data/category-sections.ts`:
  `date-calculate` to "Date Calculators", `date-convert` to "Time Zone & Format".
- **Per-tool content.** Each tool ships `config.ts` plus `Guide.astro`, `faq.ts`, and
  `knowledge.ts`. The sitemap, content manifest, FAQ JSON-LD, related-tools sections, and the
  knowledge graph generate automatically from the registry. Guides register with one import in
  `src/pages/guide/[...slug].astro` plus the slug in `src/data/guide-registry.ts`; FAQs register
  in `src/data/faq-registry.ts`; knowledge registers in `src/lib/knowledge/registry.ts`.
- **Internal linking.** Knowledge-graph overlays (`usedWith` / `alternatives` / `nextSteps`)
  curate intra-cluster links (age to date-difference to duration), giving automatic internal
  linking and topic clustering.
- **Expansion roadmap as data.** Add a `date-time` block to
  `src/lib/content-intelligence/taxonomy.ts` (`EXPANSION_TAXONOMY`, shaped engine to families
  to `expected[]`) listing the full 30 to 50 expected slugs, so `npm run intel` surfaces gaps
  without hardcoding topics in analyzer logic.
- **Authoring.** Content is written through the existing `seo-content` skill and the `seo:*`
  pipeline. Hard rule: no em-dashes anywhere (the quality gate fails on any occurrence).

---

## 9. Scalability analysis

The descriptor plus primitive-composition model scales to the future families without any
architectural change. Each new tool is a colocated descriptor plus content, reusing the
existing primitives.

| Family | How it composes |
|--------|-----------------|
| Date (weeks-between, days-until) | Difference |
| Business (deadline, shift duration, overtime) | Business / Working; holidays added later as a `WorkdayOptions` extension |
| Health (sleep, nap, sleep-debt) | Shift plus Duration |
| Finance (interest-days, billing-cycle) | Difference; renewal / recurring move to the Scheduling Engine |
| Education (semester length, attendance) | Business / Working |
| Scheduling (meeting planner, event countdown, reminder, timezone meeting) | a separate future Scheduling Engine owning recurrence / `nextOccurrence`; the timezone meeting grid uses the escape-hatch custom widget over shared primitives |

### Interactive philosophy (structural, not per tool)

The widget recomputes live (no Calculate button), runs `validateDate` on every input for live
error states, result cards carry human-readable formula and explanation text, presets give
example fills, results are copyable and shareable via URL, and the global shortcuts
(`/`, `Ctrl/Cmd+Shift+C`, `Ctrl/Cmd+Shift+X`) already apply because they are wired once in
`ToyToolsRuntime.astro`.

### Competitor review

| Site | Friction | ToyTools counter-positioning |
|------|----------|------------------------------|
| calculator.net | dense ads, non-live forms that need a Calculate click | instant live results, no ads |
| timeanddate.com | heavy chrome, ambiguous "business day" terminology | plain-language output, configurable weekends stated up front |
| Omni Calculator | slow first paint, long forms, weak mobile layout | static-first fast load, mobile-first single column, shareable links |

No layouts or content are copied. The table records friction we counter, not designs we mirror.

---

## 10. Recommended implementation order

For the follow-on build phase (not this doc-only task):

1. Engine lib plus tests (`src/lib/engines/date/`): get the primitives green first, tools
   second.
2. Register in `src/data/engines.ts`, `src/data/categories.ts`, and
   `src/data/category-sections.ts`; wire `ToyTools.runDateTool` in
   `src/components/ToyToolsRuntime.astro` (one import plus one `TT.runDateTool = runDateTool`).
3. Build `DateToolWidget.astro` plus the shared `date/` field and result components.
4. Phase 1 tools: colocated `descriptor.ts` plus `config.ts` plus the three-line `Widget.astro`.
5. Content: guide, faq, and knowledge per tool through the `seo-content` skill.
6. Add the `date-time` expansion block to `src/lib/content-intelligence/taxonomy.ts`.
7. `npm run build`, `npm run test`, and `npm run health` green; spot-check the E2E smoke suite.

---

## Coverage checklist

How the nine prompt deliverables and the ten output sections map to this document.

### Prompt deliverables

| # | Deliverable | Where |
|---|-------------|-------|
| 1 | Overall architecture | Section 1 |
| 2 | Engine design (primitives) | Sections 2, 3 |
| 3 | Tool roadmap (Phase 1 selection) | Section 6, 6a |
| 4 | Configuration model | Section 5 |
| 5 | UI component inventory and config model | Sections 5, 7 |
| 6 | Scalability analysis | Section 9 |
| 7 | SEO strategy | Section 8 |
| 8 | Competitor review | Section 9 (table) |
| 9 | Scalability / future families | Section 9 |

### Output sections

Sections 1 through 10 above, plus this checklist, cover the full ten-section design (overall
architecture, engine, shared modules, folder structure, configuration model, tool roadmap and
composition matrix, UI inventory, SEO, scalability and competitors, implementation order).

### Verification for this phase

This is a documentation deliverable, so verification is coverage plus no-regression:

- **No-regression.** Only this Markdown file and one ARCHITECTURE.md pointer line are added; no
  TypeScript, registry, or config is touched, so `npm run build` still passes.
- **Architecture fidelity.** Every code sketch cites a real file and pattern (the `engines.ts`
  entry shape, the `run*` resolver `{ ok, ... , error }` contract, `ToyTools.onReady`,
  `IoPanel` / `HeroMetric`, and the knowledge / guide / faq registration steps), so a future
  implementer follows it without surprises.
- **Style.** No em-dashes anywhere, so the doc could pass the SEO gate if later promoted.
