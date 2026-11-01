import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { filesWithBannedPrivacy } from './privacy-copy';
import { PRIVACY_LINE, privacyStatement, withPrivacy } from './privacy';

describe('filesWithBannedPrivacy', () => {
  it('finds the phrase in any case, in nested html, json and js files', () => {
    const d = mkdtempSync(join(tmpdir(), 'pc-'));
    mkdirSync(join(d, 'tool', 'x'), { recursive: true });
    writeFileSync(join(d, 'tool', 'x', 'index.html'), '<meta content="Fast. Nothing is uploaded.">');
    writeFileSync(join(d, 'a.json'), '{"d":"so nothing is uploaded"}');
    writeFileSync(join(d, 'ok.html'), '<p>What you enter stays on your device.</p>');
    writeFileSync(join(d, 'img.png'), 'nothing is uploaded');
    expect(filesWithBannedPrivacy(d)).toEqual(['a.json', join('tool', 'x', 'index.html')]);
  });
});

describe('the shared privacy line', () => {
  it('no longer overclaims', () => {
    expect(PRIVACY_LINE).toBe('What you enter stays on your device.');
    expect(privacyStatement()).not.toMatch(/nothing is uploaded/i);
    expect(withPrivacy('Count words.')).toBe('Count words. What you enter stays on your device.');
  });
});
