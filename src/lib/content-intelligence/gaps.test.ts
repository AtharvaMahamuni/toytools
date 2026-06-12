import { describe, it, expect } from 'vitest';
import { detectGaps } from './gaps';
import { tool, category, makeInputs, makeKnowledge } from './fixtures';

const categories = [
  category({ slug: 'developer-tools', segment: 'developer', engines: ['structured-data', 'encoding'] }),
];

describe('detectGaps', () => {
  it('lists per-topic missing guide/faq/knowledge/relationships', () => {
    const tools = [tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json' })];
    const gaps = detectGaps(makeInputs({ tools, categories, engines: [] }));
    const t = gaps.topics.find(x => x.slug === 'json-minifier')!;
    expect(t.missing).toContain('guide');
    expect(t.missing).toContain('faq');
    expect(t.missing).toContain('knowledge');
    expect(t.missing).toContain('relatedTools'); // solitary tool
  });

  it('omits a fully-covered topic', () => {
    const tools = [
      tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'gf', categorySlug: 'developer', title: 'GF', description: '', readMinutes: 3, updatedAt: 'x' } }),
      tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'gm', categorySlug: 'developer', title: 'GM', description: '', readMinutes: 3, updatedAt: 'x' } }),
    ];
    const knowledge = [makeKnowledge({ slug: 'json-formatter' }), makeKnowledge({ slug: 'json-minifier' })];
    const gaps = detectGaps(makeInputs({
      tools, categories, engines: [], knowledge,
      faqSlugs: ['json-formatter', 'json-minifier'],
    }));
    expect(gaps.topics.find(x => x.slug === 'json-formatter')).toBeUndefined();
  });

  it('derives missing tools from the taxonomy (expected − existing)', () => {
    const tools = [tool({ slug: 'json-formatter', engine: 'structured-data', family: 'json' })];
    const taxonomy = [{ engine: 'structured-data', families: [{ family: 'json', expected: ['json-formatter', 'json-to-csv-converter'] }] }];
    const gaps = detectGaps(makeInputs({ tools, categories, engines: [], taxonomy }));
    expect(gaps.missingTools.map(m => m.expected)).toEqual(['json-to-csv-converter']);
  });

  it('flags a category that declares an engine with no tools', () => {
    const tools = [tool({ slug: 'json-formatter', engine: 'structured-data', family: 'json', categorySlug: 'developer-tools' })];
    const gaps = detectGaps(makeInputs({ tools, categories, engines: [] }));
    // category declares 'encoding' too, but no encoding tool exists
    expect(gaps.categoriesMissingEngines).toContainEqual({ category: 'developer-tools', engine: 'encoding' });
    expect(gaps.categoriesMissingEngines).not.toContainEqual({ category: 'developer-tools', engine: 'structured-data' });
  });
});
