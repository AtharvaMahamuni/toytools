import { describe, it, expect } from 'vitest';
import { isSingleFamilyBubble } from './diversity';
import type { ToolConfig } from '@data/types';

function tool(slug: string, family?: string): ToolConfig {
  return { slug, name: slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], family };
}

describe('isSingleFamilyBubble', () => {
  it('flags a set where every related tool shares the source family', () => {
    const source = tool('json-formatter', 'json');
    const related = [tool('json-minifier', 'json'), tool('json-validator', 'json')];
    expect(isSingleFamilyBubble(source, related)).toBe(true);
  });

  it('does not flag a diverse set', () => {
    const source = tool('json-formatter', 'json');
    const related = [tool('base64', 'binary-text'), tool('json-validator', 'json')];
    expect(isSingleFamilyBubble(source, related)).toBe(false);
  });

  it('does not flag sets smaller than 2', () => {
    const source = tool('json-formatter', 'json');
    expect(isSingleFamilyBubble(source, [tool('json-minifier', 'json')])).toBe(false);
    expect(isSingleFamilyBubble(source, [])).toBe(false);
  });

  it('does not flag when the source has no family', () => {
    const source = tool('json-formatter');
    const related = [tool('a', 'json'), tool('b', 'json')];
    expect(isSingleFamilyBubble(source, related)).toBe(false);
  });
});

// ── The structural exemption ──────────────────────────────────────────────────
describe('isSingleFamilyBubble — a small category is not a bubble', () => {
  const src = tool('percentage-calculator', 'arithmetic');
  const homogeneous = [tool('tip-calculator', 'arithmetic'), tool('tax-calculator', 'arithmetic')];

  it('still reports a bubble when another family was available to pick', () => {
    const candidates = [...homogeneous, tool('word-counter', 'text-counting')];
    expect(isSingleFamilyBubble(src, homogeneous, candidates)).toBe(true);
  });

  it('reports nothing when the whole candidate pool is one family', () => {
    // number-utilities is genuinely all `arithmetic`. That is a fact about the catalog, and no
    // derivation change can fix it, so it must not read as a defect.
    expect(isSingleFamilyBubble(src, homogeneous, homogeneous)).toBe(false);
  });

  it('ignores the source itself when deciding whether an alternative existed', () => {
    expect(isSingleFamilyBubble(src, homogeneous, [...homogeneous, src])).toBe(false);
  });

  it('keeps the old behaviour when no candidate pool is supplied', () => {
    expect(isSingleFamilyBubble(src, homogeneous)).toBe(true);
  });
});
