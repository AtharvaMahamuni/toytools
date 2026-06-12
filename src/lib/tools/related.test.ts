import { describe, it, expect } from 'vitest';
import { getRelatedTools, getRelatedGuides, relationTier, tierStrength } from './related';
import type { ToolConfig } from '@data/types';

function tool(overrides: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return {
    name: overrides.slug,
    description: 'test tool',
    categorySlug: 'test',
    tags: [],
    ...overrides,
  };
}

describe('getRelatedTools', () => {
  it('returns empty array when no other tools exist', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    expect(getRelatedTools(current, [current])).toEqual([]);
  });

  it('excludes self from results', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    const other = tool({ slug: 'b', categorySlug: 'text' });
    const result = getRelatedTools(current, [current, other]);
    expect(result.every(t => t.slug !== 'a')).toBe(true);
  });

  it('returns empty array when only self is in list', () => {
    const current = tool({ slug: 'a' });
    expect(getRelatedTools(current, [current])).toEqual([]);
  });

  it('respects max parameter', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    const others = ['b', 'c', 'd', 'e', 'f', 'g'].map(s => tool({ slug: s, categorySlug: 'text' }));
    const result = getRelatedTools(current, [current, ...others], 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('defaults max to 6', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    const others = Array.from({ length: 10 }, (_, i) => tool({ slug: `t${i}`, categorySlug: 'text' }));
    const result = getRelatedTools(current, [current, ...others]);
    expect(result.length).toBeLessThanOrEqual(6);
  });

  it('tier1 (same pattern + engine) ranks before tier2 (engine-only match)', () => {
    const current = tool({ slug: 'a', engine: 'text-processor', pattern: 'transform', family: 'case' });
    const tier1Tool = tool({ slug: 'b', engine: 'text-processor', pattern: 'transform', family: 'case' });
    const tier2Tool = tool({ slug: 'c', engine: 'text-processor', pattern: 'cleanup', family: 'whitespace' });
    const result = getRelatedTools(current, [current, tier2Tool, tier1Tool]);
    expect(result[0].slug).toBe('b'); // tier1 first
    expect(result[1].slug).toBe('c'); // tier2 second
  });

  it('tier2 (engine match) ranks before tier3 (family match)', () => {
    const current = tool({ slug: 'a', engine: 'text-processor', pattern: 'transform', family: 'case', categorySlug: 'text' });
    const tier2Tool = tool({ slug: 'b', engine: 'text-processor', pattern: 'other', family: 'other', categorySlug: 'text' });
    const tier3Tool = tool({ slug: 'c', engine: 'other-engine', pattern: undefined, family: 'case', categorySlug: 'text' });
    const result = getRelatedTools(current, [current, tier3Tool, tier2Tool]);
    expect(result[0].slug).toBe('b');
    expect(result[1].slug).toBe('c');
  });

  it('tier3 (family match) ranks before tier4 (category match)', () => {
    const current = tool({ slug: 'a', family: 'case', categorySlug: 'text' });
    const tier3Tool = tool({ slug: 'b', family: 'case', categorySlug: 'other' });
    const tier4Tool = tool({ slug: 'c', family: 'other', categorySlug: 'text' });
    const result = getRelatedTools(current, [current, tier4Tool, tier3Tool]);
    expect(result[0].slug).toBe('b');
    expect(result[1].slug).toBe('c');
  });

  it('tier4 (category match) captures same-category tools with no other match', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    const sameCategory = tool({ slug: 'b', categorySlug: 'text' });
    const differentCategory = tool({ slug: 'c', categorySlug: 'number' });
    const result = getRelatedTools(current, [current, sameCategory, differentCategory]);
    expect(result.map(t => t.slug)).toContain('b');
    expect(result.map(t => t.slug)).not.toContain('c');
  });

  it('tool with no shared attributes does not appear in results', () => {
    const current = tool({ slug: 'a', categorySlug: 'text', engine: 'text-processor', pattern: 'transform', family: 'case' });
    const unrelated = tool({ slug: 'b', categorySlug: 'number', engine: 'number-engine', pattern: 'arithmetic', family: 'math' });
    const result = getRelatedTools(current, [current, unrelated]);
    expect(result.map(t => t.slug)).not.toContain('b');
  });

  it('tier1 requires both pattern and engine to match (not just one)', () => {
    const current = tool({ slug: 'a', engine: 'text-processor', pattern: 'transform' });
    // same engine, different pattern — should be tier2, not tier1
    const sameEngineOnly = tool({ slug: 'b', engine: 'text-processor', pattern: 'cleanup' });
    // same pattern, different engine — undefined engine means falsy, not tier1
    const samePatternOnly = tool({ slug: 'c', pattern: 'transform', engine: undefined });
    const result = getRelatedTools(current, [current, sameEngineOnly, samePatternOnly]);
    // sameEngineOnly lands in tier2 (engine matches), samePatternOnly has no engine so skips tier1+tier2
    expect(result.length).toBeGreaterThan(0);
    // sameEngineOnly should come before samePatternOnly (if samePatternOnly appears at all)
    const slugs = result.map(t => t.slug);
    if (slugs.includes('c')) {
      expect(slugs.indexOf('b')).toBeLessThan(slugs.indexOf('c'));
    }
  });

  it('returns all tools within max when fewer exist', () => {
    const current = tool({ slug: 'a', categorySlug: 'text' });
    const others = [tool({ slug: 'b', categorySlug: 'text' }), tool({ slug: 'c', categorySlug: 'text' })];
    const result = getRelatedTools(current, [current, ...others], 10);
    expect(result.length).toBe(2);
  });
});

describe('relationTier / tierStrength', () => {
  it('ranks pattern+engine match as tier 1', () => {
    const a = tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    const b = tool({ slug: 'b', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    expect(relationTier(a, b)).toBe(1);
  });

  it('returns 0 for self and for unrelated tools', () => {
    const a = tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    const z = tool({ slug: 'z', engine: 'x', pattern: 'y', family: 'w', categorySlug: 'other' });
    expect(relationTier(a, a)).toBe(0);
    expect(relationTier(a, z)).toBe(0);
  });

  it('maps tiers to descending strengths', () => {
    expect(tierStrength(1)).toBe(0.9);
    expect(tierStrength(2)).toBe(0.6);
    expect(tierStrength(3)).toBe(0.4);
    expect(tierStrength(4)).toBe(0.2);
    expect(tierStrength(0)).toBe(0);
  });
});

describe('getRelatedGuides', () => {
  const withGuide = (slug: string, extra: Partial<ToolConfig> = {}) =>
    tool({ slug, guide: { slug, categorySlug: 'developer', title: slug, description: '', readMinutes: 3, updatedAt: 'x' }, ...extra });

  it('only returns tools that have a guide', () => {
    const current = tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    const hasGuide = withGuide('b', { engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    const noGuide = tool({ slug: 'd', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'c' });
    const result = getRelatedGuides(current, [current, hasGuide, noGuide]).map(t => t.slug);
    expect(result).toContain('b');
    expect(result).not.toContain('d');
  });
});
