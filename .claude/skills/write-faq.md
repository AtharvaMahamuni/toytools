# Skill: Write FAQ

Generate a complete `faq.ts` file for a ToyTools tool that exactly matches the site's FAQ style.

## When to use

Invoke when the user asks you to "write the FAQ for [tool]", "generate FAQ items for [tool]", or similar.

---

## Output format

```ts
import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: '{prefix}-faq-1',
    question: 'What is [tool name]?',
    answer: 'Direct answer in plain English, 40–80 words. Includes a concrete example or practical note.',
  },
  // ... 7–11 more items
];
```

- **File location**: `src/tools/{slug}/faq.ts`
- **ID format**: `{short-prefix}-faq-{n}` where prefix is 2–4 chars (e.g. `cc`, `pct`, `wc`, `b64`, `todo`, `notepad`, `ksa`)
- **Item count**: 8–12 items

---

## Question guidelines

Questions must be **direct and user-focused**. Lead with:
- "What is…" — for definitions
- "How do I…" — for practical how-tos
- "Why does…" / "Why should I…" — for motivation and explanation
- "Does this tool…" / "Can I…" — for capability questions
- "What is the difference between…" — for comparisons
- "Will this…" — for consequence questions

**Avoid**: generic openers like "Tell me about…", vague phrases, or overly technical jargon without explanation.

### Coverage checklist — every FAQ must include at least one of each:
- [ ] Definition question ("What is [tool name]?")
- [ ] Practical "how-to" question specific to this tool
- [ ] Edge case or limitation question
- [ ] "Does this tool…" capability question referencing a feature of the actual widget
- [ ] Comparison or "when should I use X vs Y" question
- [ ] Common misconception or "why doesn't it work the way I expect?" question

---

## Answer guidelines

- **Length**: 40–80 words per answer. Short enough to scan, long enough to be genuinely useful.
- **Tone**: Plain English, direct, authoritative. Write for an intelligent adult who is not a specialist.
- **No bullet points** inside answers — answers are a single `string` value. Use commas, dashes, or short sentences instead.
- **Concrete examples**: Include a specific number, name, or scenario where it adds clarity ("e.g., converting '72 out of 90' gives 80%").
- **End with practical advice** where possible: what should the reader do next?
- **Jargon**: If you use a technical term, define it briefly inline.

---

## Reference: existing FAQ patterns

Look at these files for tone and style reference before writing:
- `src/tools/todo-list/faq.ts` — conversational, clear definitions, practical tips
- `src/tools/base64-encoder-decoder/faq.ts` — technical but accessible, includes edge cases
- `src/tools/keep-screen-awake/faq.ts` — addresses limitations and browser compatibility directly
- `src/tools/notepad/faq.ts` — emphasizes privacy and storage behaviour

---

## Registration steps (do these after creating faq.ts)

1. In `src/tools/{slug}/config.ts`, add to the config object:
   ```ts
   faq: {
     slug: '{tool-slug}',
     categorySlug: '{category-segment}',  // e.g. 'text', 'number', 'developer', 'productivity'
   },
   ```
2. In `src/data/faq-registry.ts`, add:
   ```ts
   import { items as {camelCaseName}Faqs } from '@tools/{slug}/faq';
   // and in the faqsByToolSlug object:
   '{tool-slug}': {camelCaseName}Faqs,
   ```

The `categorySlug` in `faq` config is the **segment** (URL path segment), not the `categorySlug` of the tool itself:
- `text-utilities` → segment `text`
- `number-utilities` → segment `number`
- `developer-tools` → segment `developer`
- `productivity` → segment `productivity`
