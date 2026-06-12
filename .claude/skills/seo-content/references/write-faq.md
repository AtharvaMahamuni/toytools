# FAQ reference

## File

`src/tools/<segment>/<slug>/faq.ts`:

```ts
import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: '<prefix>-faq-1',   // prefix: 2-4 chars (cc, b64, json-fmt, todo)
    question: 'What is <tool name>?',
    answer: 'Plain string, 40-80 words, direct, with a concrete example or number. No markdown, no bullets, no links. End with practical advice when possible.',
  },
  // 8-12 items total
];
```

## Coverage (include at least one of each)

- Definition ("What is ...?")
- Practical how-to specific to this tool
- Edge case or limitation
- Capability question about the actual widget ("Does this tool ...?")
- Comparison ("X vs Y", "when should I use ...")
- Misconception or "why doesn't it work the way I expect?"

Tone references: `src/tools/developer/json-formatter/faq.ts`,
`src/tools/text/character-counter/faq.ts`.

## Registration (one place)

`src/data/faq-registry.ts`:

```ts
import { items as <camelCase>Faqs } from '@tools/<segment>/<slug>/faq';
// in faqsByToolSlug:
'<slug>': <camelCase>Faqs,
```

There is **no** `faq` field in `config.ts` (it was removed). Do not create
pages under `src/pages/faq/` or entries in `faq-redirects.ts` (legacy redirect
stubs only). Once registered, the tool page renders the accordion at `#faq`
and emits FAQPage JSON-LD automatically.

When improving an existing FAQ: edit only `answer:` strings; never change
`id:` or `question:`; do not add or remove items unless asked.
