// The per-segment tool routes are generated, so this helper is the one hand-written piece of their
// getStaticPaths. A bug here silently drops tools from the build (missing pages, missing sitemap
// entries) rather than failing, so pin the partition.
import { describe, expect, it } from 'vitest';
import { toolPathsForSegment } from './segment-paths';
import { tools } from '@data/registry';
import { categories } from '@data/categories';

const segments = [...new Set(categories.map((c) => c.segment))];

describe('toolPathsForSegment', () => {
  it('returns only tools whose category maps to that segment', () => {
    for (const segment of segments) {
      for (const entry of toolPathsForSegment(segment)) {
        const category = categories.find((c) => c.slug === entry.props.tool.categorySlug);
        expect(category?.segment, `${entry.params.slug} is not in ${segment}`).toBe(segment);
      }
    }
  });

  it('partitions the whole registry — every tool is claimed by exactly one segment', () => {
    const claimed = segments.flatMap((s) => toolPathsForSegment(s).map((e) => e.params.slug));
    expect(claimed.slice().sort()).toEqual(tools.map((t) => t.slug).sort());
    expect(new Set(claimed).size).toBe(claimed.length);
  });

  it('pairs each slug with its own tool and category', () => {
    for (const entry of toolPathsForSegment('text')) {
      expect(entry.props.tool.slug).toBe(entry.params.slug);
      expect(entry.props.category.slug).toBe(entry.props.tool.categorySlug);
    }
  });

  it('returns nothing for a segment no category uses', () => {
    expect(toolPathsForSegment('not-a-segment')).toEqual([]);
  });
});
