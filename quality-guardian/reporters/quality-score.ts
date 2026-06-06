import type { Issue, ValidatorCategory } from '../types/index.js';

const CATEGORY_WEIGHTS: Record<ValidatorCategory, number> = {
  'metadata': 20,
  'internal-links': 20,
  'content-integrity': 20,
  'accessibility': 15,
  'performance': 15,
  'structured-data': 10,
  'orphan-pages': 0,   // orphan pages block the build — addressed separately
  'canonical': 0,
  'robots': 0,
  'sitemap': 0,
  'url-integrity': 0,
  'build-integrity': 0,
};

// Severity deduction per issue (applied within a category's weight)
const SEVERITY_DEDUCTION: Record<string, number> = {
  BLOCKER: 10,
  ERROR: 5,
  WARNING: 2,
  INFO: 0.5,
};

/**
 * Compute a 0-100 quality score.
 * For reporting only — never blocks builds or PRs.
 */
export function computeQualityScore(issues: Issue[]): number {
  // Group issues by category
  const byCategory = new Map<ValidatorCategory, Issue[]>();
  for (const issue of issues) {
    const existing = byCategory.get(issue.category) ?? [];
    existing.push(issue);
    byCategory.set(issue.category, existing);
  }

  let totalDeduction = 0;

  for (const [category, categoryIssues] of byCategory) {
    const weight = CATEGORY_WEIGHTS[category];
    if (weight === 0) continue;

    // Sum deductions for this category
    const rawDeduction = categoryIssues.reduce(
      (sum, issue) => sum + (SEVERITY_DEDUCTION[issue.severity] ?? 0),
      0
    );

    // Scale: cap deduction at weight (can't lose more than the category is worth)
    const scaledDeduction = Math.min(rawDeduction, weight);
    totalDeduction += scaledDeduction;
  }

  return Math.max(0, Math.round(100 - totalDeduction));
}
