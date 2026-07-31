// Color engine types. All operations are pure, deterministic, and never throw — parsing failures
// come back as { ok: false, error } so the widgets can render a safe error state.

export interface RGB {
  /** 0–255 */ r: number;
  /** 0–255 */ g: number;
  /** 0–255 */ b: number;
  /** 0–1 alpha */ a: number;
}

export interface ParseResult {
  ok: boolean;
  rgb?: RGB;
  error?: string;
}

export type ColorFormatId = 'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'cmyk';

export interface ColorFormat {
  id: ColorFormatId;
  label: string;
  /** The formatted CSS/string value, e.g. "#3366ff" or "oklch(0.6 0.2 250)". */
  value: string;
}

export interface WcagLevels {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  /** "1.00" .. "21.00" for display. */
  ratioLabel: string;
}
