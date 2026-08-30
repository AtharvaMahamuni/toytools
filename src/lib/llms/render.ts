// llms.txt — a curated Markdown overview for LLMs/AI agents, per the llms.txt convention
// (https://llmstxt.org): H1 site name, blockquote summary, then H2 sections of grouped links.
// Registry-derived like the sitemap: category links come from the content manifest (URLs) joined
// with @data/categories (name/description/toolCount), so the file never drifts as tools are
// added. Deliberately links to category pages rather than all 100+ individual tool URLs — each
// category page enumerates its own tools, which keeps this file the curated overview the
// convention asks for instead of a mass link dump.

import type { ContentEntry } from '@lib/content/manifest';
import { absoluteUrl } from '@lib/sitemap/render';
import { categories } from '@data/categories';

const SUMMARY =
  "ToyTools is the internet's little toolbox: free, browser-based tools for text, numbers, " +
  'dates, money, health, design, and code. Every tool runs client-side: no server, no ' +
  'account, and no data collection.';

const DETAIL =
  'ToyTools is one static platform rather than a collection of separate utilities: the ' +
  'computation lives in a set of shared, individually tested engines, and the interface, offline ' +
  'support and privacy contract belong to the platform, so a tool is largely a declaration of ' +
  'which engine it runs on. What it exposes is single-purpose utilities plus interactive physics ' +
  'and math simulations, organized into the categories below. Each category page lists its ' +
  'individual tools.';

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

## Categories

${categoryLines}${optionalLines}
`;
}
