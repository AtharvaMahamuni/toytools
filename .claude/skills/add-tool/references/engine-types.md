# Engine Types — Quick Reference

All five existing engines, their contracts, and the exact Widget.astro template for each.

---

## Summary table

| `engine` value | Patterns | Families | Impl interface | Runtime call |
|---------------|----------|---------|----------------|--------------|
| `text-processor` | `text-transform`, `text-cleanup` | `transform`, `cleanup` | `TextProcessor` | `ToyTools.process(id, text)` → `string` |
| `encoding` | `encode-decode` | `binary-text`, `web` | `EncodingTool` | `ToyTools.runEncoding(id, mode, text)` → `{ok,output,error?}` |
| `hashing` | `hash` | `cryptographic` | `HashTool` | `await ToyTools.runHash(id, text)` → `string` |
| `structured-data` | `structured-transform`, `structured-validate` | `json` | `StructuredDataTool` | `ToyTools.runStructuredData(id, input)` → `{ok,output,error?}` |
| `text-analysis` | `text-metric` | `text-counting`, `text-time` | *(none — shared)* | `ToyTools.analyze(text)` → `TextAnalysis` |

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
