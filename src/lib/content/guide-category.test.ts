import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { guideCategorySlugErrors } from './guide-category';

const cats = [
  { slug: 'text-utilities', segment: 'text' },
  { slug: 'health-fitness', segment: 'health' },
];
const guide = (categorySlug: string) => ({
  slug: 'how-to', categorySlug, title: 't', description: 'd', readMinutes: 3, updatedAt: '2026-09-29',
});

describe('guideCategorySlugErrors', () => {
  it('passes every guide in the registry today', () => {
    expect(tools.filter(t => t.guide).length).toBeGreaterThan(100);
    expect(guideCategorySlugErrors(tools, categories)).toEqual([]);
  });

  it('accepts the category slug or its URL segment, and skips tools with no guide', () => {
    expect(
      guideCategorySlugErrors(
        [
          { slug: 'a', categorySlug: 'text-utilities', guide: guide('text-utilities') },
          { slug: 'b', categorySlug: 'text-utilities', guide: guide('text') },
          { slug: 'c', categorySlug: 'text-utilities' },
        ],
        cats,
      ),
    ).toEqual([]);
  });

  it('rejects a value that names no category', () => {
    const [error] = guideCategorySlugErrors([{ slug: 'a', categorySlug: 'text-utilities', guide: guide('txt') }], cats);
    expect(error).toContain('"txt" is not a category slug or segment');
    expect(error).toContain('Use "text-utilities" or "text"');
  });

  it("rejects another category's slug or segment", () => {
    const errors = guideCategorySlugErrors(
      [
        { slug: 'a', categorySlug: 'text-utilities', guide: guide('health-fitness') },
        { slug: 'b', categorySlug: 'text-utilities', guide: guide('health') },
      ],
      cats,
    );
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('names category "health-fitness", but the tool is in "text-utilities"');
    expect(errors[1]).toContain('names category "health-fitness"');
  });

  it('falls back to the raw categorySlug when the tool category itself is unknown', () => {
    // validate-registry reports the unknown tool category separately; this only must not throw.
    expect(guideCategorySlugErrors([{ slug: 'a', categorySlug: 'gone', guide: guide('gone') }], cats)).toEqual([]);
    expect(guideCategorySlugErrors([{ slug: 'a', categorySlug: 'gone', guide: guide('text') }], cats)[0]).toContain(
      'Use "gone"',
    );
  });
});
