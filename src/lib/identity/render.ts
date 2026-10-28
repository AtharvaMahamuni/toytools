// Renders the identity files from the shared facts (./facts.ts), the Organization and Person
// JSON-LD (src/lib/schema/identity.ts) and the llms summary (src/lib/llms/render.ts). The endpoints
// in src/pages call these; golden copies in src/lib/llms/golden pin the output.

import { BRAND_NAME, BRAND_X_URL } from '@config/site';
import { FEEDBACK_FAQ } from '@lib/feedback/faq';
import { renderSummary } from '@lib/llms/render';
import { withBase } from '@lib/paths';
import { PRIVACY_LINE } from '@lib/privacy';
import { AUTHOR, identityGraph, logoUrlFor, organizationNode } from '@lib/schema/identity';
import { absoluteUrl } from '@lib/sitemap/render';
import { AI_CRAWLERS, AI_POLICY, CONTACT_LINE, IDENTITY_FILES, NOT_THE_NAME, TERMS_LINE } from './facts';

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
    { question: 'Is my data uploaded?', answer: `No. ${PRIVACY_LINE}` },
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
    terms: url('/terms/', site),
    contact: url('/feedback/', site),
    organization: organizationNode(logoUrl(site)),
  };
}

export const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
