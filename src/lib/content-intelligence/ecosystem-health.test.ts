import { describe, it, expect } from 'vitest';
import { summarizeEcosystem } from './ecosystem-health';
import { analyzeCoverage } from './coverage';
import { analyzeCategoryHealth } from './category-health';
import { analyzeTopicClusters } from './clusters';
import { tool, category, makeInputs } from './fixtures';

const categories = [category({ slug: 'developer-tools', segment: 'developer' })];

function parts(tools: ReturnType<typeof tool>[]) {
  const inputs = makeInputs({ tools, categories, engines: [] });
  return {
    coverage: analyzeCoverage(inputs),
    categoryHealth: analyzeCategoryHealth(inputs),
    clusters: analyzeTopicClusters(inputs),
  };
}

describe('summarizeEcosystem', () => {
  it('computes guide/faq coverage percentages', () => {
    const tools = [
      tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f', guide: { slug: 'ga', categorySlug: 'developer', title: 'GA', description: '', readMinutes: 3, updatedAt: 'x' }, faq: { slug: 'a', categorySlug: 'developer' } }),
      tool({ slug: 'b', engine: 'e', pattern: 'p', family: 'f' }),
    ];
    const eco = summarizeEcosystem(parts(tools));
    expect(eco.toolCount).toBe(2);
    expect(eco.guideCoverage).toBe(50);
    expect(eco.faqCoverage).toBe(50);
  });

  it('keeps ecosystemScore within 0–100', () => {
    const tools = [tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f' })];
    const eco = summarizeEcosystem(parts(tools));
    expect(eco.ecosystemScore).toBeGreaterThanOrEqual(0);
    expect(eco.ecosystemScore).toBeLessThanOrEqual(100);
  });

  it('counts orphan topics', () => {
    const tools = [tool({ slug: 'solo', engine: 'x', pattern: 'y', family: 'z' })];
    const eco = summarizeEcosystem(parts(tools));
    expect(eco.orphanTopics).toBe(1);
  });

  it('handles an empty ecosystem', () => {
    const eco = summarizeEcosystem({ coverage: {}, categoryHealth: [], clusters: [] });
    expect(eco).toMatchObject({ toolCount: 0, guideCoverage: 0, ecosystemScore: 0 });
  });
});
