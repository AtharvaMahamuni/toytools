// The site mark: the parent of the 119 tool icons.
//
// Composed by the same rules as tool-icon.ts (full-bleed accent gradient, soft
// top highlight, bottom shade, subject kept inside the centre safe zone) so the
// favicon and every tool's install icon read as one family. The difference is
// the subject: a tool carries its glyph, the site carries the ToyTools "T".
//
// The subject used to be a single gold disc centred on the green field, which is
// the exact construction of the flag of Bangladesh (green ground, one centred
// circle) — at 16px in a tab strip or a search result that is what it read as,
// not as a brand. A letterform cannot be mistaken for a flag, and it says the
// brand's name at the one size where a wordmark cannot follow it.
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
const ACCENT = '#2F6B4F';

/**
 * Gold, brightened from --color-gold (#906620) so the mark separates from the
 * forest field at 16px. The plain token is a text colour on paper and goes muddy
 * on a dark green ground.
 */
const GOLD_CORE = '#F0CE72';
const GOLD_EDGE = '#D2A945';

/**
 * The monogram, drawn as two rounded bars on the 96-unit viewBox rather than as
 * <text>: an SVG favicon is rendered with the *viewer's* fonts, so a typographic
 * T would shift its weight and metrics from machine to machine, and the raster
 * PNGs would stop matching the SVG. Paths are identical everywhere.
 *
 * Both bars stay inside the centre 48 units (24..72), the maskable safe zone
 * every OS crop preserves, so nothing that carries meaning is lost when iOS
 * rounds the corners or Google clips the favicon to a circle. The stem is 12
 * units wide, which still resolves to 2 solid pixels at 16px.
 */
const BAR_TOP = 27;     // top edge of the crossbar
const BAR_BOTTOM = 71;  // foot of the stem
const BAR_THICK = 12;
const CROSS_HALF = 23;  // half-width of the crossbar
const RADIUS = 5;

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
      `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A7F5E"/><stop offset="1" stop-color="${ACCENT}"/></linearGradient>` +
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
    '<g fill="url(#mark)">' +
      `<rect x="${48 - CROSS_HALF}" y="${BAR_TOP}" width="${CROSS_HALF * 2}" height="${BAR_THICK}" rx="${RADIUS}"/>` +
      `<rect x="${48 - BAR_THICK / 2}" y="${BAR_TOP}" width="${BAR_THICK}" height="${BAR_BOTTOM - BAR_TOP}" rx="${RADIUS}"/>` +
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
