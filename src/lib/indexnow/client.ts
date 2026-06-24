// IndexNow submission client. POSTs the payload to the IndexNow aggregator, which fans it out
// to every participating engine. Designed to NEVER throw and NEVER crash a deployment: all
// failures are caught and returned as a structured result. Retries once on transient errors.

import { INDEXNOW_ENABLED, INDEXNOW_ENDPOINT } from '@config/indexnow';
import { buildPayload } from '@lib/indexnow/buildPayload';

export interface SubmitResult {
  success: boolean;
  submitted: number;
  status?: number;
  error?: string;
}

const TIMEOUT_MS = 10_000;

/** A 2xx response, or a transient class (network error / 429 / 5xx) worth one retry. */
function isTransient(status: number): boolean {
  return status === 429 || status >= 500;
}

async function postOnce(body: string): Promise<{ status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      signal: controller.signal,
    });
    return { status: res.status };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Submit a list of URLs to IndexNow. Resolves a SubmitResult; never rejects.
 * No-ops (success, 0 submitted) when INDEXNOW_ENABLED is false.
 */
export async function submitUrls(urls: string[]): Promise<SubmitResult> {
  if (!INDEXNOW_ENABLED) {
    console.log('[indexnow] disabled (INDEXNOW_ENABLED=false) — skipping submission.');
    return { success: true, submitted: 0 };
  }

  let body: string;
  try {
    body = JSON.stringify(buildPayload(urls));
  } catch (e) {
    const error = (e as Error).message;
    console.error(`[indexnow] payload error: ${error}`);
    return { success: false, submitted: 0, error };
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { status } = await postOnce(body);
      // IndexNow returns 200 (OK) or 202 (Accepted) on success.
      if (status === 200 || status === 202) {
        console.log(`[indexnow] submitted ${urls.length} URLs — HTTP ${status}.`);
        return { success: true, submitted: urls.length, status };
      }
      if (isTransient(status) && attempt === 1) {
        console.warn(`[indexnow] transient HTTP ${status}, retrying once…`);
        continue;
      }
      console.error(`[indexnow] submission failed — HTTP ${status}.`);
      return { success: false, submitted: 0, status, error: `HTTP ${status}` };
    } catch (e) {
      const error = (e as Error).message;
      if (attempt === 1) {
        console.warn(`[indexnow] network error (${error}), retrying once…`);
        continue;
      }
      console.error(`[indexnow] submission failed after retry: ${error}`);
      return { success: false, submitted: 0, error };
    }
  }

  // Unreachable, but keeps the return type total.
  return { success: false, submitted: 0, error: 'exhausted retries' };
}
