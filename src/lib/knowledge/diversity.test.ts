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
