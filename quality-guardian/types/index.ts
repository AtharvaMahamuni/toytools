export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'BLOCKER';
export type FixStrategy = 'AUTO_FIX' | 'SUGGESTION' | 'MANUAL';
// AUTO_FIX: generated artifacts only (sitemap, robots.txt, route manifest) — rebuild with correct env
// SUGGESTION: metadata quality, internal linking recommendations — human action required
// MANUAL: content decisions, metadata writing, structural changes

export type ValidatorCategory =
  | 'build-integrity'
  | 'metadata'
  | 'canonical'
  | 'sitemap'
  | 'robots'
  | 'internal-links'
  | 'orphan-pages'
  | 'url-integrity'
  | 'content-integrity'
  | 'accessibility'
  | 'performance'
  | 'structured-data';

export interface Issue {
  id: string;                      // `${category}:${urlPath}:${code}` — deterministic
  severity: Severity;
  category: ValidatorCategory;
  page: string;                    // URL path e.g. "/tools/text/word-counter/"
  message: string;
  fixable: boolean;                // true only for generated-artifact issues (AUTO_FIX)
  auto_fix_strategy: FixStrategy;
  detail?: string;
}

export interface ParsedJsonLd {
  raw: string;
  parsed: unknown;
  parseError?: string;
  types: string[];                 // flattened — includes @graph[*]['@type']
}

export interface CrawledPage {
  filePath: string;                // absolute path in dist/
  urlPath: string;                 // e.g. "/tools/text/word-counter/"
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  h1s: string[];
  h2s: string[];
  internalLinks: string[];         // resolved URL paths this page links to
  jsonLdBlocks: ParsedJsonLd[];
  robots: string;                  // <meta name="robots"> content
  isRedirectStub: boolean;         // has <meta http-equiv="refresh"> — a retired URL kept alive
  fileSizeBytes: number;
  // Phase 2B fields (populated by html-parser even in Phase 2A, used only in 2B)
  altMissingCount: number;
  ariaLabelMissingCount: number;
  headingHierarchyViolations: string[];
}

export interface QualityContext {
  distDir: string;                 // absolute path to dist/
  siteUrl: string;                 // https://toytoolsapp.com
  manifestRoutes: string[];        // from dist/route-manifest.json
  inboundLinks?: Map<string, Set<string>>; // populated by internal-links validator
}

export interface ValidatorResult {
  issues: Issue[];
}

export interface Validator {
  name: ValidatorCategory;
  detect(pages: CrawledPage[], ctx: QualityContext): Promise<ValidatorResult>;
}

export interface LighthouseResult {
  url: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface PerformanceSnapshot {
  date: string;                    // ISO date YYYY-MM-DD
  homepageHtmlKB: number;
  totalCssKB: number;
  totalJsKB: number;
  largestToolPageKB: number;
  largestGuidePageKB: number;
  largestFaqPageKB: number;
}

export interface QualityReport {
  timestamp: string;
  pagesScanned: number;
  issuesFound: number;
  rebuildsTriggered: number;
  remainingIssues: number;
  qualityScore: number;            // 0-100, reporting only — never blocks builds
  exitCode: 0 | 1;
  issues: Issue[];
  lighthouseResults?: LighthouseResult[];
  performanceSnapshot?: PerformanceSnapshot;
}

export interface RouteManifest {
  generated: string;
  routes: string[];
}
