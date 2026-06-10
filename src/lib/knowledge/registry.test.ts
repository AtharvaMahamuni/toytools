import { describe, it, expect } from 'vitest';
import { buildKnowledgeMap, KNOWLEDGE_ENTRIES, KNOWLEDGE, getKnowledge, hasKnowledge } from './registry';
import { validateKnowledge } from './schema';
import { makeKnowledge } from './fixtures';

describe('buildKnowledgeMap', () => {
  it('keys entries by slug', () => {
    const map = buildKnowledgeMap([
      makeKnowledge({ slug: 'a' }),
      makeKnowledge({ slug: 'b' }),
    ]);
    expect(map.size).toBe(2);
    expect(map.get('a')?.slug).toBe('a');
  });

  it('returns an empty map for an empty list', () => {
    expect(buildKnowledgeMap([]).size).toBe(0);
  });
});

describe('getKnowledge / hasKnowledge', () => {
  it('returns undefined / false for an unknown slug without throwing', () => {
    expect(getKnowledge('does-not-exist')).toBeUndefined();
    expect(hasKnowledge('does-not-exist')).toBe(false);
  });
});

describe('registered entries', () => {
  it('has unique slugs', () => {
    const slugs = KNOWLEDGE_ENTRIES.map(e => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every registered entry passes schema validation', () => {
    for (const entry of KNOWLEDGE_ENTRIES) {
      const result = validateKnowledge(entry);
      expect(result.ok, `${entry.slug}: ${result.errors.join('; ')}`).toBe(true);
    }
  });

  it('the prebuilt KNOWLEDGE map matches the entry list', () => {
    expect(KNOWLEDGE.size).toBe(KNOWLEDGE_ENTRIES.length);
  });
});
