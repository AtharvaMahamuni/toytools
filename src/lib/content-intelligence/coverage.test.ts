import { describe, it, expect } from 'vitest';
import { analyzeCoverage } from './coverage';
import { tool, category, makeInputs } from './fixtures';

const categories = [category({ slug: 'developer-tools', segment: 'developer' })];

describe('analyzeCoverage', () => {
  it('marks tool true and reflects guide/faq presence', () => {
    const tools = [
      tool({ slug: 'json-formatter', guide: { slug: 'g', categorySlug: 'developer', title: 'G', description: '', readMinutes: 3, updatedAt: 'x' } }),
      tool({ slug: 'json-minifier' }),
    ];
    const cov = analyzeCoverage(makeInputs({ tools, categories, engines: [], faqSlugs: ['json-formatter'] }));
    expect(cov['json-formatter']).toMatchObject({ tool: true, guide: true, faq: true });
    expect(cov['json-minifier']).toMatchObject({ tool: true, guide: false, faq: false });
  });

  it('detects derived related tools/guides from the injected graph', () => {
    const tools = [
      tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'gf', categorySlug: 'developer', title: 'GF', description: '', readMinutes: 3, updatedAt: 'x' } }),
      tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json' }),
    ];
    const cov = analyzeCoverage(makeInputs({ tools, categories, engines: [] }));
    // json-minifier shares engine+pattern with json-formatter → has related tools + a related guide
    expect(cov['json-minifier'].relatedTools).toBe(true);
    expect(cov['json-minifier'].relatedGuides).toBe(true);
  });

  it('reports no related content for a solitary tool', () => {
    const tools = [tool({ slug: 'lonely', engine: 'x', pattern: 'y', family: 'z', categorySlug: 'developer-tools' })];
    const cov = analyzeCoverage(makeInputs({ tools, categories, engines: [] }));
    expect(cov['lonely'].relatedTools).toBe(false);
    expect(cov['lonely'].relatedGuides).toBe(false);
  });

  it('returns an empty report for no tools', () => {
    expect(analyzeCoverage(makeInputs({ tools: [], categories, engines: [] }))).toEqual({});
  });
});
