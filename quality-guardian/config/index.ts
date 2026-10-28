import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');

export const SITE_URL = process.env.ASTRO_SITE ?? 'https://toytoolsapp.com';

export const DIST_DIR = resolve(PACKAGE_ROOT, '../dist');
export const ROOT_DIR = resolve(PACKAGE_ROOT, '..');
export const REPORTS_DIR = resolve(PACKAGE_ROOT, 'reports');

export const THRESHOLDS = {
  titleMin: 10,
  titleMax: 70,
  descMin: 50,
  descMax: 160,
} as const;

// Raw (uncompressed) byte ceilings for the weekly performance validator. WARNING-only and weekly-only:
// the real, gzipped, per-page gate is BUDGETS in scripts/check-budget.ts, which fails the build.
// These are a coarse second net. toolPageKB never fired before beta-v12.1.1 because the validator
// matched the stub-only `/tools/` prefix; it now measures every real /tool/<segment>/<slug>/ page.
export const PERFORMANCE_BUDGETS = {
  homeHtmlKB: 100,
  cssKB: 50,
  jsKB: 150,
  toolPageKB: 300,
} as const;

export const LIGHTHOUSE_THRESHOLDS = {
  performance: 95,
  accessibility: 95,
  bestPractices: 100,
  seo: 100,
} as const;

// Generated AI files that happen to be HTML. They are not site pages: /llms.html is llms.txt as
// HTML, noindex with a canonical to the home page, links straight to the .txt and .json files,
// and is kept out of the sitemap on purpose. Its own unit and e2e tests cover it
// (src/lib/identity/render.test.ts, tests/e2e/identity-files.spec.ts).
export const NON_PAGE_HTML = new Set(['/llms.html']);

// Pages always exempt from orphan detection
export const ORPHAN_EXEMPT_PATHS = new Set(['/', '/404.html']);
