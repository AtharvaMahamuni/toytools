# Engine Types — Quick Reference

All 20 engines, their contracts, and the exact Widget.astro template for each. `src/data/engines.ts`
is the single source of truth for the current list (`ENGINE_IDS`/`PATTERN_IDS` + `engineDefs`) — if
this file and that one disagree, trust the code and fix this file.

Two engines are NOT covered here because they are not registry/impl engines at all:
**`physics`** and **`math-lab`** are manifest-driven simulations (Physics Playground / Applied Math
Lab) — see the "Are you adding an interactive SIMULATION?" branch of `SKILL.md`'s decision tree and
`ARCHITECTURE.md` → "Simulation Platform". Never scaffold a sim through this reference.

---

## Summary table

| `engine` value | Patterns | Impl interface | Runtime call |
|---------------|----------|----------------|--------------|
| `text-processor` | `text-transform`, `text-cleanup` | `TextProcessor` | `ToyTools.process(id, text)` → `string` |
| `encoding` | `encode-decode` | `EncodingTool` | `ToyTools.runEncoding(id, mode, text)` → `{ok,output,error?}` |
| `hashing` | `hash` | `HashTool` | `await ToyTools.runHash(id, text)` → `string` |
| `structured-data` | `structured-transform`, `structured-validate` | `StructuredDataTool` | `ToyTools.runStructuredData(id, input)` → `{ok,output,error?}` |
| `text-analysis` | `text-metric` | *(none — shared)* | `ToyTools.analyze(text)` → `TextAnalysis` |
| `jwt` | `token-decode` | `JwtTool` | `ToyTools.runJwt(id, token)` → `{ok,decoded?,error?}` |
| `finance` | `finance-growth`, `finance-planning` | `FinanceCalculator` | `ToyTools.runFinance(id, input, opts)` → `InteractiveResult` |
| `datetime` | `datetime-calculate`, `datetime-convert`, `datetime-schedule` | `DateTimeTool` | `ToyTools.runDateTime(id, input, opts)` → `InteractiveResult` |
| `math` | `math-calculate` | `MathCalculator` | `ToyTools.runMath(id, input, opts)` → `InteractiveResult` |
| `wellness` | `health-calculate` | `WellnessCalculator` | `ToyTools.runWellness(id, input, opts)` → `InteractiveResult` |
| `csv` | `csv-transform` | `CsvTool` | `ToyTools.runCsv(id, input, second?)` → `{ok,output,error?,summary?}` |
| `generation` | `generate-credential`, `generate-identifier`, `generate-placeholder`, `generate-code` | `Generator` | `ToyTools.runGeneration(id, options)` → `GenerationResult` |
| `tracker` | `health-track` | `TrackerDef` (data, not a function) | `ToyTools.tracker.*` namespace (`upsert`, `currentStreak`, `barsSvg`, …) |
| `color` | `color-convert`, `color-contrast` | *(none — namespace)* | `ToyTools.color.*` (`parse`, `formats`, `contrast`, `check`, …) |
| `units` | `unit-convert`, `aspect-ratio` | *(none — namespace)* | `ToyTools.units.*` (`pxToCss`, `aspect`, `dpToPxBuckets`, …) |
| `calculator` | `calculate` | *(none — bespoke per tool)* | none — tool owns its own inline script |
| `productivity` | `stateful` | *(none — bespoke per tool)* | none — tool owns its own inline script + `ToyTools.state` |
| `text-interactive` | `text-interactive` | *(none — bespoke per tool)* | none — tool owns its own inline script |

---

## text-processor

**Impl location:** `src/lib/text/processors/transform/` or `cleanup/`

**Registry:** `src/lib/text/processors/registry.ts` → `PROCESSORS` map

**Interface:**
```ts
interface TextProcessor {
  id: string;                      // matches processorId in config.ts
  family: 'transform' | 'cleanup';
  process(text: string): string;   // pure, synchronous, never throws
}
```

**Rules:**
- Sync only. No I/O, no imports from Node, no global state.
- Return the full processed text. Never mutate input.

**Widget template:**
```astro
---
import TextProcessorWidget from '@tools/_shared/TextProcessorWidget.astro';
import { config } from './config';
---
<TextProcessorWidget slug={config.slug} processorId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'text-processor',
pattern: 'text-transform',   // or 'text-cleanup'
family: 'transform',          // or 'cleanup'
processorId: 'myProcessor',  // exact id from the impl
```

---

## encoding

**Impl location:** `src/lib/engines/encoding/`

**Registry:** `src/lib/engines/encoding/registry.ts` → `ENCODERS` map

**Interface:**
```ts
interface EncodingTool {
  id: string;
  family: 'binary-text' | 'web';
  encode(input: string): string;   // must not throw
  decode(input: string): string;   // may throw on invalid input — registry catches it
  sample?: string;                 // optional: text shown when "Sample" is clicked
}

interface EncodingResult {
  ok: boolean;
  output: string;
  error?: string;
}
```

**Rules:**
- `encode()` must never throw.
- `decode()` may throw; `runEncoding()` in the registry catches it and returns `{ ok:false, error }`.
- Keep `btoa`/`atob` calls inside methods (not at import time) for Node/vitest safety.

**Widget template:**
```astro
---
import EncodingWidget from '@tools/_shared/EncodingWidget.astro';
import { config } from './config';
---
<EncodingWidget slug={config.slug} encodingId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'encoding',
pattern: 'encode-decode',
family: 'binary-text',      // or 'web'
processorId: 'myEncoder',
```

---

## hashing

**Impl location:** `src/lib/engines/hashing/`

**Registry:** `src/lib/engines/hashing/registry.ts` → `HASHERS` map

**Interface:**
```ts
interface HashTool {
  id: string;
  family: 'cryptographic';
  hash(input: string): string | Promise<string>;  // returns lowercase hex digest
}
```

**Rules:**
- Sync or async both allowed.
- Always return a lowercase hex string. Never throw — return empty string on error if needed.
- Keep `crypto.subtle` calls inside the `hash()` method body, not at module top-level.

**Widget template:**
```astro
---
import HashWidget from '@tools/_shared/HashWidget.astro';
import { config } from './config';
---
<HashWidget slug={config.slug} hashId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'hashing',
pattern: 'hash',
family: 'cryptographic',
processorId: 'myHasher',
```

---

## structured-data

**Impl location:** `src/lib/engines/structured-data/`

**Registry:** `src/lib/engines/structured-data/registry.ts` → `STRUCTURED_TOOLS` map

**Interface:**
```ts
interface StructuredDataTool {
  id: string;
  family: 'json';
  execute(input: string): StructuredDataResult;  // never throws
}

interface StructuredDataResult {
  ok: boolean;
  output: string;
  error?: string;
}
```

**Rules:**
- `execute()` must never throw. Wrap all parse errors in `{ ok: false, output: '', error }`.
- Empty input should return `{ ok: true, output: '' }` (not an error).
- Validator tools return a short status string in `output` on success (e.g., `'Valid JSON'`).

**Pattern values:**
- `structured-transform` — input → transformed output (formatter, minifier)
- `structured-validate` — input → validation result (validator)

**Widget template:**
```astro
---
import StructuredDataWidget from '@tools/_shared/StructuredDataWidget.astro';
import { config } from './config';
---
<StructuredDataWidget slug={config.slug} structuredId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'structured-data',
pattern: 'structured-transform',  // or 'structured-validate'
family: 'json',
processorId: 'my-json-tool',
```

---

## text-analysis

**No impl file needed.** All metrics come from the shared `analyzeText()` function in `src/lib/text/analysis.ts`.

**Available metric keys** (from `TextAnalysis` interface):
```
words, characters, charactersNoSpaces, sentences, paragraphs, lines,
readingTime, speakingTime, uniqueWords, averageWordLength, averageSentenceLength
```

**Valid formatter values:** `'integer'`, `'duration'`, `'percentage'`, `'decimal'`

**Widget template:**
```astro
---
import TextMetricWidget from '@tools/_shared/TextMetricWidget.astro';
---
<TextMetricWidget
  slug="my-tool-slug"
  emptyMessage="Paste or type text to begin."
  stats={[
    { metric: 'words',       label: 'Words',       formatter: 'integer' },  // → hero (large display)
    { metric: 'characters',  label: 'Characters',  formatter: 'integer' },  // → secondary grid
  ]}
/>
```

The first entry in `stats` is the **hero metric** (large numeral in the sticky output column). All remaining entries appear in the secondary stat grid.

**config.ts engine fields:**
```ts
engine: 'text-analysis',
pattern: 'text-metric',
family: 'text-counting',   // or 'text-time'
// processorId is NOT used for text-analysis
```

---

## jwt

**Impl location:** `src/lib/engines/jwt/`

**Registry:** `src/lib/engines/jwt/registry.ts` → `JWT_TOOLS` map

**Interface:**
```ts
interface JwtTool {
  id: string;
  family: 'token';
  decode(token: string): JwtDecoded;   // pure, sync; MAY throw — resolver catches it
  sample?: string;                      // optional token for the widget's "Sample" button
}
```

**Rules:**
- A decode produces a *composite* result (header object + payload object + humanized claims +
  raw signature) — that is why this is its own engine instead of `structured-data` or `encoding`.
- Decoding is local-only; nothing is verified (no signature check) and nothing leaves the browser.
- `decode()` may throw on malformed input; `runJwt()` in the registry catches it and returns
  `{ ok: false, error }`.

**Widget template:**
```astro
---
import JwtWidget from '@tools/_shared/JwtWidget.astro';
import { config } from './config';
---
<JwtWidget slug={config.slug} jwtId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'jwt',
pattern: 'token-decode',
family: 'token',
processorId: 'jwt-decoder',
```

---

## The platform experience calculators — finance / datetime / math / wellness

These four engines share one shape: a calculator is **not** a string-transform function, it is a
consumer of two engine-agnostic platform layers — `SmartFieldDef` (declarative input schema, from
`src/lib/inputs/field.ts`) in, `InteractiveResult` (from `src/lib/results/types.ts`) out. Neither
type is finance-specific; any calculator-shaped engine reuses them. A calculator's `calculate()` is
pure, synchronous, and **never throws** — even the error path returns a normal `InteractiveResult`
(build it with `calculationError(...)` from `@lib/results/index`).

```ts
// shape shared by FinanceCalculator / DateTimeTool / MathCalculator / WellnessCalculator
interface <X>Calculator {
  id: string;                              // == processorId, unique within the engine
  family: string;                          // taxonomy grouping (e.g. 'interest', 'age')
  fields: SmartFieldDef[];                  // build-time input schema the widget renders
  layout?: SectionId[];                     // optional section order override
  capabilities?: Partial<Capabilities>;     // e.g. { timeline: true, undo: true }
  calculate(input: Record<string, number | string>, opts): InteractiveResult;
}
```

`SmartFieldDef.type` is one of `currency | percent | number | integer | select | duration | slider |
segmented | date | datetime | text`. A field can carry `min`/`max`/`step`/`suffix`/`help`/`optional`/
`presets`. Build results with the helpers in `@lib/results/index` (`successResult`, `card`,
`calculationError`) — a result composes `hero`, `metrics`, optional `timeline`/`breakdown`/
`visualization`, `insights`, `assumptions`, `decisions` (cross-links to sibling tools), and
`nextQuestions`. See `src/lib/engines/finance/calculators/compound-interest.ts` for a fully worked
example (fields, scenarios, timeline, breakdown, insights, decisions all populated).

Per-engine specifics:

| Engine | Registry file / map | Calculators dir | `family` examples | Widget prop | Runtime global |
|---|---|---|---|---|---|
| `finance` | `src/lib/engines/finance/registry.ts` → `FINANCE_CALCULATORS` | `calculators/` | `interest`, `inflation`, `savings` | `financeId` | `runFinance` |
| `datetime` | `src/lib/engines/datetime/registry.ts` → `DATETIME_TOOLS` | `calculators/` | `age`, `duration`, `timezone`, `timestamp`, `schedule` | `dateTimeId` | `runDateTime` |
| `math` | `src/lib/engines/math/registry.ts` → `MATH_CALCULATORS` | `calculators/` | `fractions`, `combinatorics`, `number-theory` | `mathId` | `runMath` |
| `wellness` | `src/lib/engines/wellness/registry.ts` → `WELLNESS_CALCULATORS` | `calculators/` | `body-composition`, `energy` | `wellnessId` | `runWellness` |

`wellness` adds two optional fields not present on the others: `produces` (results this calculator
publishes to a shared cross-tool profile, e.g. TDEE publishing a `tdee` card) and `consumes` (fields
this calculator can prefill from another published result). Neither `finance`, `datetime`, nor
`math` currently uses cross-tool prefill.

**Widget template (identical shape across all four — only the id prop name changes):**
```astro
---
import FinanceWidget from '@tools/_shared/FinanceWidget.astro';
// or: DateTimeWidget / MathWidget / WellnessWidget from the same _shared dir
import { config } from './config';
---
<FinanceWidget slug={config.slug} financeId={config.processorId!} config={config} />
<!-- optional: emptyText="Shown before the first valid input." -->
```

**config.ts engine fields (finance shown; swap engine/pattern/family per row above):**
```ts
engine: 'finance',
pattern: 'finance-growth',   // or 'finance-planning'
family: 'interest',
processorId: 'compound-interest',
```

---

## csv

**Impl location:** `src/lib/engines/csv/` (tool implementations); `src/lib/csv/csv.ts` holds the
shared, dependency-free RFC 4180 parser/serializer both this engine and `structured-data`'s
CSV↔JSON tools import.

**Registry:** `src/lib/engines/csv/registry.ts` → `CSV_TOOLS` map

**Interface:**
```ts
interface CsvTool {
  id: string;
  family: 'convert' | 'clean' | 'compare';
  inputs: 1 | 2;                              // csv-diff reads two panes
  execute(input: string, second?: string): CsvResult;   // pure, never throws
}

interface CsvResult {
  ok: boolean;
  output: string;
  error?: string;
  summary?: string;   // one-line status, e.g. "5 rows · 3 columns"
}
```

**Rules:**
- `execute()` must never throw; wrap failures as `{ ok: false, output: '', error }`.
- A tool that compares two CSVs (`inputs: 2`) gets a second text pane from the shared widget.

**Widget template:**
```astro
---
import CsvWidget from '@tools/_shared/CsvWidget.astro';
import { config } from './config';
---
<CsvWidget slug={config.slug} csvId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'csv',
pattern: 'csv-transform',
family: 'clean',   // or 'convert' / 'compare'
processorId: 'csv-clean',
```

---

## generation

**Impl location:** `src/lib/generation/generators/`

**Registry:** `src/lib/generation/registry.ts` → `GENERATORS` map

**Interface:**
```ts
interface Generator {
  id: string;
  family: string;
  fields: GeneratorField[];       // declarative option controls (number/range/boolean/select/text)
  autoGenerate?: boolean;          // regenerate on option change without a button press (default true)
  live?: boolean;
  generate(options: GeneratorOptions): GenerationResult;   // never throws
}
```

**Rules:**
- Randomness (`crypto.getRandomValues`/`crypto.randomUUID`) must live **inside** `generate()`, never
  at module top-level — importing a strategy must stay side-effect-free for Node/vitest.
- The shared `GeneratorWidget` renders controls purely from the `fields` schema at build time; it
  has no per-tool knowledge, so adding a generator never touches the widget.
- A field's `showWhen` makes it conditionally visible based on another field's value.

**Widget template:**
```astro
---
import GeneratorWidget from '@tools/_shared/GeneratorWidget.astro';
import { config } from './config';
---
<GeneratorWidget slug={config.slug} generatorId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'generation',
pattern: 'generate-credential',  // or generate-identifier / generate-placeholder / generate-code
family: 'password',
processorId: 'password',
```

---

## tracker

**Impl location:** `src/lib/engines/tracker/` (`model.ts` pure entry/streak logic, `viz.ts` pure SVG
chart builders). Unlike every other engine, a tracker tool is **not a function** — it is a
declarative `TrackerDef` describing a repeat-entry log persisted in `ToyTools.state`, with streaks
and a mini trend chart.

**Registry:** `src/lib/engines/tracker/registry.ts` → `TRACKER_DEFS` map

**Interface:**
```ts
interface TrackerDef {
  id: string;
  unit: string;                                  // e.g. 'glasses', 'kg'
  inputMode: 'increment' | 'value';               // tap-to-add vs. type-a-value
  chart: 'bars' | 'line';
  streakMode: 'goal' | 'logged';                  // what counts a day toward the streak
  step: number;
  decimals: number;
  windowDays: number;                             // chart span
  quickAdds?: number[];                           // increment-mode quick buttons
  addLabel?: string;
  defaultGoal?: number;
  goalLabel?: string;                             // omit to hide the goal control entirely
  units?: { value: string; label: string }[];     // cosmetic unit choices only
}
```

**Rules:**
- No `calculate()` — the def is pure data. `ToyTools.tracker` (the attached runtime facade) bundles
  the tested pure `model`/`viz` functions (`upsert`, `increment`, `currentStreak`, `barsSvg`, …) that
  the widget's inline script calls directly.
- `streakMode: 'logged'` counts any entry that day; `'goal'` requires the value to meet the goal.

**Widget template:**
```astro
---
import TrackerWidget from '@tools/_shared/TrackerWidget.astro';
import { config } from './config';
---
<TrackerWidget slug={config.slug} trackerId={config.processorId!} config={config} />
```

**config.ts engine fields:**
```ts
engine: 'tracker',
pattern: 'health-track',
family: 'hydration',
processorId: 'water-intake',
```

---

## color

**Impl location:** `src/lib/engines/color/` (`convert.ts` parse/format, `contrast.ts` WCAG math)

**Runtime namespace** (no per-tool registry — every color tool calls the same helpers directly):
```ts
ToyTools.color = {
  parse(input: string): ParseResult,
  formats(input: string): { ok, rgb, formats } | { ok: false, error },
  hex(rgb: RGB): string,
  contrast(fg: RGB, bg: RGB): number,
  wcag(fg: RGB, bg: RGB): WcagLevels,
  luminance(rgb: RGB): number,
  suggest(fg: RGB, bg: RGB): RGB,
  check(fg: string, bg: string): { ok, fg, bg, levels } | { ok: false, error },
};
```

**Rules:**
- Every function is pure, deterministic, and never throws — parse failures come back as
  `{ ok: false, error }`, not an exception.
- There is **no shared widget**. Like `calculator`/`productivity`/`text-interactive`, a `color` tool
  writes a fully bespoke `Widget.astro` (see the "Bespoke engines" section below) whose inline
  script calls `ToyTools.color.*` directly.

**config.ts engine fields:**
```ts
engine: 'color',
pattern: 'color-convert',   // or 'color-contrast'
family: 'format',
// no processorId — there is no registry to resolve against
```

---

## units

**Impl location:** `src/lib/engines/units/` (`convert.ts` — exact-ratio CSS + mobile-density math)

**Runtime namespace:**
```ts
ToyTools.units = {
  pxToCss(px: number): CssUnits,
  cssToPx(value: number, unit: string): number,
  dpToPxBuckets(dp: number): DensityBucket[],
  pxToDp(px: number, dpi: number): number,
  ptToPxIos(pt: number): number,
  simplifyRatio(w: number, h: number): string,
  aspect(w: number, h: number): AspectResult,
  buckets: DensityBucket[],
};
```

**Rules:**
- Conversions are exact ratios — nothing can fail at runtime; there is no error path to design for.
- No shared widget, same as `color` — write a bespoke `Widget.astro`.

**config.ts engine fields:**
```ts
engine: 'units',
pattern: 'unit-convert',   // or 'aspect-ratio'
family: 'css',
// no processorId
```

---

## Bespoke engines — calculator / productivity / text-interactive

These three have **no shared widget and no registry to resolve against**. Each tool's `Widget.astro`
is fully self-contained: `ToolSplit`/`IoPanel` composition in the frontmatter plus its own
`<script is:inline>` that reads/writes the DOM directly, exactly like `color`/`units` tools. There is
no `processorId` — the engine/pattern/family fields exist purely for taxonomy and discovery.

| Engine | Pattern | What it's for | Example tool |
|---|---|---|---|
| `calculator` | `calculate` | Stateless single-shot math (percentage, tip, margin, tax, scientific) | `percentage-calculator` |
| `productivity` | `stateful` | Tools that persist user data across visits via `ToyTools.state` (notes, todos, timers) | `notepad`, `todo-list`, `pomodoro-timer` |
| `text-interactive` | `text-interactive` | Text tools needing bespoke live interaction beyond a pure transform (diff view, regex find/replace) | `find-replace`, `text-compare` |

**config.ts engine fields (calculator shown):**
```ts
engine: 'calculator',
pattern: 'calculate',
family: 'arithmetic',
// no processorId
```

Before reaching for one of these three, check whether the tool actually fits an existing
engine-backed pattern instead — a bespoke widget means more code to maintain per tool, with no
registry/validator safety net catching a broken wiring.
