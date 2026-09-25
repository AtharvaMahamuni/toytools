// A concise site description in the same shape ToyTools publishes at /llms.txt.
// H1, a blockquote, then H2 sections. Empty optional sections are omitted.
// This is a layout, not a claim that llms.txt is an official standard.

export interface LlmsPageLink {
  name: string;
  url: string;
}

export interface LlmsDraftInput {
  siteName: string;
  siteUrl: string;
  purpose: string;
  contact: string;
  pagesText: string;
  usage: string;
  crawlerPolicy: string;
}

export interface LlmsDraft {
  text: string;
  omitted: string[];
}

export function parseLlmsPages(raw: string, siteUrl: string): LlmsPageLink[] {
  const base = siteUrl.trim();
  const pages: LlmsPageLink[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const bar = trimmed.indexOf('|');
    const name = (bar === -1 ? trimmed : trimmed.slice(0, bar)).trim();
    const href = (bar === -1 ? '' : trimmed.slice(bar + 1)).trim();
    if (!name) continue;
    pages.push({ name: name.replace(/[\[\]]/g, ''), url: resolveUrl(href, base) });
  }
  return pages;
}

function resolveUrl(href: string, siteUrl: string): string {
  if (!href) return siteUrl;
  try {
    return new URL(href, siteUrl || undefined).href;
  } catch {
    return href;
  }
}

export function buildLlmsTxt(input: LlmsDraftInput): LlmsDraft {
  const name = input.siteName.trim() || 'Site';
  const purpose = input.purpose.trim();
  const pages = parseLlmsPages(input.pagesText, input.siteUrl);
  const contact = input.contact.trim();
  const usage = input.usage.trim();
  const policy = input.crawlerPolicy.trim();
  const omitted: string[] = [];

  const parts = [`# ${name}`, ''];
  if (purpose) parts.push(`> ${purpose}`, '');
  else omitted.push('Purpose');

  if (pages.length) {
    parts.push('## Tools', '', ...pages.map(page => `- [${page.name}](${page.url})`), '');
  } else omitted.push('Tools');

  if (contact) parts.push('## Contact', '', contact, '');
  else omitted.push('Contact');

  if (usage) parts.push('## Usage', '', usage, '');
  else omitted.push('Usage');

  if (policy) parts.push('## Crawler policy', '', policy, '');
  else omitted.push('Crawler policy');

  return { text: parts.join('\n').trim() + '\n', omitted };
}
