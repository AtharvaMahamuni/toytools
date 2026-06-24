// IndexNow submission CLI. Collects the public URL list and POSTs it to IndexNow, printing a
// summary. Designed to run post-deploy (`npm run indexnow`). It ALWAYS exits 0 so it can never
// fail a deployment — IndexNow is best-effort notification, deploy success is what matters.
//
// URL source: prefers dist/indexnow-urls.json (the build artifact) when present, so CI submits
// exactly what was deployed; falls back to recomputing via collectUrls() when dist is absent.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INDEXNOW_ENABLED, INDEXNOW_HOST, INDEXNOW_KEY } from '../src/config/indexnow';
import { collectUrls } from '../src/lib/indexnow/collectUrls';
import { submitUrls } from '../src/lib/indexnow/client';

function loadUrls(): string[] {
  const artifact = join(process.cwd(), 'dist', 'indexnow-urls.json');
  if (existsSync(artifact)) {
    try {
      const parsed = JSON.parse(readFileSync(artifact, 'utf8')) as { urls?: string[] };
      if (Array.isArray(parsed.urls) && parsed.urls.length > 0) {
        console.log(`[indexnow] using ${parsed.urls.length} URLs from dist/indexnow-urls.json`);
        return parsed.urls;
      }
    } catch (e) {
      console.warn(`[indexnow] could not read dist/indexnow-urls.json (${(e as Error).message}); recomputing.`);
    }
  }
  return collectUrls();
}

async function main(): Promise<void> {
  const banner = '━'.repeat(30);
  console.log(`\n${banner}\nIndexNow Submission\n${banner}\n`);

  if (!INDEXNOW_ENABLED) {
    console.log('IndexNow disabled (INDEXNOW_ENABLED=false) — nothing to do.\n');
    return;
  }
  if (!INDEXNOW_KEY || !INDEXNOW_HOST) {
    console.warn('IndexNow misconfigured (missing key or host) — skipping.\n');
    return;
  }

  const urls = loadUrls();
  // De-dupe defensively (the artifact is already unique, but the fallback path and merges aren't guaranteed).
  const unique = [...new Set(urls)];
  console.log(`URLs collected: ${urls.length}`);
  console.log(`Unique URLs:    ${unique.length}\n`);

  if (unique.length === 0) {
    console.warn('No URLs to submit — skipping.\n');
    return;
  }

  console.log('Submitting…\n');
  const result = await submitUrls(unique);

  console.log(`\n${banner}`);
  console.log(`URLs submitted: ${result.submitted}`);
  console.log(`Status:         ${result.success ? 'Success' : 'Failed'}${result.status ? ` (HTTP ${result.status})` : ''}`);
  if (result.error) console.log(`Error:          ${result.error}`);
  console.log(`${banner}\n`);
}

main()
  .catch(e => {
    // Never let an unexpected throw fail the deploy.
    console.error(`[indexnow] unexpected error: ${(e as Error).message}`);
  })
  .finally(() => process.exit(0));
