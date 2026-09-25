import { describe, expect, it } from 'vitest';
import { CHAT_CLEAN_DEFAULTS, cleanChatExport } from './chatClean';

const SAMPLE = [
  '[10:15] User: How do I open a file?',
  '',
  'Assistant: Use open().',
  '',
  '```',
  'open(path)',
  '```',
  '',
  '[10:16] User: Thanks 【1†source】',
].join('\n');

describe('cleanChatExport', () => {
  it('strips timestamps, speaker labels, citation chips, and extra blank lines', () => {
    const cleaned = cleanChatExport(SAMPLE, CHAT_CLEAN_DEFAULTS);
    expect(cleaned.text).toBe('How do I open a file?\n\nUse open().\n\n```\nopen(path)\n```\n\nThanks');
    expect(cleaned.removedLines).toBeGreaterThan(0);
    expect(cleaned.lossy).toBe(false);
  });

  it('keeps user turns only and says so', () => {
    const cleaned = cleanChatExport(SAMPLE, { ...CHAT_CLEAN_DEFAULTS, keep: 'user', removeSpeakerLabels: false });
    expect(cleaned.text).toContain('How do I open a file?');
    expect(cleaned.text).not.toContain('Use open()');
    expect(cleaned.lossy).toBe(true);
    expect(cleaned.note).toContain('user turns only');
  });

  it('keeps assistant turns only', () => {
    const cleaned = cleanChatExport(SAMPLE, { ...CHAT_CLEAN_DEFAULTS, keep: 'assistant' });
    expect(cleaned.text).toContain('Use open().');
    expect(cleaned.text).not.toContain('How do I open a file?');
  });

  it('keeps fenced code and drops the conversation', () => {
    const cleaned = cleanChatExport(SAMPLE, { ...CHAT_CLEAN_DEFAULTS, keep: 'code' });
    expect(cleaned.text).toBe('```\nopen(path)\n```');
    expect(cleaned.lossy).toBe(true);
  });

  it('drops an empty fence', () => {
    const cleaned = cleanChatExport('```\n```\n\nHello', CHAT_CLEAN_DEFAULTS);
    expect(cleaned.text).toBe('Hello');
  });

  it('leaves text alone when a turn filter finds no speaker labels', () => {
    const cleaned = cleanChatExport('Just a paragraph.', { ...CHAT_CLEAN_DEFAULTS, keep: 'user' });
    expect(cleaned.text).toBe('Just a paragraph.');
    expect(cleaned.note).toContain('No speaker labels');
  });

  it('keeps Unicode and does not invent structure for malformed input', () => {
    const cleaned = cleanChatExport('  你好   世界  \n\n\n\nnext', {
      ...CHAT_CLEAN_DEFAULTS,
      removeSpeakerLabels: false,
    });
    expect(cleaned.text).toBe('你好 世界\n\nnext');
  });

  it('returns empty for empty input', () => {
    expect(cleanChatExport('   \n', CHAT_CLEAN_DEFAULTS).text).toBe('');
  });
});
