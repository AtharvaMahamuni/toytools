import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { GOLDEN_DIR, GOLDEN_FILES, GOLDEN_SITE, firstDifference } from './golden';

const ROOT = resolve(__dirname, '../../..');

// The llms files are pinned to a committed copy. A change to either one, intended or not, fails
// here until the copy is rewritten with `npm run llms:golden` and the diff is committed with it.
describe('llms files match their committed golden copy byte for byte', () => {
  it('renders the goldens on the production origin', () => {
    expect(GOLDEN_SITE).toBe('https://toytoolsapp.com/');
  });

  for (const [name, render] of Object.entries(GOLDEN_FILES)) {
    it(name, () => {
      const golden = readFileSync(join(ROOT, GOLDEN_DIR, name));
      const rendered = Buffer.from(render(), 'utf8');
      const diff = firstDifference(golden.toString('utf8'), rendered.toString('utf8'));
      expect(
        diff,
        `${name} differs from ${GOLDEN_DIR}/${name}. If the change is intended, run npm run llms:golden and commit the diff.`,
      ).toBeNull();
      expect(rendered.equals(golden)).toBe(true);
    });
  }
});

describe('firstDifference', () => {
  it('is null for equal texts and names the first differing line otherwise', () => {
    expect(firstDifference('a\nb\n', 'a\nb\n')).toBeNull();
    expect(firstDifference('a\nb\nc', 'a\nB\nc')).toEqual({ line: 2, expected: 'b', actual: 'B' });
    expect(firstDifference('a\nb', 'a\nb\nc')).toEqual({ line: 3, expected: undefined, actual: 'c' });
    expect(firstDifference('a\nb\n', 'a\nb')).toEqual({ line: 3, expected: '', actual: undefined });
  });
});
