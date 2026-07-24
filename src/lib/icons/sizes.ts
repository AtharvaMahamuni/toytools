// Raster sizes emitted for each tool's install icon (px). 192 + 512 satisfy
// Chrome's PWA installability requirement (a 512 for the maskable/splash icon,
// a 192 "any"), and 192 doubles as the iOS apple-touch-icon (iOS downscales to
// 180). Shared by the generator, the manifest endpoint, the head tags, and the
// architecture validator so the set never drifts.
export const ICON_PNG_SIZES = [192, 512] as const;

/** Size used for the iOS apple-touch-icon link. */
export const APPLE_TOUCH_SIZE = 192;
