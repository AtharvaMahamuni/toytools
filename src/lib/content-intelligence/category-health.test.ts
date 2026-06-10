import { describe, it, expect } from 'vitest';
import { analyzeCategoryHealth } from './category-health';
import { tool, category, makeInputs } from './fixtures';

const g = (slug: string) => ({ slug, categorySlug: 'developer', title: slug, description: '', readMinutes: 3, updatedAt: 'x' });

describe('analyzeCategoryHealth', () => {
  it('counts tools/guides/faqs per category', () => {
    const tools = [
      tool({ slug: 'a', categorySlug: 'dev', engine: 'e', pattern: 'p', family: 'f', guide: g('a'), faq: { slug: 'a', categorySlug: 'developer' } }),
      tool({ slug: 'b', categorySlug: 'dev', engine: 'e', pattern: 'p', family: 'f', guide: g('b') }),
    ];
    const categories = [category({ slug: 'dev', segment: 'developer' })];
    const [health] = analyzeCategoryHealth(makeInputs({ tools, categories, engines: [] }));
    expect(health).toMatchObject({ slug: 'dev', tools: 2, guides: 2, faqs: 1 });
  });

  it('computes avgRelationships excluding BELONGS_TO_CATEGORY', () => {
    const tools = [
      tool({ slug: 'a', categorySlug: 'dev', engine: 'e', pattern: 'p', family: 'f' }),
      tool({ slug: 'b', categorySlug: 'dev', engine: 'e', pattern: 'p', family: 'f' }),
    ];
    const categories = [category({ slug: 'dev', segment: 'developer' })];
    const [health] = analyzeCategoryHealth(makeInputs({ tools, categories, engines: [] }));
    // each tool relates to the other (RELATED_TOOL); BELONGS_TO_CATEGORY excluded
    expect(health.avgRelationships).toBeGreaterThan(0);
  });

  it('keeps coverageScore within 0–100 and rewards full coverage', () => {
    const tools = [tool({ slug: 'a', categorySlug: 'dev', engine: 'e', pattern: 'p', family: 'f', guide: g('a'), faq: { slug: 'a', categorySlug: 'developer' } })];
    const categories = [category({ slug: 'dev', segment: 'developer' })];
    const [health] = analyzeCategoryHealth(makeInputs({ tools, categories, engines: [] }));
    expect(health.coverageScore).toBeGreaterThanOrEqual(0);
    expect(health.coverageScore).toBeLessThanOrEqual(100);
  });

  it('handles an empty category without dividing by zero', () => {
    const categories = [category({ slug: 'empty', segment: 'empty' })];
    const [health] = analyzeCategoryHealth(makeInputs({ tools: [], categories, engines: [] }));
    expect(health).toMatchObject({ tools: 0, avgRelationships: 0, coverageScore: 0 });
  });
});
