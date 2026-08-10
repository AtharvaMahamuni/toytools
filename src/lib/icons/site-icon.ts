// The site mark: the parent of the 119 tool icons.
//
// Composed by the same rules as tool-icon.ts (full-bleed accent gradient, soft
// top highlight, bottom shade, subject kept inside the centre safe zone) so the
// favicon and every tool's install icon read as one family. The difference is
// the subject: a tool carries its glyph, the site carries the gold dot that
// already appears as "●" in every page title.
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
 * Gold, brightened from --color-gold (#906620) so the dot separates from the
 * forest field at 16px. The plain token is a text colour on paper and goes muddy
 * on a dark green ground.
 */
const GOLD_CORE = '#F0CE72';
const GOLD_EDGE = '#D2A945';

/**
 * The dot's diameter as a fraction of the icon. 31% keeps it well inside the
 * circular crop Google and iOS apply, and still resolves to roughly 5px when the
 * icon is rendered at 16px in a search result.
 */
const DOT_RADIUS = 15; // on the 96-unit viewBox

/**
 * The site icon as an SVG string. Deterministic: the same input always yields
 * byte-identical output, so the generated favicon is stable across builds.
 */
export function siteIconSvg(size = 512): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 96 96" role="img" aria-label="ToyTools">` +
    '<defs>' +
      // Deeper than a tool icon's field (l+8 to l-14 rather than +13 to -9): the
      // dot is a single small shape and needs the extra separation.
      `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A7F5E"/><stop offset="1" stop-color="${ACCENT}"/></linearGradient>` +
      '<radialGradient id="hl" cx="0.3" cy="0.22" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.10"/></linearGradient>' +
      `<radialGradient id="dot" cx="0.38" cy="0.32" r="0.78"><stop offset="0" stop-color="${GOLD_CORE}"/><stop offset="1" stop-color="${GOLD_EDGE}"/></radialGradient>` +
    '</defs>' +
    '<rect width="96" height="96" fill="url(#g)"/>' +
    '<rect width="96" height="96" fill="url(#hl)"/>' +
    '<rect width="96" height="96" fill="url(#sh)"/>' +
    `<circle cx="48" cy="48" r="${DOT_RADIUS}" fill="url(#dot)"/>` +
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
