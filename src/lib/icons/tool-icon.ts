// Install-icon composition + resolution.
//
// Turns a tool into a full-bleed, maskable SVG app icon, entirely from registry
// data (no browser APIs — safe in SSR/build/tests). The identity model:
//   Level 1  glyph   — GLYPHS[id], chosen by family (or a per-slug override)
//   Level 2  detail  — a per-slug override glyph where a family is crowded
//   constant colour  — the category accent, as a per-slug seeded gradient so
//                      siblings that share a glyph still differ by shade
//
// Everything is deterministic: the same tool always yields byte-identical SVG,
// so the endpoints emit stable static files and the unit test can pin them.

import type { Tool } from '@data/types';
import { categories } from '@data/categories';
import { GLYPHS } from './glyphs';

const FALLBACK_ACCENT = '#2F6B4F';

// ── family → default glyph ────────────────────────────────────────────────
// Every family present in the registry maps to a meaningful glyph. Siblings in
// the same family share it and separate by the seeded hue-shift; where that is
// not enough (casing, counters, arithmetic) a per-slug override wins below.
const FAMILY_GLYPH: Record<string, string> = {
  // developer
  'binary-text': 'swap',
  checksum: 'shield',
  cryptographic: 'hash',
  json: 'braces',
  token: 'jwt',
  web: 'link',
  clean: 'broom',
  compare: 'compare',
  convert: 'swap',
  // text
  transform: 'title',
  'text-counting': 'words',
  cleanup: 'broom',
  'find-replace': 'searchSwap',
  'text-compare': 'compare',
  // number
  arithmetic: 'pct',
  // money
  interest: 'coins',
  savings: 'target',
  inflation: 'trendUp',
  // health
  'body-composition': 'gauge',
  cardio: 'heartPulse',
  energy: 'flame',
  nutrition: 'pie',
  'fitness-performance': 'chartUp',
  habit: 'droplet',
  measurement: 'scaleLine',
  // date-time
  age: 'cake',
  duration: 'calendarRange',
  schedule: 'cron',
  timestamp: 'clock',
  timezone: 'globe',
  // generate
  code: 'qr',
  credential: 'key',
  identifier: 'fingerprint',
  placeholder: 'paragraph',
  // productivity
  note: 'note',
  task: 'checklist',
  timer: 'tomato',
  utility: 'sun',
  // physics (simulations)
  mechanics: 'arc',
  waves: 'wave',
  oscillations: 'pendulum',
  thermodynamics: 'thermo',
  electricity: 'zap',
  // applied math
  trigonometry: 'unitCircle',
  algebra: 'parabola',
  probability: 'dice',
  combinatorics: 'ncr',
  fractions: 'frac',
  'number-theory': 'primeX',
  // design & CSS
  color: 'swatch',
  'css-unit': 'ruler',
  aspect: 'aspectFrame',
};

// ── per-slug override → glyph ─────────────────────────────────────────────
// Crowded families where the glyph must name the exact tool, plus bespoke
// flagship glyphs. A slug not listed here falls back to its family default.
const SLUG_GLYPH: Record<string, string> = {
  // developer — encode/decode + structured-data specifics
  'base64-encoder-decoder': 'swap',
  'hex-encoder-decoder': 'hexagon',
  'binary-text-converter': 'binary',
  'rot13-encoder-decoder': 'rot',
  'html-entity-encoder-decoder': 'angle',
  'json-escape': 'backslash',
  'punycode-converter': 'globeA',
  'url-encoder-decoder': 'link',
  'json-formatter': 'braces',
  'json-minifier': 'bracesMin',
  'json-validator': 'bracesCheck',
  'json-tree-viewer': 'tree',
  'json-to-csv-converter': 'bracesGrid',
  'json-to-yaml-converter': 'bracesList',
  'csv-to-json-converter': 'gridBraces',
  'yaml-to-json-converter': 'listBraces',
  'csv-to-tsv': 'table',
  'csv-cleaner': 'broom',
  'csv-diff': 'compare',
  'jwt-decoder': 'jwt',

  // text — casing (the characters are the identity)
  'camel-case-converter': 'camel',
  'snake-case-converter': 'snake',
  'kebab-case-converter': 'kebab',
  'uppercase-converter': 'upper',
  'lowercase-converter': 'lower',
  'title-case-converter': 'title',
  'sentence-case-converter': 'sentenceCase',
  'reverse-text': 'reverse',
  'slugify-text': 'slug',

  // text — counters (unit counted)
  'word-counter': 'words',
  'character-counter': 'charBox',
  'letter-counter': 'letter',
  'line-counter': 'linesNum',
  'paragraph-counter': 'paragraphCount',
  'sentence-counter': 'sentenceCount',
  'space-counter': 'spaceCount',
  'reading-time-calculator': 'readingTime',
  'word-frequency-counter': 'wordFreq',

  // text — cleanup specifics (rest share the broom + hue)
  'trim-text': 'trim',
  'remove-duplicate-lines': 'linesX',
  'normalize-whitespace': 'dots',
  'remove-extra-spaces': 'dots',

  // number — arithmetic (domain object)
  'percentage-calculator': 'pct',
  'tip-calculator': 'coinPct',
  'discount-calculator': 'tag',
  'tax-calculator': 'receipt',
  'margin-calculator': 'chartUp',
  'markup-calculator': 'chartBar',
  'scientific-calculator': 'calculator',

  // money — specifics beyond the family default
  'sip-calculator': 'recurring',
  'savings-goal-calculator': 'target',
  'emergency-fund-calculator': 'piggy',
  'compound-interest-calculator': 'coins',
  'cagr-calculator': 'trendUp',
  'roi-calculator': 'chartUp',
  'inflation-calculator': 'trendUp',

  // health — specifics
  'water-intake-tracker': 'droplet',
  'move-today-tracker': 'footsteps',
  'body-weight-tracker': 'scaleLine',
  'tdee-calculator': 'flame',
  'macro-calculator': 'pie',
  'heart-rate-zone-calculator': 'heartPulse',
  'running-pace-calculator': 'footsteps',
  'bmr-calculator': 'gauge',
  'protein-intake-calculator': 'pie',

  // generate — flagships
  'qr-code-generator': 'qr',
  'password-generator': 'key',
  'random-string-generator': 'dice2',
  'uuid-generator': 'fingerprint',
  'lorem-ipsum-generator': 'paragraph',

  // productivity — flagships
  'pomodoro-timer': 'tomato',
  notepad: 'note',
  'todo-list': 'checklist',
  'keep-screen-awake': 'sun',

  // math — specifics
  'fraction-calculator': 'frac',
  'prime-factorization-calculator': 'primeX',
  'combinations-permutations-calculator': 'ncr',
};

/** Category accent hex for a tool, with a safe fallback. */
export function toolAccent(tool: Pick<Tool, 'categorySlug'>): string {
  return categories.find(c => c.slug === tool.categorySlug)?.accent ?? FALLBACK_ACCENT;
}

/** Resolve which glyph a tool uses: per-slug override, then family, then spark. */
export function resolveGlyphId(tool: Pick<Tool, 'slug' | 'family'>): string {
  const bySlug = SLUG_GLYPH[tool.slug];
  if (bySlug && GLYPHS[bySlug]) return bySlug;
  const byFamily = tool.family ? FAMILY_GLYPH[tool.family] : undefined;
  if (byFamily && GLYPHS[byFamily]) return byFamily;
  return 'spark';
}

// ── colour maths (pure) ────────────────────────────────────────────────────
function hexToHsl(hex: string): [number, number, number] {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return hexToHsl(FALLBACK_ACCENT);
  const r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const hsl = (h: number, s: number, l: number) =>
  `hsl(${((Math.round(h) % 360) + 360) % 360} ${clamp(Math.round(s), 0, 100)}% ${clamp(Math.round(l), 0, 100)}%)`;

/**
 * Deterministic per-slug hue offset in [-12, +12] degrees.
 *
 * Was ±22, which was safe while the category accents were stock Tailwind 500/600s sitting far
 * apart on the wheel. The 2026-08-09 retoning moved them into one muted family with neighbours as
 * close as 20 degrees, and a ±22 swing let a design tool drift into the physics blue. Siblings
 * still separate; categories no longer collide.
 */
function hueShift(slug: string): number {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n * 31 + slug.charCodeAt(i)) >>> 0;
  return (n % 25) - 12;
}

export interface IconColors {
  /** Base category accent (manifest theme_color). */
  accent: string;
  /** Darker seeded tone for the manifest background_color / splash. */
  background: string;
}

/** Manifest theme/background colours for a tool (hex + a derived deep tone). */
export function iconColors(tool: Pick<Tool, 'slug' | 'categorySlug'>): IconColors {
  const accent = toolAccent(tool);
  const [h, s, l] = hexToHsl(accent);
  const sh = hueShift(tool.slug);
  // background_color is an opaque, slightly deepened seeded tone (never a white flash).
  const bg = hslToHex(((h + sh) % 360 + 360) % 360, clamp(s + 6, 0, 100), clamp(l - 16, 12, 40));
  return { accent, background: bg };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Compose the full app icon as an SVG string. Full-bleed and opaque (the OS
 * applies its own mask), glyph kept inside the centre safe zone, with a soft
 * top highlight + bottom shade for native depth.
 */
export function toolIconSvg(tool: Pick<Tool, 'slug' | 'categorySlug' | 'family'>, size = 512): string {
  const accent = toolAccent(tool);
  const [h, s, l] = hexToHsl(accent);
  const sh = hueShift(tool.slug);
  // Flatter than it was (+13/-9 became +7/-7). A steep gradient plus a glossy highlight read as
  // 2010 app-store chrome next to Warm Paper, and at 28px on the tool page the shading is not
  // legible anyway: all it does is make the mark the loudest thing above the fold.
  const a = hsl(h + sh, s + 2, clamp(l + 7, 0, 88));
  const b = hsl(h + sh, s + 6, clamp(l - 7, 20, 100));
  const glyph = GLYPHS[resolveGlyphId(tool)] ?? GLYPHS.spark;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" role="img" aria-label="${escapeAttr(tool.slug)} icon">` +
    '<defs>' +
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
    '<radialGradient id="hl" cx="0.3" cy="0.22" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.10"/></linearGradient>' +
    '</defs>' +
    '<rect width="96" height="96" fill="url(#g)"/>' +
    '<rect width="96" height="96" fill="url(#hl)"/>' +
    '<rect width="96" height="96" fill="url(#sh)"/>' +
    `<g transform="translate(24 24) scale(2)">${glyph}</g>` +
    '</svg>'
  );
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
