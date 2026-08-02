import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseChangelog, renderInline } from './changelog';

const SAMPLE = `# ToyTools Changelog

Preamble that is not part of any release.

## [alpha-v2.0] - 2026-01-02

### Added
- A thing with \`code\` and **bold**.
- A second thing
  that wrapped onto another line.

### Fixed
- Something broken.

## [alpha-v1.0] - 2025-12-01

### Added
- The first thing.
`;

describe('parseChangelog', () => {
  const entries = parseChangelog(SAMPLE);

  it('finds every release, newest first, as written', () => {
    expect(entries.map(e => e.version)).toEqual(['alpha-v2.0', 'alpha-v1.0']);
    expect(entries[0]!.date).toBe('2026-01-02');
  });

  it('ignores the preamble above the first release', () =>
    expect(JSON.stringify(entries)).not.toContain('Preamble'));

  it('groups items under their section', () => {
    expect(entries[0]!.sections.map(s => s.title)).toEqual(['Added', 'Fixed']);
    expect(entries[0]!.sections[0]!.items).toHaveLength(2);
    expect(entries[0]!.sections[1]!.items).toEqual(['Something broken.']);
  });

  it('joins a bullet that wrapped onto the next line', () =>
    expect(entries[0]!.sections[0]!.items[1]).toBe('A second thing that wrapped onto another line.'));
});

describe('renderInline', () => {
  it('renders code, bold and links', () => {
    expect(renderInline('use `npm run build`')).toBe('use <code>npm run build</code>');
    expect(renderInline('**Added** support')).toBe('<strong>Added</strong> support');
    expect(renderInline('[Keep a Changelog](https://keepachangelog.com/)')).toContain(
      '<a href="https://keepachangelog.com/" rel="noopener">Keep a Changelog</a>',
    );
  });

  it('escapes markup in the source before formatting it', () => {
    expect(renderInline('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(renderInline('`<b>x</b>`')).toBe('<code>&lt;b&gt;x&lt;/b&gt;</code>');
  });

  it('leaves a non-http link target alone', () =>
    expect(renderInline('[x](javascript:alert(1))')).toBe('[x](javascript:alert(1))'));
});

// The point of parsing the real file is that the page cannot drift from it.
describe('the committed CHANGELOG.md', () => {
  const entries = parseChangelog(
    readFileSync(join(process.cwd(), 'CHANGELOG.md'), 'utf8'),
  );

  it('parses into releases that each have content', () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.version, 'every release needs a version').toBeTruthy();
      expect(entry.date, `${entry.version} needs a date`).toBeTruthy();
      expect(entry.sections.length, `${entry.version} has no sections`).toBeGreaterThan(0);
      for (const section of entry.sections) {
        expect(section.items.length, `${entry.version} / ${section.title} is empty`).toBeGreaterThan(0);
      }
    }
  });
});
