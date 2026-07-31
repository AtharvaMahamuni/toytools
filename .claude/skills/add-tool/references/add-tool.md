# Adding a Tool — Complete Checklist

Work through each phase in order. Every numbered item is a file change.

---

## Phase 1 — Engine implementation

Skip this phase entirely for `text-analysis` (no impl) and for the five bespoke/namespace engines
— `calculator`, `productivity`, `text-interactive`, `color`, `units` — which have no registry to
add an entry to; go straight to Phase 2 and write the tool's own `<script is:inline>`. Full
interface + rules for every engine: `references/engine-types.md`.

For every other engine: create the impl file, then add exactly **one import + one map entry** to the registry.

### text-processor
```
src/lib/text/processors/
├── transform/   ← for convert/change tools
└── cleanup/     ← for remove/normalize tools
```
Impl file exports one `const` matching `TextProcessor { id, family, process(text): string }`.
Registry: `src/lib/text/processors/registry.ts` → add to `PROCESSORS` map.

### encoding
```
src/lib/engines/encoding/<id>.ts
```
Impl file exports one `const` matching `EncodingTool { id, family, encode, decode, sample? }`.
Registry: `src/lib/engines/encoding/registry.ts` → add to `ENCODERS` map.

### hashing
```
src/lib/engines/hashing/<id>.ts
```
Impl file exports one `const` matching `HashTool { id, family, hash(text): string | Promise<string> }`.
Registry: `src/lib/engines/hashing/registry.ts` → add to `HASHERS` map.

### structured-data
```
src/lib/engines/structured-data/<id>.ts
```
Impl file exports one `const` matching `StructuredDataTool { id, family, execute(input): { ok, output, error? } }`.
Registry: `src/lib/engines/structured-data/registry.ts` → add to `STRUCTURED_TOOLS` map.

### text-analysis
No impl needed. The shared `analyzeText()` in `src/lib/text/analysis.ts` is the only implementation. Skip to Phase 2.

### jwt
```
src/lib/engines/jwt/<id>.ts
```
Impl file exports one `const` matching `JwtTool { id, family, decode(token): JwtDecoded, sample? }`. `decode` may throw — the registry resolver catches it.
Registry: `src/lib/engines/jwt/registry.ts` → add to `JWT_TOOLS` map.

### finance / datetime / math / wellness
These four share one shape: `SmartFieldDef[]` fields in, `InteractiveResult` out (never throws —
build the error case with `calculationError()`). See `references/engine-types.md` → "The platform
experience calculators" for the full interface and a worked example.
```
src/lib/engines/finance/calculators/<id>.ts     → FINANCE_CALCULATORS   in registry.ts
src/lib/engines/datetime/calculators/<id>.ts    → DATETIME_TOOLS        in registry.ts
src/lib/engines/math/calculators/<id>.ts        → MATH_CALCULATORS      in registry.ts
src/lib/engines/wellness/calculators/<id>.ts    → WELLNESS_CALCULATORS  in registry.ts
```

### csv
```
src/lib/engines/csv/<id>.ts
```
Impl file exports one `const` matching `CsvTool { id, family, inputs: 1 | 2, execute(input, second?): CsvResult }`. `execute` must never throw.
Registry: `src/lib/engines/csv/registry.ts` → add to `CSV_TOOLS` map.

### generation
```
src/lib/generation/generators/<id>.ts
```
Impl file exports one `const` matching `Generator { id, family, fields: GeneratorField[], generate(options): GenerationResult }`. Randomness must live inside `generate()`, never at module top-level.
Registry: `src/lib/generation/registry.ts` → add to `GENERATORS` map.

### tracker
```
src/lib/engines/tracker/registry.ts → add a TrackerDef entry to TRACKER_DEFS
```
No impl file — a tracker is pure data (`{ id, unit, inputMode, chart, streakMode, step, decimals, windowDays, ... }`). The shared `model.ts`/`viz.ts` logic never changes.

### calculator / productivity / text-interactive / color / units
No registry, no impl file, no shared widget. Skip straight to Phase 2 and write a fully bespoke
`Widget.astro` (ToolSplit/IoPanel composition + its own `<script is:inline>`), calling
`ToyTools.color.*` / `ToyTools.units.*` directly for those two engines. See
`references/engine-types.md` for the namespace surfaces and rules.

---

## Phase 2 — Tool directory

Create `src/tools/<segment>/<slug>/` with two required files.

### `config.ts`

```ts
import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'my-tool-slug',           // kebab-case, globally unique, matches directory name
  name: 'My Tool Name',
  seoTitle: 'My Tool — Free Online Tool',  // optional; falls back to name
  description: 'One sentence describing what the tool does.',
  categorySlug: 'text-utilities', // must exist in src/data/categories.ts
  tags: ['tag1', 'tag2'],         // SEO keyword array, 5–15 entries

  // optional temporal fields
  isNew: true,
  updatedAt: '2026-06-14',

  // engine wiring — all four required
  engine: 'text-processor',       // must be registered in src/data/engines.ts
  pattern: 'text-transform',      // must be declared in that engine's patterns[]
  family: 'transform',            // sub-grouping within the engine
  processorId: 'myProcessor',     // MUST match the id field in the engine impl

  // optional
  toolGroup: 'my-group',          // if joining a tool group
  relatedTools: ['other-slug'],   // slugs of related tools (all must exist)
  guide: {                        // include only if Guide.astro exists
    slug: 'guide-slug',
    categorySlug: 'text',
    title: 'Guide Title',
    description: 'One-sentence guide description.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },
};
```

**Segment → categorySlug mapping** (authoritative list: `src/data/categories.ts`; cross-check
`docs/code-map.json` if unsure):

| Directory segment | categorySlug |
|------------------|-------------|
| `text/` | `text-utilities` |
| `developer-utilities/` | `developer-utilities` |
| `number/` | `number-utilities` |
| `productivity/` | `productivity` |
| `finance/` | `money-finance` |
| `generate/` | `generate` |
| `physics/` | `physics` |
| `math/` | `applied-math` |
| `datetime/` | `date-time` |
| `health/` | `health-fitness` |
| `design/` | `design-tools` |

### `Widget.astro`

Widget files are always 3 lines. Pick the template for your engine:

**text-processor:**
```astro
---
import TextProcessorWidget from '@tools/_shared/TextProcessorWidget.astro';
import { config } from './config';
---
<TextProcessorWidget slug={config.slug} processorId={config.processorId!} config={config} />
```

**encoding:**
```astro
---
import EncodingWidget from '@tools/_shared/EncodingWidget.astro';
import { config } from './config';
---
<EncodingWidget slug={config.slug} encodingId={config.processorId!} config={config} />
```

**hashing:**
```astro
---
import HashWidget from '@tools/_shared/HashWidget.astro';
import { config } from './config';
---
<HashWidget slug={config.slug} hashId={config.processorId!} config={config} />
```

**structured-data:**
```astro
---
import StructuredDataWidget from '@tools/_shared/StructuredDataWidget.astro';
import { config } from './config';
---
<StructuredDataWidget slug={config.slug} structuredId={config.processorId!} config={config} />
```

**text-analysis:**
```astro
---
import TextMetricWidget from '@tools/_shared/TextMetricWidget.astro';
---
<TextMetricWidget
  slug="my-tool-slug"
  emptyMessage="Paste or type text to begin."
  stats={[
    { metric: 'words', label: 'Words', formatter: 'integer' },
    // first entry is the hero metric; rest appear in secondary stat grid
  ]}
/>
```
Valid `metric` keys: `words`, `characters`, `charactersNoSpaces`, `sentences`, `paragraphs`, `lines`, `readingTime`, `speakingTime`, `uniqueWords`, `averageWordLength`, `averageSentenceLength`.
Valid `formatter` values: `'integer'`, `'duration'`, `'percentage'`, `'decimal'`.

**jwt:**
```astro
---
import JwtWidget from '@tools/_shared/JwtWidget.astro';
import { config } from './config';
---
<JwtWidget slug={config.slug} jwtId={config.processorId!} config={config} />
```

**finance / datetime / math / wellness** (identical shape — only the widget name and id prop change):
```astro
---
import FinanceWidget from '@tools/_shared/FinanceWidget.astro';
import { config } from './config';
---
<FinanceWidget slug={config.slug} financeId={config.processorId!} config={config} />
```
Swap `FinanceWidget`/`financeId` for `DateTimeWidget`/`dateTimeId`, `MathWidget`/`mathId`, or
`WellnessWidget`/`wellnessId`. An optional `emptyText="..."` prop sets the pre-input placeholder copy.

**csv:**
```astro
---
import CsvWidget from '@tools/_shared/CsvWidget.astro';
import { config } from './config';
---
<CsvWidget slug={config.slug} csvId={config.processorId!} config={config} />
```

**generation:**
```astro
---
import GeneratorWidget from '@tools/_shared/GeneratorWidget.astro';
import { config } from './config';
---
<GeneratorWidget slug={config.slug} generatorId={config.processorId!} config={config} />
```

**tracker:**
```astro
---
import TrackerWidget from '@tools/_shared/TrackerWidget.astro';
import { config } from './config';
---
<TrackerWidget slug={config.slug} trackerId={config.processorId!} config={config} />
```

**calculator / productivity / text-interactive / color / units:**
No shared widget — write a bespoke `Widget.astro` with `ToolSplit`/`IoPanel` composition and its
own `<script is:inline>`. See any existing tool in that engine (`docs/code-map.json`) for a
starting point, and `references/engine-types.md` for the `ToyTools.color`/`ToyTools.units`
namespace surface when applicable.

---

## Phase 3 — Platform registration

Tool/FAQ/guide/knowledge registration is **derived from the tool directory** — never hand-edit
`src/data/registry.ts`, `faq-registry.ts`, `guide-registry.ts`, `src/lib/knowledge/registry.ts`,
any `*.generated.ts` barrel, or the guide route. After authoring (or removing) files in
`src/tools/<segment>/<slug>/`, run:

```sh
npm run registries:generate   # scaffold:tool already runs this for you
```

`validate-architecture` fails the build if the generated barrels are stale, so a forgotten
regenerate cannot slip through. The files below are the only ones that still take hand edits,
and only in the listed cases.

### `src/data/category-sections.ts` (only if `pattern` is new)

If the tool uses a pattern string that has no section mapping yet:
```ts
// In sectionsByPattern:
'my-new-pattern': { title: 'My Section Title', order: 5 },
```

### `src/data/engines.ts` (only if engine is new)

Only required when adding a brand-new engine type — rare. See `references/add-engine.md`.

### `src/data/tool-groups.ts` (only if `toolGroup` is set in config)

```ts
// Add or update a group:
{
  id: 'my-group',
  name: 'My Group Name',
  members: [
    { slug: 'existing-tool', label: 'Existing' },
    { slug: 'my-tool-slug',  label: 'My Tool' },
  ],
},
```
All group members must share the same `engine` + `pattern`. The validator enforces this.

---

## Phase 4 — Optional content

See `references/optional-content.md` for FAQ, Guide, and Knowledge file steps.

---

## Phase 5 — Validate

```sh
npm run build    # TypeScript + registry validation + Astro render
npm run health   # post-build: sitemap, manifest, knowledge coverage
```

If `validate-registry` fails, the error message names the exact field and file — fix that specific file only. Do not re-run exploration.

If `npm run health` warns about missing knowledge, either add `knowledge.ts` (see optional-content.md) or accept the warning for now.
