// Post-build privacy copy check (audit P-1, 1 Nov 2026). Fails if "Nothing is uploaded" appears in
// any built file under dist/. The accurate line lives in src/lib/privacy.ts.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesWithBannedPrivacy, pagesForTool, pagesWithDeviceClaim } from '../src/lib/privacy-copy';
import { tools } from '../src/data/registry';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const hits = filesWithBannedPrivacy(DIST);
if (hits.length) {
  console.error(`[check-privacy-copy] "Nothing is uploaded" is in ${hits.length} built file(s):`);
  for (const h of hits.slice(0, 40)) console.error(`  ${h}`);
  process.exit(1);
}

// A tool that makes a network request (trustVariant 'lookup') must not claim data stays on the device.
const lookup = tools.filter((t) => t.trustVariant === 'lookup');
const claims = lookup.flatMap((t) => pagesWithDeviceClaim(DIST, pagesForTool(t)));
if (claims.length) {
  console.error('[check-privacy-copy] a network-lookup tool page claims data stays on the device:');
  for (const c of claims) console.error(`  ${c}`);
  process.exit(1);
}
console.log(`[check-privacy-copy] no "Nothing is uploaded" in dist/; no device claim on ${lookup.length} lookup tool(s)`);
