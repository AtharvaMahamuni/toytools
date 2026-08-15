// The site mark: the parent of the 119 tool icons.
//
// Composed by the same rules as tool-icon.ts (full-bleed accent gradient, soft
// top highlight, bottom shade, subject kept inside the centre safe zone) so the
// favicon and every tool's install icon read as one family. The difference is
// what the subject says. A tool icon carries a glyph, which answers "what does
// this one do". The site mark has to answer something the catalog cannot say one
// tool at a time: that the tools are produced by a platform.
//
// So the mark is a board, read at three distances:
//
//   far  (16px, a tab strip)  a gold T — the brand, and nothing else survives
//   near (48px, a SERP)       the T stands among modules, in ranks
//   close(512px, the store)   the modules sit on two solid rails beneath them
//
// The modules are the tools: uniform, interchangeable, many, all the same shape
// because they are all produced the same way. The rails under them are the
// engines — every module rests on one, nothing floats. That is literally how the
// site is built (a handful of engines in src/lib/engines/ render 119 tools whose
// widgets are three lines each), so the mark describes the machine rather than
// decorating the letter.
//
// The subject used to be a single gold disc centred on the green field, which is
// the exact construction of the flag of Bangladesh (green ground, one centred
// circle) — at 16px in a tab strip or a search result that is what it read as,
// not as a brand.
//
// Full-bleed and opaque on purpose. Google renders favicons small and inside its
// own container, and iOS masks the touch icon, so the artwork must survive being
// cropped to a circle: nothing that matters may sit outside the centre.
//
// Gloss matches tool-icon.ts (highlight 0.14, shade 0.10). The two composers landed on separate
// branches and briefly disagreed, which is exactly the drift "one family" is supposed to prevent:
// if you change the shading in one, change it in the other in the same commit.
//
// Rasterized to PNGs by scripts/generate-tool-icons.ts (`npm run icons:generate`).
// The SVG here is the source of truth; public/favicon.svg is generated from it.

/** Forest accent, matching --color-accent in src/styles/tokens.css. */
export const ACCENT = '#2F6B4F';

/** The lighter stop of the field gradient. The mark is measured against ACCENT,
 *  the darker of the two, because that is the worst case. */
const FIELD_LIGHT = '#3A7F5E';

/**
 * Gold, brightened from --color-gold (#906620) so the mark separates from the
 * forest field at 16px. The plain token is a text colour on paper and goes muddy
 * on a dark green ground.
 *
 * Brightened a second time on 2026-08-14, from #F0CE72/#D2A945, after actually
 * measuring it: the old pair was 2.85:1 against the field, under the 3:1 floor
 * for non-text contrast — and a favicon is the most demanding non-text case
 * there is, since it is rendered at 16px, antialiased, and often rescaled by the
 * browser. These are 4.04:1. `contrastRatio` below is exported so the unit test
 * holds that floor: a retheme that dims the mark now fails the build instead of
 * shipping an icon nobody can read in a tab strip.
 */
const GOLD_CORE = '#FBE6A8';
export const GOLD_EDGE = '#EFCB74';

/**
 * WCAG contrast between two hex colours. Pure, and here rather than in the test
 * so the number the icon is designed against and the number the test enforces
 * can never be two different calculations.
 */
export function contrastRatio(one: string, two: string): number {
  const luminance = (hex: string): number => {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
    if (!m) return 0;
    const [r, g, b] = [1, 2, 3].map(i => {
      const channel = parseInt(m[i], 16) / 255;
      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [lighter, darker] = [luminance(one), luminance(two)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Everything is laid out inside SAFE (24..72), the centre half of the icon and
 * the maskable safe zone every OS crop preserves, so nothing that carries
 * meaning is lost when iOS rounds the corners or Google clips the favicon to a
 * circle.
 */
const SAFE_MIN = 24;
const SAFE_MAX = 72;

/**
 * The monogram, drawn as two rounded bars rather than as <text>: an SVG favicon
 * is rendered with the *viewer's* fonts, so a typographic T would shift its
 * weight and metrics from machine to machine, and the raster PNGs would stop
 * matching the SVG. Paths are identical everywhere.
 *
 * The stem is 12 units wide, which still resolves to 2 solid pixels at 16px —
 * the size that decides whether the mark works at all.
 */
const CROSSBAR = { x: SAFE_MIN, y: SAFE_MIN, w: 48, h: 13 };
const STEM = { x: 42, y: SAFE_MIN, w: 12, h: 48 };
const LETTER_RADIUS = 4;

/**
 * The board around the letter.
 *
 * MODULE is one tool. They are laid out in the two channels the letter leaves
 * free (left and right of the stem, below the crossbar), two columns and three
 * rows deep in each, which is as many as fit before the grid stops reading as a
 * grid. RAIL is an engine: one continuous bar under each channel, wider than any
 * module and brighter than all of them, because the tools rest on it.
 *
 * CLEARANCE is the gap the board keeps from the letter. It is the reason the
 * modules read as a separate layer instead of as serifs.
 */
const MODULE = 6;
const MODULE_GAP = 2.5;
const CLEARANCE = 2.5;
const RAIL_HEIGHT = 6;
const MODULE_ROWS = 3;
const MODULE_OPACITY = 0.2;
const RAIL_OPACITY = 0.34;

/** A rounded rect, in the attribute order the unit test reads bounds from. */
function box(x: number, y: number, w: number, h: number, r: number, fill: string): string {
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${round(r)}" ${fill}/>`;
}

/** Two decimals, no trailing zeros: keeps the emitted SVG short and stable. */
function round(n: number): string {
  return String(Math.round(n * 100) / 100);
}

/**
 * The modules and rails, in the two channels the letter leaves free.
 *
 * Derived from the letter rather than hand-placed, so moving the T moves the
 * board with it and the clearance can never go stale.
 */
function boardSvg(): string {
  const channels = [
    { x: SAFE_MIN, w: STEM.x - CLEARANCE - SAFE_MIN },          // left of the stem
    { x: STEM.x + STEM.w + CLEARANCE, w: SAFE_MAX - (STEM.x + STEM.w + CLEARANCE) },
  ];
  const top = CROSSBAR.y + CROSSBAR.h + CLEARANCE;              // first row clears the crossbar
  const railY = SAFE_MAX - RAIL_HEIGHT;
  // Centre the rows in the band between the crossbar and the rail.
  const band = railY - MODULE_GAP - top;
  const rowsHeight = MODULE_ROWS * MODULE + (MODULE_ROWS - 1) * MODULE_GAP;
  const firstRow = top + (band - rowsHeight) / 2;

  const dim = `fill="${GOLD_CORE}" fill-opacity="${MODULE_OPACITY}"`;
  const rail = `fill="${GOLD_CORE}" fill-opacity="${RAIL_OPACITY}"`;

  let out = '';
  for (const channel of channels) {
    // Two columns per channel, pushed to its outer and inner edge so the two
    // channels stay mirror images of each other.
    for (const x of [channel.x, channel.x + channel.w - MODULE]) {
      for (let row = 0; row < MODULE_ROWS; row++) {
        out += box(x, firstRow + row * (MODULE + MODULE_GAP), MODULE, MODULE, MODULE * 0.3, dim);
      }
    }
    out += box(channel.x, railY, channel.w, RAIL_HEIGHT, RAIL_HEIGHT * 0.35, rail);
  }
  return out;
}

/**
 * The site icon as an SVG string. Deterministic: the same input always yields
 * byte-identical output, so the generated favicon is stable across builds.
 */
export function siteIconSvg(size = 512): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" role="img" aria-label="ToyTools">` +
    '<defs>' +
      // Deeper than a tool icon's field (l+8 to l-14 rather than +13 to -9): the
      // monogram is one solid gold shape and needs the extra separation.
      `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${FIELD_LIGHT}"/><stop offset="1" stop-color="${ACCENT}"/></linearGradient>` +
      '<radialGradient id="hl" cx="0.3" cy="0.22" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.10"/></linearGradient>' +
      // userSpaceOnUse, not the default objectBoundingBox: the crossbar and the
      // stem are two elements sharing one fill, and a per-element gradient would
      // draw a visible seam down the join.
      `<radialGradient id="mark" gradientUnits="userSpaceOnUse" cx="38" cy="34" r="52"><stop offset="0" stop-color="${GOLD_CORE}"/><stop offset="1" stop-color="${GOLD_EDGE}"/></radialGradient>` +
    '</defs>' +
    '<rect width="96" height="96" fill="url(#g)"/>' +
    '<rect width="96" height="96" fill="url(#hl)"/>' +
    '<rect width="96" height="96" fill="url(#sh)"/>' +
    // The board goes down first: the letter is the thing in front of it.
    boardSvg() +
    '<g fill="url(#mark)">' +
      box(CROSSBAR.x, CROSSBAR.y, CROSSBAR.w, CROSSBAR.h, LETTER_RADIUS, '') +
      box(STEM.x, STEM.y, STEM.w, STEM.h, LETTER_RADIUS, '') +
    '</g>' +
    '</svg>'
  );
}

/**
 * Raster sizes emitted for the site mark.
 *
 * 48 and 96 exist because Google asks for a favicon that is a square multiple of
 * 48px; the 32x32 file this replaced was below that floor. 180 is the iOS
 * apple-touch-icon. 512 is the Organization logo in the homepage JSON-LD, which
 * wants a raster comfortably above Google's 112px minimum.
 */
export const SITE_ICON_SIZES = [48, 96, 180, 512] as const;

/** Public path for a given site-icon raster. */
export function siteIconPath(size: (typeof SITE_ICON_SIZES)[number]): string {
  return size === 180 ? '/apple-touch-icon.png' : `/favicon-${size}.png`;
}
