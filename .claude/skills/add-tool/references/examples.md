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

## Registration — derived, not edited

There is no registry import to write. Once `src/tools/<segment>/<slug>/config.ts` exists, run
`npm run registries:generate` (scaffold:tool does this automatically) and the tool is registered
via `src/data/registry.generated.ts`. Never hand-edit the registry hubs or `*.generated.ts` files.
