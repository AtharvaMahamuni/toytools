import { load } from 'cheerio';
import { isJunkHeading } from './text.js';
import type { CompetitorPage } from '../../types/index.js';

const QUESTION_STARTERS = /^(what|why|how|when|where|can|should|does|is|are|do|which|who)\b/i;

function isQuestion(text: string): boolean {
  const t = text.trim();
  return t.endsWith('?') || QUESTION_STARTERS.test(t);
}

type JsonLdNode = { '@type'?: string | string[]; '@graph'?: unknown; mainEntity?: unknown; name?: string };

/**
 * Flattens a parsed JSON-LD blob into individual nodes, walking top-level
 * arrays and `@graph` containers (the common modern wrapper).
 */
function flattenJsonLd(data: unknown): JsonLdNode[] {
  if (Array.isArray(data)) return data.flatMap(flattenJsonLd);
  if (data && typeof data === 'object') {
    const node = data as JsonLdNode;
    if (Array.isArray(node['@graph'])) {
      return [node, ...node['@graph'].flatMap(flattenJsonLd)];
    }
    return [node];
  }
  return [];
}

function typesOf(node: JsonLdNode): string[] {
  const t = node['@type'];
  if (Array.isArray(t)) return t.filter(Boolean);
  return t ? [t] : [];
}

/**
 * Extracts structured data from a competitor page's HTML using Cheerio.
 */
export function extractCompetitorPage(html: string, url: string): CompetitorPage {
  const $ = load(html);

  // Remove noise: nav, footer, style, ads, and off-content regions (sidebars,
  // "related/recommended" blocks, recirculation cards) that leak unrelated blog
  // headings into the extracted questions/gaps. Keep JSON-LD scripts — they
  // carry FAQ schema and @type data parsed further down.
  $([
    'nav', 'footer', 'header', 'aside',
    'script:not([type="application/ld+json"])', 'style', 'noscript', 'iframe',
    '[role="navigation"]', '[role="complementary"]', '[role="banner"]',
    '[class*="ad-"]', '[id*="ad-"]', '[class*="cookie"]', '[class*="banner"]',
    '[class*="sidebar"]', '[class*="related"]', '[class*="recirc"]',
    '[class*="recommend"]', '[class*="promo"]', '[class*="newsletter"]',
    '[class*="subscribe"]', '[class*="menu"]', '[class*="breadcrumb"]',
  ].join(', ')).remove();

  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';

  const headingText = (sel: string) =>
    $(sel).map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get()
      .filter(t => t && !isJunkHeading(t));

  const h1 = headingText('h1');
  const h2 = headingText('h2');
  const h3 = headingText('h3');

  const tables = $('table').length;
  const lists = $('ul, ol').length;

  // FAQ questions: headings that look like questions + FAQ schema items
  const faqFromHeadings = [...h2, ...h3].filter(isQuestion);
  const faqFromSchema: string[] = [];
  const schemaTypes: string[] = [];

  // Single pass over JSON-LD blobs, flattened to handle @graph and arrays.
  $('script[type="application/ld+json"]').each((_, el) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse($(el).html() ?? '{}');
    } catch {
      return; // malformed JSON-LD — skip
    }
    for (const node of flattenJsonLd(parsed)) {
      schemaTypes.push(...typesOf(node));
      if (typesOf(node).includes('FAQPage')) {
        const items = Array.isArray(node.mainEntity) ? node.mainEntity : [];
        for (const item of items) {
          if (item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string') {
            faqFromSchema.push((item as { name: string }).name.trim());
          }
        }
      }
    }
  });

  // Also grab elements with FAQ-like class patterns
  $('[class*="faq"] [class*="question"], [class*="faq"] h3, [class*="accordion"] h3').each((_, el) => {
    const text = $(el).text().trim();
    if (text) faqFromSchema.push(text);
  });

  const faqQuestions = [...new Set([...faqFromHeadings, ...faqFromSchema].filter(Boolean))];

  // Word count from body text
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').length : 0;

  return {
    url,
    title,
    description,
    h1,
    h2,
    h3,
    tables,
    lists,
    faqQuestions,
    wordCount,
    schemaTypes: [...new Set(schemaTypes)],
  };
}
