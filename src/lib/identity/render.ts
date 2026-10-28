// Renders the identity files from the shared facts (./facts.ts), the Organization and Person
// JSON-LD (src/lib/schema/identity.ts) and the llms summary (src/lib/llms/render.ts). The endpoints
// in src/pages call these; golden copies in src/lib/llms/golden pin the output.

import { BRAND_NAME, BRAND_X_URL } from '@config/site';
import { FEEDBACK_FAQ } from '@lib/feedback/faq';
import { llmsTxtForSite, renderSummary } from '@lib/llms/render';
import { withBase } from '@lib/paths';
import { SITE_PRIVACY_LINE } from '@lib/privacy';
import { AUTHOR, identityGraph, logoUrlFor, organizationNode } from '@lib/schema/identity';
import { absoluteUrl } from '@lib/sitemap/render';
import { AI_CRAWLERS, AI_POLICY, DISCOVERY_PATHS, CONTACT_LINE, IDENTITY_FILES, NOT_THE_NAME, TERMS_LINE } from './facts';

const url = (path: string, site: string) => absoluteUrl(withBase(path), site);

const logoUrl = logoUrlFor;

export function renderBrandTxt(site: string): string {
  return `# ${BRAND_NAME} brand

Name: ${BRAND_NAME}
Written: one word, capital T twice. Not ${NOT_THE_NAME.join(', not ')}.
In titles and names, write "and", never an ampersand.
Website: ${url('/', site)}
X: ${BRAND_X_URL}
Founder: ${AUTHOR.name} (${AUTHOR.x}, ${AUTHOR.linkedin})
About: ${url('/about/', site)}
Privacy: ${url('/privacy/', site)}
Contact: ${url('/feedback/', site)}

> ${renderSummary()}
`;
}

export function renderAiTxt(site: string): string {
  return `# ${BRAND_NAME} AI usage policy

# The public pages may be crawled, used for training and cited by AI systems. This matches
# robots.txt, which allows every crawler, including the ones named below.
User-agent: *
Allow: /
${AI_CRAWLERS.map(bot => `\nUser-agent: ${bot}\nAllow: /`).join('\n')}

Crawling: ${AI_POLICY.crawling}
Training: ${AI_POLICY.training}
Citation: ${AI_POLICY.citation}
Attribution: ${AI_POLICY.attribution}. Name "${BRAND_NAME}" and link the page you used.

Summary: ${url('/llms.txt', site)}
Inventory: ${url('/llms-full.txt', site)}
Terms: ${url('/terms/', site)}
Contact: ${url('/feedback/', site)}
`;
}

/** The site-level questions, each answer taken from a shared fact, then the /feedback/ FAQ. */
export function siteFaq(site: string): { question: string; answer: string }[] {
  return [
    { question: `What is ${BRAND_NAME}?`, answer: renderSummary() },
    { question: `Is ${BRAND_NAME} free?`, answer: `${TERMS_LINE} See ${url('/terms/', site)}.` },
    { question: 'Is my data uploaded?', answer: `${SITE_PRIVACY_LINE} See ${url('/privacy/', site)}` },
    { question: `How do I contact ${BRAND_NAME}?`, answer: `${CONTACT_LINE} Use the Contact and feedback page: ${url('/feedback/', site)}` },
    ...FEEDBACK_FAQ.map(({ question, answer }) => ({ question, answer })),
  ];
}

export function renderFaqAiTxt(site: string): string {
  const pairs = siteFaq(site).map(({ question, answer }) => `Q: ${question}\nA: ${answer}`);
  return `# ${BRAND_NAME} FAQ\n\n${pairs.join('\n\n')}\n`;
}

/** /identity.json: exactly the Organization and Person graph BaseLayout puts on every page. */
export function identityJson(site: string): Record<string, unknown> {
  return identityGraph(logoUrl(site));
}

export function aiJson(site: string): Record<string, unknown> {
  return {
    name: BRAND_NAME,
    url: url('/', site),
    description: renderSummary(),
    policy: { ...AI_POLICY, crawlers: [...AI_CRAWLERS] },
    files: IDENTITY_FILES.map(f => ({ url: url(f.path, site), about: f.about })),
    llms: { summary: url('/llms.txt', site), inventory: url('/llms-full.txt', site) },
    privacy: { statement: SITE_PRIVACY_LINE, url: url('/privacy/', site) },
    terms: url('/terms/', site),
    contact: url('/feedback/', site),
    organization: organizationNode(logoUrl(site)),
  };
}

export const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/** The sitemap robots.txt names, on `site`. */
export function sitemapUrl(site: string): string {
  return url('/sitemap-index.xml', site);
}

/**
 * /robots-ai.txt (ADF-010): the AI crawler groups robots.txt already allows, from the same list,
 * so it cannot contradict robots.txt. No Crawl-delay, because robots.txt sets none.
 */
export function renderRobotsAiTxt(site: string): string {
  return `# robots-ai.txt for ${BRAND_NAME}
# Supplementary AI crawler rules. robots.txt is authoritative and allows every crawler.
${AI_CRAWLERS.map(bot => `\nUser-agent: ${bot}\nAllow: /`).join('\n')}

Sitemap: ${sitemapUrl(site)}

${DISCOVERY_PATHS.map(path => `Discovery: ${url(path, site)}`).join('\n')}
`;
}

/** /llm.txt: the short llms.txt, the summary and where the full files are. */
export function renderLlmTxt(site: string): string {
  return `# ${BRAND_NAME}

> ${renderSummary()}

- [llms.txt](${url('/llms.txt', site)}): Core tools, categories and pages.
- [llms-full.txt](${url('/llms-full.txt', site)}): Every published tool.
${IDENTITY_FILES.filter(f => f.path !== '/llm.txt').map(f => `- [${f.path.slice(1)}](${url(f.path, site)}): ${f.about}`).join('\n')}
`;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown in llms.txt: [text](url) links only. */
function inline(text: string): string {
  return escapeHtml(text).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, h) => `<a href="${h}">${t}</a>`);
}

/** The Markdown subset llms.txt uses (#, ##, >, - lists, paragraphs) as HTML. */
export function markdownToHtml(md: string): string {
  const out: string[] = [];
  let list = false;
  for (const line of md.split('\n')) {
    const item = line.startsWith('- ');
    if (list && !item) { out.push('</ul>'); list = false; }
    if (!line.trim()) continue;
    if (line.startsWith('## ')) out.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith('# ')) out.push(`<h1>${inline(line.slice(2))}</h1>`);
    else if (line.startsWith('> ')) out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
    else if (item) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('\n');
}

/** /llms.html: llms.txt as HTML. noindex, canonical to the home page, never in the sitemap. */
export function renderLlmsHtml(site: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${BRAND_NAME} for language models</title>
<link rel="canonical" href="${url('/', site)}">
<link rel="alternate" type="text/plain" href="${url('/llms.txt', site)}">
</head>
<body>
<main>
${markdownToHtml(llmsTxtForSite(site))}
</main>
</body>
</html>
`;
}
