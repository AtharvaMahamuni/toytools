import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitUrls } from './client';

const URLS = ['https://toytoolsapp.com/', 'https://toytoolsapp.com/tool/text/word-counter/'];

describe('submitUrls', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('returns success on HTTP 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitUrls(URLS);
    expect(res).toMatchObject({ success: true, submitted: URLS.length, status: 200 });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('treats HTTP 202 as success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 202 }));
    const res = await submitUrls(URLS);
    expect(res.success).toBe(true);
  });

  it('retries once on a transient 5xx then succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 503 })
      .mockResolvedValueOnce({ status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitUrls(URLS);
    expect(res.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry a non-transient 4xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 422 });
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitUrls(URLS);
    expect(res.success).toBe(false);
    expect(res.status).toBe(422);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('retries once on a network error then fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitUrls(URLS);
    expect(res.success).toBe(false);
    expect(res.error).toContain('ECONNRESET');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns a payload error (no fetch) for an empty URL list', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await submitUrls([]);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/empty/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('no-ops when disabled via env', async () => {
    vi.resetModules();
    vi.stubEnv('INDEXNOW_ENABLED', 'false');
    const { submitUrls: disabledSubmit } = await import('./client');
    const res = await disabledSubmit(URLS);
    expect(res).toEqual({ success: true, submitted: 0 });
    vi.unstubAllEnvs();
  });
});
