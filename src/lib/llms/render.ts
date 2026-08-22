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
  'ToyTools is a static site of single-purpose utilities plus interactive physics and math ' +
  'simulations, organized into the categories below. Each category page lists its individual tools.';

export function renderLlmsTxt(
  categoryEntries: ContentEntry[],
  feedbackEntry: ContentEntry | undefined,
  site: string,
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

  const optionalLines = feedbackEntry
    ? `\n\n## Optional\n\n- [Feedback](${absoluteUrl(feedbackEntry.url, site)}): Report a problem or suggest a tool.`
    : '';

  return `# ToyTools

> ${SUMMARY}

${DETAIL}

## Categories

${categoryLines}${optionalLines}
`;
}
