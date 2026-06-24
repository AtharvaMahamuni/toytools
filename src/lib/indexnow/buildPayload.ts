// IndexNow submission payload builder. Shapes the collected URL list into the exact JSON body
// the IndexNow API expects, and validates the required fields up front so a malformed request
// is caught locally rather than failing silently at the endpoint.

import { INDEXNOW_HOST, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from '@config/indexnow';

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Build the IndexNow payload from a list of absolute URLs.
 * Throws a descriptive error when host/key are missing or the URL list is empty — callers
 * (the client and CLI) catch this so it never crashes a deployment.
 */
export function buildPayload(urls: string[]): IndexNowPayload {
  if (!INDEXNOW_HOST) throw new Error('IndexNow: missing host');
  if (!INDEXNOW_KEY) throw new Error('IndexNow: missing key');
  if (urls.length === 0) throw new Error('IndexNow: URL list is empty');

  return {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };
}
