import { describe, expect, it } from 'vitest';
import { runProcessor } from './processors/registry';
import { textHandoff } from './handoff';

/** Run the real processor, then ask the seam about the pair. Nothing here is hand-faked. */
const h = (id: string, input: string) => textHandoff(id, input, runProcessor(id, input));

describe('textHandoff — "this is not the tool you wanted"', () => {
  it('tells the extra-space remover that the line edges are still there', () => {
    const r = h('removeExtraSpaces', '  alpha   beta  ');
    expect(r?.text).toContain('1 line still starts or ends');
    expect(r?.tool?.slug).toBe('trim-text');
  });

  it('tells the trimmer that the gaps inside the lines survived', () => {
    const r = h('trimLines', '  alpha   beta  ');
    expect(r?.text).toContain('1 gap');
    expect(r?.tool?.slug).toBe('remove-extra-spaces');
  });

  it('tells the tab remover it left runs of spaces behind', () => {
    const r = h('removeTabs', 'alpha \t beta');
    expect(r?.tool?.slug).toBe('remove-extra-spaces');
  });

  it('warns that normalizing whitespace ate the line breaks too', () => {
    const r = h('normalizeWhitespace', 'alpha\nbeta\ngamma');
    expect(r?.text).toContain('2 line breaks');
    expect(r?.tool?.slug).toBe('remove-extra-spaces');
  });

  it('warns that removing line breaks flattened the paragraphs', () => {
    const r = h('removeLineBreaks', 'one\n\ntwo\n\nthree');
    expect(r?.text).toContain('3 paragraphs');
    expect(r?.tool?.slug).toBe('remove-blank-lines');
  });

  it('catches the blank-line remover doing nothing to a multi-line list', () => {
    const r = h('removeBlankLines', 'one\ntwo\nthree');
    expect(r?.text).toContain('3 lines');
    expect(r?.tool?.slug).toBe('remove-line-breaks');
  });

  it('measures how many more duplicates a trim would find', () => {
    const r = h('removeDuplicateLines', 'alpha\nalpha \n alpha');
    expect(r?.text).toContain('2 more lines are');
    expect(r?.tool?.slug).toBe('trim-text');
  });

  it('measures the case-only duplicates when those dominate', () => {
    const r = h('removeDuplicateLines', 'Alpha\nalpha\nALPHA');
    expect(r?.text).toContain('a duplicate if case is ignored');
    expect(r?.tool?.slug).toBe('lowercase-converter');
  });

  it('explains a no-op emoji strip on text that is simply not ASCII', () => {
    const r = h('removeEmoji', 'Crème brûlée');
    expect(r?.tool?.slug).toBe('remove-accents');
  });

  it('explains a no-op accent strip on text whose non-ASCII has no separable mark', () => {
    const r = h('removeAccents', 'こんにちは');
    expect(r?.tool?.slug).toBe('remove-emoji');
  });

  it('reports the lines a slug silently deleted', () => {
    const r = h('slugify', 'Cafe Menu\nこんにちは\nAbout Us');
    expect(r?.text).toContain('1 line has');
    expect(r?.tool?.slug).toBe('kebab-case-converter');
  });

  it('flags accented letters kept by the identifier transforms', () => {
    for (const id of ['kebabCase', 'snakeCase', 'camelCase']) {
      expect(h(id, 'Café Menu')?.tool?.slug).toBe('remove-accents');
    }
  });

  it('explains why sentence case looks like plain lowercasing', () => {
    const r = h('sentenceCase', 'the quick brown fox');
    expect(r?.text).toContain('No sentence endings');
    expect(r?.tool?.slug).toBe('title-case-converter');
  });

  it('counts the short words title case capitalized against every style guide', () => {
    const r = h('titleCase', 'the lord of the rings');
    expect(r?.text).toContain('2 short words are');
    expect(r?.tool?.slug).toBe('sentence-case-converter');
  });

  it('says that reversing a block moves the line breaks', () => {
    expect(h('reverseText', 'abc\n123')?.text).toContain('1 line break');
  });

  it('names the acronyms lowercasing destroyed', () => {
    const r = h('lowercase', 'The API returns HTTP headers');
    expect(r?.text).toContain('API');
    expect(r?.text).toContain('HTTP');
  });
});

// Silence is what stops eighteen near-identical pages growing a permanent "see also" strip.
describe('textHandoff — silence', () => {
  const IDS = [
    'removeExtraSpaces', 'trimLines', 'removeTabs', 'normalizeWhitespace', 'removeLineBreaks',
    'removeBlankLines', 'removeDuplicateLines', 'removeEmoji', 'removeAccents', 'slugify',
    'kebabCase', 'snakeCase', 'camelCase', 'sentenceCase', 'titleCase', 'reverseText',
    'lowercase', 'uppercase',
  ];

  it('says nothing on empty input, on every processor', () => {
    for (const id of IDS) expect(h(id, '')).toBeNull();
  });

  it('says nothing to the uppercase converter, which has no honest rule', () => {
    expect(h('uppercase', 'anything at all, of any length')).toBeNull();
  });

  it('says nothing once the whitespace tools have nothing left to hand over', () => {
    expect(h('removeExtraSpaces', 'alpha   beta')).toBeNull();
    expect(h('trimLines', '  alpha beta  ')).toBeNull();
    expect(h('removeTabs', 'alpha\tbeta')).toBeNull();
    expect(h('normalizeWhitespace', 'alpha   beta')).toBeNull();
    expect(h('removeLineBreaks', 'one\ntwo')).toBeNull();
  });

  it('says nothing when the blank-line remover actually removed one', () => {
    expect(h('removeBlankLines', 'one\n\ntwo')).toBeNull();
  });

  it('says nothing when no further deduplication is available', () => {
    expect(h('removeDuplicateLines', 'alpha\nbeta\ngamma')).toBeNull();
  });

  it('says nothing when the emoji and accent tools actually did their job', () => {
    expect(h('removeEmoji', 'hello 👋 there')).toBeNull();
    expect(h('removeAccents', 'Crème brûlée')).toBeNull();
    expect(h('removeEmoji', 'plain ascii')).toBeNull();
    expect(h('removeAccents', 'plain ascii')).toBeNull();
  });

  it('says nothing for ASCII input on the identifier and slug transforms', () => {
    for (const id of ['slugify', 'kebabCase', 'snakeCase', 'camelCase']) {
      expect(h(id, 'Hello World')).toBeNull();
    }
  });

  it('says nothing when sentence case had real sentences to work with', () => {
    expect(h('sentenceCase', 'one thing. then another.')).toBeNull();
  });

  it('says nothing when a title has no minor words to get wrong', () => {
    expect(h('titleCase', 'hello world')).toBeNull();
  });

  it('says nothing when reversing a single line, or lowercasing ordinary prose', () => {
    expect(h('reverseText', 'abcdef')).toBeNull();
    expect(h('lowercase', 'The quick brown fox')).toBeNull();
  });
});
