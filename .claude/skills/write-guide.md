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

Good section topics to cover:
- How the tool/concept works mechanically
- When and why to use it (real-world contexts)
- Variations or sub-types (e.g. different case styles, different calculation types)
- Comparison with alternatives

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
