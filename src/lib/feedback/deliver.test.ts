import { describe, it, expect } from 'vitest';
import { buildMailtoUrl, composeFeedback, prepareFeedback } from './deliver';
import { MAX_MAILTO_LENGTH } from './config';
import type { FeedbackEnv, FeedbackInput } from './templates';

const env: FeedbackEnv = {
  browser: 'Chrome',
  platform: 'Android',
  language: 'en-IN',
  url: 'https://toytoolsapp.com/tool/text/word-counter/',
  version: '1.4.2',
  time: '2026-07-30 18:42 IST',
};

const valid: FeedbackInput = {
  type: 'bug',
  values: {
    tool: 'Word Counter',
    problem: 'Emoji are counted as two characters each',
    expected: 'They should count as one, the way Twitter does',
  },
};

describe('buildMailtoUrl', () => {
  it('addresses the message and carries the subject and body', () => {
    const { url, truncated } = buildMailtoUrl('Hello there', 'Line one\nLine two', 'a@b.com');
    expect(url.startsWith('mailto:a@b.com?subject=')).toBe(true);
    expect(url).toContain('subject=Hello%20there');
    // Newlines survive as %0A, which is what makes the body arrive as separate lines.
    expect(url).toContain('body=Line%20one%0ALine%20two');
    expect(truncated).toBe(false);
  });

  it('leaves a short message untouched', () => {
    expect(buildMailtoUrl('Subject', 'Short body', 'a@b.com').truncated).toBe(false);
  });

  // Mail clients disagree on how much they accept, and the old Windows shell limit is the floor.
  // Over it, clients silently truncate or ignore the link, which looks like a broken button.
  it('trims a long message to fit rather than producing a URL nothing will open', () => {
    const body = Array.from({ length: 400 }, (_, i) => `Line ${i} of a very long report`).join('\n');
    const { url, truncated } = buildMailtoUrl('Subject', body, 'a@b.com');

    expect(truncated).toBe(true);
    expect(url.length).toBeLessThanOrEqual(MAX_MAILTO_LENGTH);
  });

  it('says so in the body when it had to trim, rather than truncating silently', () => {
    const body = 'x'.repeat(5000);
    const { url } = buildMailtoUrl('Subject', body, 'a@b.com');
    expect(decodeURIComponent(url)).toContain('Copy message');
  });

  // Encoded length is not proportional to character count: a newline costs three characters and an
  // emoji up to twelve, so a body of multi-byte characters is the case a naive slice would fail.
  it('fits a body of multi-byte characters, where encoded length outruns character count', () => {
    const { url, truncated } = buildMailtoUrl('Subject', '👋'.repeat(500), 'a@b.com');
    expect(truncated).toBe(true);
    expect(url.length).toBeLessThanOrEqual(MAX_MAILTO_LENGTH);
  });

  it('respects an explicit ceiling', () => {
    const { url } = buildMailtoUrl('Subject', 'y'.repeat(2000), 'a@b.com', 400);
    expect(url.length).toBeLessThanOrEqual(400);
  });

  it('survives an empty body', () => {
    const { url, truncated } = buildMailtoUrl('Subject', '', 'a@b.com');
    expect(truncated).toBe(false);
    expect(url).toContain('body=');
  });
});

describe('composeFeedback', () => {
  it('returns the subject, the full body, and a mailto URL', () => {
    const composed = composeFeedback(valid, env, 'a@b.com');
    expect(composed.subject).toBe('[ToyTools] BUG · Word Counter');
    expect(composed.body).toContain('Feedback Type\nBug Report');
    expect(composed.mailto.startsWith('mailto:a@b.com?')).toBe(true);
    expect(composed.address).toBe('a@b.com');
  });

  // The point of keeping both: what the mail client gets may be trimmed, but the text offered
  // for copying is always everything the visitor wrote.
  it('keeps the full body intact even when the mailto version is trimmed', () => {
    const long: FeedbackInput = {
      type: 'general',
      values: { message: 'z'.repeat(4000) },
    };
    const composed = composeFeedback(long, env, 'a@b.com');
    expect(composed.truncated).toBe(true);
    expect(composed.body).toContain('z'.repeat(4000));
    expect(composed.mailto.length).toBeLessThanOrEqual(MAX_MAILTO_LENGTH);
  });

  it('addresses real feedback to the configured inbox by default', () => {
    expect(composeFeedback(valid, env).address).toContain('@');
  });
});

describe('prepareFeedback', () => {
  it('reports a complete submission as ready', () => {
    const result = prepareFeedback(valid, env);
    expect(result.outcome).toBe('ready');
    expect(result.validation.ok).toBe(true);
    expect(result.message).toMatch(/ready/i);
  });

  it('reports missing answers without discarding what was written', () => {
    const result = prepareFeedback(
      { type: 'bug', values: { tool: 'Word Counter' } },
      env,
    );
    expect(result.outcome).toBe('invalid');
    expect(Object.keys(result.validation.errors)).toContain('problem');
    // The composed message still exists, so nothing typed is thrown away on a failed attempt.
    expect(result.composed.body).toContain('Word Counter');
  });

  it('warns when the message had to be shortened for the mail client', () => {
    const result = prepareFeedback(
      { type: 'general', values: { message: 'w'.repeat(4000) } },
      env,
    );
    expect(result.outcome).toBe('ready');
    expect(result.message).toMatch(/too long/i);
  });
});
