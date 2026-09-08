// llms.txt — a curated Markdown overview for LLMs/AI agents, per the llms.txt convention
// (https://llmstxt.org): H1 site name, blockquote summary, then H2 sections of grouped links.
// Registry-derived like the sitemap: category links come from the content manifest (URLs) joined
// with @data/categories (name/description/toolCount). Core tools are a closed slug list looked up
// in the registry, so a rename or removal fails the build instead of silently dropping a URL.

import type { ContentEntry } from '@lib/content/manifest';
import { absoluteUrl } from '@lib/sitemap/render';
import { categories } from '@data/categories';
import { tools } from '@data/registry';
import { withBase } from '@lib/paths';
import { PRIVACY_LINE } from '@lib/privacy';

const SUMMARY =
  "ToyTools is the internet's little toolbox: free, browser-based tools for text, numbers, " +
  `dates, money, health, design, and code. ${PRIVACY_LINE}`;

const DETAIL =
  'ToyTools is one static platform rather than a collection of separate utilities: the ' +
  'computation lives in a set of shared, individually tested engines, and the interface, offline ' +
  'support and privacy contract belong to the platform, so a tool is largely a declaration of ' +
  'which engine it runs on. What it exposes is single-purpose utilities plus interactive physics ' +
  'and math simulations, organized into the categories below. Each category page lists its ' +
  'individual tools.';

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

function segmentOf(categorySlug: string): string {
  return categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;
}

function coreToolLines(site: string): string {
  const bySlug = new Map(tools.map(t => [t.slug, t]));
  const missing = CORE_TOOL_SLUGS.filter(slug => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(`llms.txt core tools missing from the registry: ${missing.join(', ')}`);
  }
  return CORE_TOOL_SLUGS.map(slug => {
    const tool = bySlug.get(slug)!;
    const path = withBase(`/tool/${segmentOf(tool.categorySlug)}/${tool.slug}/`);
    const blurb = tool.tagline ?? tool.description;
    return `- [${tool.name}](${absoluteUrl(path, site)}): ${blurb}`;
  }).join('\n');
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

  return `# ToyTools

> ${SUMMARY}

${DETAIL}

## Core tools

${coreToolLines(site)}

## Categories

${categoryLines}${optionalLines}
`;
}
