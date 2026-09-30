// Rewrites the committed llms goldens (src/lib/llms/golden/) from the current renderer.
// Run it on purpose, after a change to llms.txt or llms-full.txt is intended, then review and
// commit the diff: `npm run llms:golden`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { GOLDEN_DIR, GOLDEN_FILES } from '../src/lib/llms/golden';

const root = join(import.meta.dirname, '..');
for (const [name, render] of Object.entries(GOLDEN_FILES)) {
  const path = join(root, GOLDEN_DIR, name);
  const next = render();
  const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (before === next) {
    console.log(`[llms:golden] ${name}: unchanged`);
    continue;
  }
  writeFileSync(path, next);
  console.log(`[llms:golden] ${name}: ${before === null ? 'written' : 'updated'} (${Buffer.byteLength(next)} bytes)`);
}
