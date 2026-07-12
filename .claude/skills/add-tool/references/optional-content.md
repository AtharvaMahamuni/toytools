# Optional Content — FAQs, Guides, Knowledge Files

Add these after the tool is registered and `npm run build` passes. Each is independent.

---

## FAQ

FAQs live on the tool page only (no standalone FAQ pages). They appear in the `#faq` section, emit `FAQPage` JSON-LD, and add "Common Questions (N)" to the tool nav row automatically.

### Step 1 — Create `faq.ts`

**File:** `src/tools/<segment>/<slug>/faq.ts`

```ts
import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'my-tool-faq-1',        // must be unique across the tool's FAQ list
    question: 'How does X work?',
    answer: 'X works by ...',   // plain text or minimal HTML
  },
  {
    id: 'my-tool-faq-2',
    question: 'Is this free?',
    answer: 'Yes. All tools run entirely in your browser.',
  },
];
```

### Step 2 — Regenerate the registration barrels

```sh
npm run registries:generate
```

Registration is derived from `faq.ts` presence in the tool directory — never hand-edit
`faq-registry.ts` or `faq-registry.generated.ts`. The tool page automatically renders the FAQ
accordion.

---

## Guide

A guide is a standalone page at `/guide/<category>/<guide-slug>/`. Two authored pieces — the
`guide:` field in config.ts and the `Guide.astro` file — plus one regenerate; the route map and
slug registry both derive from `Guide.astro` presence, so they cannot drift.

### Step 1 — Add `guide` field to `config.ts`

```ts
guide: {
  slug: 'how-to-do-x',             // becomes the URL: /guide/text/how-to-do-x/
  categorySlug: 'text',            // URL segment (not the full category slug)
  title: 'How To Do X',
  description: 'One sentence shown in meta and guide listings.',
  readMinutes: 4,
  updatedAt: 'Jun 2026',
},
```

### Step 2 — Create `Guide.astro`

**File:** `src/tools/<segment>/<slug>/Guide.astro`

```astro
---
import GuideLayout from '@layouts/GuideLayout.astro';
import { config } from './config';
---

<GuideLayout config={config}>
  <p>Introduction paragraph...</p>

  <h2>Section heading</h2>
  <p>Section content...</p>
</GuideLayout>
```

Consult `seo-content` skill (`references/write-guide.md`) for full guide structure conventions.

### Step 3 — Regenerate the registration barrels

```sh
npm run registries:generate
```

The guide route discovers `Guide.astro` components via `import.meta.glob`, and
`guide-registry.generated.ts` derives the slug list from the same file presence — never hand-edit
either. `validate-registry.ts` fails the build when config declares `guide:` but no `Guide.astro`
exists (and `validate-architecture` when the barrels are stale).

---

## Knowledge file

Knowledge files power the related tools graph, topic clusters, EntityMatcher, and the `dist/knowledge-graph.json` diagnostics. A missing file generates a build warning; an invalid one fails the build.

### Step 1 — Generate a stub

```sh
npm run seo:scaffold -- <slug>
```

This writes `seo-engine/output/<slug>/knowledge.draft.ts` with `primaryConcepts` and `intentGroups` pre-filled from SERP research. Copy it to the tool directory and rename to `knowledge.ts`.

**File:** `src/tools/<segment>/<slug>/knowledge.ts`

### Step 2 — Fill in overlay fields

Fields you must author (the rest are derived automatically):

```ts
import { KNOWLEDGE_SCHEMA_VERSION } from '@lib/knowledge/types';
import type { Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'my-tool-slug',              // must equal config.slug
  title: 'My Tool Name',
  category: 'text-utilities',        // must equal config.categorySlug
  summary: 'One sentence, ≤160 chars.',

  // Concepts (author these)
  primaryConcepts: ['concept-a', 'concept-b'],
  secondaryConcepts: ['concept-c'],

  // Intent groups (author these)
  intentGroups: {
    informational: ['what is X', 'how does X work'],
    howTo: ['how to convert X', 'X online'],
  },

  // Real-world context (author these)
  realWorldUseCases: ['Python variable naming', 'database column names'],
  commonMistakes: ['Confusing X with Y'],
  commonQuestions: ['What is X?', 'When should I use X?'],

  // Curated relations (author these; targets must exist in registry)
  usedWith: [{ slug: 'related-tool', reason: 'Often used together' }],
  alternatives: [{ slug: 'alternative-tool' }],
  nextSteps: [{ slug: 'next-tool', reason: 'Natural next step' }],

  // Metadata (author these)
  workflowStage: 'transform',
  keywords: ['keyword1', 'keyword2'],
  entityAliases: ['alias1', 'alias2'],
};
```

**RelationshipReference type:** `{ slug: string, reason?: string, strength?: 'strong'|'medium'|'weak', priority?: number }`

All `slug` values in `usedWith`/`alternatives`/`nextSteps` must resolve to registered tools.

### Step 3 — Regenerate the registration barrels

```sh
npm run registries:generate
```

Registration derives from `knowledge.ts` presence in the tool directory — never hand-edit
`src/lib/knowledge/registry.ts` or its `registry.generated.ts`.

### Validation

```sh
npm run build    # invalid knowledge (bad shape, unresolved slug) → BUILD FAILS
npm run health   # missing knowledge → WARNING (or ERROR if KNOWLEDGE_REQUIRED=true)
```

---

## Tool groups

Group sibling tools that share one engine so they render a `GroupSwitcher` pill row and persist input across mode switches.

### Requirements

- All members must share the same `engine` + `pattern` (validator enforces this).
- Each member keeps its own URL, slug, guide, FAQ, and sitemap entry — URLs are never merged.

### Step 1 — Declare the group in `src/data/tool-groups.ts`

```ts
{
  id: 'case-converters',
  name: 'Case Converters',
  members: [
    { slug: 'uppercase-converter', label: 'UPPER' },
    { slug: 'lowercase-converter', label: 'lower' },
    { slug: 'snake-case-converter', label: 'snake_case' },
    // add new member here
    { slug: 'my-new-tool', label: 'myLabel' },
  ],
},
```

### Step 2 — Set `toolGroup` in each member's `config.ts`

```ts
toolGroup: 'case-converters',
```

All existing members must be updated if a group member is added. The validator checks that every `toolGroup` reference resolves to a declared group and that every declared member has `toolGroup` set.
