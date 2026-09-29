// The site's whole custom-event inventory, pinned. Privacy-first: the only custom events are the
// three the equalizer has always sent, and a new one is a decision for the PR that adds it, made in
// the open by editing this list, not something that slips in with a widget change.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(__dirname, '..', '..', '..');
const SRC = join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts|js|mjs)$/.test(name) && !/\.test\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
const calls: { file: string; name: string }[] = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/\b(?:TT|ToyTools)\.track\(\s*['"]([^'"]+)['"]/g)) {
    calls.push({ file: relative(ROOT, f), name: m[1] });
  }
}

describe('custom analytics events', () => {
  it('are exactly the three eq_* events, all from the shared equalizer widget', () => {
    expect(calls.map((c) => c.name).sort()).toEqual([
      'eq_image_generated',
      'eq_preset_selected',
      'eq_preset_shared',
    ]);
    expect(new Set(calls.map((c) => c.file))).toEqual(new Set(['src/tools/_shared/EqWidget.astro']));
  });

  it('never call gtag directly outside the platform bootstrap', () => {
    const direct = files
      .filter((f) => /\bgtag\(\s*['"]event['"]/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(ROOT, f));
    expect(direct).toEqual(['src/lib/runtime/platform.ts']);
  });

  it('have no dead vocabulary module or trackEvent path left behind', () => {
    const hits = files.filter((f) => /\bAnalyticsEvents\b|\btrackEvent\s*\(/.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});
