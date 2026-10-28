import { describe, expect, it } from 'vitest';
import { BRAND_NAME } from '@config/site';
import { FEEDBACK_FAQ } from '@lib/feedback/faq';
import { SITE_PRIVACY_LINE } from '@lib/privacy';
import { llmsTxtForSite, renderSummary } from '@lib/llms/render';
import { identityGraph, logoUrlFor, ORG_ID, PERSON_ID } from '@lib/schema/identity';
import { AI_CRAWLERS, DISCOVERY_PATHS, IDENTITY_FILES } from './facts';
import {
  aiJson,
  identityJson,
  markdownToHtml,
  renderAiTxt,
  renderBrandTxt,
  renderFaqAiTxt,
  renderLlmTxt,
  renderLlmsHtml,
  renderRobotsAiTxt,
  siteFaq,
} from './render';
import { GET as robotsGet } from '../../pages/robots.txt';

const SITE = 'https://toytoolsapp.com/';
const OTHER = 'https://example.test/';

/** Every "name" value anywhere in a JSON value. */
function names(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(names);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => (k === 'name' && typeof v === 'string' ? [v] : names(v)));
  }
  return [];
}

describe('identity.json is the page JSON-LD', () => {
  it('equals the graph BaseLayout emits on every page, for the same site', () => {
    for (const site of [SITE, OTHER]) {
      expect(identityJson(site)).toEqual(identityGraph(logoUrlFor(new URL(site))));
    }
  });

  it('ai.json carries the same Organization node', () => {
    const graph = identityJson(SITE)['@graph'] as Record<string, unknown>[];
    expect(aiJson(SITE).organization).toEqual(graph.find(n => n['@id'] === ORG_ID));
    expect(graph.map(n => n['@id'])).toEqual([ORG_ID, PERSON_ID]);
  });
});

describe('names match llms.txt', () => {
  const llms = llmsTxtForSite(SITE);

  it('every file names the brand as llms.txt does', () => {
    expect(llms.startsWith(`# ${BRAND_NAME}\n`)).toBe(true);
    for (const text of [renderBrandTxt(SITE), renderAiTxt(SITE), renderFaqAiTxt(SITE)]) {
      expect(text.split('\n')[0]).toMatch(new RegExp(`^# ${BRAND_NAME} `));
    }
    expect(aiJson(SITE).name).toBe(BRAND_NAME);
    expect(names(identityJson(SITE))[0]).toBe(BRAND_NAME);
  });

  it('every file states the llms.txt summary', () => {
    const summary = renderSummary();
    expect(llms).toContain(`> ${summary}`);
    expect(renderBrandTxt(SITE)).toContain(summary);
    expect(renderFaqAiTxt(SITE)).toContain(summary);
    expect(aiJson(SITE).description).toBe(summary);
  });

  it('llms.txt lists every identity file', () => {
    for (const file of IDENTITY_FILES) {
      expect(llms).toContain(`- [${file.path.slice(1)}](${new URL(file.path, SITE).href}): ${file.about}`);
    }
  });
});

describe('no ampersand in any name or title', () => {
  it('holds for the JSON names, the file headings and the FAQ questions', () => {
    const all = [
      ...names(identityJson(SITE)),
      ...names(aiJson(SITE)),
      ...[renderBrandTxt(SITE), renderAiTxt(SITE), renderFaqAiTxt(SITE)].map(t => t.split('\n')[0]!),
      ...siteFaq(SITE).map(q => q.question),
    ];
    expect(all.length).toBeGreaterThan(10);
    expect(all.filter(n => n.includes('&'))).toEqual([]);
  });
});

describe('ai.txt agrees with robots.txt', () => {
  it('allows every crawler robots.txt names, and nothing is disallowed', async () => {
    const res = await (robotsGet as (c: { url: URL }) => Response)({ url: new URL(`${SITE}robots.txt`) });
    const robots = await res.text();
    const agents = (t: string) => [...t.matchAll(/^User-agent: (.+)$/gm)].map(m => m[1]);
    expect(agents(renderAiTxt(SITE))).toEqual(agents(robots));
    expect(agents(robots)).toEqual(['*', ...AI_CRAWLERS]);
    expect(robots).not.toMatch(/Disallow/);
    expect(renderAiTxt(SITE)).not.toMatch(/Disallow/);
    expect(renderAiTxt(SITE)).toMatch(/^Training: allowed$/m);
    expect(renderAiTxt(SITE)).toMatch(/^Citation: allowed$/m);
    expect(renderAiTxt(SITE)).toMatch(/^Attribution: appreciated\./m);
  });
});

describe('site-wide privacy claims', () => {
  it('say what is and is not sent, and link /privacy/, never a bare "Nothing is uploaded"', () => {
    const texts = [renderBrandTxt(SITE), renderAiTxt(SITE), renderFaqAiTxt(SITE), JSON.stringify(aiJson(SITE)), llmsTxtForSite(SITE).split('\n')[2]!];
    for (const text of texts) expect(text).not.toContain('Nothing is uploaded');
    const answer = siteFaq(SITE).find(q => q.question === 'Is my data uploaded?')!.answer;
    expect(answer).toBe(`${SITE_PRIVACY_LINE} See ${SITE}privacy/`);
    expect(SITE_PRIVACY_LINE).toMatch(/analytics/);
    expect(SITE_PRIVACY_LINE).toMatch(/feedback form sends what you submit/);
    expect(aiJson(SITE).privacy).toEqual({ statement: SITE_PRIVACY_LINE, url: `${SITE}privacy/` });
  });
});

describe('faq-ai.txt', () => {
  it('prints the /feedback/ FAQ word for word after the site questions', () => {
    const text = renderFaqAiTxt(SITE);
    for (const item of FEEDBACK_FAQ) expect(text).toContain(`Q: ${item.question}\nA: ${item.answer}`);
    expect(text.match(/^Q: /gm)!.length).toBe(siteFaq(SITE).length);
  });
});

describe('identity files on another site', () => {
  it('link the site they are given, apart from the pinned @ids and the social accounts', () => {
    const texts = [renderBrandTxt(OTHER), renderAiTxt(OTHER), renderFaqAiTxt(OTHER), JSON.stringify(aiJson(OTHER))];
    const urls = texts.flatMap(t => [...t.matchAll(/https?:\/\/[^\s)",]+/g)].map(m => m[0]));
    const off = urls.filter(
      u => !u.startsWith(OTHER) && !/^https:\/\/(x\.com|www\.linkedin\.com)\//.test(u) && !u.startsWith('https://toytoolsapp.com/#') && u !== 'https://toytoolsapp.com/',
    );
    expect(urls.length).toBeGreaterThan(10);
    expect(off).toEqual([]);
  });
});

describe('robots-ai.txt agrees with robots.txt', () => {
  it('allows exactly the AI crawlers robots.txt names, with its sitemap, no Disallow and no Crawl-delay', async () => {
    const res = await (robotsGet as (c: { url: URL }) => Response)({ url: new URL(`${SITE}robots.txt`) });
    const robots = await res.text();
    const text = renderRobotsAiTxt(SITE);
    const agents = (t: string) => [...t.matchAll(/^User-agent: (.+)$/gm)].map(m => m[1]);
    expect(agents(text)).toEqual(agents(robots).filter(a => a !== '*'));
    expect(agents(text)).toEqual([...AI_CRAWLERS]);
    expect(text.match(/^Allow: \/$/gm)!.length).toBe(AI_CRAWLERS.length);
    expect(text).not.toMatch(/Disallow|Crawl-delay/i);
    const sitemap = (t: string) => t.match(/^Sitemap: (.+)$/m)![1];
    expect(sitemap(text)).toBe(sitemap(robots));
  });

  it('lists every Discovery file on the same host, in order', () => {
    const lines = [...renderRobotsAiTxt(SITE).matchAll(/^Discovery: (.+)$/gm)].map(m => m[1]);
    expect(lines).toEqual(DISCOVERY_PATHS.map(p => new URL(p, SITE).href));
    expect(DISCOVERY_PATHS).toEqual(['/llms.txt', '/llms.html', '/ai.txt', '/ai.json', '/identity.json', '/brand.txt', '/faq-ai.txt']);
    for (const line of [...renderRobotsAiTxt(OTHER).matchAll(/^Discovery: (.+)$/gm)]) expect(line[1]!.startsWith(OTHER)).toBe(true);
  });
});

describe('llm.txt and llms.html come from llms.txt', () => {
  it('llm.txt is shorter than llms.txt and opens with its heading and summary', () => {
    const llm = renderLlmTxt(SITE);
    const llms = llmsTxtForSite(SITE);
    expect(llm.length).toBeLessThan(llms.length / 3);
    expect(llm.startsWith(`# ${BRAND_NAME}\n\n> ${renderSummary()}\n`)).toBe(true);
    expect(llms.startsWith(`# ${BRAND_NAME}\n\n> ${renderSummary()}\n`)).toBe(true);
    expect(llm).toContain(`${SITE}llms.txt`);
    expect(llm).toContain(`${SITE}llms-full.txt`);
  });

  it('llms.html renders every llms.txt link, is noindex and canonical to home', () => {
    const html = renderLlmsHtml(SITE);
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toContain(`<link rel="canonical" href="${SITE}">`);
    const mdLinks = [...llmsTxtForSite(SITE).matchAll(/\]\(([^)\s]+)\)/g)].map(m => m[1]);
    const htmlLinks = [...html.matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);
    expect(htmlLinks).toEqual(mdLinks);
    expect(html.match(/<h2>/g)!.length).toBe(llmsTxtForSite(SITE).match(/^## /gm)!.length);
  });

  it('markdownToHtml escapes text', () => {
    expect(markdownToHtml('- [a<b](https://x.test/): c & d')).toBe('<ul>\n<li><a href="https://x.test/">a&lt;b</a>: c &amp; d</li>\n</ul>');
  });
});

describe('the new files are listed', () => {
  it('in llms.txt and ai.json', () => {
    const llms = llmsTxtForSite(SITE);
    const files = (aiJson(SITE).files as { url: string }[]).map(f => f.url);
    for (const path of ['/llm.txt', '/llms.html', '/robots-ai.txt']) {
      expect(IDENTITY_FILES.map(f => f.path)).toContain(path);
      expect(llms).toContain(`](${new URL(path, SITE).href})`);
      expect(files).toContain(new URL(path, SITE).href);
    }
  });
});
