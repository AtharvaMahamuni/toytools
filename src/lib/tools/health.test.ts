import { describe, it, expect } from 'vitest';
import { getToolHealth, getAllToolHealth } from './health';
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

describe('getToolHealth', () => {
  it('hasTool is always true', () => {
    const t = tool({ slug: 'a' });
    expect(getToolHealth(t, [t]).hasTool).toBe(true);
  });

  it('hasStructuredData is always true', () => {
    const t = tool({ slug: 'a' });
    expect(getToolHealth(t, [t]).hasStructuredData).toBe(true);
  });

  it('slug matches the tool slug', () => {
    const t = tool({ slug: 'my-tool' });
    expect(getToolHealth(t, [t]).slug).toBe('my-tool');
  });

  it('hasGuide is true when guide is defined', () => {
    const t = tool({
      slug: 'a',
      guide: { slug: 'a', categorySlug: 'text', title: 'Guide', description: 'desc', readMinutes: 5, updatedAt: 'Jun 2026' },
    });
    expect(getToolHealth(t, [t]).hasGuide).toBe(true);
  });

  it('hasGuide is false when guide is undefined', () => {
    const t = tool({ slug: 'a' });
    expect(getToolHealth(t, [t]).hasGuide).toBe(false);
  });

  it('hasFAQ is true when faq is defined', () => {
    const t = tool({ slug: 'a', faq: { slug: 'a', categorySlug: 'text' } });
    expect(getToolHealth(t, [t]).hasFAQ).toBe(true);
  });

  it('hasFAQ is false when faq is undefined', () => {
    const t = tool({ slug: 'a' });
    expect(getToolHealth(t, [t]).hasFAQ).toBe(false);
  });

  it('hasRelatedTools is true when another tool shares the same category', () => {
    const a = tool({ slug: 'a', categorySlug: 'text' });
    const b = tool({ slug: 'b', categorySlug: 'text' });
    expect(getToolHealth(a, [a, b]).hasRelatedTools).toBe(true);
  });

  it('hasRelatedTools is false when no other tools match', () => {
    const a = tool({ slug: 'a', categorySlug: 'text' });
    const b = tool({ slug: 'b', categorySlug: 'number' });
    expect(getToolHealth(a, [a, b]).hasRelatedTools).toBe(false);
  });

  it('hasRelatedTools is false when only self exists', () => {
    const a = tool({ slug: 'a' });
    expect(getToolHealth(a, [a]).hasRelatedTools).toBe(false);
  });

  it('hasMetadata is true when engine, pattern, and family are all defined', () => {
    const t = tool({ slug: 'a', engine: 'text-processor', pattern: 'transform', family: 'case' });
    expect(getToolHealth(t, [t]).hasMetadata).toBe(true);
  });

  it('hasMetadata is false when engine is missing', () => {
    const t = tool({ slug: 'a', pattern: 'transform', family: 'case' });
    expect(getToolHealth(t, [t]).hasMetadata).toBe(false);
  });

  it('hasMetadata is false when pattern is missing', () => {
    const t = tool({ slug: 'a', engine: 'text-processor', family: 'case' });
    expect(getToolHealth(t, [t]).hasMetadata).toBe(false);
  });

  it('hasMetadata is false when family is missing', () => {
    const t = tool({ slug: 'a', engine: 'text-processor', pattern: 'transform' });
    expect(getToolHealth(t, [t]).hasMetadata).toBe(false);
  });

  it('hasMetadata is false when all three are undefined', () => {
    const t = tool({ slug: 'a' });
    expect(getToolHealth(t, [t]).hasMetadata).toBe(false);
  });

  it('fully-healthy tool has all flags true', () => {
    const a = tool({
      slug: 'a',
      categorySlug: 'text',
      engine: 'text-processor',
      pattern: 'transform',
      family: 'case',
      guide: { slug: 'a', categorySlug: 'text', title: 'G', description: 'd', readMinutes: 3, updatedAt: 'Jun 2026' },
      faq: { slug: 'a', categorySlug: 'text' },
    });
    const b = tool({ slug: 'b', categorySlug: 'text' });
    const health = getToolHealth(a, [a, b]);
    expect(health.hasTool).toBe(true);
    expect(health.hasGuide).toBe(true);
    expect(health.hasFAQ).toBe(true);
    expect(health.hasRelatedTools).toBe(true);
    expect(health.hasMetadata).toBe(true);
    expect(health.hasStructuredData).toBe(true);
  });
});

describe('getAllToolHealth', () => {
  it('returns one health entry per tool', () => {
    const tools = [tool({ slug: 'a' }), tool({ slug: 'b' }), tool({ slug: 'c' })];
    expect(getAllToolHealth(tools).length).toBe(3);
  });

  it('returns empty array for empty input', () => {
    expect(getAllToolHealth([])).toEqual([]);
  });

  it('each entry slug corresponds to the matching tool', () => {
    const tools = [tool({ slug: 'alpha' }), tool({ slug: 'beta' })];
    const health = getAllToolHealth(tools);
    expect(health.map(h => h.slug)).toEqual(['alpha', 'beta']);
  });

  it('single tool gets a valid health report', () => {
    const t = tool({ slug: 'solo' });
    const [h] = getAllToolHealth([t]);
    expect(h.slug).toBe('solo');
    expect(h.hasTool).toBe(true);
  });
});
