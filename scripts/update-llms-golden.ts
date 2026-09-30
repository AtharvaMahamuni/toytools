// Rewrites the committed llms goldens (src/lib/llms/golden/) from what the two endpoints serve.
// Run it on purpose, after a change to llms.txt or llms-full.txt is intended, then review and
// commit the diff: `npm run llms:golden`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GOLDEN_DIR, GOLDEN_ENDPOINTS, servedBytes } from '../src/lib/llms/golden';

const root = join(import.meta.dirname, '..');
for (const name of Object.keys(GOLDEN_ENDPOINTS) as Array<keyof typeof GOLDEN_ENDPOINTS>) {
  const path = join(root, GOLDEN_DIR, name);
  const next = await servedBytes(name);
  const before = existsSync(path) ? readFileSync(path) : null;
  if (before?.equals(next)) {
    console.log(`[llms:golden] ${name}: unchanged`);
    continue;
  }
  writeFileSync(path, next);
  console.log(`[llms:golden] ${name}: ${before === null ? 'written' : 'updated'} (${next.length} bytes)`);
}
