// Post-build crawl hygiene (GSC ADJUST step 4, 27 Oct 2026). Runs after `astro build` on dist/.
//
// 1. The 22 URLs Search Console reports as "Not found (404)" (the set traced in the 18 Sep audit:
//    9 developer guide renames, 12 plural /tools/ and /categories/ URLs, 1 deleted case-converter
//    guide), plus the guide folded into the whitespace hub, must each build a page, so GitHub
//    Pages never answers them with 404.html.
// 2. No sitemap lists favicon.ico, an /faq/ URL, a redirect stub, a noindex page, or a URL that
//    did not build.
// 3. Every page in the sitemap has a footer that links About, Privacy, Terms and the contact route
//    (/feedback/, labelled "Contact and feedback"), so trust pages are one click from anywhere.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors: string[] = [];

export const GSC_404_URLS: readonly string[] = [
  '/guide/developer/what-is-base64/',
  '/guide/developer/what-is-html-entity-encoding/',
  '/guide/developer/what-is-json-formatting/',
  '/guide/developer/what-is-json-minification/',
  '/guide/developer/how-to-validate-json/',
  '/guide/developer/what-is-md5/',
  '/guide/developer/what-is-sha1/',
  '/guide/developer/what-is-sha256/',
  '/guide/developer/what-is-url-encoding/',
  '/tools/developer/base64-encoder-decoder/',
  '/tools/text/word-counter/',
  '/tools/number/percentage-calculator/',
  '/tools/productivity/keep-screen-awake/',
  '/tools/productivity/notepad/',
  '/tools/productivity/pomodoro-timer/',
  '/tools/productivity/todo-list/',
  '/tools/text/case-converter/',
  '/categories/text-utilities/',
  '/categories/number-utilities/',
  '/categories/developer-tools/',
  '/categories/productivity/',
  '/guide/text/how-to-change-text-case/',
];
const FOLDED_GUIDES = ['/guide/text/how-to-normalize-whitespace/'];
// Hubs that absorbed a folded guide must stay indexable and listed in a sitemap.
export const REQUIRED_IN_SITEMAP: readonly string[] = ['/guide/text/how-to-remove-blank-lines/', '/terms/'];

const page = (url: string) => join(DIST, url, 'index.html');
const isStub = (html: string) => /http-equiv="refresh"/i.test(html);
const isNoindex = (html: string) => /<meta[^>]+name="robots"[^>]+noindex/i.test(html);

if (!existsSync(DIST)) {
  console.error('[check-crawl-hygiene] dist/ is missing: run astro build first');
  process.exit(1);
}

if (GSC_404_URLS.length !== 22) errors.push(`expected the 22 GSC 404 URLs, found ${GSC_404_URLS.length}`);
for (const url of [...GSC_404_URLS, ...FOLDED_GUIDES]) {
  if (!existsSync(page(url))) { errors.push(`${url} does not build: GitHub Pages would serve 404`); continue; }
  const html = readFileSync(page(url), 'utf8');
  if (!isStub(html) || !isNoindex(html)) errors.push(`${url} must be a noindex redirect stub`);
}

const sitemapDir = join(DIST, 'sitemaps');
const sitemapFiles = readdirSync(sitemapDir).filter(f => f.endsWith('.xml')).map(f => join(sitemapDir, f));
let locs = 0;
let footers = 0;

/** What the footer is missing, or null. The contact link may carry ?tool= on tool pages. */
export function footerProblem(html: string): string | null {
  const footer = html.match(/<footer[^>]*role="contentinfo"[\s\S]*?<\/footer>/)?.[0];
  if (!footer) return 'is missing';
  for (const p of ['/about/', '/privacy/', '/terms/']) if (!footer.includes(`${p}"`)) return `has no ${p} link`;
  if (!/<a[^>]*href="[^"]*\/feedback\/(\?tool=[^"]*)?"[^>]*>\s*Contact and feedback\s*<\/a>/.test(footer)) return 'has no "Contact and feedback" link to /feedback/';
  return null;
}
const listed = new Set<string>();
for (const file of sitemapFiles) {
  const xml = readFileSync(file, 'utf8');
  if (!xml.includes('<urlset')) continue; // retired bucket names are HTML stubs, not urlsets
  for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    locs++;
    const path = new URL(loc).pathname;
    listed.add(path);
    const name = file.slice(DIST.length);
    if (/favicon/i.test(path)) { errors.push(`${name} lists ${path}`); continue; }
    if (path.startsWith('/faq/')) { errors.push(`${name} lists FAQ URL ${path}`); continue; }
    const target = path.endsWith('/') ? page(path) : join(DIST, path);
    if (!existsSync(target)) { errors.push(`${name} lists ${path}, which did not build`); continue; }
    if (!target.endsWith('.html')) continue;
    const html = readFileSync(target, 'utf8');
    if (isStub(html)) errors.push(`${name} lists redirect stub ${path}`);
    else if (isNoindex(html)) errors.push(`${name} lists noindex page ${path}`);
    else { const f = footerProblem(html); if (f) errors.push(`${path}: footer ${f}`); else footers++; }
  }
}
if (locs === 0) errors.push('no sitemap URLs found');
if (footers === 0) errors.push('no footer checked');
for (const url of REQUIRED_IN_SITEMAP) if (!listed.has(url)) errors.push(`${url} is missing from the sitemap`);

if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n[check-crawl-hygiene] ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`[check-crawl-hygiene] OK: ${GSC_404_URLS.length} GSC 404 URLs and ${FOLDED_GUIDES.length} folded guide build as stubs; ${locs} sitemap URLs (${REQUIRED_IN_SITEMAP.length} required pages listed), none favicon, FAQ, stub or noindex; ${footers} footers link About, Privacy, Terms and Contact and feedback.`);
