import { describe, it, expect } from 'vitest';
import { resolveGuideHost, sharedGuideErrors, type GuideToolLike } from './shared-guide';
import { tools, getToolBySlug } from '@data/registry';

const hub: GuideToolLike = { slug: 'hub', guide: { title: 'Hub' }, toolGroup: 'g' };
const member: GuideToolLike = { slug: 'member', sharedGuide: 'hub', toolGroup: 'g' };
const all = [hub, member];
const find = (s: string) => all.find(t => t.slug === s);

describe('sharedGuide', () => {
  it('a tool with its own guide is its own host', () => {
    expect(resolveGuideHost(hub, find)).toBe(hub);
  });
  it('a guideless member resolves to its hub', () => {
    expect(resolveGuideHost(member, find)).toBe(hub);
  });
  it('no guide and no sharedGuide resolves to nothing', () => {
    expect(resolveGuideHost({ slug: 'x' }, find)).toBeUndefined();
  });
  it('accepts a valid declaration', () => {
    expect(sharedGuideErrors(member, all)).toEqual([]);
    expect(sharedGuideErrors(hub, all)).toEqual([]);
  });
  it('rejects guide plus sharedGuide', () => {
    expect(sharedGuideErrors({ ...member, guide: { title: 'x' } }, all).join()).toMatch(/both guide and sharedGuide/);
  });
  it('rejects self, unknown, guideless and cross-group hosts', () => {
    expect(sharedGuideErrors({ ...member, sharedGuide: 'member' }, all).join()).toMatch(/itself/);
    expect(sharedGuideErrors({ ...member, sharedGuide: 'nope' }, all).join()).toMatch(/is not a tool/);
    expect(sharedGuideErrors(member, [{ ...hub, guide: undefined }, member]).join()).toMatch(/no guide of its own/);
    expect(sharedGuideErrors({ ...member, toolGroup: 'other' }, all).join()).toMatch(/same tool group/);
  });
  it('every registered sharedGuide is valid, and normalize-whitespace links to the whitespace hub', () => {
    for (const t of tools) expect(sharedGuideErrors(t, tools), t.slug).toEqual([]);
    const nw = getToolBySlug('normalize-whitespace')!;
    expect(nw.guide).toBeUndefined();
    expect(resolveGuideHost(nw, getToolBySlug)?.slug).toBe('remove-blank-lines');
  });
});
