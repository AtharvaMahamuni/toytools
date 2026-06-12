# knowledge.ts reference

Every tool should have a co-located knowledge file. It powers Related Tools /
You May Also Need / Continue Learning, topic clusters, and the EntityMatcher.
A missing file WARNs at build; an invalid one **fails the build**.

## File

`src/tools/<segment>/<slug>/knowledge.ts`. Start from
`seo-engine/output/<slug>/knowledge.draft.ts` if a scaffold exists; otherwise
copy the shape from `src/tools/developer/json-formatter/knowledge.ts`.

```ts
import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: '<slug>',            // MUST equal the tool slug
  title: '<Tool Name>',
  category: '<categorySlug>', // MUST equal config.categorySlug (e.g. 'text-utilities')
  summary: 'One line, max 160 chars.',
  primaryConcepts: [/* 1-2 canonical concepts */],
  secondaryConcepts: [],
  intentGroups: { informational: [], howTo: [], comparison: [], misconception: [], troubleshooting: [] },
  realWorldUseCases: [],
  commonMistakes: [],
  commonQuestions: [],
  usedWith: [],       // [{ slug: 'sibling-tool', reason: 'why', strength: 0.8 }]
  alternatives: [],   // [{ slug: 'alt-tool', reason: 'when to choose it' }]
  nextSteps: [],      // [{ slug: 'next-tool', reason: 'what to do next', priority: 1 }]
  workflowStage: ['transform'], // input | transform | validate | analyze | export
  keywords: [],
  entityAliases: [],
};
```

Author **only** these overlay fields. Related tools/guides/FAQs are derived
from engine/pattern/family/category automatically; do not author them.
Relationship slugs must be real registered tools (the build resolves them).

## Sync rules (the audit's Knowledge Sync section checks these)

- Every `commonQuestions` entry has a matching question in `faq.ts`.
- Every `commonMistakes` topic appears in the guide (common-mistake ReferenceBlock).
- Every `realWorldUseCases` entry is mentioned in the guide or an FAQ answer.

Keep these three short (2-4 entries each) so sync stays easy.

## Registration (one place)

`src/lib/knowledge/registry.ts`:

```ts
import { knowledge as <camelCase> } from '@tools/<segment>/<slug>/knowledge';
// in KNOWLEDGE_ENTRIES:
<camelCase>,
```
