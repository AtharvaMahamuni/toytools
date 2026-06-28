// Google Search Console URL Inspection provider — the programmatic, no-UI way to read a page's
// real indexation status. This is the answer to "which pages are indexed?" without ever opening
// Search Console: a service account + the URL Inspection API return the same coverageState the
// UI shows ("Submitted and indexed", "Crawled - currently not indexed", …).
//
// One-time setup (see docs/indexing.md): create a GCP service account, enable the Search Console
// API, and add the service account's email as a user on the Search Console property. Then provide
// its key via env. No browser, no manual export — fully CI-driven.
//
// Quota: 2000 inspections/day, 600/min per property. The runner throttles to stay under both.

import { readFileSync } from 'node:fs';
import {
  bucketFromGoogleState,
  type ExternalSignalProvider,
  type IndexationRecord,
} from './external-signals.js';

const INSPECT_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

/** Read the service-account JSON from either an inline env var or a credentials file path. */
function readServiceAccount(): { client_email: string; private_key: string } | null {
  const inline = process.env.GSC_SA_KEY_JSON;
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  try {
    if (inline) return JSON.parse(inline);
    if (path) return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
  return null;
}

export class GoogleSearchConsoleProvider implements ExternalSignalProvider {
  readonly name = 'google-search-console';
  private token: string | null = null;

  /** sc-domain:toytoolsapp.com OR https://toytoolsapp.com/ — must match a verified property. */
  private get siteUrl(): string {
    return process.env.GSC_SITE_URL ?? '';
  }

  isConfigured(): boolean {
    return Boolean(this.siteUrl) && readServiceAccount() !== null;
  }

  configHint(): string {
    return [
      'Set GSC_SITE_URL (e.g. "sc-domain:toytoolsapp.com" or "https://toytoolsapp.com/")',
      'and provide the service-account key via GSC_SA_KEY_JSON (inline JSON) or',
      'GOOGLE_APPLICATION_CREDENTIALS (path to the key file). See docs/indexing.md.',
    ].join(' ');
  }

  /** Lazily mint an OAuth token. google-auth-library is imported here so --dry-run works without it. */
  private async accessToken(): Promise<string> {
    if (this.token) return this.token;
    const sa = readServiceAccount();
    if (!sa) throw new Error('No service-account credentials found');
    const { JWT } = await import('google-auth-library');
    const client = new JWT({ email: sa.client_email, key: sa.private_key, scopes: [SCOPE] });
    const { token } = await client.getAccessToken();
    if (!token) throw new Error('Failed to obtain access token');
    this.token = token;
    return token;
  }

  async inspect(url: string): Promise<IndexationRecord> {
    const checkedAt = new Date().toISOString();
    try {
      const token = await this.accessToken();
      const res = await fetch(INSPECT_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: this.siteUrl, languageCode: 'en-US' }),
      });
      if (!res.ok) {
        return {
          url, source: this.name, bucket: 'error', indexed: false, checkedAt,
          error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`,
        };
      }
      const data = (await res.json()) as any;
      const idx = data?.inspectionResult?.indexStatusResult ?? {};
      const bucket = bucketFromGoogleState(idx.coverageState, idx.verdict);
      return {
        url, source: this.name, bucket, indexed: bucket === 'indexed', checkedAt,
        verdict: idx.verdict,
        coverageState: idx.coverageState,
        robotsTxtState: idx.robotsTxtState,
        lastCrawlTime: idx.lastCrawlTime,
      };
    } catch (e) {
      return {
        url, source: this.name, bucket: 'error', indexed: false, checkedAt,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }
}
