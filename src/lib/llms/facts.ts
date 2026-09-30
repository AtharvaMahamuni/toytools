// ToolFacts: the one per-tool projection the llms files render from.
//
// It is derived, not authored. Authoring stays where it is, colocated in the tool directory:
//   • config.ts (via the registry): name, tagline, description, citation, methodology,
//     trustVariant, updatedAt, guide;
//   • knowledge.ts: summary, inputs, outputs, use cases, how-to queries;
//   • faq.ts: the FAQ items.
// Simulations reach the same fields through their manifests (src/lib/simulation/derived.ts).
//
// URLs come from the URL builder only (canonicalFor in src/lib/paths.ts), never spelled here.
// llms.txt and llms-full.txt (src/lib/llms/render.ts) read a tool only through toolFacts(), so
// every llms surface states the same facts in the same words.

import { categories } from '@data/categories';
import { faqsByToolSlug } from '@data/faq-registry';
import { tools } from '@data/registry';
import type { FAQItem, Tool } from '@data/types';
import { getKnowledge } from '@lib/knowledge/registry';
import { canonicalFor } from '@lib/paths';
import { privacyStatement } from '@lib/privacy';

export interface ToolFacts {
  slug: string;
  name: string;
  /** The tool's category. `name` is absent only for a category missing from categories.ts. */
  category: { slug: string; segment: string; name?: string };
  /** config.pattern, e.g. 'simulate'. */
  pattern?: Tool['pattern'];
  /** The one-line blurb: config.tagline, or config.description while a tool has no tagline. */
  tagline: string;
  /** knowledge.summary, when the tool has a knowledge file. */
  summary?: string;
  /** config.citation.problem: the job, in one sentence. */
  problem?: string;
  /** config.citation.nonGoal: completes "It does not ...", as authored. */
  doesNot?: string;
  /** privacyStatement(config.trustVariant). */
  privacy: string;
  /** knowledge.inputs / knowledge.outputs (decision D2: knowledge.ts is their home). */
  inputs: string[];
  outputs: string[];
  /** knowledge.realWorldUseCases. */
  useCases: string[];
  /** knowledge.intentGroups.howTo[0]: a query this tool answers. */
  exampleQuery?: string;
  /** config.methodology. */
  methodology?: { name: string; detail: string };
  /** The tool's FAQ items (faq.ts, or its simulation manifest). */
  faq: FAQItem[];
  /** Absolute URLs from canonicalFor(): the tool page and, when the tool has one, its guide. */
  urls: { tool: string; guide?: string };
  /** config.updatedAt (YYYY-MM-DD), when set. */
  updatedAt?: string;
}

/** The facts for one tool, with URLs on `site` (Astro.site; the production origin when absent). */
export function toolFacts(tool: Tool, site?: URL | string | null): ToolFacts {
  const category = categories.find(c => c.slug === tool.categorySlug);
  // A tool whose category is missing keeps its categorySlug as the segment, as the renderer always
  // did. validate-registry fails the build on such a tool, so this only serves test fixtures.
  const segment = category?.segment ?? tool.categorySlug;
  const knowledge = getKnowledge(tool.slug);
  return {
    slug: tool.slug,
    name: tool.name,
    category: { slug: tool.categorySlug, segment, name: category?.name },
    pattern: tool.pattern,
    tagline: tool.tagline ?? tool.description,
    summary: knowledge?.summary,
    problem: tool.citation?.problem,
    doesNot: tool.citation?.nonGoal,
    privacy: privacyStatement(tool.trustVariant),
    inputs: knowledge?.inputs ?? [],
    outputs: knowledge?.outputs ?? [],
    useCases: knowledge?.realWorldUseCases ?? [],
    exampleQuery: knowledge?.intentGroups.howTo[0],
    methodology: tool.methodology,
    faq: faqsByToolSlug[tool.slug] ?? [],
    urls: {
      tool: canonicalFor({ kind: 'tool', slug: tool.slug, segment }, site),
      guide: tool.guide
        ? canonicalFor({ kind: 'guide', slug: tool.guide.slug, categorySlug: tool.guide.categorySlug }, site)
        : undefined,
    },
    updatedAt: tool.updatedAt,
  };
}

/** toolFacts() for every tool in `catalog` (the registry by default), in catalog order. */
export function allToolFacts(site?: URL | string | null, catalog: readonly Tool[] = tools): ToolFacts[] {
  return catalog.map(tool => toolFacts(tool, site));
}
