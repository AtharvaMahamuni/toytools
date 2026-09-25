import { describe, expect, it } from 'vitest';
import { packPrompt, type PromptFields } from './promptPack';

const EMPTY: PromptFields = { role: '', task: '', context: '', constraints: '', outputFormat: '' };

describe('packPrompt', () => {
  it('assembles every field as Markdown sections', () => {
    const packed = packPrompt({
      role: 'You are a senior Android engineer.',
      task: 'Explain how Binder IPC works.',
      context: 'The audience understands Kotlin.',
      constraints: 'Use simple language.',
      outputFormat: 'Use headings and bullet points.',
    }, 'markdown');
    expect(packed.text).toBe(
      [
        '## Role',
        '',
        'You are a senior Android engineer.',
        '',
        '## Task',
        '',
        'Explain how Binder IPC works.',
        '',
        '## Context',
        '',
        'The audience understands Kotlin.',
        '',
        '## Constraints',
        '',
        'Use simple language.',
        '',
        '## Output format',
        '',
        'Use headings and bullet points.',
      ].join('\n'),
    );
    expect(packed.omitted).toEqual([]);
    expect(packed.characters).toBe(packed.text.length);
    expect(packed.words).toBeGreaterThan(0);
  });

  it('keeps only the task when the other fields are empty', () => {
    const packed = packPrompt({ ...EMPTY, task: 'Explain coroutines.' }, 'markdown');
    expect(packed.text).toBe('## Task\n\nExplain coroutines.');
    expect(packed.omitted).toEqual(['Role', 'Context', 'Constraints', 'Output format']);
  });

  it('returns nothing when every field is empty or whitespace', () => {
    const packed = packPrompt({ ...EMPTY, role: '   \n  ' }, 'markdown');
    expect(packed.text).toBe('');
    expect(packed.characters).toBe(0);
    expect(packed.words).toBe(0);
    expect(packed.omitted).toEqual(['Role', 'Task', 'Context', 'Constraints', 'Output format']);
  });

  it('trims surrounding whitespace and keeps internal newlines', () => {
    const packed = packPrompt({
      ...EMPTY,
      constraints: '  Use simple language.\nInclude a concrete example.  ',
    }, 'markdown');
    expect(packed.text).toBe('## Constraints\n\nUse simple language.\nInclude a concrete example.');
  });

  it('wraps fields in XML-style tags', () => {
    const packed = packPrompt({
      ...EMPTY,
      role: 'You are a Kotlin expert.',
      task: 'Explain coroutines.',
    }, 'xml');
    expect(packed.text).toBe('<role>\nYou are a Kotlin expert.\n</role>\n\n<task>\nExplain coroutines.\n</task>');
  });

  it('escapes XML special characters and leaves them alone in Markdown', () => {
    const fields = { ...EMPTY, task: 'Use a <tag> & keep it.' };
    expect(packPrompt(fields, 'xml').text).toBe('<task>\nUse a &lt;tag&gt; &amp; keep it.\n</task>');
    expect(packPrompt(fields, 'markdown').text).toContain('Use a <tag> & keep it.');
  });
});
