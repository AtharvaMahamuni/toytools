// Contrast of the cream and orange design tokens (alpha-v13.25.1), in both themes, read straight
// from tokens.css so a token edit that drops a pair below WCAG AA fails here (accuracy audit,
// 3 Nov 2026). Covers the button label on orange, text on the cream canvas, and the ink pill.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, 'tokens.css'), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`missing ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const out: Record<string, string> = {};
  for (const m of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]!] = m[2]!.trim();
  return out;
}

const light = block(':root {');
const themes: Record<string, Record<string, string>> = {
  light,
  'dark (data-theme)': { ...light, ...block(':root[data-theme="dark"]') },
  'dark (system)': { ...light, ...block(':root:not([data-theme="light"])') },
};

function resolve(theme: Record<string, string>, name: string): string {
  let v = theme[name];
  for (let i = 0; v && i < 10; i++) {
    const ref = v.match(/^var\((--[\w-]+)\)$/);
    if (!ref) break;
    v = theme[ref[1]!];
  }
  if (!v || !/^#[0-9a-f]{6}$/i.test(v)) throw new Error(`${name} is not a solid hex colour: ${v}`);
  return v;
}

function luminance(hex: string): number {
  const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = ch.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const PAIRS: Array<[string, string, string]> = [
  ['button label on orange', '--color-text-inverse', '--color-action'],
  ['button label on hovered orange', '--color-text-inverse', '--color-action-hover'],
  ['text on cream', '--color-text', '--color-bg'],
  ['muted text on cream', '--color-text-muted', '--color-bg'],
  ['text on a card', '--color-text', '--color-surface'],
  ['orange text on cream', '--color-accent-strong', '--color-bg'],
  ['selected pill label', '--color-on-selected', '--color-selected'],
];

describe('design token contrast (WCAG AA, 4.5:1)', () => {
  for (const [themeName, theme] of Object.entries(themes)) {
    for (const [label, fg, bg] of PAIRS) {
      it(`${themeName}: ${label}`, () => {
        expect(contrast(resolve(theme, fg), resolve(theme, bg))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
