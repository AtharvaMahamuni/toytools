// Glyph library for the install-icon system.
//
// Each glyph is inner SVG markup authored on a 24x24 Lucide-style grid (white
// stroke/fill, round caps/joins). It is placed into the 96x96 icon via
// `translate(24 24) scale(2)` (see tool-icon.ts), so the glyph occupies the
// centre 48px — inside the maskable safe zone every OS crop preserves.
//
// Meaning lives here (Level 1: "what kind of tool"); tool-icon.ts maps each
// tool's family/slug to a glyph id and composits colour + depth around it.
// Pure data — no browser APIs, safe to import in SSR/build and unit tests.

const S = '<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const E = '</g>';

/** A centred monospace text glyph — used where the characters ARE the identity
 *  (case conversions, fractions, %, binary). */
function t(str: string, size: number): string {
  return (
    `<text x="12" y="12.7" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" ` +
    `font-weight="700" font-size="${size}" fill="#fff" text-anchor="middle" ` +
    `dominant-baseline="central">${str}</text>`
  );
}

export const GLYPHS: Record<string, string> = {
  // ── developer: encode/decode ──────────────────────────────────────────
  swap: S + '<path d="M8 4 4 8l4 4"/><path d="M4 8h15"/><path d="M16 20l4-4-4-4"/><path d="M20 16H5"/>' + E,
  hexagon: S + '<path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3Z"/>' + E,
  binary: t('01', 11),
  rot: S + '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>' + E,
  angle: t('&lt;/&gt;', 8.5),
  backslash: t('\\', 15),
  globeA: S + '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.5 2.6 14.5 0 17M12 3.5c-2.6 2.5-2.6 14.5 0 17"/>' + E,

  // ── developer: hashing ────────────────────────────────────────────────
  hash: S + '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>' + E,
  shield: S + '<path d="M12 3l7 2.5V11c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V5.5L12 3Z"/><path d="M9 12l2 2 4-4"/>' + E,

  // ── developer: structured data (JSON/YAML/CSV) ────────────────────────
  braces: S + '<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-4c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>' + E,
  bracesCheck: S + '<path d="M9 3H8a2 2 0 0 0-2 2v3.5a2 2 0 0 1-2 2 2 2 0 0 1 2 2V16c0 1.1.9 2 2 2h1"/><path d="M20 3h-1a2 2 0 0 0-2 2v3.5a2 2 0 0 0-1 .5"/><path d="M13 16.5l2 2 4-4.5"/>' + E,
  bracesMin: S + '<path d="M8 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3c0 1.1.9 2 2 2h1"/><path d="M16 20h1a2 2 0 0 0 2-2v-3c0-1.1.9-2 2-2a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2h-1"/><path d="M9.5 12h5"/>' + E,
  tree: S + '<path d="M21 6h-8M21 12h-8M21 18h-8"/><path d="M4 4v3a2 2 0 0 0 2 2h3M4 12h5"/><path d="M4 4v10a2 2 0 0 0 2 2h3"/>' + E,
  gridBraces: '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="7" height="8" rx="1"/><path d="M2.5 9h7M6 6v8"/><path d="M10.5 10h3.6M12.7 8.3 14.5 10l-1.8 1.7"/><path d="M20.5 6.4c-1 0-1.5.6-1.5 1.6v1.1c0 .8-.4 1.2-1 1.2.6 0 1 .4 1 1.2v1.1c0 1 .5 1.6 1.5 1.6"/></g>',
  bracesGrid: '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6.4c-1 0-1.5.6-1.5 1.6v1.1c0 .8-.4 1.2-1 1.2.6 0 1 .4 1 1.2v1.1c0 1 .5 1.6 1.5 1.6"/><path d="M8.5 10h3.6M10.7 8.3 12.5 10l-1.8 1.7"/><rect x="14.5" y="6" width="7" height="8" rx="1"/><path d="M14.5 9h7M18 6v8"/></g>',
  bracesList: '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6.4c-1 0-1.5.6-1.5 1.6v1.1c0 .8-.4 1.2-1 1.2.6 0 1 .4 1 1.2v1.1c0 1 .5 1.6 1.5 1.6"/><path d="M8.5 10h3.4M10.6 8.4 12.4 10l-1.8 1.6"/><path d="M15 7.5h6M15 12.5h6M15 17.5h6"/><circle cx="15" cy="7.5" r="0" /></g>',
  listBraces: '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5h6M3 11.5h6M3 16.5h6"/><path d="M11 10h3.4M12.6 8.4 14.4 10l-1.8 1.6"/><path d="M20.5 6.4c-1 0-1.5.6-1.5 1.6v1.1c0 .8-.4 1.2-1 1.2.6 0 1 .4 1 1.2v1.1c0 1 .5 1.6 1.5 1.6"/></g>',
  table: S + '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 15h17M9.5 5v14M15 5v14"/>' + E,

  // ── developer: tokens / web ───────────────────────────────────────────
  jwt: S + '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M9 8.5v7" stroke-dasharray="1.4 2"/><path d="M15 8.5v7" stroke-dasharray="1.4 2"/>' + E,
  link: S + '<path d="M9.5 14.5 14.5 9.5"/><path d="M8 11 6 13a3.5 3.5 0 0 0 5 5l2-2"/><path d="M16 13l2-2a3.5 3.5 0 0 0-5-5l-2 2"/>' + E,

  // ── text: transforms (casing) — the characters ARE the identity ───────
  camel: t('aA', 11),
  snake: t('a_a', 8.5),
  kebab: t('a-a', 9),
  upper: t('AA', 11),
  lower: t('aa', 12),
  title: t('Aa', 11),
  sentenceCase: t('Ab.', 8.5),
  reverse: '<g transform="translate(24 0) scale(-1 1)">' + t('R', 14) + '</g>',
  slug: t('a-b', 9),

  // ── text: counting — differentiated by the unit counted ───────────────
  words: S + '<rect x="3" y="9" width="4.5" height="6" rx="1.4"/><rect x="9.7" y="9" width="4.5" height="6" rx="1.4"/><rect x="16.5" y="9" width="4.5" height="6" rx="1.4"/>' + E,
  charBox: '<g fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="3"/></g>' + t('a', 9),
  letter: t('A', 14),
  linesNum: S + '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5v3M3.4 8h1.2M4 11h1M3.5 15h1.2a.6.6 0 0 1 0 1.2H3.5H4.7a.6.6 0 0 1 0 1.2H3.5"/>' + E,
  paragraphCount: t('&#182;', 16),
  sentenceCount: S + '<path d="M4 7h16M4 12h16M4 17h9"/><circle cx="16" cy="17" r="1.1" fill="#fff" stroke="none"/>' + E,
  spaceCount: S + '<path d="M4 8v4M20 8v4M4 12h16"/>' + E,
  readingTime: S + '<circle cx="8" cy="12" r="6"/><path d="M8 9v3l2 1.3"/><path d="M17 8h4M17 12h4M17 16h2.5"/>' + E,
  wordFreq: S + '<path d="M4 20V10M9.3 20V5M14.6 20v-8M20 20V8"/>' + E,

  // ── text: cleanup / interactive ───────────────────────────────────────
  broom: S + '<path d="M18 4 9 13"/><path d="M14.5 8.5 6 17c-1.2 1.2-3 1.4-3 1.4s.2-1.8 1.4-3l8.5-8.5"/><path d="M5.5 18.5 8 21M9 15l3 3M12.5 12.5 15 15"/>' + E,
  trim: S + '<path d="M4 4v16M20 4v16"/><path d="M8 9l-2 3 2 3M16 9l2 3-2 3"/>' + E,
  linesX: S + '<path d="M4 7h10M4 12h16M4 17h10"/><path d="M17.5 5.5 21 9M21 5.5 17.5 9"/>' + E,
  dots: S + '<path d="M4 12h.01M9 12h.01M14 12h.01M19 12h.01"/>' + E,
  searchSwap: S + '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20 20"/><path d="M8.5 8.5h3M11 7l1.5 1.5L11 10"/>' + E,
  compare: S + '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/><path d="M5 8.5h3M5 12h3"/><path d="M16 8.5h3M16 12h3M16 15.5h3"/>' + E,

  // ── number: percentage math — the domain object separates them ────────
  pct: t('%', 15),
  coinPct: S + '<circle cx="12" cy="12" r="8.5"/><path d="M9 15 15 9"/><circle cx="9.4" cy="9.4" r="1.1" fill="#fff"/><circle cx="14.6" cy="14.6" r="1.1" fill="#fff"/>' + E,
  tag: S + '<path d="M3.3 12.4 11 4.7a2 2 0 0 1 1.4-.6h5.1a2 2 0 0 1 2 2v5.1a2 2 0 0 1-.6 1.4l-7.7 7.7a2 2 0 0 1-2.8 0l-5.1-5.1a2 2 0 0 1 0-2.8Z"/><circle cx="16" cy="8" r="1.3" fill="#fff"/>' + E,
  receipt: S + '<path d="M5 3.2v17.6l2.3-1.3L9.5 21l2.5-1.5L14.5 21l2.2-1.5 2.3 1.3V3.2l-2.3 1.3L16.5 3l-2.5 1.5L11.5 3 9.3 4.5 7 3 4.7 4.5Z"/><path d="M8.5 9h7M8.5 13h4.5"/>' + E,
  chartUp: S + '<path d="M3 17 9 11l4 3 8-8"/><path d="M15 6h6v6"/>' + E,
  chartBar: S + '<path d="M3 21h18"/><rect x="5" y="11" width="3.5" height="8" rx=".6"/><rect x="10.2" y="7" width="3.5" height="12" rx=".6"/><rect x="15.4" y="13" width="3.5" height="6" rx=".6"/>' + E,
  calculator: S + '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M8 7h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>' + E,

  // ── money & finance ───────────────────────────────────────────────────
  coins: '<g fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><ellipse cx="9" cy="7" rx="5.2" ry="2.4"/><path d="M3.8 7v3.6c0 1.3 2.3 2.4 5.2 2.4"/><ellipse cx="15" cy="14.5" rx="5.2" ry="2.4"/><path d="M9.8 14.6v2.9c0 1.3 2.3 2.4 5.2 2.4s5.2-1.1 5.2-2.4v-2.9"/></g>',
  trendUp: S + '<path d="M3 17 9 11l4 3 8-8"/><path d="M15 6h6v6"/>' + E,
  recurring: S + '<path d="M19 12a7 7 0 1 1-2-4.9"/><path d="M19 4v4h-4"/><circle cx="12" cy="12" r="2.4" fill="#fff" stroke="none"/>' + E,
  target: S + '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r="1" fill="#fff" stroke="none"/>' + E,
  piggy: S + '<path d="M4 12a6 6 0 0 1 6-6h3a6 6 0 0 1 6 6v3a2 2 0 0 1-2 2h-1l-1 2h-3l-.6-1.2A6 6 0 0 1 4 12Z"/><path d="M16 6.5 15 4M4.5 11H3"/><circle cx="15.5" cy="12" r="1" fill="#fff" stroke="none"/>' + E,

  // ── health & fitness ──────────────────────────────────────────────────
  gauge: S + '<path d="M4.6 17a8.5 8.5 0 1 1 14.8 0"/><path d="M12 16.5 15.5 10"/><circle cx="12" cy="16.8" r="1.4" fill="#fff" stroke="none"/>' + E,
  heartPulse: S + '<path d="M12 20S4 15 4 9.4A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 8 2.4C20 15 12 20 12 20Z"/><path d="M5 12h3.2l1.3-2.6 2 4.6 1.2-2H19"/>' + E,
  droplet: S + '<path d="M12 3.2S5.5 9.7 5.5 14a6.5 6.5 0 0 0 13 0C18.5 9.7 12 3.2 12 3.2Z"/>' + E,
  pie: S + '<circle cx="12" cy="12" r="8.5"/><path d="M12 12V3.5M12 12l7.4 4.2"/>' + E,
  flame: S + '<path d="M12 3s5 3.5 5 8.5a5 5 0 0 1-10 0C7 9 9 7.5 9 7.5s0 2 1.5 2.5C11 8 12 3 12 3Z"/>' + E,
  footsteps: S + '<path d="M7 5c1.5 0 2.5 1.4 2.5 3.5S8.5 13 7 13s-2.5-1.4-2.5-3.5S5.5 5 7 5Z"/><path d="M6.2 15.5h1.6a1.5 1.5 0 0 1 1.5 1.7l-.2 1.6a1.5 1.5 0 0 1-3 0l-.2-1.6a1.5 1.5 0 0 1 .3-1.7Z"/><path d="M17 8c1.5 0 2.5 1.4 2.5 3.5S18.5 15 17 15s-2.5-1.4-2.5-3.5S15.5 8 17 8Z"/><path d="M16.2 17.5h1.6a1.5 1.5 0 0 1 1.5 1.7l-.1 1a1.5 1.5 0 0 1-2.9 0l-.1-1a1.5 1.5 0 0 1 .1-1.7Z"/>' + E,
  scaleLine: S + '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M12 8v3"/><path d="M8.5 15c1-1.5 2-2.2 3.5-2.2S14.5 13.5 15.5 15"/><circle cx="12" cy="8" r="0.8" fill="#fff" stroke="none"/>' + E,

  // ── date & time ───────────────────────────────────────────────────────
  cake: S + '<path d="M4 20.5h16"/><path d="M5.5 20.5v-6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6"/><path d="M4.5 16c1.8 0 1.8 1.4 3.7 1.4S12 16 12 16s1.9 1.4 3.8 1.4S19.5 16 19.5 16"/><path d="M12 8.5v-2.5"/><circle cx="12" cy="4.5" r="1" fill="#fff" stroke="none"/>' + E,
  globe: S + '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.5 2.6 14.5 0 17M12 3.5c-2.6 2.5-2.6 14.5 0 17"/>' + E,
  clock: S + '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.4 2"/>' + E,
  calendarRange: S + '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.5 14h4M12.5 17h4"/>' + E,
  cron: S + '<circle cx="12" cy="12" r="7"/><path d="M12 8.5v3.5l2.2 1.4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2"/>' + E,

  // ── generate ──────────────────────────────────────────────────────────
  key: S + '<circle cx="8.5" cy="15" r="4.5"/><path d="M11.7 11.8 20 3.5"/><path d="M16.5 7l2.2 2.2"/><path d="M13.7 9.8l2 2"/>' + E,
  qr: '<g stroke="#fff" stroke-width="2" fill="none"><rect x="3.5" y="3.5" width="6.6" height="6.6" rx="1.3"/><rect x="13.9" y="3.5" width="6.6" height="6.6" rx="1.3"/><rect x="3.5" y="13.9" width="6.6" height="6.6" rx="1.3"/></g><g fill="#fff"><rect x="13.9" y="13.9" width="2.7" height="2.7" rx=".5"/><rect x="17.8" y="13.9" width="2.7" height="2.7" rx=".5"/><rect x="13.9" y="17.8" width="2.7" height="2.7" rx=".5"/><rect x="17.8" y="17.8" width="2.7" height="2.7" rx=".5"/></g>',
  fingerprint: '<g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"><path d="M12 5a7 7 0 0 1 7 7v1"/><path d="M5 13v-1a7 7 0 0 1 4-6.3"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0v3.5"/><path d="M12 12v4.5"/><path d="M6.2 15.5c.3 1.4.9 2.6 1.6 3.5"/><path d="M18 14.5c-.2 1.6-.7 3-1.4 4"/></g>',
  paragraph: S + '<path d="M4 6h16M4 10.5h16M4 15h16M4 19.5h9"/>' + E,
  dice2: '<g fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3.5"/></g><g fill="#fff"><circle cx="8.5" cy="8.5" r="1.4"/><circle cx="15.5" cy="15.5" r="1.4"/></g>',

  // ── productivity (flagships) ──────────────────────────────────────────
  tomato: '<g><circle cx="12" cy="13.6" r="7.3" fill="#fff"/><path d="M12 6.3C12 4 10.1 2.6 8 2.6c0 2.3 1.9 3.7 4 3.7z" fill="#fff"/><path d="M12 6.3C12 4 13.9 2.6 16 2.6c0 2.3-1.9 3.7-4 3.7z" fill="#fff"/><path d="M12 6.3V3.1" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><path d="M9.4 8.8C8.9 11.2 8.9 16 9.4 18.8M14.6 8.8c.5 2.4.5 7.2 0 10" fill="none" stroke="rgba(0,0,0,.11)" stroke-width="1.2" stroke-linecap="round"/></g>',
  note: S + '<path d="M6 3.5h8.5L18.5 7.5V20.5H6Z"/><path d="M14 3.5V8h4.5"/><path d="M9 12.5h6M9 15.5h4"/>' + E,
  checklist: S + '<path d="M4 6.5 5.6 8l2.4-2.6"/><path d="M4 13.5 5.6 15l2.4-2.6"/><path d="M11.5 7h8.5M11.5 14h8.5"/>' + E,
  sun: S + '<circle cx="12" cy="12" r="3.8"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.5 12h2M19.5 12h2M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5"/>' + E,

  // ── physics (simulations) ─────────────────────────────────────────────
  arc: S + '<path d="M4 20.5Q12 1 20 20.5"/><circle cx="4" cy="20.5" r="1.8" fill="#fff" stroke="none"/><circle cx="20" cy="20.5" r="1.8" fill="#fff" stroke="none"/>' + E,
  pendulum: S + '<circle cx="12" cy="4" r="1.3" fill="#fff" stroke="none"/><path d="M12 4.5 8.5 15"/><circle cx="8" cy="16.5" r="2.8" fill="#fff" stroke="none"/><path d="M6 19.5a6 6 0 0 1 11-2.5" stroke-dasharray="2 2.4"/>' + E,
  wave: S + '<path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0"/>' + E,
  thermo: S + '<path d="M12 4a2.5 2.5 0 0 1 2.5 2.5v7.2a4.5 4.5 0 1 1-5 0V6.5A2.5 2.5 0 0 1 12 4Z"/><path d="M12 9v6.5"/><circle cx="12" cy="17.5" r="1.6" fill="#fff" stroke="none"/>' + E,
  zap: '<path d="M13 2 4 13.5h6.2L9.5 22 20 10.5h-6.3L13 2Z" fill="#fff"/>',
  spring: S + '<path d="M12 3v2"/><path d="M8 6h8l-8 3h8l-8 3h8"/><rect x="8.5" y="14.5" width="7" height="5" rx="1"/>' + E,

  // ── applied math ──────────────────────────────────────────────────────
  parabola: S + '<path d="M4 4v16.5h16"/><path d="M6 8Q12 22 18.5 8"/>' + E,
  unitCircle: S + '<circle cx="12" cy="12" r="8"/><path d="M12 12h8"/><path d="M12 12 18 8"/><path d="M16 12a4 4 0 0 0-1.2-2.9"/>' + E,
  dice: '<g fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3.5"/></g><g fill="#fff"><circle cx="8.2" cy="8.2" r="1.3"/><circle cx="15.8" cy="8.2" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="8.2" cy="15.8" r="1.3"/><circle cx="15.8" cy="15.8" r="1.3"/></g>',
  frac: t('&#8239;a&#8260;b&#8239;', 9),
  ncr: t('nCr', 8),
  primeX: S + '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>' + E,

  // ── design & CSS ──────────────────────────────────────────────────────
  swatch: S + '<circle cx="9" cy="9" r="5.5"/><path d="M12.5 5.5A5.5 5.5 0 0 1 18.5 15"/><path d="M14 14.5h5a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-8"/><circle cx="9" cy="9" r="0.6" fill="#fff"/>' + E,
  ruler: S + '<path d="M4 8h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><path d="M8 8v3"/><path d="M12 8v4"/><path d="M16 8v3"/>' + E,
  aspectFrame: S + '<path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8 9v6"/><path d="M8 9h6"/>' + E,

  // ── generic fallback (never blank) ────────────────────────────────────
  spark: S + '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6Z"/>' + E,
};

/** Ids that need a light inner crease/detail contrast — used by the composer to
 *  decide whether to add a subtle bottom shade under a filled glyph. (Currently
 *  informational; kept minimal so the data stays declarative.) */
export const FILLED_GLYPHS = new Set(['tomato', 'zap', 'qr', 'dice', 'dice2']);
