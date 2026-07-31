// CSS + mobile unit engine types. Pure and deterministic; conversions are exact ratios so nothing
// can fail at runtime — callers pass numbers, we return numbers.

export interface CssUnits {
  px: number;
  rem: number;
  em: number;
  pt: number;
  /** Percent of the root font size (16px → 100%). */
  percent: number;
}

export interface DensityBucket {
  /** Android density qualifier, e.g. "xhdpi". */
  id: string;
  label: string;
  /** Screen density in dpi (mdpi = 160 baseline). */
  dpi: number;
  /** Scale factor relative to mdpi (xhdpi = 2). */
  scale: number;
  /** Pixel value at this density for the given dp. */
  px: number;
}

export interface AspectResult {
  width: number;
  height: number;
  /** Simplified ratio, e.g. "16:9". */
  ratio: string;
  ratioW: number;
  ratioH: number;
}
