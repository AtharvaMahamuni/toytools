// Modular type scale. Body size times a ratio, stepped from caption up to display.
// rem assumes the browser's 16px root, the same default the px-to-rem converter uses.

export const TYPE_ROOT_PX = 16;
export const TYPE_MIN_PX = 12;
export const TYPE_MAX_PX = 64;

export const TYPE_RATIOS = [
  { id: '1.125', value: 1.125, name: 'Major second' },
  { id: '1.2', value: 1.2, name: 'Minor third' },
  { id: '1.25', value: 1.25, name: 'Major third' },
  { id: '1.333', value: 1.333, name: 'Perfect fourth' },
  { id: '1.5', value: 1.5, name: 'Perfect fifth' },
  { id: '1.618', value: 1.618, name: 'Golden ratio' },
] as const;

export const TYPE_STEPS = [
  { id: 'caption', label: 'Caption', power: -2 },
  { id: 'small', label: 'Small', power: -1 },
  { id: 'body', label: 'Body', power: 0 },
  { id: 'lead', label: 'Lead', power: 1 },
  { id: 'h3', label: 'H3', power: 2 },
  { id: 'h2', label: 'H2', power: 3 },
  { id: 'h1', label: 'H1', power: 4 },
  { id: 'display', label: 'Display', power: 5 },
] as const;

export interface TypeStep {
  id: string;
  label: string;
  power: number;
  px: number;
  rem: number;
}

export interface TypeScaleOk {
  ok: true;
  ratio: number;
  basePx: number;
  steps: TypeStep[];
  css: string;
  note: string | null;
}

export interface TypeScaleBad {
  ok: false;
  error: string;
}

function round(n: number, digits: number): number {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function pxOf(base: number, ratio: number, power: number): number {
  return round(base * ratio ** power, 2);
}

export function typeScale(basePx: number, ratio: number): TypeScaleOk | TypeScaleBad {
  if (!Number.isFinite(basePx) || basePx < 1 || basePx > 200) {
    return { ok: false, error: 'Enter a base size between 1 and 200 pixels.' };
  }
  if (!Number.isFinite(ratio) || ratio <= 1 || ratio > 2) {
    return { ok: false, error: 'Enter a ratio above 1 and at most 2.' };
  }
  const steps: TypeStep[] = TYPE_STEPS.map((step) => {
    const px = pxOf(basePx, ratio, step.power);
    return { id: step.id, label: step.label, power: step.power, px, rem: round(px / TYPE_ROOT_PX, 4) };
  });
  const css = [
    ':root {',
    ...steps.map((step) => `  --type-${step.id}: ${step.rem}rem;`),
    '}',
  ].join('\n');
  const smallest = steps[0];
  const largest = steps[steps.length - 1];
  const bits: string[] = [];
  if (smallest.px < TYPE_MIN_PX) {
    bits.push(`${smallest.label} is ${smallest.px}px, under the 12px floor`);
  }
  if (largest.px > TYPE_MAX_PX) {
    bits.push(`${largest.label} is ${largest.px}px, and that size overflows a phone`);
  }
  return {
    ok: true,
    ratio,
    basePx,
    steps,
    css,
    note: bits.length ? `${bits.join('. ')}.` : null,
  };
}
