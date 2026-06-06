import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import type { ValidatorCategory } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');

export const SITE_URL = process.env.ASTRO_SITE ?? 'https://toytoolsapp.com';

export const DIST_DIR = resolve(PACKAGE_ROOT, '../dist');
export const ROOT_DIR = resolve(PACKAGE_ROOT, '..');
export const REPORTS_DIR = resolve(PACKAGE_ROOT, 'reports');

export const MAX_FIX_ITERATIONS = 1; // one cycle only — predictable, no loops

export const THRESHOLDS = {
  titleMin: 10,
  titleMax: 70,
  descMin: 50,
  descMax: 160,
} as const;

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

// Locale prefixes: language-stub pages expected to be orphans (WARNING, not BLOCKER)
export const LOCALE_PREFIXES = ['/en/', '/de/', '/fr/', '/ja/'];

// Pages always exempt from orphan detection
export const ORPHAN_EXEMPT_PATHS = new Set(['/', '/404.html']);

export const PHASE_2A_CATEGORIES: ValidatorCategory[] = [
  'build-integrity',
  'metadata',
  'canonical',
  'robots',
  'sitemap',
  'internal-links',
  'orphan-pages',
  'url-integrity',
  'content-integrity',
];

export const PHASE_2B_CATEGORIES: ValidatorCategory[] = [
  'accessibility',
  'performance',
  'structured-data',
];
