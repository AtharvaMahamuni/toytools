# Guide structure reference

Structural facts only. Style rules and per-slug registration snippets live in
the generated brief (`seo-engine/output/<slug>/PROMPT.md`); if it exists, it
wins. Best teacher: open `src/tools/developer/json-formatter/Guide.astro` and
`src/tools/text/character-counter/Guide.astro` and imitate them.

## File location

`src/tools/<segment>/<slug>/Guide.astro` where `<segment>` is the URL segment
(`text`, `number`, `developer`, `productivity`), two levels under `src/tools/`.

## Skeleton

```astro
---
import GuideLayout from '@layouts/GuideLayout.astro';
import ReferenceBlock from '@components/ReferenceBlock.astro';
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
const toolHref = withBase(`/tool/${category.segment}/${config.slug}/`);
---

<GuideLayout {...props} toolSlug={config.slug} toolName={config.name} toolCategorySlug={config.categorySlug}>
  <!-- sections -->
</GuideLayout>

<style>
  /* copy the .cta-link block from an exemplar guide verbatim */
</style>
```

Note the URL is `/tool/...` (singular). There are no standalone FAQ pages and
no `faqHref`/`FAQPreview`: the FAQ renders automatically on the tool page once
registered in `src/data/faq-registry.ts`.

## Sections

- Every section: `<section id="kebab-case-id">` with
  `<h2>Title <span class="gold-dot" aria-hidden="true"></span></h2>`.
  Section ids are URL anchors; never rename existing ones.
- Order: Quick Answer (definition, who it is for, `.cta-link` to the tool),
  3-5 conceptual sections, Common Mistakes (2-3
  `<ReferenceBlock type="common-mistake">`), History (optional).
- At least 3 `<h2>` headings phrased as questions.
- At least one `<ReferenceBlock>` per guide. Types: `key-idea` (core insight),
  `note` (practical tip), `common-mistake`. Always pass `heading`; body is 1-3
  sentences in a `<p>`.
- Cover all six first principles: what it is, why it matters, how it works,
  examples (real values), common mistakes, comparisons.
- Target 1,100-2,600 words.

## Registration (two authored pieces + one command)

1. `config.ts`: add the `guide` field (`slug`, `categorySlug` = URL segment,
   `title`, `description` max 160 chars, `readMinutes`, `updatedAt`).
2. `Guide.astro` in the tool directory (the route discovers it via glob).
3. Run `npm run registries:generate` (never hand-edit `guide-registry.ts`,
   its `.generated.ts`, or the guide route).

`npm run build` fails when `guide:` is declared without a `Guide.astro`, and
when the generated barrels are stale.

## When editing an existing guide, never touch

- Section `id` attributes or `<h2>` text
- ReferenceBlock `type`/`heading`/structure
- Astro frontmatter, `{...}` expressions, `withBase()` calls
- `<code>` content, the CTA href, the `<style>` block
