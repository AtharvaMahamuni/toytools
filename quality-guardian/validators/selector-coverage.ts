// Selector coverage: proof, on the real dist/, that every page-type-specific rule reaches real pages.
//
// The tool-specific rules in structured-data, performance and content-integrity, and the weekly
// Lighthouse picker, matched the stub-only `/tools/` prefix for months and passed every run, because
// a rule that selects nothing cannot fail. The unit test (tests/page-kinds.test.ts) pins the
// selectors against the registry's real paths; this runs the same selectors against the crawled
// build on every PR, so a future URL-shape change that strands a rule fails loudly here instead of
// going quietly green again.
//
// Runs inside build-integrity (a PR-phase validator) because the rules it guards are mostly
// weekly-only: the PR is the only place a stranded selector would be caught before it ships.

import type { CrawledPage, Issue } from '../types/index.js';
import type { PageKind } from '../config/page-kinds.js';
import { pageKind } from '../config/page-kinds.js';
import { structuredDataTargets } from './structured-data.js';
import { performanceToolPages } from './performance.js';
import { contentIntegrityToolPages } from './content-integrity.js';
import { selectLighthouseRoutes } from '../workflows/lighthouse-targets.js';

export interface SelectorCase {
  /** Human name, used in the issue id and message. */
  name: string;
  /** The URL paths this rule would run against. */
  paths: string[];
  /** The page kinds the rule is meant to cover. Each needs at least one real page. */
  kinds: PageKind[];
}

export function selectorCases(pages: readonly CrawledPage[]): SelectorCase[] {
  const paths = (list: readonly { urlPath: string }[]) => list.map(p => p.urlPath);
  return [
    { name: 'structured-data/tool', paths: paths(structuredDataTargets(pages, 'tool')), kinds: ['tool'] },
    { name: 'structured-data/category', paths: paths(structuredDataTargets(pages, 'category')), kinds: ['category'] },
    { name: 'structured-data/guide', paths: paths(structuredDataTargets(pages, 'guide')), kinds: ['guide'] },
    { name: 'performance/tool-page-budget', paths: paths(performanceToolPages(pages)), kinds: ['tool'] },
    { name: 'content-integrity/tool', paths: paths(contentIntegrityToolPages(pages)), kinds: ['tool'] },
    { name: 'weekly/lighthouse', paths: selectLighthouseRoutes(pages), kinds: ['homepage', 'category', 'tool', 'guide'] },
  ];
}

export function selectorCoverageIssues(
  pages: readonly CrawledPage[],
  cases: SelectorCase[] = selectorCases(pages),
): Issue[] {
  const stubs = new Set(pages.filter(p => p.isRedirectStub).map(p => p.urlPath));
  const issues: Issue[] = [];

  for (const { name, paths, kinds } of cases) {
    for (const kind of kinds) {
      if (!paths.some(p => pageKind(p) === kind)) {
        issues.push({
          id: `build-integrity:/:selector-misses-${kind}:${name}`,
          severity: 'ERROR',
          category: 'build-integrity',
          page: '/',
          message: `Validator rule "${name}" selects no real ${kind} page, so it checks nothing`,
          fixable: false,
          auto_fix_strategy: 'MANUAL',
          detail: 'The live URL shapes live in quality-guardian/config/page-kinds.ts. Fix the shape there, never by adding paths.',
        });
      }
    }
    const selectedStubs = paths.filter(p => stubs.has(p));
    if (selectedStubs.length > 0) {
      issues.push({
        id: `build-integrity:/:selector-hits-stub:${name}`,
        severity: 'ERROR',
        category: 'build-integrity',
        page: selectedStubs[0]!,
        message: `Validator rule "${name}" selects ${selectedStubs.length} redirect stub(s)`,
        fixable: false,
        auto_fix_strategy: 'MANUAL',
        detail: selectedStubs.slice(0, 5).join(', '),
      });
    }
  }

  return issues;
}
