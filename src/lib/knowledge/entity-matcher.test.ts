import { describe, it, expect } from 'vitest';
import { buildEntityIndex, getEntityMatches } from './entity-matcher';
import { makeKnowledge } from './fixtures';
import type { ToolConfig } from '@data/types';

const tools: ToolConfig[] = [
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'd', categorySlug: 'developer-tools', tags: ['t'] },
  { slug: 'base64-encoder-decoder', name: 'Base64 Encoder & Decoder', description: 'd', categorySlug: 'developer-tools', tags: ['t'] },
];

const knowledge = [
  makeKnowledge({
    slug: 'json-formatter',
    primaryConcepts: ['JSON'],
    secondaryConcepts: ['pretty print'],
    keywords: ['beautify'],
    entityAliases: ['json document'],
  }),
  makeKnowledge({
    slug: 'base64-encoder-decoder',
    primaryConcepts: ['Base64'],
    secondaryConcepts: ['encoding'],
  }),
];

const index = buildEntityIndex(knowledge, tools);

describe('buildEntityIndex', () => {
  it('scores primary concepts above secondary and keywords', () => {
    expect(index.get('json')?.score).toBe(100);
    expect(index.get('pretty print')?.score).toBe(60);
    expect(index.get('beautify')?.score).toBe(40);
  });

  it('indexes the tool name', () => {
    expect(index.get('json formatter')?.slug).toBe('json-formatter');
  });

  it('ignores knowledge whose tool is not registered', () => {
    const idx = buildEntityIndex([makeKnowledge({ slug: 'ghost', primaryConcepts: ['ghost'] })], tools);
    expect(idx.has('ghost')).toBe(false);
  });
});

describe('getEntityMatches', () => {
  it('matches a concept on a token boundary', () => {
    const matches = getEntityMatches('You can format JSON quickly', index);
    expect(matches.map(m => m.slug)).toContain('json-formatter');
  });

  it('does NOT match inside a larger token (json in jsonp)', () => {
    const matches = getEntityMatches('the jsonp callback', index);
    expect(matches.find(m => m.slug === 'json-formatter')).toBeFalsy();
  });

  it('is case-insensitive but preserves the matched casing', () => {
    const matches = getEntityMatches('Encode with BASE64 now', index);
    const b64 = matches.find(m => m.slug === 'base64-encoder-decoder');
    expect(b64?.term).toBe('BASE64');
  });

  it('prefers the longest surface form over a sub-token', () => {
    const matches = getEntityMatches('inspect a json document here', index);
    // "json document" (alias) should win over "json" for the overlapping span
    const span = matches.find(m => m.term.toLowerCase() === 'json document');
    expect(span).toBeTruthy();
    expect(matches.filter(m => m.start < span!.end && m.end > span!.start)).toHaveLength(1);
  });

  it('returns matches sorted by position', () => {
    const matches = getEntityMatches('Base64 then JSON', index);
    expect(matches.map(m => m.slug)).toEqual(['base64-encoder-decoder', 'json-formatter']);
  });

  it('returns empty for empty content', () => {
    expect(getEntityMatches('', index)).toEqual([]);
  });
});
