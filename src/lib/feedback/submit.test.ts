import { describe, it, expect, vi } from 'vitest';
import { buildPayload, isSubmissionEnabled, submitFeedback } from './submit';
import type { FeedbackEnv, FeedbackInput } from './templates';
import type { AnalyticsSignals } from '@lib/analytics/guard';

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
    problem: 'Emoji count is incorrect on long text',
    expected: 'It should match what Twitter reports',
  },
};

/** A real person on production — the only session allowed to actually send. */
const realUser: AnalyticsSignals = {
  dev: false,
  e2e: false,
  webdriver: false,
  hostname: 'toytoolsapp.com',
};

const ok = () => Promise.resolve({ ok: true } as Response);

describe('isSubmissionEnabled', () => {
  it('allows a real production session', () => {
    expect(isSubmissionEnabled(realUser)).toBe(true);
  });

  // The Playwright suite drives this form on every pull request. Without these the inbox
  // would receive a burst of test submissions on every CI run.
  it.each([
    ['dev server', { ...realUser, dev: true }],
    ['E2E mode', { ...realUser, e2e: true }],
    ['browser automation', { ...realUser, webdriver: true }],
    ['localhost', { ...realUser, hostname: 'localhost' }],
  ])('refuses %s', (_label, signals) => {
    expect(isSubmissionEnabled(signals)).toBe(false);
  });
});

describe('buildPayload', () => {
  it('sends only the four relay fields plus the honeypot', () => {
    const payload = buildPayload(valid, env, 'test-key');
    expect(Object.keys(payload).sort()).toEqual([
      'access_key',
      'botcheck',
      'from_name',
      'message',
      'subject',
    ]);
    expect(payload.access_key).toBe('test-key');
    expect(payload.subject).toBe('[ToyTools] BUG · Word Counter');
    expect(payload.message).toContain('Feedback Type\nBug Report');
  });
});

describe('submitFeedback', () => {
  it('sends a valid submission from a real session', async () => {
    const fetchFn = vi.fn(ok);
    const result = await submitFeedback(valid, env, {
      fetchFn: fetchFn as unknown as typeof fetch,
      signals: realUser,
      accessKey: 'test-key',
    });

    expect(result.outcome).toBe('sent');
    expect(fetchFn).toHaveBeenCalledOnce();
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(JSON.parse(String(init.body)).subject).toBe('[ToyTools] BUG · Word Counter');
  });

  it('refuses an incomplete submission without touching the network', async () => {
    const fetchFn = vi.fn(ok);
    const result = await submitFeedback({ type: 'bug', values: {} }, env, {
      fetchFn: fetchFn as unknown as typeof fetch,
      signals: realUser,
      accessKey: 'test-key',
    });

    expect(result.outcome).toBe('invalid');
    expect(result.validation.ok).toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('swallows a honeypot hit and reports success so the bot learns nothing', async () => {
    const fetchFn = vi.fn(ok);
    const result = await submitFeedback(valid, env, {
      fetchFn: fetchFn as unknown as typeof fetch,
      signals: realUser,
      accessKey: 'test-key',
      honeypot: 'http://spam.example',
    });

    expect(result.outcome).toBe('trapped');
    expect(result.message).toBe('Thanks. That is genuinely useful.');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('previews instead of sending when no access key is configured', async () => {
    const fetchFn = vi.fn(ok);
    const result = await submitFeedback(valid, env, {
      fetchFn: fetchFn as unknown as typeof fetch,
      signals: realUser,
      accessKey: '',
    });

    expect(result.outcome).toBe('preview');
    expect(result.body).toContain('Emoji count is incorrect on long text');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('previews instead of sending under E2E, so CI can never email the inbox', async () => {
    const fetchFn = vi.fn(ok);
    const result = await submitFeedback(valid, env, {
      fetchFn: fetchFn as unknown as typeof fetch,
      signals: { ...realUser, e2e: true },
      accessKey: 'test-key',
    });

    expect(result.outcome).toBe('preview');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('reports an error when the relay refuses the submission', async () => {
    const result = await submitFeedback(valid, env, {
      fetchFn: (() => Promise.resolve({ ok: false } as Response)) as unknown as typeof fetch,
      signals: realUser,
      accessKey: 'test-key',
    });
    expect(result.outcome).toBe('error');
  });

  it('reports an error instead of throwing when the network fails', async () => {
    const result = await submitFeedback(valid, env, {
      fetchFn: (() => Promise.reject(new Error('offline'))) as unknown as typeof fetch,
      signals: realUser,
      accessKey: 'test-key',
    });
    expect(result.outcome).toBe('error');
    expect(result.message).toBe('That did not send. Please try again in a moment.');
  });

  it('reports an error when the environment has no fetch at all', async () => {
    const original = globalThis.fetch;
    // @ts-expect-error deliberately removing fetch to exercise the guard
    delete globalThis.fetch;
    try {
      const result = await submitFeedback(valid, env, {
        signals: realUser,
        accessKey: 'test-key',
      });
      expect(result.outcome).toBe('error');
    } finally {
      globalThis.fetch = original;
    }
  });

  it('always returns the composed email so preview mode can show it', async () => {
    const result = await submitFeedback(valid, env, {
      signals: { ...realUser, dev: true },
      accessKey: 'test-key',
    });
    expect(result.subject).toBe('[ToyTools] BUG · Word Counter');
    expect(result.body).toContain('ToyTools Version 1.4.2');
  });
});
