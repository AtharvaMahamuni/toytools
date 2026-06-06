# Skill: Write Guide

Generate a complete `Guide.astro` file for a ToyTools tool that exactly matches the site's guide style.

## When to use

Invoke when the user asks to "write the guide for [tool]", "create a guide for [tool]", or similar.

---

## File location

`src/tools/{slug}/Guide.astro`

---

## Required imports block (copy verbatim, adjust paths)

```astro
---
import GuideLayout from '@layouts/GuideLayout.astro';
import ReferenceBlock from '@components/ReferenceBlock.astro';
import FAQPreview from '@components/FAQPreview.astro';
import { items as faqItems } from './faq';
import { config } from './config';
import { withBase } from '@lib/paths';
import { categories } from '@data/categories';
import type { EcosystemEntry } from '@data/types';

interface Props {
  title: string;
  description: string;
  readMinutes: number;
  updatedAt: string;
  entry: EcosystemEntry;
}

const props = Astro.props;
const category = categories.find(c => c.slug === config.categorySlug)!;
const toolHref = withBase(`/tools/${category.segment}/${config.slug}/`);
const faqHref  = config.faq ? withBase(`/faq/${config.faq.categorySlug}/${config.faq.slug}/`) : null;
---
```

---

## Required GuideLayout wrapper

```astro
<GuideLayout
  {...props}
  toolSlug={config.slug}
  toolName={config.name}
  toolCategorySlug={config.categorySlug}
>
  <!-- sections go here -->
</GuideLayout>
```

---

## Required sections (in this order)

### 1. Quick Answer (required)
```astro
<section id="quick-answer">
  <h2>Quick Answer <span class="gold-dot" aria-hidden="true"></span></h2>
  <p>First paragraph: what the tool/concept is in plain English.</p>
  <p>Second paragraph: who uses it and why it matters.</p>
  <a href={toolHref} class="cta-link">Try The {Tool Name} →</a>
</section>
```

### 2. Conceptual sections (3–5, required)
Each section must have:
- A unique `id` attribute (kebab-case, matches the section heading)
- An `<h2>` with the gold-dot span: `<h2>Title <span class="gold-dot" aria-hidden="true"></span></h2>`
- 3–6 paragraphs of educational content
- At least one `<ReferenceBlock>` per guide (can be in any section)

**At least 3 of the guide's `<h2>` headings must be phrased as questions** (ending with `?`). Questions improve scannability, SEO, and GEO snippet extraction.

Good question heading examples:
- "Why Was Base64 Created?"
- "How Does It Work?"
- "Is Base64 Secure?"
- "When Should You Use Title Case?"

Good section topics to cover:
- How the tool/concept works mechanically
- When and why to use it (real-world contexts)
- Variations or sub-types (e.g. different case styles, different calculation types)
- Comparison with alternatives

**Section writing formula — apply to every conceptual section:**

1. **Direct answer first.** The opening sentence must directly state the answer or core fact. Keep it under 20 words. Do not start with "There are many…", "This can be…", "One of the…", or similar openers.
2. **Explain in 2–4 short paragraphs.** Each paragraph covers one idea. Max 4 sentences per paragraph.
3. **Include at least one example.** Use a concrete before/after, input/output, or real-world scenario. Mark it clearly:
   ```astro
   <p>For example: [specific scenario with real values, not hypothetical X or Y]</p>
   ```
4. **Add a comparison or contrast** where natural. "Unlike X, this approach does Y." Comparisons improve the interestingness score.
5. **Use a `<ReferenceBlock>`** for the most important takeaway or a common mistake in this section.

### 3. Common Mistakes (required)
```astro
<section id="common-mistakes">
  <h2>Common Mistakes <span class="gold-dot" aria-hidden="true"></span></h2>
  <ReferenceBlock type="common-mistake" heading="Mistake title">
    <p>Explanation of the mistake and how to avoid it.</p>
  </ReferenceBlock>
  <!-- 2–3 common-mistake blocks total -->
  <!-- optionally 1 "note" block with a positive tip -->
</section>
```

### 4. History (required)
```astro
<section id="history">
  <h2>History <span class="gold-dot" aria-hidden="true"></span></h2>
  <p>Origins — where and when did this concept/tool come from?</p>
  <p>Development — how did it evolve over time?</p>
  <p>Modern era — how is it used today, and how has it changed?</p>
</section>
```

### 5. FAQ Preview (required last section)
```astro
<section id="faq">
  <h2>Common Questions <span class="gold-dot" aria-hidden="true"></span></h2>
  {faqHref && <FAQPreview items={faqItems.slice(0, 4)} faqHref={faqHref} />}
</section>
```

---

## ReferenceBlock usage

Three types — choose based on content:
```astro
<ReferenceBlock type="key-idea" heading="The core insight">
  <p>A single key concept the reader should understand and remember.</p>
</ReferenceBlock>

<ReferenceBlock type="note" heading="Practical tip">
  <p>A helpful note or positive guidance.</p>
</ReferenceBlock>

<ReferenceBlock type="common-mistake" heading="Mistake name">
  <p>Description of the mistake and how to avoid it.</p>
</ReferenceBlock>
```

Always include the `heading` prop. The content should be 1–3 sentences inside a `<p>` tag.

---

## CTA style block (copy verbatim at the bottom of every guide)

```astro
<style>
  .cta-link {
    display: inline-flex;
    align-items: center;
    height: var(--touch-target);
    padding-inline: var(--space-5);
    margin-top: var(--space-5);
    background: var(--color-accent);
    color: var(--color-text-inverse);
    font-weight: var(--font-weight-semibold);
    font-size: var(--text-base);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: var(--transition-color);
  }

  .cta-link:hover {
    opacity: 0.9;
    text-decoration: none;
  }
</style>
```

---

## Tone and writing guidelines

- **Educational and authoritative**: explain the "why" and "how", not just the "what"
- **Plain English**: avoid jargon; define technical terms inline the first time they appear
- **Declarative facts** over second-person advice ("Most developers use camelCase" rather than "You should use camelCase")
- **Concrete examples**: use specific numbers, names, and scenarios (not hypothetical "X" or "Y")
- **Word count target**: 1,800–2,600 words across all sections
- **No comments in the output**: do not add HTML or Astro comments explaining your choices

---

## Sentence and paragraph rules

These are enforced by the Writing Intelligence Engine. Writing that violates them will score poorly in the audit.

**Sentences:**
- Ideal length: 10–18 words
- Acceptable: up to 25 words
- Never exceed 35 words. Split into two sentences instead.
- Vary sentence length across paragraphs. Do not write 4 sentences of identical length in a row.

**Paragraphs:**
- Maximum 4 sentences per paragraph
- One idea per paragraph
- Always leave a blank line between paragraphs in the Astro source

**Opening sentences after every `<h2>`:**
- Must directly state the answer or core fact
- Must be under 25 words
- Must NOT start with: "There are many…", "There are several…", "This can be…", "One of the…", "In general…", "It depends…"

**Flow between paragraphs:**
- Use transition words at least once every 3 paragraphs: however, therefore, because, as a result, for example, in contrast, additionally, whereas, consequently, instead

---

## Words never to write

The Writing Intelligence Engine penalises these. Avoid them entirely.

**Jargon** (use the plain replacement):
| Avoid | Use instead |
|-------|------------|
| utilize | use |
| leverage | use |
| facilitate | help |
| streamline | simplify |
| robust | reliable / solid |
| comprehensive | complete / full |
| synergy | (delete it) |
| advanced | (be specific instead) |
| powerful | (be specific instead) |
| optimize | improve / tune |
| ecosystem | (be specific: "tools", "libraries", "services") |

**Hedging** (replace with direct statements when the claim is factual):
- generally, typically, usually, often
- may, might, perhaps, can sometimes, in many cases

Exception: keep "may" or "might" only when the outcome is genuinely uncertain.

**Fluff and boring openers** (delete on sight):
- "In today's digital world…"
- "It is important to note…"
- "There are many reasons…"
- "As we all know…"
- "Without a doubt…"
- "This guide will explain…"
- "Benefits of…" (as a heading or opener)
- "It is important to understand…"

**Passive voice** (convert to active):
- is encoded → [subject] encodes
- was created → [subject] created
- are generated → [subject] generates
- is used → [subject] uses
- is known → developers know / [subject] recognises

Exception: leave passive voice when it is the natural idiom for a historical fact, e.g. "Base64 was defined in RFC 1341."

---

## First principles coverage checklist

Every guide must cover all six. Check before finishing:

- [ ] **What it is** — define the concept clearly in the Quick Answer or first conceptual section
- [ ] **Why it matters** — explain the real-world problem it solves (not "it is useful because…")
- [ ] **How it works** — explain the mechanism, not just the outcome
- [ ] **Examples** — at least one concrete, worked example with real values (Input → Output or Before → After)
- [ ] **Common mistakes** — at least one `<ReferenceBlock type="common-mistake">` per guide
- [ ] **Comparisons** — at least one sentence comparing this with an alternative, variant, or related concept

---

## Entity and concept coverage

Guides score higher when they naturally mention the key technical concepts users search alongside this tool. Cover these inline — not as a list, but woven into the prose.

For developer tools (encoding, hashing, conversion):
- Mention the underlying standard or RFC if one exists
- Mention the data formats involved (ASCII, UTF-8, binary, hex, etc.)
- Mention real-world contexts (APIs, JWTs, email, URLs, HTML, JSON)

For text utilities (case conversion, counting, formatting):
- Mention the naming conventions or style guides that define usage
- Mention the programming languages or systems where each form appears

For productivity tools (timers, notes, to-do):
- Mention the research or technique the tool is based on (e.g. Pomodoro technique, cognitive offloading)
- Mention browser storage mechanisms if the tool saves data (localStorage, sessionStorage)

For number utilities (calculators, converters):
- Mention the formula explicitly in prose or in an example
- Mention the units and edge cases (zero, negative values, very large numbers)

---

## Interestingness — write at least one of these per guide

The engine rewards content that teaches memorable concepts. Include at least one:

- A common misconception that the guide corrects: "Many people think X. In fact, Y."
- A surprising fact: "Surprisingly, Base64 makes data 33% larger, not smaller."
- A comparison that reveals insight: "Unlike encryption, Base64 requires no key — anyone can reverse it."
- A "myth vs. reality" framing inside a `<ReferenceBlock type="key-idea">`

---

## Built-in quality targets

A guide written following this skill should score approximately:

| Metric | Target |
|--------|--------|
| Overall Content Intelligence | ≥ 80/100 |
| Writing Quality | ≥ 78/100 |
| Usefulness | ≥ 85/100 |
| SEO Completeness | ≥ 80/100 |
| Clarity | ≥ 85/100 |
| Teaching | ≥ 70/100 |
| Confidence (low hedging) | ≥ 90/100 |
| Jargon | ≥ 95/100 |
| ToyTools Style Match | ≥ 82/100 |

After writing, run the audit to verify:
```bash
cd seo-engine && npm run seo:writing-tool -- <slug>
```

If any category scores below its target, review the relevant section of this skill and apply the fix before finishing.

---

## Registration steps (do these after creating Guide.astro)

1. In `src/tools/{slug}/config.ts`, add to the config object:
   ```ts
   guide: {
     slug: '{guide-slug}',            // kebab-case, e.g. 'how-to-change-text-case'
     categorySlug: '{segment}',       // URL segment: 'text', 'number', 'developer', 'productivity'
     title: 'How To ...',
     description: 'One sentence describing what the reader will learn.',
     readMinutes: 5,
     updatedAt: 'Jun 2026',
   },
   ```
2. In `src/pages/guide/[...slug].astro`, add a static import and entry in `guidesBySlug`:
   ```ts
   import {ToolName}Guide from '../../tools/{slug}/Guide.astro';
   // ...
   '{tool-slug}': {ToolName}Guide,
   ```

The `categorySlug` in `guide` config is the **URL segment**, not the tool's `categorySlug`:
- `text-utilities` → `text`
- `number-utilities` → `number`
- `developer-tools` → `developer`
- `productivity` → `productivity`
