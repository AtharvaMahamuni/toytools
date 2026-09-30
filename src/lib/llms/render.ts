// llms.txt — a curated Markdown overview for LLMs/AI agents, per the llms.txt convention
// (https://llmstxt.org): H1 site name, blockquote summary, then H2 sections of grouped links.
// Registry-derived like the sitemap: category links come from the content manifest (URLs) joined
// with @data/categories (name/description/toolCount). Core tools are a closed slug list looked up
// in the registry, so a rename or removal fails the build instead of silently dropping a URL.
//
// Every per-tool fact (name, blurb, privacy, non-goal, URL) is read through toolFacts() in
// ./facts.ts, never from the registry, knowledge or FAQ sources directly; render.test.ts pins that.

import { contentByType, type ContentEntry } from '@lib/content/manifest';
import { absoluteUrl } from '@lib/sitemap/render';
import { categories } from '@data/categories';
import type { Category, Tool } from '@data/types';
import { withBase } from '@lib/paths';
import { PRIVACY_LINE } from '@lib/privacy';
import { allToolFacts, type ToolFacts } from './facts';

/**
 * The short noun each category contributes to the SUMMARY sentence, keyed by category slug.
 *
 * The SUMMARY used to be hand-written prose that named eight subjects (text, numbers, dates, money,
 * health, design, code, prep) and silently skipped the seven added after it (physics, chemistry,
 * applied math, music, fidgets, generators, productivity). The sentence is now generated from
 * categories.ts, in its order, and a category with no entry here throws at build time, so adding a
 * category forces this line to be written in the same PR (CLAUDE.md, "LLM files").
 */
export const CATEGORY_SUMMARY_TERMS: Readonly<Record<string, string>> = {
  'text-utilities': 'text',
  'number-utilities': 'numbers',
  'developer-utilities': 'developer utilities',
  productivity: 'productivity',
  'money-finance': 'money',
  generate: 'generators',
  physics: 'physics',
  'applied-math': 'applied math',
  chemistry: 'chemistry',
  'date-time': 'dates',
  'health-fitness': 'health',
  'design-tools': 'design',
  'music-audio': 'music',
  fidgets: 'fidgets',
  prep: 'prep',
};

type SummaryCategory = Pick<Category, 'slug'>;

/** Each category's summary term, in categories.ts order. Throws on a category with no term. */
export function categorySummaryTerms(list: readonly SummaryCategory[] = categories): string[] {
  const missing = list.filter(c => !CATEGORY_SUMMARY_TERMS[c.slug]).map(c => c.slug);
  if (missing.length) {
    throw new Error(
      `llms.txt SUMMARY has no term for categor${missing.length === 1 ? 'y' : 'ies'} ${missing.join(', ')}. ` +
        'Add one to CATEGORY_SUMMARY_TERMS in src/lib/llms/render.ts.',
    );
  }
  return list.map(c => CATEGORY_SUMMARY_TERMS[c.slug]!);
}

/** "a", "a and b", "a, b, and c". */
function listPhrase(items: readonly string[]): string {
  if (items.length <= 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** The llms.txt blockquote: one sentence naming every category, then the prep and privacy lines. */
export function renderSummary(list: readonly SummaryCategory[] = categories): string {
  return (
    `ToyTools is the internet's little toolbox: free, browser-based tools for ${listPhrase(categorySummaryTerms(list))}. ` +
    `The prep tools prepare text before a model (ToyTools does not run a model). ${PRIVACY_LINE}`
  );
}

/** Categories that hold at least one simulation, as summary terms, in categories.ts order. */
export function simulationSubjects(
  catalog: readonly Pick<Tool, 'categorySlug' | 'pattern'>[] = allToolFacts().map(f => ({
    categorySlug: f.category.slug,
    pattern: f.pattern,
  })),
): string[] {
  const withSims = new Set(catalog.filter(t => t.pattern === 'simulate').map(t => t.categorySlug));
  return categorySummaryTerms(categories.filter(c => withSims.has(c.slug)));
}

export function renderDetail(): string {
  return (
    'ToyTools is one static platform rather than a collection of separate utilities: the ' +
    'computation lives in a set of shared, individually tested engines, and the interface, offline ' +
    'support and privacy contract belong to the platform, so a tool is largely a declaration of ' +
    'which engine it runs on. What it exposes is single-purpose utilities plus interactive ' +
    `${listPhrase(simulationSubjects())} simulations, organized into the categories below. Each ` +
    'category page lists its individual tools.'
  );
}

/**
 * 25 tools an agent should try first. Category highlights plus a few high-intent utilities.
 * Order is the order they appear in the file. Every slug must exist in the registry.
 */
export const CORE_TOOL_SLUGS = [
  'word-counter',
  'character-counter',
  'find-replace',
  'percentage-calculator',
  'discount-calculator',
  'json-formatter',
  'base64-encoder-decoder',
  'jwt-decoder',
  'password-generator',
  'uuid-generator',
  'qr-code-generator',
  'age-calculator',
  'unix-timestamp-converter',
  'timezone-converter',
  'bmi-calculator',
  'tdee-calculator',
  'compound-interest-calculator',
  'sip-calculator',
  'tip-calculator',
  'color-contrast-checker',
  'scientific-calculator',
  'notepad',
  'pomodoro-timer',
  'sha256-hash-generator',
  'lorem-ipsum-generator',
] as const;

/**
 * Prep tools an agent should notice in the short llms.txt. Separate from Core so the
 * closed 25-slug core list stays stable while the Prep category is discoverable by URL.
 */
export const PREP_HIGHLIGHT_SLUGS = [
  'prompt-packer',
  'context-fit-checker',
  'chat-export-cleaner',
] as const;

/** One "- [Name](url): blurb" line per slug, in list order. Throws on a slug not in the registry. */
function highlightLines(slugs: readonly string[], facts: readonly ToolFacts[], label: string): string {
  const bySlug = new Map(facts.map(f => [f.slug, f]));
  const missing = slugs.filter(slug => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(`llms.txt ${label} tools missing from the registry: ${missing.join(', ')}`);
  }
  return slugs
    .map(slug => {
      const f = bySlug.get(slug)!;
      return `- [${f.name}](${f.urls.tool}): ${f.tagline}`;
    })
    .join('\n');
}

export function renderLlmsTxt(
  categoryEntries: ContentEntry[],
  feedbackEntry: ContentEntry | undefined,
  site: string,
  platformEntry?: ContentEntry,
): string {
  const categoryLines = categoryEntries
    .map(entry => {
      const meta = categories.find(c => c.slug === entry.categorySlug);
      if (!meta) return null;
      const count = meta.toolCount === 1 ? '1 tool' : `${meta.toolCount} tools`;
      return `- [${meta.name}](${absoluteUrl(entry.url, site)}): ${meta.description} (${count})`;
    })
    .filter((line): line is string => line !== null)
    .join('\n');

  // The one non-category link worth a crawler's attention: it is where the claim in DETAIL above
  // is actually made, with the engine manifest to back it.
  const extras = [
    platformEntry
      ? `- [Platform](${absoluteUrl(platformEntry.url, site)}): The engines, shared runtime and guarantees every tool is built on.`
      : null,
    feedbackEntry
      ? `- [Feedback](${absoluteUrl(feedbackEntry.url, site)}): Report a problem or suggest a tool.`
      : null,
  ].filter((line): line is string => line !== null);

  const optionalLines = extras.length ? `\n\n## Optional\n\n${extras.join('\n')}` : '';

  const fullUrl = absoluteUrl(withBase('/llms-full.txt'), site);
  const facts = allToolFacts(site);

  return `# ToyTools

> ${renderSummary()}

${renderDetail()}

Every published tool is listed in [llms-full.txt](${fullUrl}).

## Core tools

${highlightLines(CORE_TOOL_SLUGS, facts, 'core')}

## Prep tools

Prepare text before a model. ToyTools does not run a model.

${highlightLines(PREP_HIGHLIGHT_SLUGS, facts, 'prep')}

## Categories

${categoryLines}${optionalLines}
`;
}

/** Completes "Does not: …". Citation text starts with a lowercase verb. */
export function doesNotLine(nonGoal: string | undefined): string {
  const text = (nonGoal?.trim() || 'call an AI model.').replace(/\.$/, '');
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

/** The first sentence of the blurb, ending in a period. */
function useFor(tagline: string): string {
  const raw = tagline.trim().replace(/\s+/g, ' ');
  const sentence = raw.split(/(?<=[.!?])\s/)[0] ?? raw;
  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

/**
 * One compact block per published tool, in category then slug order.
 * The registry is the only list. A tool added later appears here with no second file to edit.
 */
export function renderLlmsFull(site: string, catalog?: Tool[]): string {
  const sorted = allToolFacts(site, catalog).sort((a, b) => {
    const byCategory = a.category.slug.localeCompare(b.category.slug);
    return byCategory !== 0 ? byCategory : a.slug.localeCompare(b.slug);
  });

  const blocks = sorted.map(f =>
    [
      `## ${f.name}`,
      '',
      `URL: ${f.urls.tool}`,
      `Use for: ${useFor(f.tagline)}`,
      `Privacy: ${f.privacy}`,
      `Does not: ${doesNotLine(f.doesNot)}`,
    ].join('\n'),
  );

  return `# ToyTools tool inventory

> ${PRIVACY_LINE} ToyTools does not run an AI model.

${blocks.join('\n\n')}
`;
}

/**
 * What /llms.txt serves on `site`: the category entries and the Platform and Feedback pages from
 * the content manifest, rendered by renderLlmsTxt. The endpoint and the golden test both call it.
 */
export function llmsTxtForSite(site: string): string {
  const standalone = contentByType('page');
  return renderLlmsTxt(
    contentByType('category'),
    standalone.find(p => p.slug === 'feedback'),
    site,
    standalone.find(p => p.slug === 'platform'),
  );
}
