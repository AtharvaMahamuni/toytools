// Post-build privacy copy check (audit P-1, 1 Nov 2026). Fails if "Nothing is uploaded" appears in
// any built file under dist/. The accurate line lives in src/lib/privacy.ts.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesWithBannedPrivacy } from '../src/lib/privacy-copy';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const hits = filesWithBannedPrivacy(DIST);
if (hits.length) {
  console.error(`[check-privacy-copy] "Nothing is uploaded" is in ${hits.length} built file(s):`);
  for (const h of hits.slice(0, 40)) console.error(`  ${h}`);
  process.exit(1);
}
console.log('[check-privacy-copy] no "Nothing is uploaded" in dist/');
