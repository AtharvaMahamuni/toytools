// entryUrl() rebuilds a tool URL on the client from the compact search index, and it spells the
// route itself so the palette chunk does not share a module with the engine bundles (see the
// header of ./types.ts). This pins it to the URL builder for every tool in the registry, so the
// two can never disagree.
import { describe, it, expect } from 'vitest';
import { buildClientIndex, entryUrl } from './index';
import { toolPath } from '@lib/paths';
import { tools } from '@data/registry';
import { categories } from '@data/categories';

describe('entryUrl agrees with the URL builder', () => {
  it('for every entry in the client index', () => {
    const index = buildClientIndex();
    expect(index.t.length).toBe(tools.length);
    for (const entry of index.t) {
      const tool = tools.find((t) => t.slug === entry.s)!;
      const segment = categories.find((c) => c.slug === tool.categorySlug)!.segment;
      expect(entryUrl(index, entry)).toBe(toolPath({ slug: tool.slug, segment }));
    }
  });
});
