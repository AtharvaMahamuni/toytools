# Examples — Real Implementations from the Codebase

Copy these patterns directly. Every snippet is taken from a shipped tool.

---

## text-processor: snake_case converter

**Engine impl** — `src/lib/text/processors/transform/snakeCase.ts`
```ts
import type { TextProcessor } from '../types';
import { splitWords, perLine } from './_words';

export const snakeCase: TextProcessor = {
  id: 'snakeCase',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      splitWords(line).map((w) => w.toLowerCase()).join('_')
    ),
};
```

**Registry entry** — `src/lib/text/processors/registry.ts`
```ts
import { snakeCase } from './transform/snakeCase';

export const PROCESSORS: Record<string, TextProcessor> = {
  // ...other entries
  snakeCase,
};
```

**config.ts** — `src/tools/text/snake-case-converter/config.ts`
```ts
import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'snake-case-converter',
  name: 'snake_case Converter',
  seoTitle: 'snake_case Converter — Convert Text To snake_case Online',
  description: 'Convert text to snake_case for Python variables and database columns.',
  categorySlug: 'text-utilities',
  tags: ['snake case', 'snake case converter', 'convert to snake_case', 'snake_case', 'python naming', 'database column name', 'underscore case'],
  updatedAt: '2026-06-07',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'snakeCase',
  toolGroup: 'case-converters',
  guide: {
    slug: 'how-to-convert-text-to-snake-case',
    categorySlug: 'text',
    title: 'How To Convert Text To snake_case',
    description: 'Learn what snake_case is, why Python and SQL favor it, and how to convert any phrase into a snake_case identifier.',
    readMinutes: 3,
    updatedAt: 'Jun 2026',
  },
};
```

**Widget.astro** — `src/tools/text/snake-case-converter/Widget.astro`
```astro
---
import TextProcessorWidget from '@tools/_shared/TextProcessorWidget.astro';
import { config } from './config';
---
<TextProcessorWidget slug={config.slug} processorId={config.processorId!} config={config} />
```

---

## encoding: Base64

**Engine impl** — `src/lib/engines/encoding/base64.ts`
```ts
import type { EncodingTool } from './types';

export const base64: EncodingTool = {
  id: 'base64',
  family: 'binary-text',
  sample: 'Hello, World!',
  encode: (input) => btoa(unescape(encodeURIComponent(input))),
  decode: (input) => decodeURIComponent(escape(atob(input.replace(/\s+/g, '')))),
};
```

**Registry entry** — `src/lib/engines/encoding/registry.ts`
```ts
import { base64 } from './base64';

export const ENCODERS: Record<string, EncodingTool> = {
  base64,
  // ...other entries
};
```

**config.ts** — `src/tools/developer-utilities/base64-encoder-decoder/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'base64-encoder-decoder',
  name: 'Base64 Encoder & Decoder',
  seoTitle: 'Base64 Encoder & Decoder — Free Online Tool',
  description: 'Encode and decode Base64 strings instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-utilities',
  tags: ['base64', 'encode', 'decode', 'developer', 'base64 encoder', 'base64 decoder'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'binary-text',
  processorId: 'base64',
  relatedTools: ['url-encoder-decoder', 'html-entity-encoder-decoder'],
};
```

**Widget.astro** — `src/tools/developer-utilities/base64-encoder-decoder/Widget.astro`
```astro
---
import EncodingWidget from '@tools/_shared/EncodingWidget.astro';
import { config } from './config';
---
<EncodingWidget slug={config.slug} encodingId={config.processorId!} config={config} />
```

---

## hashing: SHA-256

**Engine impl** — `src/lib/engines/hashing/sha.ts` (exports both sha1 and sha256)
```ts
import type { HashTool } from './types';

function toHex(buffer: ArrayBuffer): string {
  let out = '';
  for (const byte of new Uint8Array(buffer)) {
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
}

async function digest(algorithm: 'SHA-1' | 'SHA-256', input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return toHex(buffer);
}

export const sha256: HashTool = {
  id: 'sha256',
  family: 'cryptographic',
  hash: (input) => digest('SHA-256', input),
};
```

**config.ts** — `src/tools/developer-utilities/sha256-hash-generator/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'sha256-hash-generator',
  name: 'SHA-256 Hash Generator',
  seoTitle: 'SHA-256 Hash Generator — Free Online Tool',
  description: 'Generate a SHA-256 hash from any text instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-utilities',
  tags: ['sha256', 'sha-256', 'sha256 hash', 'sha256 generator', 'hash generator', 'checksum'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'hashing',
  pattern: 'hash',
  family: 'cryptographic',
  processorId: 'sha256',
  relatedTools: ['md5-hash-generator', 'sha1-hash-generator'],
};
```

**Widget.astro** — `src/tools/developer-utilities/sha256-hash-generator/Widget.astro`
```astro
---
import HashWidget from '@tools/_shared/HashWidget.astro';
import { config } from './config';
---
<HashWidget slug={config.slug} hashId={config.processorId!} config={config} />
```

---

## structured-data: JSON Formatter

**Engine impl** — `src/lib/engines/structured-data/jsonFormatter.ts`
```ts
import type { StructuredDataTool } from './types';

export const jsonFormatter: StructuredDataTool = {
  id: 'json-formatter',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    try {
      return { ok: true, output: JSON.stringify(JSON.parse(input), null, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
```

**config.ts** — `src/tools/developer-utilities/json-formatter/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  seoTitle: 'JSON Formatter & Beautifier — Free Online Tool',
  description: 'Pretty-print and beautify JSON with proper indentation instantly in your browser. Fast, private, and free.',
  categorySlug: 'developer-utilities',
  tags: ['json formatter', 'json beautifier', 'format json', 'pretty print json'],
  isNew: true,
  updatedAt: '2026-06-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-formatter',
  relatedTools: ['json-minifier', 'json-validator'],
};
```

**Widget.astro** — `src/tools/developer-utilities/json-formatter/Widget.astro`
```astro
---
import StructuredDataWidget from '@tools/_shared/StructuredDataWidget.astro';
import { config } from './config';
---
<StructuredDataWidget slug={config.slug} structuredId={config.processorId!} config={config} />
```

---

## text-analysis: Word Counter

**config.ts** — `src/tools/text/word-counter/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'word-counter',
  name: 'Word Counter',
  seoTitle: 'Word Counter — Free Online Word Count Tool',
  description: 'Count words, characters, sentences, and paragraphs in any text.',
  categorySlug: 'text-utilities',
  tags: ['text', 'count', 'words', 'characters', 'count words online', 'word count checker'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'text-analysis',
  pattern: 'text-metric',
  family: 'text-counting',
  primaryMetric: { metric: 'words', label: 'Words', formatter: 'integer' },
  relatedTools: ['character-counter', 'reading-time-calculator', 'sentence-counter'],
};
```

**Widget.astro** — `src/tools/text/word-counter/Widget.astro`
```astro
---
import TextMetricWidget from '@tools/_shared/TextMetricWidget.astro';
---
<TextMetricWidget
  slug="word-counter"
  emptyMessage="Paste or type text to count words."
  stats={[
    { metric: 'words',       label: 'Words',        formatter: 'integer' },
    { metric: 'characters',  label: 'Characters',   formatter: 'integer' },
    { metric: 'sentences',   label: 'Sentences',    formatter: 'integer' },
    { metric: 'paragraphs',  label: 'Paragraphs',   formatter: 'integer' },
    { metric: 'readingTime', label: 'Reading Time', formatter: 'duration' },
    { metric: 'uniqueWords', label: 'Unique Words', formatter: 'integer' },
  ]}
/>
```

---

## jwt: JWT Decoder

**Engine impl** — `src/lib/engines/jwt/registry.ts` (decode logic lives in `decode.ts`; the registry
just wires it up)
```ts
import type { JwtTool } from './types';
import { decodeJwt } from './decode';

const jwtDecoder: JwtTool = {
  id: 'jwt-decoder',
  family: 'token',
  sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. ... ',
  decode: decodeJwt,
};

export const JWT_TOOLS: Record<string, JwtTool> = {
  'jwt-decoder': jwtDecoder,
};
```

**config.ts** — `src/tools/developer-utilities/jwt-decoder/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  description: 'Decode a JSON Web Token to read its header, payload, and claims. 100% in your browser.',
  categorySlug: 'developer-utilities',
  engine: 'jwt',
  pattern: 'token-decode',
  family: 'token',
  processorId: 'jwt-decoder',
  relatedTools: ['base64-encoder-decoder', 'json-formatter', 'sha256-hash-generator'],
};
```

**Widget.astro**
```astro
---
import JwtWidget from '@tools/_shared/JwtWidget.astro';
import { config } from './config';
---
<JwtWidget slug={config.slug} jwtId={config.processorId!} config={config} />
```

---

## finance: Compound Interest Calculator

**Engine impl** — `src/lib/engines/finance/calculators/compound-interest.ts` (trimmed; the shipped
file also builds a timeline, breakdown, insights, milestones, and cross-tool decisions)
```ts
import type { FinanceCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import { futureValueCompound, futureValueAnnuity } from '../models';
import { money } from '../format';
import { number, positive, choice } from '../validation';

export const compoundInterest: FinanceCalculator = {
  id: 'compound-interest',
  family: 'interest',
  capabilities: { timeline: true, loadExample: true, undo: true },
  fields: [
    { id: 'principal', label: 'Initial amount', type: 'currency', default: 10000, min: 0 },
    { id: 'rate', label: 'Annual interest rate', type: 'percent', default: 7, min: 0, max: 100, suffix: '%' },
    { id: 'frequency', label: 'Compounding frequency', type: 'select', default: '12',
      options: [{ value: '12', label: 'Monthly' }, { value: '1', label: 'Annually' }] },
    { id: 'years', label: 'Years', type: 'duration', default: 20, min: 0, max: 100 },
  ],
  calculate(input, { currency }) {
    const p = positive(input, 'principal', 'an initial amount');
    if (!p.ok) return p.result;
    const r = number(input, 'rate', 'an interest rate', { min: 0, max: 100 });
    if (!r.ok) return r.result;
    const y = number(input, 'years', 'a number of years', { min: 0, max: 100 });
    if (!y.ok) return y.result;

    const n = Number(choice(input, 'frequency', '12'));
    const finalAmount = futureValueCompound(p.value, r.value / 100, n, y.value);

    return successResult({
      hero: card('final', 'Final amount', money(finalAmount, currency), { raw: finalAmount, emphasis: 'hero' }),
      explanation: `${money(p.value, currency)} at ${r.value}% compounded grows to ${money(finalAmount, currency)}.`,
    });
  },
};
```

**Registry entry** — `src/lib/engines/finance/registry.ts`
```ts
import { compoundInterest } from './calculators/compound-interest';

export const FINANCE_CALCULATORS: Record<string, FinanceCalculator> = {
  'compound-interest': compoundInterest,
  // ...other entries
};
```

**Widget.astro**
```astro
---
import FinanceWidget from '@tools/_shared/FinanceWidget.astro';
import { config } from './config';
---
<FinanceWidget slug={config.slug} financeId={config.processorId!} config={config} />
```

`datetime`/`math`/`wellness` calculators follow this exact shape (`SmartFieldDef[]` in,
`InteractiveResult` out) — swap the import paths and widget/prop names per
`references/engine-types.md`.

---

## csv: CSV Cleaner

**Engine impl** — `src/lib/engines/csv/csvClean.ts` (shape only; parsing itself lives in the shared
`src/lib/csv/csv.ts`)
```ts
import type { CsvTool } from './types';
import { parseCsv, serializeCsv } from '@lib/csv/csv';

export const csvClean: CsvTool = {
  id: 'csv-clean',
  family: 'clean',
  inputs: 1,
  execute(input) {
    const parsed = parseCsv(input, { delimiter: ',', smartTypes: false });
    if (!parsed.ok) return { ok: false, output: '', error: 'Could not parse this CSV' };
    // ...trim whitespace, drop empty rows, square up ragged rows...
    const output = serializeCsv(parsed.rows, parsed.headers);
    return { ok: true, output, summary: `${parsed.rows.length} rows · ${parsed.headers.length} columns` };
  },
};
```

**Registry entry** — `src/lib/engines/csv/registry.ts`
```ts
import { csvClean } from './csvClean';

export const CSV_TOOLS: Record<string, CsvTool> = {
  'csv-clean': csvClean,
  // ...other entries
};
```

**config.ts** — `src/tools/developer-utilities/csv-cleaner/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'csv-cleaner',
  name: 'CSV Cleaner',
  description: 'Clean a messy CSV in one pass: remove empty rows, trim stray whitespace, fix trailing commas.',
  categorySlug: 'developer-utilities',
  engine: 'csv',
  pattern: 'csv-transform',
  family: 'clean',
  processorId: 'csv-clean',
  toolGroup: 'csv-tools',
  relatedTools: ['csv-diff', 'csv-to-json-converter'],
};
```

**Widget.astro**
```astro
---
import CsvWidget from '@tools/_shared/CsvWidget.astro';
import { config } from './config';
---
<CsvWidget slug={config.slug} csvId={config.processorId!} config={config} />
```

---

## generation: UUID Generator

**Engine impl** — `src/lib/generation/generators/uuid.ts` (trimmed)
```ts
import type { Generator, GenerationResult, GeneratorOptions } from '../types';

export const uuid: Generator = {
  id: 'uuid',
  family: 'identifier',
  autoGenerate: true,
  fields: [
    { id: 'count', label: 'How many', type: 'number', default: 1, min: 1, max: 100 },
    { id: 'hyphens', label: 'Include hyphens', type: 'boolean', default: true, group: 'Format' },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const count = Math.max(1, Math.min(100, Math.round(Number(opts.count) || 1)));
    // crypto.randomUUID() lives INSIDE generate(), never at module top-level
    const lines = Array.from({ length: count }, () => crypto.randomUUID());
    return { ok: true, kind: 'lines', lines, text: lines.join('\n') };
  },
};
```

**Registry entry** — `src/lib/generation/registry.ts`
```ts
import { uuid } from './generators/uuid';

export const GENERATORS: Record<string, Generator> = {
  uuid,
  // ...other entries
};
```

**config.ts** — `src/tools/generate/uuid-generator/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'uuid-generator',
  name: 'UUID Generator',
  categorySlug: 'generate',
  engine: 'generation',
  pattern: 'generate-identifier',
  family: 'identifier',
  processorId: 'uuid',
  relatedTools: ['random-string-generator', 'password-generator'],
};
```

**Widget.astro**
```astro
---
import GeneratorWidget from '@tools/_shared/GeneratorWidget.astro';
import { config } from './config';
---
<GeneratorWidget slug={config.slug} generatorId={config.processorId!} config={config} />
```

---

## tracker: Water Intake Tracker

**Def** — `src/lib/engines/tracker/registry.ts` (no impl file — a tracker is pure data)
```ts
export const TRACKER_DEFS: Record<string, TrackerDef> = {
  'water-intake': {
    id: 'water-intake',
    unit: 'glasses',
    inputMode: 'increment',
    chart: 'bars',
    streakMode: 'goal',
    step: 1,
    decimals: 0,
    windowDays: 7,
    quickAdds: [1],
    defaultGoal: 8,
    goalLabel: 'Daily goal (glasses)',
  },
  // ...other entries
};
```

**config.ts** — `src/tools/health/water-intake-tracker/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'water-intake-tracker',
  name: 'Water Intake Tracker',
  categorySlug: 'health-fitness',
  engine: 'tracker',
  pattern: 'health-track',
  family: 'habit',
  processorId: 'water-intake',
  relatedTools: ['body-weight-tracker', 'move-today-tracker', 'tdee-calculator'],
};
```

**Widget.astro**
```astro
---
import TrackerWidget from '@tools/_shared/TrackerWidget.astro';
import { config } from './config';
---
<TrackerWidget slug={config.slug} trackerId={config.processorId!} config={config} />
```

---

## color / units: bespoke namespace-backed widgets

Both engines have **no registry and no shared widget** — every tool is a self-contained
`Widget.astro` that calls the `ToyTools.color.*` / `ToyTools.units.*` namespace (attached in
`src/lib/runtime/engines/color.ts` / `units.ts`) directly from its own inline script.

**config.ts** — `src/tools/design/color-format-converter/config.ts`
```ts
export const config: ToolConfig = {
  slug: 'color-format-converter',
  name: 'Color Format Converter',
  categorySlug: 'design-tools',
  engine: 'color',
  pattern: 'color-convert',
  family: 'color',
  relatedTools: ['color-contrast-checker'],
  // no processorId — nothing to resolve in a registry
};
```

**Widget.astro** (excerpt — ToolSplit/IoPanel shell, full script omitted; see the shipped file for
the rest)
```astro
---
import ToolSplit from '@tools/_shared/ToolSplit.astro';
import IoPanel from '@tools/_shared/IoPanel.astro';
---
<ToolSplit ratio="1-1" stackOrder="output-first" stickyOutput={false}>
  <IoPanel slot="input" label="Color" variant="prose">
    <input id="cfc-input" class="widget-input" type="text" value="#3366ff" />
  </IoPanel>
  <IoPanel slot="output" label="Formats" variant="mono" result>
    <ul id="cfc-formats"></ul>
  </IoPanel>
</ToolSplit>

<script is:inline>
  (function () {
    var textEl = document.getElementById('cfc-input');
    var TT = window.ToyTools;
    function render() {
      var res = TT && TT.color ? TT.color.formats(textEl.value) : null;
      // ...render res.formats into #cfc-formats, or the error state...
    }
    textEl.addEventListener('input', render);
    ToyTools.onReady(render);
  })();
</script>
```

`units` tools follow the identical shape, calling `ToyTools.units.pxToCss(...)` /
`ToyTools.units.aspect(...)` etc. instead.

---

## Registration — derived, not edited

There is no registry import to write. Once `src/tools/<segment>/<slug>/config.ts` exists, run
`npm run registries:generate` (scaffold:tool does this automatically) and the tool is registered
via `src/data/registry.generated.ts`. Never hand-edit the registry hubs or `*.generated.ts` files.
