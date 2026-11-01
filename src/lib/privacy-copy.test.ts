import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { filesWithBannedPrivacy, pagesForTool, pagesWithDeviceClaim } from './privacy-copy';
import { PRIVACY_LINE, openingAnswer, privacyStatement, withPrivacy } from './privacy';

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

describe('device claims on network-lookup tools', () => {
  it('lists the tool page and the guide', () => {
    expect(pagesForTool({ slug: 'a', categorySlug: 'c', guide: { slug: 'g', categorySlug: 'd' } })).toEqual([
      join('tool', 'c', 'a', 'index.html'),
      join('guide', 'd', 'g', 'index.html'),
    ]);
  });

  it('flags a lookup page that says data stays on the device, and skips a missing one', () => {
    const d = mkdtempSync(join(tmpdir(), 'pc-'));
    mkdirSync(join(d, 'tool', 'c', 'a'), { recursive: true });
    writeFileSync(join(d, 'tool', 'c', 'a', 'index.html'), '<p>What you enter stays on your device.</p>');
    expect(pagesWithDeviceClaim(d, pagesForTool({ slug: 'a', categorySlug: 'c', guide: { slug: 'g', categorySlug: 'd' } }))).toEqual([
      join('tool', 'c', 'a', 'index.html'),
    ]);
  });

  it('a lookup tool gets the lookup statement, never the device line', () => {
    const lookup = privacyStatement('lookup');
    expect(withPrivacy('Shows your public IP.', 'lookup')).toBe(`Shows your public IP. ${lookup}`);
    expect(withPrivacy('Runs in your browser.', 'lookup')).toBe(`Runs in your browser. ${lookup}`);
    expect(openingAnswer({ description: 'Public IPv4 and IPv6.', trustVariant: 'lookup' })).not.toMatch(/stays on your device/);
    expect(withPrivacy('Count words.')).toBe('Count words. What you enter stays on your device.');
  });
});
